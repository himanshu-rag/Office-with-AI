require('dotenv').config();
const mysql = require('mysql2/promise');

async function setupDb() {
    let dbPass = process.env.DB_PASS || process.env.DB_PASSWORD || '';
    if (dbPass && dbPass.startsWith('\\$')) {
        dbPass = dbPass.substring(1);
    }

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: dbPass,
        port: parseInt(process.env.DB_PORT || '3306', 10),
    });

    try {
        console.log('Creating alert_app_db if not exists...');
        await connection.query(`CREATE DATABASE IF NOT EXISTS alert_app_db`);
        
        console.log('Using alert_app_db...');
        await connection.query(`USE alert_app_db`);

        console.log('Creating alarms table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS alarms (
                id INT AUTO_INCREMENT PRIMARY KEY,
                aws_alarm_name VARCHAR(255) NOT NULL,
                instance_id VARCHAR(255),
                state_reason TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                status ENUM('ACTIVE', 'ACKNOWLEDGED') DEFAULT 'ACTIVE',
                audience_count INT DEFAULT 1,
                INDEX (status)
            )
        `);

        console.log('Database setup complete.');
    } catch (err) {
        console.error('Error setting up database:', err);
    } finally {
        await connection.end();
    }
}

setupDb();
