const express = require('express');
const router = express.Router();
const { authenticate } = require('../shared/middleware/auth.middleware');
const { authorize } = require('../shared/middleware/role.middleware');
const { validateCreateOrder, validateUpdateStatus } = require('./order.validation');
const { createOrder, getOrders, getAllOrders, getOrderById, updateOrderStatus } = require('./order.controller');

router.post('/', authenticate, validateCreateOrder, createOrder);
router.get('/', authenticate, getOrders);
router.get('/all', authenticate, authorize('admin'), getAllOrders);
router.get('/:id', authenticate, getOrderById);
router.put('/:id/status', authenticate, authorize('admin'), validateUpdateStatus, updateOrderStatus);

module.exports = router;
