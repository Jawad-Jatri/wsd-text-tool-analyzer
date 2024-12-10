const request = require('supertest');
const {sequelize, Text} = require('../../src/models');
const {fakeText} = require('../mocks');

let textId;
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
    });

    it('Should allow requests up to the limit', async () => {
        for (let i = 0; i < rateLimit; i++) {
            const response = await request(app)
                .get(`/api/words/${textId}`)
                .expect('Content-Type', /json/)
                .expect(200);
            expect(response.status).toBe(200);
        }
    });
    it('should return 429 too many requests after exceeding the limit', async () => {
        for (let i = 0; i < rateLimit; i++) {
            await request(app).get(`/api/words/${textId}`);
        }
        return request(app)
            .get(`/api/words/${textId}`)
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
            await request(app).get(`/api/words/${textId}`);
        }
        await request(app)
            .get(`/api/words/${textId}`)
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
            .expect('Content-Type', /json/)
            .expect(200);
    }, (windowLimit + 5) * 1000);
});
