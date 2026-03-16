const express = require('express');
const router = express.Router();
const { authenticate } = require('../shared/middleware/auth.middleware');
const { authorize } = require('../shared/middleware/role.middleware');
const cacheMiddleware = require('../shared/middleware/cache.middleware');
const cacheKeys = require('../shared/utils/cacheKeys');
const { validateCreateMenuItem, validateUpdateMenuItem } = require('./menu.validation');
const {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('./menu.controller');

router.get('/', cacheMiddleware(() => cacheKeys.menuAll(), 900), getAllMenuItems);
router.get('/:id', cacheMiddleware((req) => cacheKeys.menuItem(req.params.id), 900), getMenuItemById);
router.post('/', authenticate, authorize('admin'), validateCreateMenuItem, createMenuItem);
router.put('/:id', authenticate, authorize('admin'), validateUpdateMenuItem, updateMenuItem);
router.delete('/:id', authenticate, authorize('admin'), deleteMenuItem);

module.exports = router;
