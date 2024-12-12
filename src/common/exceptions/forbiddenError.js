const statusCode = require("../constants/statusCode");

class ForbiddenError extends Error {
    constructor(message) {
        super(message);
        this.status = statusCode.HTTP_403_FORBIDDEN;
    }
}

module.exports = ForbiddenError;