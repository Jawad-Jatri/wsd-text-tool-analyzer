const request = require('supertest');
const app = require('../../src/app');
const sequelize = require('../../src/config/db');
const {fakeText} = require('../mocks');
const nock = require('nock');

beforeAll(async () => {
    await sequelize.sync({force: true}); // Drop existing tables and recreate
});

// Cleanup after tests
afterAll(async () => {
    await sequelize.close(); // Close database connection
});

let agent;

describe('Text crud Application', () => {
    beforeAll(async () => {
        // Mock Google's token endpoint
        nock('https://www.googleapis.com')
            .post('/oauth2/v4/token')
            .reply(200, {
                access_token: 'mock_access_token',
                id_token: 'mock_id_token',
                expires_in: 3600,
            });

        // Mock Google's user info endpoint
        nock('https://www.googleapis.com')
            .get('/oauth2/v3/userinfo')
            .query({access_token: 'mock_access_token'})
            .reply(200, {
                id: '12345',
                name: 'Test User',
                email: 'testuser@example.com',
            });
        agent = request.agent(app); // Maintain session across requests
        await agent.get('/auth/google/callback?code=test_code&state=web').expect(302); // Mock OAuth callback

    });
    it('should redirect unauthenticated user to the home page (login)', async () => {
        const res = await request(app).get('/dashboard');
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/');
    });

    it('should load all texts in page', async () => {
        const res = await agent.get('/dashboard');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('Text List');
    });

    it('should create a new text', async () => {
        const res = await agent
            .post('/create')
            .send(`text=${fakeText}`);
        expect(res.statusCode).toBe(302);
        const listRes = await agent.get('/dashboard');
        expect(listRes.text).toContain(fakeText);
    });

    it('should return error page for blank text', async () => {
        const res = await agent
            .post('/create')
            .send(`text=`);
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain("Text is required!");
    });

    it('should render edit page', async () => {
        const res = await agent
            .get('/edit/1');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain(fakeText);
    });

    it('should render report page', async () => {
        const res = await agent
            .get('/report/1');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain(`Text: ${fakeText}`);
    });

    it('should return error page for text not found', async () => {
        const res = await agent
            .get('/edit/100');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain("Text not found!");
    });

    it('should update an existing text', async () => {
        const editRes = await agent
            .post(`/edit/1`)
            .send(`text=Updated --- ${fakeText}`);
        expect(editRes.statusCode).toBe(302);

        const listRes = await agent.get('/dashboard');
        expect(listRes.text).toContain(`Updated --- ${fakeText}`);
    });

    it('should return error page for blank text update', async () => {
        const res = await agent
            .post('/edit/1')
            .send(`text=`);
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain("Text is required!");
    });

    it('should delete an existing text', async () => {
        const deleteRes = await agent.post('/delete/1');
        expect(deleteRes.statusCode).toBe(302);

        const updatedListRes = await agent.get('/dashboard');
        expect(updatedListRes.text).not.toContain(`${fakeText}`);
    });
});
