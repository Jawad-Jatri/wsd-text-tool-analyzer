const {User, Text} = require('../models');
const config = require('../config');
const NotFoundError = require("../common/exceptions/notFoundError");
const BadRequestError = require("../common/exceptions/badRequestError");

const userService = {
    getUserById: async (id) => {
        try {
            if (!id) {
                throw new BadRequestError("Id is required!");
            }
            const user = await User.findOne(
                {where: {id}}
            );
            if (!user) {
                throw new NotFoundError("User not found!");
            }
            return user;
        } catch (error) {
            throw error;
        }
    },
    insertUser: async (name, email, googleId) => {
        try {
            if (!name) {
                throw new BadRequestError("Name is required!");
            }
            if (!email) {
                throw new BadRequestError("Email is required!");
            }
            if (!googleId) {
                throw new BadRequestError("Google ID is required!");
            }
            return await User.create({name, email, googleId, status: true});
        } catch (error) {
            throw error;
        }
    },
    findOrCreateUserByEmail: async (name, email, googleId) => {
        try {
            if (!name) {
                throw new BadRequestError("Name is required!");
            }
            if (!email) {
                throw new BadRequestError("Email is required!");
            }
            if (!googleId) {
                throw new BadRequestError("Google ID is required!");
            }
            const user = await User.findOne({where: {email}});
            if (!user) {
                return userService.insertUser(name, email, googleId);
            }
            return user;
        } catch (error) {
            throw error;
        }
    },
};

module.exports = userService;