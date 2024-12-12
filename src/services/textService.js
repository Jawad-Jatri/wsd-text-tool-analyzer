const {Text} = require('../models');
const NotFoundError = require("../common/exceptions/notFoundError");
const BadRequestError = require("../common/exceptions/badRequestError");
const cacheFunction = require('../../src/common/utils/cacheFunction')
const cacheKey = require('../../src/common/constants/cacheKey')

const textService = {
    getTextById: async (id) => {
        try {
            if (!id) {
                throw new BadRequestError("Id is required!");
            }
            const text = await Text.findOne(
                {where: {id}}
            );
            if (!text) {
                throw new NotFoundError("Text not found!");
            }
            return text;
        } catch (error) {
            throw error;
        }
    },
    getTextsByUserId: async (userId) => {
        try {
            if (!userId) {
                throw new BadRequestError("User id is required!");
            }
            return await Text.findAll(
                {where: {UserId: userId}}
            );
        } catch (error) {
            throw error;
        }
    },
    getReportByTextId: async (id) => {
        try {
            if (!id) {
                throw new BadRequestError("Id is required!");
            }
            const text = await Text.findOne(
                {where: {id}}
            );
            if (!text) {
                throw new NotFoundError("Text not found!");
            }
            return {
                id: text.id,
                text: text.text,
                words: await textService.wordCountInText(id),
                characters: await textService.characterCountInText(id),
                paragraphs: await textService.paragraphCountInText(id),
                sentence: await textService.sentenceCountInText(id),
                longestWord: await textService.longestWordsByParagraphs(id),
            }
        } catch (error) {
            throw error;
        }
    },
    findAllText: async () => {
        try {
            return await Text.findAll();
        } catch (error) {
            throw error;
        }
    },
    insertText: async (text, userId) => {
        try {
            if (!userId) {
                throw new BadRequestError("User id is required!");
            }
            if (!text) {
                throw new BadRequestError("Text is required!");
            }
            return await Text.create({text, UserId: userId});
        } catch (error) {
            throw error;
        }
    },
    deleteText: async (id) => {
        try {
            if (!id) {
                throw new BadRequestError("Id is required!");
            }
            return await Text.destroy({where: {id: id}});
        } catch (error) {
            throw error;
        }
    },
    updateText: async (id, text) => {
        try {
            if (!id) {
                throw new BadRequestError("Id is required!");
            }
            if (!text) {
                throw new BadRequestError("Text is required!");
            }
            await Text.update({text},
                {where: {id: id}});

            return await textService.getTextById(id);
        } catch (error) {
            throw error;
        }
    },
    wordCountInText: async (id) => {
        try {
            const {text} = await textService.getTextById(id);
            return text.replace(/[.,!?;:()"'`]/g, "").split(/\s+/).length;
        } catch (error) {
            throw error;
        }
    },
    characterCountInText: async (id) => {
        try {
            const {text} = await textService.getTextById(id);
            return text.length;
        } catch (error) {
            throw error;
        }
    },
    sentenceCountInText: async (id) => {
        try {
            const {text} = await textService.getTextById(id);
            return (text.match(/[.!?]/g) || []).length;
        } catch (error) {
            throw error;
        }
    },
    paragraphCountInText: async (id) => {
        try {
            const {text} = await textService.getTextById(id);
            return text.split('\n').length;
        } catch (error) {
            throw error;
        }
    },
    longestWordsByParagraphs: async (id) => {
        try {
            const {text} = await textService.getTextById(id);
            const paragraphs = text.split('\n');

            return paragraphs.map(paragraph => {
                const words = paragraph.replace(/[.,!?;:()"'`]/g, " ").split(/\s+/);
                const maxLength = Math.max(...words.map(word => word.length));
                const longestWords = words.filter(word => word.length === maxLength);

                return {
                    paragraph,
                    longestWords
                };
            });

        } catch (error) {
            throw error;
        }
    },
};

textService.getTextById = cacheFunction(textService.getTextById, cacheKey.getTextById);

module.exports = textService;