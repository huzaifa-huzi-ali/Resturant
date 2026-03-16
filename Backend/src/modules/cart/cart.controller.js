const cartService = require('./cart.service');
const redisClient = require('../shared/config/redis');

const clearCartCache = async (userId) => {
  try {
    await redisClient.del(`cart:user:${userId}`);
  } catch (err) {
    console.error('Redis cache clear error:', err);
  }
};

const getCart = async (req, res, next) => {
  try { res.json(await cartService.getCart(req.user.id)); }
  catch (err) { next(err); }
};

const addCartItem = async (req, res, next) => {
  try { 
    const item = await cartService.addItem(req.user.id, req.body); 
    await clearCartCache(req.user.id);
    res.status(201).json(item);
  }
  catch (err) { next(err); }
};

const updateCartItem = async (req, res, next) => {
  try { 
    const item = await cartService.updateItem(req.user.id, req.params.id, req.body.quantity); 
    await clearCartCache(req.user.id);
    res.json(item);
  }
  catch (err) { next(err); }
};

const deleteCartItem = async (req, res, next) => {
  try { 
    await cartService.removeItem(req.user.id, req.params.id); 
    await clearCartCache(req.user.id);
    res.json({ message: 'Item removed from cart' }); 
  }
  catch (err) { next(err); }
};

module.exports = { getCart, addCartItem, updateCartItem, deleteCartItem };
