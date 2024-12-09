const request = require('supertest');
const app = require('../src/app');
const {sequelize, Text} = require('../src/models');

const testingText = "The quick brown fox jumps over the lazy dog. \nThe lazy dog slept in the sun.";

let textId;

beforeAll(async () => {
    await sequelize.sync({force: true});
    const text = await Text.create({
        text: testingText
    });
    textId = text.id;
});

afterAll(async () => {
    await sequelize.close();
});

describe('API e2e test', () => {
    it('should return the number of words', async () => {
        return request(app)
            .get(`/api/words/${textId}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        code: expect.any(Number),
                        message: expect.any(String),
                        data: expect.objectContaining({
                            count: 16,
                        })
                    })
                );
            });
    });
    it('should return 404 text not found for word count', async () => {
        return request(app)
            .get('/api/words/999')
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
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        code: expect.any(Number),
                        message: expect.any(String),
                        data: expect.objectContaining({
                            count: 76,
                        })
                    })
                );
            });
    });
    it('should return 404 text not found for characters count', async () => {
        return request(app)
            .get('/api/characters/999')
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
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        code: expect.any(Number),
                        message: expect.any(String),
                        data: expect.objectContaining({
                            count: 2,
                        })
                    })
                );
            });
    });
    it('should return 404 text not found for sentences count', async () => {
        return request(app)
            .get('/api/sentences/999')
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
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        code: expect.any(Number),
                        message: expect.any(String),
                        data: expect.objectContaining({
                            count: 2,
                        })
                    })
                );
            });
    });
    it('should return 404 text not found for paragraphs count', async () => {
        return request(app)
            .get('/api/paragraphs/999')
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