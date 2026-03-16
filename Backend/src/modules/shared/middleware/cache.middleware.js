const redisClient = require('../config/redis');

const cacheMiddleware = (keyGenerator, ttl = 600) => {
  return async (req, res, next) => {
    try {
      const key = keyGenerator(req);

      const cachedData = await redisClient.get(key);

      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      const originalJson = res.json.bind(res);

      res.json = async (data) => {
        try {
          await redisClient.setEx(key, ttl, JSON.stringify(data));
        } catch (cacheErr) {
          console.error("Cache Set Error:", cacheErr);
        }
        return originalJson(data);
      };

      next();
    } catch (err) {
      console.error("Cache Check Error:", err);
      next();
    }
  };
};

module.exports = cacheMiddleware;
