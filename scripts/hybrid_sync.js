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

async function fetchAPIData(url, token, sid) {
    const fetchUrl = `${url}token=${token}&sid=${sid}`;
    console.log(`Fetching from API: ${fetchUrl.replace(token, '***')}`);
    
    const response = await fetch(fetchUrl);
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
                const normName = String(row.customer_name).trim().toLowerCase();
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

        const updatesToInsert = [];
        const idsToDeprecate = [];
        const logsToInsert = [];
        const processedApiNames = new Set();

        // 3. Process API Data
        for (const row of allApiData) {
            const rawName = row['Customer Name'];
            if (!rawName) continue;

            const normName = String(rawName).trim().toLowerCase();
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
                    
                    idsToDeprecate.push(dbRow.id);

                    const newRow = { ...dbRow };
                    delete newRow.id; // Auto-increment
                    newRow.customer_storage = apiGb.toFixed(2);
                    newRow.used_storage_gb = usedGb.toFixed(2);
                    newRow.is_latest_record = true;
                    
                    // Update size_increased based on quota difference
                    const sign = diff > 0 ? "+" : "";
                    newRow.size_increased = `${sign}${diff.toFixed(2)} GB`;
                    
                    updatesToInsert.push(newRow);

                    let logParts = [];
                    if (Math.abs(diff) > 0.01) {
                        logParts.push(`quota updated from ${dbGb.toFixed(2)}GB to ${apiGb.toFixed(2)}GB`);
                    }
                    if (Math.abs(usedDiff) > 0.01) {
                        logParts.push(`usage updated from ${dbUsedGb.toFixed(2)}GB to ${usedGb.toFixed(2)}GB`);
                    }
                    
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
        if (updatesToInsert.length === 0 && idsToDeprecate.length === 0) {
            console.log("Diff Checker: No changes detected. All systems synchronized.");
            return;
        }

        console.log(`Executing ${idsToDeprecate.length} deprecations and ${updatesToInsert.length} row insertions.`);
        await connection.beginTransaction();

        try {
            if (idsToDeprecate.length > 0) {
                const placeholders = idsToDeprecate.map(() => '?').join(',');
                await connection.query(
                    `UPDATE backup_history SET is_latest_record = False WHERE id IN (${placeholders})`,
                    idsToDeprecate
                );
            }

            if (updatesToInsert.length > 0) {
                const cols = Object.keys(updatesToInsert[0]);
                const colsStr = cols.map(c => `\`${c}\``).join(', ');
                const placeholders = cols.map(() => '?').join(', ');
                const sql = `INSERT INTO backup_history (${colsStr}) VALUES (${placeholders})`;

                for (const row of updatesToInsert) {
                    const values = cols.map(c => row[c]);
                    await connection.query(sql, values);
                }
            }

            if (logsToInsert.length > 0) {
                const logSql = `INSERT INTO logs (partner_name, email_id, customer_name, customer_id, log_information) VALUES ?`;
                await connection.query(logSql, [logsToInsert]);
            }

            await connection.commit();
            console.log("Hybrid Sync Complete! All changes safely recorded.");
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
