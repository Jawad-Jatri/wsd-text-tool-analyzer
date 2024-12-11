require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    db: {
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '@Kil201514057',
        database: process.env.NODE_ENV === 'test' ? process.env.DB_NAME_TEST : process.env.DB_NAME || 'text_analyzer_db',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: process.env.DB_DIALECT || 'mysql',
    },
    rateLimit: {
        max: process.env.MAX_RATE_LIMIT || 5,
        windowInS: process.env.RATE_LIMIT_WINDOW_IN_SECONDS || 60,
    },
    oauth: {
        googleClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
        googleClientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        callbackUrl: process.env.OAUTH_CALLBACK_URL || "/auth/google/callback",
        jwtToken: process.env.JWT_SECRET || "Lkbn1h?b5IQE&ucKIt{y3?PpCGDw%S3k6tbM:/WoI>+2qO8o",
        sessionToken: process.env.SESSION_SECRET || "bn1E&ucKIt{y3?PpCGDw%S3k6tb",
    }
};