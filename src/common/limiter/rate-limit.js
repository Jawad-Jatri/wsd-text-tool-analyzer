const rateLimit = require('express-rate-limit');
const TooManyRequestsError = require("../exceptions/tooManyRequestsError");
const config = require("../../config");

const rateLimiter = rateLimit({
    windowMs: config.rateLimit.windowInS * 1000,
    max: config.rateLimit.max,
    keyGenerator: (req) => {
        return req.originalUrl; // using for rate limiting individually
    },
    handler: (req, res, next, options) => {
        next(new TooManyRequestsError("Too many requests."));
    },
});

module.exports = rateLimiter;