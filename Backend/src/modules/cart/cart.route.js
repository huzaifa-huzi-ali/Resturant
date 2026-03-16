const express = require('express');
const router = express.Router();
const { authenticate } = require('../shared/middleware/auth.middleware');
const cacheMiddleware = require('../shared/middleware/cache.middleware');
const cacheKeys = require('../shared/utils/cacheKeys');
const { validateAddCartItem, validateUpdateCartItem } = require('./cart.validation');
const { getCart, addCartItem, updateCartItem, deleteCartItem } = require('./cart.controller');

router.get('/', authenticate, cacheMiddleware((req) => cacheKeys.cart(req.user.id), 900), getCart);
router.post('/items', authenticate, validateAddCartItem, addCartItem);
router.put('/items/:id', authenticate, validateUpdateCartItem, updateCartItem);
router.delete('/items/:id', authenticate, deleteCartItem);

module.exports = router;
