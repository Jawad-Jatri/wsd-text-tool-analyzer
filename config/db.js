const config = require('../config');
const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');

(async () => {
    try {
        // Connect to MySQL and create the database if it doesn't exist
        const connection = await mysql.createConnection({
            host: config.db.host,
            user: config.db.username,
            password: config.db.password,
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${config.db.database}`);
        console.log(`Database "${config.db.database}" ensured.`);
        await connection.end();
    } catch (error) {
        console.error('Error creating database:', error);
    }
})();

const sequelize = new Sequelize(
    config.db.database,
    config.db.username,
    config.db.password,
    {
        host: config.db.host,
        dialect: config.db.dialect,
    }
);

// Test the connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

module.exports = sequelize;