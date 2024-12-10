const config = require('../../config')

class CacheInterface {
    generateKey(identifier) {
        return `${config.cache.prefix}:cache:${identifier.trim()}`
    }

    get(key) {
        throw new Error("get() method must be implemented");
    }

    set(key, value, ttl) {
        throw new Error("set() method must be implemented");
    }

    delete(key) {
        throw new Error("delete() method must be implemented");
    }

    check(key) {
        throw new Error("check() method must be implemented");
    }
}

module.exports = CacheInterface;