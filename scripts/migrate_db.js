require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrate() {
    let dbPass = process.env.DB_PASS || process.env.DB_PASSWORD || '';
    if (dbPass && dbPass.startsWith('\\$')) {
        dbPass = dbPass.substring(1);
    }
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: dbPass,
        port: parseInt(process.env.DB_PORT || '3306', 10),
        database: 'alert_app_db'
    });
    try {
        console.log('Adding acknowledged_by column...');
        await connection.query('ALTER TABLE alarms ADD COLUMN acknowledged_by VARCHAR(255)');
    } catch(e) { console.log('Column acknowledged_by likely exists.'); }
    
    try {
        console.log('Adding acknowledged_at column...');
        await connection.query('ALTER TABLE alarms ADD COLUMN acknowledged_at DATETIME');
    } catch(e) { console.log('Column acknowledged_at likely exists.'); }
    
    console.log('Migration complete.');
    await connection.end();
}
migrate();
