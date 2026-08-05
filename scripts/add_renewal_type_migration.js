const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function migrate() {
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

    console.log("Connected to database. Running migration...");

    try {
        await connection.execute(`
            ALTER TABLE backup_history 
            ADD COLUMN renewal_type VARCHAR(50) DEFAULT 'Direct'
        `);
        console.log("Migration successful: Added renewal_type column.");
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log("Migration skipped: renewal_type column already exists.");
        } else {
            console.error("Migration failed:", err);
        }
    } finally {
        await connection.end();
    }
}

migrate();
