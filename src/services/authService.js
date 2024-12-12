const config = require('../config');
const jwt = require('jsonwebtoken');
const BadRequestError = require("../common/exceptions/badRequestError");
const {getUserById} = require('../services/userService');
const ForbiddenError = require("../common/exceptions/forbiddenError");

const authService = {
    generateToken: async (userId) => {
        try {
            if (!userId) {
                throw new BadRequestError("User id is required!");
            }
            const user = getUserById(userId);
            return jwt.sign({id: user.id}, config.oauth.jwtToken, {expiresIn: '1h'});

        } catch (error) {
            throw error;
        }
    },
    verifyToken: async (token, callback) => {
        try {
            jwt.verify(token, config.oauth.jwtToken, (err, decoded) => {
                if (err) {
                    throw new ForbiddenError('Forbidden');
                }
                callback(decoded);
            });
        } catch (error) {
            throw error;
        }
    },
};

module.exports = authService;