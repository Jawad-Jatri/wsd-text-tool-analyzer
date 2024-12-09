const statusCode = require("../constants/statusCode");

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.status = statusCode.HTTP_404_NOT_FOUND;
    }
}

module.exports = NotFoundError;