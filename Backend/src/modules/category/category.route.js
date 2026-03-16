const express = require('express');
const router = express.Router();
const { authenticate } = require('../shared/middleware/auth.middleware');
const { authorize } = require('../shared/middleware/role.middleware');
const cacheMiddleware = require('../shared/middleware/cache.middleware');
const cacheKeys = require('../shared/utils/cacheKeys');
const { validateCreateCategory, validateUpdateCategory } = require('./category.validation');
const { getAllCategories, createCategory, updateCategory, deleteCategory } = require('./category.controller');

router.get('/', cacheMiddleware(() => cacheKeys.categories(), 3600), getAllCategories);
router.post('/', authenticate, authorize('admin'), validateCreateCategory, createCategory);
router.put('/:id', authenticate, authorize('admin'), validateUpdateCategory, updateCategory);
router.delete('/:id', authenticate, authorize('admin'), deleteCategory);

module.exports = router;
