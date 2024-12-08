const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    return res.status(statusCode).json({
        error: {
            code: statusCode,
            message: err.message || 'Internal Server Error',
        },
    });
};

module.exports = errorHandler;