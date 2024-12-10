const {Text} = require('../models');
const NotFoundError = require("../common/exceptions/notFoundError");
const BadRequestError = require("../common/exceptions/badRequestError");

const textService = {
    getTextById: async (id) => {
        try {
            const text = await Text.findOne(
                {where: {id}}
            )
            if (!text) {
                throw new NotFoundError("Text not found!")
            }
            return text
        } catch (error) {
            throw error
        }
    },
    findAllText: async () => {
        try {
            return Text.findAll()
        } catch (error) {
            throw error
        }
    },
    insertText: async (text) => {
        try {
            if (!text) {
                throw new BadRequestError("Text is required!")
            }
            return await Text.create(text)
        } catch (error) {
            throw error
        }
    },
    deleteText: async (id) => {
        try {
            return Text.destroy({where: {id: id}});
        } catch (error) {
            throw error
        }
    },
    updateText: async (id, text) => {
        try {
            if (!id) {
                throw new BadRequestError("Id is required!")
            }
            if (!text) {
                throw new BadRequestError("Text is required!")
            }
            await Text.update({text},
                {where: {id: id}});

            return this.getTextById(id)
        } catch (error) {
            throw error
        }
    },
};

module.exports = textService;