const request = require('supertest');
const {sequelize, Text} = require('../../src/models');
const {fakeText} = require('../mocks');
const nock = require("nock");
const app = require("../../src/app");

let textId;
let token;
let rateLimit = 5;
let windowLimit = 10;

beforeAll(async () => {
    await sequelize.sync({force: true});
    const text = await Text.create({
        text: fakeText
    });
    textId = text.id;
});

afterAll(async () => {
    await sequelize.close();
});

describe('Rate limit test', () => {
    let app;

    beforeEach(async () => {
        jest.resetModules();
        process.env.MAX_RATE_LIMIT = rateLimit;
        process.env.RATE_LIMIT_WINDOW_IN_SECONDS = windowLimit;
        app = require('../../src/app');
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

        const agent = request.agent(app); // Maintain session across requests
        const res = await agent.get('/auth/google/callback?code=test_code&state=api').expect(200);
        token = res.body.data.accessToken;
    });

    it('Should allow requests up to the limit', async () => {
        for (let i = 0; i < rateLimit; i++) {
            const response = await request(app)
                .get(`/api/words/${textId}`)
                .set('Authorization', `Bearer ${token}`)
                .expect('Content-Type', /json/)
                .expect(200);
            expect(response.status).toBe(200);
        }
    });
    it('should return 429 too many requests after exceeding the limit', async () => {
        for (let i = 0; i < rateLimit; i++) {
            await request(app).get(`/api/words/${textId}`).set('Authorization', `Bearer ${token}`);
        }
        return request(app)
            .get(`/api/words/${textId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(429)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        error: expect.objectContaining({
                            code: 429,
                            message: expect.any(String),
                        })
                    })
                );
            });
    });
    it('should reset limit after the window', async () => {
        for (let i = 0; i < rateLimit; i++) {
            await request(app).get(`/api/words/${textId}`).set('Authorization', `Bearer ${token}`).expect(200);
        }
        await request(app)
            .get(`/api/words/${textId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(429)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        error: expect.objectContaining({
                            code: 429,
                            message: expect.any(String),
                        })
                    })
                );
            });
        await new Promise((resolve) => setTimeout(resolve, (windowLimit + 1) * 1000));

        return request(app)
            .get(`/api/words/${textId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(200);
    }, (windowLimit + 5) * 1000);
});
