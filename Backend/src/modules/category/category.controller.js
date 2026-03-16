const categoryService = require('./category.service');
const redisClient = require('../shared/config/redis');

const clearCategoryCache = async () => {
  try {
    const keys = await redisClient.keys('categories:*');
    if (keys.length > 0) await redisClient.del(keys);
  } catch (err) {
    console.error('Redis cache clear error:', err);
  }
};

const getAllCategories = async (req, res, next) => {
  try { res.json(await categoryService.getAll()); }
  catch (err) { next(err); }
};

const createCategory = async (req, res, next) => {
  try { 
    const category = await categoryService.create(req.body); 
    await clearCategoryCache();
    res.status(201).json(category); 
  }
  catch (err) { next(err); }
};

const updateCategory = async (req, res, next) => {
  try { 
    const category = await categoryService.update(req.params.id, req.body); 
    await clearCategoryCache();
    res.json(category); 
  }
  catch (err) { next(err); }
};

const deleteCategory = async (req, res, next) => {
  try { 
    await categoryService.remove(req.params.id); 
    await clearCategoryCache();
    res.json({ message: 'Category deleted' }); 
  }
  catch (err) { next(err); }
};

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory };
