const NodeCache = require('node-cache');
const config = require('../config')
const CacheInterface = require('../common/interfaces/CacheInterface')
const cache = new NodeCache()

class Cache extends CacheInterface {
    constructor() {
        super();
    }

    async get(key) {
        return cache.get(this.generateKey(key));
    }

    async set(key, value, ttl = config.cache.timeout) {
        cache.set(this.generateKey(key), value, ttl);
    }

    async delete(key) {
        cache.del(this.generateKey(key));
    }

    check(key) {
        return cache.has(this.generateKey(key));
    }
}

module.exports = Cache;