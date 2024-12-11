const {Text} = require('../models');
const config = require('../config');
const jwt = require('jsonwebtoken');
const NotFoundError = require("../common/exceptions/notFoundError");
const BadRequestError = require("../common/exceptions/badRequestError");
const {getUserById} = require('../services/userService');

const authService = {
    generateToken: async (userId) => {
        try {
            if (!userId) throw new BadRequestError("User id is required!");
            const user = getUserById(userId);
            return jwt.sign({id: user.id}, config.oauth.jwtToken, {expiresIn: '1h'});

        } catch (error) {
            throw error;
        }
    },
    verifyToken: async () => {
        try {

        } catch (error) {
            throw error;
        }
    },
};

module.exports = authService;