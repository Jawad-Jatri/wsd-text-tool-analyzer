require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    db: {
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '@Kil201514057',
        database: process.env.DB_NAME || 'text_analyzer_db',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: process.env.DB_DIALECT || 'mysql',
    },
};