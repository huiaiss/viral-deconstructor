const { createClient } = require('redis');
const config = require('../config');

const redis = createClient({ url: config.redis.url });

redis.on('error', (err) => console.error('Redis error:', err));

(async () => {
  await redis.connect();
})();

module.exports = redis;
