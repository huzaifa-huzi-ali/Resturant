const userService = require('./user.service');
const { getClient } = require('../shared/config/redis');

const clearUserCache = async (userId) => {
  try {
    const client = getClient();
    await client.del(`user:profile:${userId}`);
  } catch (err) {
    console.warn('Redis cache clear error:', err.message);
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
