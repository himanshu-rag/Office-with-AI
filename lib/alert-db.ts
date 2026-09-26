import mysql from 'mysql2/promise';

let dbPass = process.env.DB_PASS || process.env.DB_PASSWORD || '';
if (dbPass && dbPass.startsWith('\\$')) {
    dbPass = dbPass.substring(1);
}

const alertPool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: dbPass,
    database: 'alert_app_db',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default alertPool;
