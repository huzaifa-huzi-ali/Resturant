const redis = require('redis');

let client = null;
let isConnected = false;

/**
 * Initialize Redis client with error handling and graceful degradation
 * If Redis is unavailable, caching will be skipped but app continues to work
 */
const initializeRedis = async () => {
  if (isConnected) return client;

  try {
    client = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.warn('⚠️  Redis connection failed after 10 retries. Caching disabled.');
            return new Error('Redis max retries exceeded');
          }
          return retries * 50;
        },
      },
      // Timeout settings for better reliability
      commandsQueueBehaviour: 'block',
    });

    // Error handler
    client.on('error', (err) => {
      console.error('❌ Redis Error:', err.message);
      isConnected = false;
    });

    // Reconnection handler
    client.on('reconnecting', () => {
      console.log('🔄 Redis reconnecting...');
    });

    // Connected handler
    client.on('connect', () => {
      console.log('✅ Connected to Redis cache');
      isConnected = true;
    });

    // Connect with timeout
    await Promise.race([
      client.connect(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Redis connection timeout')), 5000)
      ),
    ]);

    isConnected = true;
    console.log('✅ Redis cache initialized successfully');
    return client;
  } catch (error) {
    console.warn(
      `⚠️  Redis connection failed: ${error.message}. Caching will be disabled.`
    );
    isConnected = false;
    // Return a mock client that doesn't throw errors
    return createMockRedisClient();
  }
};

/**
 * Mock Redis client for graceful degradation when Redis is unavailable
 * All methods return success without actually caching
 */
const createMockRedisClient = () => ({
  connect: async () => {
    console.log('📌 Using mock Redis client (no-op caching)');
  },
  get: async () => null,
  set: async () => 'OK',
  del: async () => 0,
  exists: async () => 0,
  keys: async () => [],
  flushAll: async () => 'OK',
  closeConnection: async () => 'OK',
  quit: async () => 'OK',
});

/**
 * Get Redis client status
 */
const getRedisStatus = () => ({
  isConnected,
  client: client ? 'active' : 'inactive',
});

/**
 * Graceful shutdown
 */
const closeRedis = async () => {
  if (client && isConnected) {
    try {
      await client.quit();
      console.log('✅ Redis connection closed');
      isConnected = false;
    } catch (error) {
      console.error('Error closing Redis:', error.message);
    }
  }
};

module.exports = {
  initializeRedis,
  getRedisStatus,
  closeRedis,
  getClient: () => client || createMockRedisClient(),
};
