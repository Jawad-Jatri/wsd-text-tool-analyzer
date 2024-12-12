const request = require('supertest');
const app = require('../../src/app');
const {sequelize, Text} = require('../../src/models');
const {fakeText} = require('../mocks');
const nock = require('nock');

let textId;
let token;

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

describe('API integration test', () => {
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

        const agent = request.agent(app); // Maintain session across requests
        const res = await agent.get('/auth/google/callback?code=test_code&state=api').expect(200);
        token = res.body.data.accessToken;
    });
    it('should return unauthorized error 401', async () => {
        return request(app)
            .get(`/api/words/${textId}`)
            .expect('Content-Type', /json/)
            .expect(401)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        error: expect.objectContaining({
                            code: 401,
                            message: expect.any(String),
                        })
                    })
                );
            });
    });
    it('should return the number of words', async () => {
        return request(app)
            .get(`/api/words/${textId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        code: expect.any(Number),
                        message: expect.any(String),
                        data: expect.objectContaining({
                            count: expect.any(Number),
                        })
                    })
                );
            });
    });
    it('should return 404 text not found for word count', async () => {
        return request(app)
            .get('/api/words/999')
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(404)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        error: expect.objectContaining({
                            code: 404,
                            message: expect.any(String),
                        })
                    })
                );
            });
    });
    it('should return the number of characters', async () => {
        return request(app)
            .get(`/api/characters/${textId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        code: expect.any(Number),
                        message: expect.any(String),
                        data: expect.objectContaining({
                            count: expect.any(Number),
                        })
                    })
                );
            });
    });
    it('should return 404 text not found for characters count', async () => {
        return request(app)
            .get('/api/characters/999')
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(404)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        error: expect.objectContaining({
                            code: 404,
                            message: expect.any(String),
                        })
                    })
                );
            });
    });
    it('should return the number of sentences', async () => {
        return request(app)
            .get(`/api/sentences/${textId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        code: expect.any(Number),
                        message: expect.any(String),
                        data: expect.objectContaining({
                            count: expect.any(Number),
                        })
                    })
                );
            });
    });
    it('should return 404 text not found for sentences count', async () => {
        return request(app)
            .get('/api/sentences/999')
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(404)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        error: expect.objectContaining({
                            code: 404,
                            message: expect.any(String),
                        })
                    })
                );
            });
    });
    it('should return the number of paragraphs', async () => {
        return request(app)
            .get(`/api/paragraphs/${textId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        code: expect.any(Number),
                        message: expect.any(String),
                        data: expect.objectContaining({
                            count: expect.any(Number),
                        })
                    })
                );
            });
    });
    it('should return 404 text not found for paragraphs count', async () => {
        return request(app)
            .get('/api/paragraphs/999')
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(404)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        error: expect.objectContaining({
                            code: 404,
                            message: expect.any(String),
                        })
                    })
                );
            });
    });
    it('should return the longest words in paragraphs', async () => {
        return request(app)
            .get(`/api/longest-words/${textId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        code: expect.any(Number),
                        message: expect.any(String),
                        data: expect.arrayContaining([
                            expect.objectContaining({
                                paragraph: expect.any(String),
                                longestWords: expect.arrayContaining([
                                    expect.any(String),
                                ])
                            })
                        ])
                    })
                );
            });
    });
    it('should return 404 text not found for longest words count', async () => {
        return request(app)
            .get('/api/longest-words/999')
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(404)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        error: expect.objectContaining({
                            code: 404,
                            message: expect.any(String),
                        })
                    })
                );
            });
    });
});