const {
    getTextById,
    getTextsByUserId,
    findAllText,
    insertText,
    deleteText,
    updateText,
    wordCountInText,
    characterCountInText,
    sentenceCountInText,
    paragraphCountInText,
    longestWordsByParagraphs,
    getReportByTextId
} = require('../../../src/services/textService');
const BadRequestError = require("../../../src/common/exceptions/badRequestError");
const NotFoundError = require("../../../src/common/exceptions/notFoundError");
const {fakeTexts, fakeText, fakeTextAnalysisReport} = require('../../mocks');
const cacheFunction = require("../../../src/common/utils/cacheFunction")

jest.mock("../../../src/common/utils/cacheFunction")
jest.mock('../../../src/models', () => {
    const {fakeTexts} = require('../../mocks');
    const SequelizeMock = require('sequelize-mock');
    const dbMock = new SequelizeMock();
    const TextMock = dbMock.define('Text', fakeTexts[0]);
    return {
        Text: TextMock,
    };
});

beforeEach(() => {
    // This ensures that the cacheFunction wrapper is applied correctly in the test
    getTextById = cacheFunction(getTextById, 'getTextById');
});
describe('Text Service unit test', () => {
    let TextMock;
    let cacheMock;

    beforeAll(() => {
        const {Text} = require('../../../src/models');
        TextMock = Text;
    });

    describe('getTextById', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should throw BadRequestError if id is not provided', async () => {
            const res = getTextById();
            await expect(res).rejects.toThrow(BadRequestError);
            await expect(res).rejects.toThrow('Id is required!');
        });

        it('should throw NotFoundError if text is not found', async () => {
            TextMock.findOne = jest.fn().mockResolvedValue(null);
            const res = getTextById(1);
            await expect(res).rejects.toThrow(NotFoundError);
            await expect(res).rejects.toThrow('Text not found!');
        });

        it('should return the text if found', async () => {
            cacheMock.get.mockReturnValueOnce(null);
            TextMock.findOne = jest.fn().mockResolvedValue(fakeTexts[0]);

            const res = await getTextById(1);

            expect(cacheMock.get).toHaveBeenCalledWith('getTextById:1');
            expect(TextMock.findOne).toHaveBeenCalledWith({where: {id: 1}});
            expect(cacheMock.set).toHaveBeenCalledWith('getTextById:1', fakeTexts[0]);
            expect(res).toEqual(fakeTexts[0]);
        });
    });
    describe('findAllText', () => {
        it('should return all texts', async () => {
            TextMock.findAll = jest.fn().mockResolvedValue(fakeTexts);

            const res = await findAllText();
            expect(TextMock.findAll).toHaveBeenCalled();
            expect(res).toEqual(fakeTexts);
            expect(res).toHaveLength(2);
        });

        it('should throw an error if findAll fails', async () => {
            TextMock.findAll = jest.fn().mockRejectedValue(new Error('DB error'));

            const res = findAllText();
            await expect(res).rejects.toThrow('DB error');
        });

    });
    describe('getTextsByUserId', () => {
        it('should return all texts by userId', async () => {
            TextMock.findAll = jest.fn().mockResolvedValue(fakeTexts.filter(obj => obj.UserId === 1));

            const res = await getTextsByUserId(1);
            expect(TextMock.findAll).toHaveBeenCalled();
            expect(res).toEqual(fakeTexts.filter(obj => obj.UserId === 1));
            expect(res).toHaveLength(1);
        });

        it('should throw an error if userid not given', async () => {
            const res = getTextsByUserId();
            await expect(res).rejects.toThrow('User id is required!');
        });

        it('should throw an error if findAll fails', async () => {
            TextMock.findAll = jest.fn().mockRejectedValue(new Error('DB error'));

            const res = getTextsByUserId(1);
            await expect(res).rejects.toThrow('DB error');
        });
    });
    describe('insertText', () => {
        it('should throw BadRequestError if text is not provided', async () => {
            const res = insertText(null, 1);
            await expect(res).rejects.toThrow(BadRequestError);
            await expect(res).rejects.toThrow('Text is required!');
        });

        it('should throw BadRequestError if user id is not provided', async () => {
            const res = insertText(fakeText, null);
            await expect(res).rejects.toThrow(BadRequestError);
            await expect(res).rejects.toThrow('User id is required!');
        });

        it('should insert text and return the created text', async () => {
            TextMock.create = jest.fn().mockResolvedValue({id: 1, text: fakeText, UserId: 1});

            const res = await insertText(fakeText, 1);
            expect(TextMock.create).toHaveBeenCalledWith({text: fakeText, UserId: 1});
            expect(res).toEqual({id: 1, text: fakeText, UserId: 1});
        });
    });
    describe('deleteText', () => {
        it('should throw BadRequestError if id is not provided', async () => {
            const res = deleteText();
            await expect(res).rejects.toThrow(BadRequestError);
            await expect(res).rejects.toThrow('Id is required!');
        });

        it('should delete the text and return the result', async () => {
            TextMock.destroy = jest.fn().mockResolvedValue(1); // Assume 1 row is deleted

            const res = await deleteText(1);
            expect(TextMock.destroy).toHaveBeenCalledWith({where: {id: 1}});
            expect(res).toBe(1);
        });

        it('should throw an error if deletion fails', async () => {
            TextMock.destroy = jest.fn().mockRejectedValue(new Error('DB error'));

            const res = deleteText(1);
            await expect(res).rejects.toThrow('DB error');
        });
    });
    describe('updateText', () => {
        it('should throw BadRequestError if id is not provided', async () => {
            const res = updateText(null, fakeText);

            await expect(res).rejects.toThrow(BadRequestError);
            await expect(res).rejects.toThrow('Id is required!');
        });

        it('should throw BadRequestError if text is not provided', async () => {
            const res = updateText(1, null);

            await expect(res).rejects.toThrow(BadRequestError);
            await expect(res).rejects.toThrow('Text is required!');
        });

        it('should update the text and return the updated text', async () => {
            TextMock.update = jest.fn().mockResolvedValue([1]); // Assume 1 row is updated
            TextMock.findOne = jest.fn().mockResolvedValue({id: 1, text: fakeText});

            const res = await updateText(1, fakeText);
            expect(TextMock.update).toHaveBeenCalledWith({text: fakeText}, {where: {id: 1}});
            expect(TextMock.findOne).toHaveBeenCalledWith({where: {id: 1}});
            expect(res).toEqual({id: 1, text: fakeText});
        });

        it('should throw an error if update fails', async () => {
            TextMock.update = jest.fn().mockRejectedValue(new Error('DB error'));

            const res = updateText(1, fakeText);
            await expect(res).rejects.toThrow('DB error');
        });
    });
    describe('getReportByTextId', () => {
        it('should throw BadRequestError if id is not provided', async () => {
            const res = getReportByTextId();
            await expect(res).rejects.toThrow(BadRequestError);
            await expect(res).rejects.toThrow('Id is required!');
        });

        it('should throw NotFoundError if text is not found', async () => {
            TextMock.findOne = jest.fn().mockResolvedValue(null);
            const res = getReportByTextId(1);
            await expect(res).rejects.toThrow(NotFoundError);
            await expect(res).rejects.toThrow('Text not found!');
        });

        it('should return text report', async () => {
            TextMock.findOne = jest.fn().mockResolvedValue({
                id: fakeTextAnalysisReport.id,
                text: fakeTextAnalysisReport.text
            });

            const res = await getReportByTextId(fakeTextAnalysisReport.id);
            expect(TextMock.findOne).toHaveBeenCalledWith({where: {id: fakeTextAnalysisReport.id}});
            expect(typeof res).toBe('object');
            expect(res).toEqual(
                expect.objectContaining(
                    {
                        id: fakeTextAnalysisReport.id,
                        text: fakeTextAnalysisReport.text,
                        words: expect.any(Number),
                        characters: expect.any(Number),
                        paragraphs: expect.any(Number),
                        sentence: expect.any(Number),
                        longestWord: expect.arrayContaining([
                            expect.objectContaining(
                                {
                                    paragraph: expect.any(String),
                                    longestWords: expect.arrayContaining([expect.any(String)])
                                }
                            )
                        ])
                    })
            );
        });
    });
    describe('wordCountInText', () => {
        it('should throw BadRequestError if id is not provided', async () => {
            const res = wordCountInText();
            await expect(res).rejects.toThrow(BadRequestError);
            await expect(res).rejects.toThrow('Id is required!');
        });

        it('should throw NotFoundError if text is not found', async () => {
            TextMock.findOne = jest.fn().mockResolvedValue(null);
            const res = wordCountInText(1);
            await expect(res).rejects.toThrow(NotFoundError);
            await expect(res).rejects.toThrow('Text not found!');
        });

        it('should return text word count', async () => {
            TextMock.findOne = jest.fn().mockResolvedValue({
                id: fakeTextAnalysisReport.id,
                text: fakeTextAnalysisReport.text
            });

            const res = await wordCountInText(fakeTextAnalysisReport.id);
            expect(TextMock.findOne).toHaveBeenCalledWith({where: {id: fakeTextAnalysisReport.id}});
            expect(typeof res).toBe('number');
            expect(res).toEqual(fakeTextAnalysisReport.wordCount);
        });
    });
    describe('characterCountInText', () => {
        it('should throw BadRequestError if id is not provided', async () => {
            const res = characterCountInText();
            await expect(res).rejects.toThrow(BadRequestError);
            await expect(res).rejects.toThrow('Id is required!');
        });

        it('should throw NotFoundError if text is not found', async () => {
            TextMock.findOne = jest.fn().mockResolvedValue(null);
            const res = characterCountInText(1);
            await expect(res).rejects.toThrow(NotFoundError);
            await expect(res).rejects.toThrow('Text not found!');
        });

        it('should return text character count', async () => {
            TextMock.findOne = jest.fn().mockResolvedValue({
                id: fakeTextAnalysisReport.id,
                text: fakeTextAnalysisReport.text
            });

            const res = await characterCountInText(fakeTextAnalysisReport.id);
            expect(TextMock.findOne).toHaveBeenCalledWith({where: {id: fakeTextAnalysisReport.id}});
            expect(typeof res).toBe('number');
            expect(res).toEqual(fakeTextAnalysisReport.characterCount);
        });
    });
    describe('sentenceCountInText', () => {
        it('should throw BadRequestError if id is not provided', async () => {
            const res = sentenceCountInText();
            await expect(res).rejects.toThrow(BadRequestError);
            await expect(res).rejects.toThrow('Id is required!');
        });

        it('should throw NotFoundError if text is not found', async () => {
            TextMock.findOne = jest.fn().mockResolvedValue(null);
            const res = sentenceCountInText(1);
            await expect(res).rejects.toThrow(NotFoundError);
            await expect(res).rejects.toThrow('Text not found!');
        });

        it('should return text sentence count', async () => {
            TextMock.findOne = jest.fn().mockResolvedValue({
                id: fakeTextAnalysisReport.id,
                text: fakeTextAnalysisReport.text
            });

            const res = await sentenceCountInText(fakeTextAnalysisReport.id);
            expect(TextMock.findOne).toHaveBeenCalledWith({where: {id: fakeTextAnalysisReport.id}});
            expect(typeof res).toBe('number');
            expect(res).toEqual(fakeTextAnalysisReport.sentenceCount);
        });

        it('should return text sentence count 0', async () => {
            TextMock.findOne = jest.fn().mockResolvedValue({id: 1, text: 'Hello World'});

            const res = await sentenceCountInText(1);
            expect(TextMock.findOne).toHaveBeenCalledWith({where: {id: 1}});
            expect(typeof res).toBe('number');
            expect(res).toEqual(0);
        });
    });
    describe('paragraphCountInText', () => {
        it('should throw BadRequestError if id is not provided', async () => {
            const res = paragraphCountInText();
            await expect(res).rejects.toThrow(BadRequestError);
            await expect(res).rejects.toThrow('Id is required!');
        });

        it('should throw NotFoundError if text is not found', async () => {
            TextMock.findOne = jest.fn().mockResolvedValue(null);
            const res = paragraphCountInText(1);
            await expect(res).rejects.toThrow(NotFoundError);
            await expect(res).rejects.toThrow('Text not found!');
        });

        it('should return text paragraph count', async () => {
            TextMock.findOne = jest.fn().mockResolvedValue({
                id: fakeTextAnalysisReport.id,
                text: fakeTextAnalysisReport.text
            });

            const res = await paragraphCountInText(fakeTextAnalysisReport.id);
            expect(TextMock.findOne).toHaveBeenCalledWith({where: {id: fakeTextAnalysisReport.id}});
            expect(typeof res).toBe('number');
            expect(res).toEqual(fakeTextAnalysisReport.paragraphCount);
        });
    });
    describe('longestWordsByParagraphs', () => {
        it('should throw BadRequestError if id is not provided', async () => {
            const res = longestWordsByParagraphs();
            await expect(res).rejects.toThrow(BadRequestError);
            await expect(res).rejects.toThrow('Id is required!');
        });

        it('should throw NotFoundError if text is not found', async () => {
            TextMock.findOne = jest.fn().mockResolvedValue(null);
            const res = longestWordsByParagraphs(1);
            await expect(res).rejects.toThrow(NotFoundError);
            await expect(res).rejects.toThrow('Text not found!');
        });

        it('should return longest words by paragraphs', async () => {
            TextMock.findOne = jest.fn().mockResolvedValue({
                id: fakeTextAnalysisReport.id,
                text: fakeTextAnalysisReport.text
            });

            const res = await longestWordsByParagraphs(fakeTextAnalysisReport.id);
            expect(TextMock.findOne).toHaveBeenCalledWith({where: {id: fakeTextAnalysisReport.id}});
            expect(Array.isArray(res)).toBe(true);
            expect(res).toEqual(fakeTextAnalysisReport.longestWordsInParagraphs);
        });
    });
});