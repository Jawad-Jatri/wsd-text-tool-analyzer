const statusCode = require("../constants/statusCode");

class TooManyRequestsError extends Error {
    constructor(message) {
        super(message);
        this.status = statusCode.HTTP_429_TOO_MANY_REQUESTS;
    }
}

module.exports = TooManyRequestsError;