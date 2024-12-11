const statusCode = require("../constants/statusCode");

class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.status = statusCode.HTTP_401_UNAUTHORIZED;
    }
}

module.exports = UnauthorizedError;