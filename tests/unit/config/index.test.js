const config = require('../../../src/config'); // Adjust the path to your config file
jest.mock('dotenv', () => ({
    config: jest.fn(),
}));

describe('Config tests', () => {
    let originalEnv;
    beforeAll(() => {
        originalEnv = {...process.env};
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('should use default values if no environment variables are set', () => {
        delete process.env.NODE_ENV;
        jest.resetModules();
        const config = require('../../../src/config');

        expect(config.port).toBe(3000);
        expect(config.nodeEnv).toBe('development');
        expect(config.db.username).toBe('root');
        expect(config.db.host).toBe('localhost');
        expect(config.db.port).toBe(3306);
        expect(config.db.dialect).toBe('mysql');
        expect(config.rateLimit.max).toBe(5);
        expect(config.rateLimit.windowInS).toBe(60);
        expect(config.oauth.jwtToken).toBe("Lkbn1h?b5IQE&ucKIt{y3?PpCGDw%S3k6tbM:/WoI>+2qO8o");
        expect(config.oauth.sessionToken).toBe("bn1E&ucKIt{y3?PpCGDw%S3k6tb");
        expect(config.oauth.callbackUrl).toBe("/auth/google/callback");
    });

    it('should use environment variables if set', () => {
        process.env.PORT = 5000;
        process.env.NODE_ENV = 'production';
        process.env.DB_USER = 'admin';
        process.env.DB_PASSWORD = 'secret';
        process.env.DB_NAME = 'prod_db';
        process.env.DB_HOST = 'db.example.com';
        process.env.DB_PORT = 5432;
        process.env.DB_DIALECT = 'postgres';
        process.env.MAX_RATE_LIMIT = 10;
        process.env.RATE_LIMIT_WINDOW_IN_SECONDS = 30;
        process.env.OAUTH_CALLBACK_URL = "/auth/google/callback"
        process.env.JWT_SECRET = "Lkbn1h?b5IQE&ucKIt{y3?PpCGDw%S3k6tbM:/WoI>+2qO8o"
        process.env.SESSION_SECRET = "bn1E&ucKIt{y3?PpCGDw%S3k6tb"

        jest.resetModules();
        const config = require('../../../src/config'); // Adjust the path to your config file

        expect(parseInt(config.port)).toBe(5000);
        expect(config.nodeEnv).toBe('production');
        expect(config.db.username).toBe('admin');
        expect(config.db.password).toBe('secret');
        expect(config.db.database).toBe('prod_db');
        expect(config.db.host).toBe('db.example.com');
        expect(parseInt(config.db.port)).toBe(5432);
        expect(config.db.dialect).toBe('postgres');
        expect(parseInt(config.rateLimit.max)).toBe(10);
        expect(parseInt(config.rateLimit.windowInS)).toBe(30);
        expect(config.oauth.jwtToken).toBe("Lkbn1h?b5IQE&ucKIt{y3?PpCGDw%S3k6tbM:/WoI>+2qO8o");
        expect(config.oauth.sessionToken).toBe("bn1E&ucKIt{y3?PpCGDw%S3k6tb");
        expect(config.oauth.callbackUrl).toBe("/auth/google/callback");
    });

    it('should use test database name if NODE_ENV is test', () => {
        process.env.NODE_ENV = 'test';
        process.env.DB_NAME_TEST = 'test_db';
        jest.resetModules();

        const config = require('../../../src/config'); // Adjust the path to your config file

        expect(config.db.database).toBe('test_db');
    });

    it('should fall back to default values when environment variables are missing', () => {
        delete process.env.PORT;
        delete process.env.DB_USER;
        delete process.env.DB_PASSWORD;
        delete process.env.DB_HOST;
        delete process.env.DB_PORT;
        delete process.env.DB_DIALECT;

        jest.resetModules();
        const config = require('../../../src/config'); // Adjust the path to your config file
        expect(config.port).toBe(3000);
        expect(config.db.username).toBe('root');
        expect(config.db.host).toBe('localhost');
        expect(config.db.port).toBe(3306);
        expect(config.db.dialect).toBe('mysql');
    });
});