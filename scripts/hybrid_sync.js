const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const AWS_PORTAL_URL = process.env.AWS_PORTAL_URL || "https://partners.nosky.io/API/external/?";
const AWS_TOKEN = process.env.AWS_TOKEN;
const WASABI_PORTAL_URL = process.env.WASABI_PORTAL_URL || "https://portal.nosky.io/API/external/?";
const WASABI_TOKEN = process.env.WASABI_TOKEN;

function bytesToGB(bytes) {
    if (!bytes) return 0.0;
    return parseFloat(bytes) / (1024 ** 3);
}

function normalizeString(val) {
    if (!val) return '';
    let str = String(val).trim().toLowerCase();
    // Remove text in parentheses/brackets to handle "(Indirect)" and similar suffixes
    str = str.replace(/\[.*?\]|\(.*?\)/g, '');
    str = str.replace(/\s+/g, ' ').trim();
    return str;
}

async function fetchAPIData(url, token, sid) {
    console.log(`Fetching from API via POST: ${url.split('?')[0]} (sid=${sid})`);
    
    // We remove the trailing '?' from the URL if it exists, since we are using POST
    const baseUrl = url.endsWith('?') ? url.slice(0, -1) : url;
    
    const form = new URLSearchParams();
    form.append('action', 'export');
    form.append('auth', token);
    form.append('search', 'search-customers');
    form.append('sid', sid);
    form.append('json', 'true');
    
    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: form
    });
    
    const text = await response.text();
    
    if (!response.ok) {
        throw new Error(`API Error (${response.status}): ${text}`);
    }
    
    let data;
    try {
        data = JSON.parse(text);
    } catch(e) {
        throw new Error(`API returned invalid JSON: ${text.substring(0, 100)}...`);
    }
    
    if (data && data.message) {
        if (typeof data.message === 'string') {
            try {
                return JSON.parse(data.message);
            } catch(e) {
                throw new Error(`API Error Message: ${data.message}`);
            }
        }
        throw new Error(`API Error Message: ${JSON.stringify(data.message)}`);
    }
    
    if (Array.isArray(data)) {
        return data;
    }
    
    throw new Error(`Unexpected API response format: ${JSON.stringify(data).substring(0, 100)}...`);
}

async function runHybridSync() {
    console.log("=====================================");
    console.log("STARTING DUAL-TRIGGER ETL PIPELINE");
    console.log("=====================================");

    let dbPass = process.env.DB_PASSWORD || process.env.DB_PASS;
    if (dbPass && dbPass.startsWith('\\$')) {
        dbPass = dbPass.substring(1);
    }

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: dbPass,
        database: process.env.DB_NAME,
    });

    try {
        // 1. Fetch DB Records
        console.log("Fetching latest database records (is_latest_record = True)...");
        const [dbRows] = await connection.execute('SELECT * FROM backup_history WHERE is_latest_record = True');
        console.log(`Loaded ${dbRows.length} active customers from DB.`);

        const dbLookup = {};
        dbRows.forEach(row => {
            if (row.customer_name) {
                const normName = normalizeString(row.customer_name);
                dbLookup[normName] = row;
            }
        });

        // 2. Fetch API Data
        const awsData = await fetchAPIData(AWS_PORTAL_URL, AWS_TOKEN, "429");
        const wasabiData = await fetchAPIData(WASABI_PORTAL_URL, WASABI_TOKEN, "491");
        const allApiData = [...awsData, ...wasabiData];

        if (allApiData.length === 0) {
            console.error("API Outage Safety Net: API returned empty data. Aborting sync to prevent data loss.");
            return;
        }

        console.log(`Successfully fetched ${allApiData.length} total records from API.`);

        const recordsToUpdate = [];
        const logsToInsert = [];
        const processedApiNames = new Set();

        // 3. Process API Data
        for (const row of allApiData) {
            const rawName = row['Customer Name'];
            if (!rawName) continue;

            const normName = normalizeString(rawName);
            processedApiNames.add(normName);

            if (dbLookup[normName]) {
                const dbRow = dbLookup[normName];
                // Map allocated storage from Quota (Combined)
                const apiBytes = row['Quota (Combined)'] || 0;
                const apiGb = bytesToGB(apiBytes);
                
                // Map actual usage from Data size or Stored
                const usedBytes = row['Data size'] || row['Stored'] || 0;
                const usedGb = bytesToGB(usedBytes);
                
                const dbGb = parseFloat(dbRow.customer_storage || 0);
                const dbUsedGb = parseFloat(dbRow.used_storage_gb || 0);

                // Math Tolerance Threshold: > 0.01GB change
                const diff = apiGb - dbGb;
                const usedDiff = usedGb - dbUsedGb;
                
                if (Math.abs(diff) > 0.01 || Math.abs(usedDiff) > 0.01) {
                    console.log(`Syncing data for ${rawName}: Quota -> ${apiGb.toFixed(2)}GB, Usage -> ${usedGb.toFixed(2)}GB`);
                    
                    const sign = diff > 0 ? "+" : "";
                    const sizeIncreased = `${sign}${diff.toFixed(2)} GB`;

                    recordsToUpdate.push({
                        id: dbRow.id,
                        customer_storage: apiGb.toFixed(2),
                        used_storage_gb: usedGb.toFixed(2),
                        size_increased: sizeIncreased
                    });

                    let logParts = [];
                    if (Math.abs(diff) > 0.01) logParts.push(`quota updated to ${apiGb.toFixed(2)}GB`);
                    if (Math.abs(usedDiff) > 0.01) logParts.push(`usage updated to ${usedGb.toFixed(2)}GB`);
                    
                    logsToInsert.push([
                        dbRow.partner,
                        dbRow.partner_email,
                        dbRow.customer_name,
                        dbRow.customer_id,
                        `Customer ${logParts.join(' and ')} via API.`
                    ]);
                }
            }
        }

        // 5. Execute DB Transaction
        if (recordsToUpdate.length === 0) {
            console.log("Diff Checker: No changes detected. All systems synchronized.");
            return;
        }

        console.log(`Executing ${recordsToUpdate.length} direct row updates.`);
        await connection.beginTransaction();

        try {
            for (const record of recordsToUpdate) {
                await connection.execute(
                    `UPDATE backup_history SET customer_storage = ?, used_storage_gb = ?, size_increased = ? WHERE id = ?`,
                    [record.customer_storage, record.used_storage_gb, record.size_increased, record.id]
                );
            }

            if (logsToInsert.length > 0) {
                const logSql = `INSERT INTO logs (partner_name, email_id, customer_name, customer_id, log_information) VALUES ?`;
                await connection.query(logSql, [logsToInsert]);
            }

            await connection.commit();
            console.log("Hybrid Sync Complete! All rows updated in place.");
        } catch (err) {
            await connection.rollback();
            console.error("Transaction rolled back due to error:", err);
        }

    } catch (err) {
        console.error("Fatal Error:", err);
    } finally {
        await connection.end();
    }
}

runHybridSync();
