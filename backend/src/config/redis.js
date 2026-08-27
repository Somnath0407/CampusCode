const { createClient } = require('redis');

const redisClient = createClient({
    url: process.env.REDIS_URL,
});

// node-redis emits 'error' on any connection hiccup (e.g. a transient
// ECONNRESET on the TLS socket to Upstash) — an EventEmitter's 'error' event
// is fatal (crashes the whole process) unless something is listening for it.
// The client already retries/reconnects on its own; this just keeps a blip
// from taking the entire server down.
redisClient.on('error', (err) => {
    console.error('Redis client error:', err.message);
});

module.exports = redisClient;

