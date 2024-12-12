const UnauthorizedError = require('../common/exceptions/unauthorizedError');
const {verifyToken} = require('../services/authService')

const isAuthenticatedUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return next(new UnauthorizedError('Not authorized'));

        await verifyToken(token, (user) => {
            req.user = user
            next()
        });

    } catch (err) {
        next(err);
    }
};

module.exports = isAuthenticatedUser;