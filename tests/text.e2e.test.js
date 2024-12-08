const request = require('supertest');
const app = require('../src/app');
const sequelize = require('../src/config/db');

const testingText = "The quick brown fox jumps over the lazy dog. The lazy dog slept in the sun.";

beforeAll(async () => {
    await sequelize.sync({force: true}); // Drop existing tables and recreate
});

// Cleanup after tests
afterAll(async () => {
    await sequelize.close(); // Close database connection
});

describe('Text crud Application', () => {
    it('should load all texts in page', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('Text List');
    });

    it('should create a new text', async () => {
        const res = await request(app)
            .post('/create')
            .send(`text=${testingText}`);
        expect(res.statusCode).toBe(302);
        const listRes = await request(app).get('/');
        expect(listRes.text).toContain(testingText);
    });

    it('should update an existing text', async () => {
        const editRes = await request(app)
            .post(`/edit/1`)
            .send(`text=Updated --- ${testingText}`);
        expect(editRes.statusCode).toBe(302);

        const listRes = await request(app).get('/');
        expect(listRes.text).toContain(`Updated --- ${testingText}`);
    });

    it('should delete an existing text', async () => {
        const deleteRes = await request(app).post('/delete/1');
        expect(deleteRes.statusCode).toBe(302);

        const updatedListRes = await request(app).get('/');
        expect(updatedListRes.text).not.toContain(`${testingText}`);
    });
});
