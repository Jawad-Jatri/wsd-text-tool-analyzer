const successResponse = require("../common/response/successResponse");
const {
    wordCountInText,
    sentenceCountInText,
    characterCountInText,
    paragraphCountInText,
    longestWordsByParagraphs
} = require("../services/textService");

const apiController = {
    wordCount: async (req, res, next) => {
        try {
            const {id} = req.params;

            return successResponse(res, {
                count: await wordCountInText(id)
            });
        } catch (err) {
            next(err);
        }
    },
    characterCount: async (req, res, next) => {
        try {
            const {id} = req.params;

            return successResponse(res, {
                count: await characterCountInText(id)
            });
        } catch (err) {
            next(err);
        }
    },
    sentenceCount: async (req, res, next) => {
        try {
            const {id} = req.params;

            return successResponse(res, {
                count: await sentenceCountInText(id)
            });
        } catch (err) {
            next(err);
        }
    },
    paragraphCount: async (req, res, next) => {
        try {
            const {id} = req.params;

            return successResponse(res, {
                count: await paragraphCountInText(id)
            });
        } catch (err) {
            next(err);
        }
    },
    longestWordsInParagraphs: async (req, res, next) => {
        try {
            const {id} = req.params;

            return successResponse(res, await longestWordsByParagraphs(id));
        } catch (err) {
            next(err);
        }
    },
};

module.exports = apiController;