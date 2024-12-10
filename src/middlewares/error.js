const config = require('../config');

const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    return res.status(statusCode).json(config.nodeEnv === 'production' ? {
        error: {
            code: statusCode,
            message: 'Something went wrong',
        },
    } : {
        error: {
            code: statusCode,
            message: err.message || 'Internal Server Error',
            stack: err.stack
        },
    });
};

module.exports = errorHandler;