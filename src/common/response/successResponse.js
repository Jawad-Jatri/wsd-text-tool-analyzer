const statusCode = require("../constants/statusCode");

const successResponse = (res, data, message = 'Request successful', code = statusCode.HTTP_200_OK) => {
    res.status(code).json({
        code,
        message,
        data,
    });
};

module.exports = successResponse;