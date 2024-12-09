const {Text} = require('../models');
const NotFoundError = require("../common/exceptions/notFoundError");
const successResponse = require("../common/response/successResponse");

const apiController = {
    wordCount: async (req, res, next) => {
        try {
            const {id} = req.params;
            const text = await Text.findOne({where: {id: id}});

            if (!text) {
                next(new NotFoundError("Text not found!"));
            }

            return successResponse(res, {
                count: text.text.replace(/[.,!?;:()"'`]/g, "").split(/\s+/).length,
            });
        } catch (err) {
            next(err);
        }
    },
    characterCount: async (req, res, next) => {
        try {
            const {id} = req.params;
            const text = await Text.findOne({where: {id: id}});

            if (!text) {
                next(new NotFoundError("Text not found!"));
            }

            return successResponse(res, {
                count: text.text.length
            });
        } catch (err) {
            next(err);
        }
    },
    sentenceCount: async (req, res, next) => {
        try {
            const {id} = req.params;
            const text = await Text.findOne({where: {id: id}});

            if (!text) {
                next(new NotFoundError("Text not found!"));
            }

            return successResponse(res, {
                count: (text.text.match(/[.!?]/g) || []).length
            });
        } catch (err) {
            next(err);
        }
    },
    paragraphCount: async (req, res, next) => {
        try {
            const {id} = req.params;
            const text = await Text.findOne({where: {id: id}});

            if (!text) {
                next(new NotFoundError("Text not found!"));
            }

            return successResponse(res, {
                count: text.text.split('\n').length
            });
        } catch (err) {
            next(err);
        }
    },
    longestWordsInParagraphs: async (req, res, next) => {
        try {
            const {id} = req.params;
            const text = await Text.findOne({where: {id: id}});

            if (!text) {
                next(new NotFoundError("Text not found!"));
            }
            const paragraphs = text.text.split('\n');

            const data = paragraphs.map(paragraph => {
                const words = paragraph.replace(/[.,!?;:()"'`]/g, " ").split(/\s+/);
                const maxLength = Math.max(...words.map(word => word.length));
                const longestWords = words.filter(word => word.length === maxLength);

                return {
                    paragraph,
                    longestWords
                };
            });

            return successResponse(res, data);
        } catch (err) {
            next(err);
        }
    },
};

module.exports = apiController;