const { getClient } = require('../config/redis');

const cacheMiddleware = (keyGenerator, ttl = 600) => {
  return async (req, res, next) => {
    try {
      const key = keyGenerator(req);
      const client = getClient();

      const cachedData = await client.get(key);

      if (cachedData) {
        res.setHeader('X-Cache', 'HIT');
        return res.json(JSON.parse(cachedData));
      }

      const originalJson = res.json.bind(res);

      res.json = async (data) => {
        try {
          res.setHeader('X-Cache', 'MISS');
          await client.setEx(key, ttl, JSON.stringify(data));
        } catch (cacheErr) {
          console.warn('⚠️ Cache Set Error:', cacheErr.message);
        }
        return originalJson(data);
      };

      next();
    } catch (err) {
      console.warn('⚠️ Cache Check Error:', err.message);
      next();
    }
  };
};

module.exports = cacheMiddleware;
