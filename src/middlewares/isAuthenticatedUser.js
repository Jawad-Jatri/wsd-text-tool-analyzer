const UnauthorizedError = require('../common/exceptions/unauthorizedError');
const ForbiddenError = require('../common/exceptions/forbiddenError');
const jwt = require('jsonwebtoken');
const config = require('../config');

const isAuthenticatedUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return next(new UnauthorizedError('Not authorized'));

        jwt.verify(token, config.oauth.jwtToken, (err, user) => {
            if (err) return next(new ForbiddenError('Forbidden'));
            req.user = user;
            next();
        });

    } catch (err) {
        next(err);
    }
};

module.exports = isAuthenticatedUser;