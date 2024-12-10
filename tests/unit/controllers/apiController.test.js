const BadRequestError = require("../../../src/common/exceptions/badRequestError");
const {
    wordCount,
    characterCount,
    sentenceCount,
    paragraphCount,
    longestWordsInParagraphs
} = require('../../../src/controllers/apiController');
const {fakeTextAnalysisReport} = require('../../mocks');

jest.mock("../../../src/common/response/successResponse");
const successResponse = require("../../../src/common/response/successResponse");

jest.mock('../../../src/services/textService');
const textService = require('../../../src/services/textService');

describe('Api Controller unit test', () => {
    let req, res, next;
    beforeEach(() => {
        jest.clearAllMocks();
        req = {params: {}};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        successResponse.mockImplementation((res, data) => res.status(200).json(data));
    });

    describe('wordCount', () => {
        it('should return word count response', async () => {
            req.params = {id: fakeTextAnalysisReport.id};
            textService.wordCountInText.mockResolvedValue(fakeTextAnalysisReport.wordCount);
            await wordCount(req, res, next);

            expect(textService.wordCountInText).toHaveBeenCalledWith(fakeTextAnalysisReport.id);
            expect(successResponse).toHaveBeenCalledWith(res, {count: fakeTextAnalysisReport.wordCount});
            expect(next).not.toHaveBeenCalled();
        });

        it('should throw error for id null', async () => {
            req.params = {id: null};
            textService.wordCountInText.mockRejectedValue(new BadRequestError("Id is required!"));
            await wordCount(req, res, next);

            expect(textService.wordCountInText).toHaveBeenCalledWith(null);
            expect(next).toHaveBeenCalledWith(new BadRequestError("Id is required!"));
            expect(successResponse).not.toHaveBeenCalled();
        });

        it('should throw error for DB error', async () => {
            req.params = {id: fakeTextAnalysisReport.id};
            textService.wordCountInText.mockRejectedValue(new Error("DB error"));
            await wordCount(req, res, next);

            expect(textService.wordCountInText).toHaveBeenCalledWith(fakeTextAnalysisReport.id);
            expect(next).toHaveBeenCalledWith(new Error("DB error"));
            expect(successResponse).not.toHaveBeenCalled();
        });
    });
    describe('characterCount', () => {
        it('should return character count response', async () => {
            req.params = {id: fakeTextAnalysisReport.id};
            textService.characterCountInText.mockResolvedValue(fakeTextAnalysisReport.characterCount);
            await characterCount(req, res, next);

            expect(textService.characterCountInText).toHaveBeenCalledWith(fakeTextAnalysisReport.id);
            expect(successResponse).toHaveBeenCalledWith(res, {count: fakeTextAnalysisReport.characterCount});
            expect(next).not.toHaveBeenCalled();
        });

        it('should throw error for id null', async () => {
            req.params = {id: null};
            textService.characterCountInText.mockRejectedValue(new BadRequestError("Id is required!"));
            await characterCount(req, res, next);

            expect(textService.characterCountInText).toHaveBeenCalledWith(null);
            expect(next).toHaveBeenCalledWith(new BadRequestError("Id is required!"));
            expect(successResponse).not.toHaveBeenCalled();
        });

        it('should throw error for DB error', async () => {
            req.params = {id: fakeTextAnalysisReport.id};
            textService.characterCountInText.mockRejectedValue(new Error("DB error"));
            await characterCount(req, res, next);

            expect(textService.characterCountInText).toHaveBeenCalledWith(fakeTextAnalysisReport.id);
            expect(next).toHaveBeenCalledWith(new Error("DB error"));
            expect(successResponse).not.toHaveBeenCalled();
        });
    });
    describe('sentenceCount', () => {
        it('should return sentence count response', async () => {
            req.params = {id: fakeTextAnalysisReport.id};
            textService.sentenceCountInText.mockResolvedValue(fakeTextAnalysisReport.sentenceCount);
            await sentenceCount(req, res, next);

            expect(textService.sentenceCountInText).toHaveBeenCalledWith(fakeTextAnalysisReport.id);
            expect(successResponse).toHaveBeenCalledWith(res, {count: fakeTextAnalysisReport.sentenceCount});
            expect(next).not.toHaveBeenCalled();
        });

        it('should throw error for id null', async () => {
            req.params = {id: null};
            textService.sentenceCountInText.mockRejectedValue(new BadRequestError("Id is required!"));
            await sentenceCount(req, res, next);

            expect(textService.sentenceCountInText).toHaveBeenCalledWith(null);
            expect(next).toHaveBeenCalledWith(new BadRequestError("Id is required!"));
            expect(successResponse).not.toHaveBeenCalled();
        });

        it('should throw error for DB error', async () => {
            req.params = {id: fakeTextAnalysisReport.id};
            textService.sentenceCountInText.mockRejectedValue(new Error("DB error"));
            await sentenceCount(req, res, next);

            expect(textService.sentenceCountInText).toHaveBeenCalledWith(fakeTextAnalysisReport.id);
            expect(next).toHaveBeenCalledWith(new Error("DB error"));
            expect(successResponse).not.toHaveBeenCalled();
        });
    });
    describe('paragraphCount', () => {
        it('should return paragraph count response', async () => {
            req.params = {id: fakeTextAnalysisReport.id};
            textService.paragraphCountInText.mockResolvedValue(fakeTextAnalysisReport.paragraphCount);
            await paragraphCount(req, res, next);

            expect(textService.paragraphCountInText).toHaveBeenCalledWith(fakeTextAnalysisReport.id);
            expect(successResponse).toHaveBeenCalledWith(res, {count: fakeTextAnalysisReport.paragraphCount});
            expect(next).not.toHaveBeenCalled();
        });

        it('should throw error for id null', async () => {
            req.params = {id: null};
            textService.paragraphCountInText.mockRejectedValue(new BadRequestError("Id is required!"));
            await paragraphCount(req, res, next);

            expect(textService.paragraphCountInText).toHaveBeenCalledWith(null);
            expect(next).toHaveBeenCalledWith(new BadRequestError("Id is required!"));
            expect(successResponse).not.toHaveBeenCalled();
        });

        it('should throw error for DB error', async () => {
            req.params = {id: fakeTextAnalysisReport.id};
            textService.paragraphCountInText.mockRejectedValue(new Error("DB error"));
            await paragraphCount(req, res, next);

            expect(textService.paragraphCountInText).toHaveBeenCalledWith(fakeTextAnalysisReport.id);
            expect(next).toHaveBeenCalledWith(new Error("DB error"));
            expect(successResponse).not.toHaveBeenCalled();
        });
    });
    describe('longestWordsInParagraphs', () => {
        it('should return paragraph count response', async () => {
            req.params = {id: fakeTextAnalysisReport.id};
            textService.longestWordsByParagraphs.mockResolvedValue(fakeTextAnalysisReport.longestWordsInParagraphs);
            await longestWordsInParagraphs(req, res, next);

            expect(textService.longestWordsByParagraphs).toHaveBeenCalledWith(fakeTextAnalysisReport.id);
            expect(successResponse).toHaveBeenCalledWith(res, fakeTextAnalysisReport.longestWordsInParagraphs);
            expect(next).not.toHaveBeenCalled();
        });

        it('should throw error for id null', async () => {
            req.params = {id: null};
            textService.longestWordsByParagraphs.mockRejectedValue(new BadRequestError("Id is required!"));
            await longestWordsInParagraphs(req, res, next);

            expect(textService.longestWordsByParagraphs).toHaveBeenCalledWith(null);
            expect(next).toHaveBeenCalledWith(new BadRequestError("Id is required!"));
            expect(successResponse).not.toHaveBeenCalled();
        });

        it('should throw error for DB error', async () => {
            req.params = {id: fakeTextAnalysisReport.id};
            textService.longestWordsByParagraphs.mockRejectedValue(new Error("DB error"));
            await longestWordsInParagraphs(req, res, next);

            expect(textService.longestWordsByParagraphs).toHaveBeenCalledWith(fakeTextAnalysisReport.id);
            expect(next).toHaveBeenCalledWith(new Error("DB error"));
            expect(successResponse).not.toHaveBeenCalled();
        });
    });
});
