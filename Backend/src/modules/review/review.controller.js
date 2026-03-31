const reviewService = require('./review.service');
const { getClient } = require('../shared/config/redis');

const clearReviewCache = async () => {
  try {
    const client = getClient();
    const keys = await client.keys('reviews:*');
    if (keys.length > 0) await client.del(keys);
  } catch (err) {
    console.warn('Redis cache clear error:', err.message);
  }
};

const createReview = async (req, res, next) => {
  try { 
    const review = await reviewService.createReview(req.user.id, req.body);
    await clearReviewCache();
    res.status(201).json(review); 
  }
  catch (err) { next(err); }
};
const getReviewsByMenuItem = async (req, res, next) => {
  try { res.json(await reviewService.getByMenuItem(req.params.menuItemId)); }
  catch (err) { next(err); }
};
const deleteReview = async (req, res, next) => {
  try { 
    await reviewService.deleteReview(req.params.id, req.user); 
    await clearReviewCache();
    res.json({ message: 'Review deleted' }); 
  }
  catch (err) { next(err); }
};

module.exports = { createReview, getReviewsByMenuItem, deleteReview };
