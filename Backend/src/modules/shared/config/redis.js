const redis = require('redis');

const redisUrl = process.env.REDIS_URL;

// If no Redis URL is provided, export a no-op client to avoid noisy connection errors in dev.
if (!redisUrl) {
  console.warn('Redis cache disabled: REDIS_URL not set.');
  const noop = {
    get: async () => null,
    setEx: async () => {},
    del: async () => {},
    keys: async () => [],
    quit: async () => {},
  };
  module.exports = noop;
  return;
}

const client = redis.createClient({ url: redisUrl });

client.on('error', (err) => {
  console.error('Redis Error:', err);
});

(async () => {
  try {
    await client.connect();
    console.log('✅ Connected to Redis cache');
  } catch (error) {
    console.error('❌ Failed to connect to Redis', error);
  }
})();

module.exports = client;
