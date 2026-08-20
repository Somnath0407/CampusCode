const { createClient } = require('redis');

const redisClient = createClient({
    url: process.env.REDIS_URL,
});

module.exports = redisClient;

