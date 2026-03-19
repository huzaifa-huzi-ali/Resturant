const menuService = require('./menu.service');
const redisClient = require('../shared/config/redis');

const clearMenuCache = async () => {
  try {
    const keys = await redisClient.keys('menu:*');
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (err) {
    console.error('Redis cache clear error:', err);
  }
};

const getAllMenuItems = async (req, res, next) => {
  try {
    const items = await menuService.getAll(req.query);
    res.json(items);
  } catch (err) { next(err); }
};

const getMenuItemById = async (req, res, next) => {
  try {
    const item = await menuService.getById(req.params.id);
    res.json(item);
  } catch (err) { next(err); }
};

const createMenuItem = async (req, res, next) => {
  try {
    const item = await menuService.create(req.body);
    await clearMenuCache();
    res.status(201).json(item);

  } catch (err) { next(err); }
};

const updateMenuItem = async (req, res, next) => {
  try {
    const item = await menuService.update(req.params.id, req.body);
    await clearMenuCache();
    res.json(item);
  } catch (err) { next(err); }
};

const deleteMenuItem = async (req, res, next) => {
  try {
    await menuService.remove(req.params.id);
    await clearMenuCache();
    res.json({ message: 'Menu item deleted' });
  } catch (err) { next(err); }
};

module.exports = { getAllMenuItems, getMenuItemById, createMenuItem, updateMenuItem, deleteMenuItem };
