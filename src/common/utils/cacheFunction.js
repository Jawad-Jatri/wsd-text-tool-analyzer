const Cache = require('../../config/cache')
const cache = new Cache()

const cacheFunction = (fn, keyPrefix = '') => {
    return async (...args) => {
        const key = `${keyPrefix}:${JSON.stringify(args)}`;

        const cachedResult = await cache.get(key);
        if (cachedResult) {
            console.log('Cache hit for:', key);
            return cachedResult;
        }

        // Execute the original function and cache the result
        const result = await fn(...args);
        await cache.set(key, result);
        return result;
    };
};

module.exports = cacheFunction;