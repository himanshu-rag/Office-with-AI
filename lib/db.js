const mysql = require('mysql2/promise');

let dbPass = process.env.DB_PASS || process.env.DB_PASSWORD;
if (dbPass && dbPass.startsWith('\\$')) {
    dbPass = dbPass.substring(1);
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: dbPass,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
