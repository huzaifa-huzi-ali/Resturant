const userService = require('./user.service');
const redisClient = require('../shared/config/redis');

const clearUserProfileCache = async (userId) => {
  try {
    await redisClient.del(`user:profile:${userId}`);
  } catch (err) {
    console.error('Redis cache clear error:', err);
  }
};

const getProfile = async (req, res, next) => {
  try { res.json(await userService.getProfile(req.user.id)); }
  catch (err) { next(err); }
};

const updateProfile = async (req, res, next) => {
  try { 
    const profile = await userService.updateProfile(req.user.id, req.body); 
    await clearUserProfileCache(req.user.id);
    res.json(profile);
  }
  catch (err) { next(err); }
};

module.exports = { getProfile, updateProfile };
