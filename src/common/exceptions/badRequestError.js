const statusCode = require("../constants/statusCode");

class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.status = statusCode.HTTP_400_BAD_REQUEST;
    }
}

module.exports = BadRequestError;