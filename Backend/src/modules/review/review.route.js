const express = require('express');
const router = express.Router();
const { authenticate } = require('../shared/middleware/auth.middleware');
const cacheMiddleware = require('../shared/middleware/cache.middleware');
const cacheKeys = require('../shared/utils/cacheKeys');
const { validateCreateReview } = require('./review.validation');
const { createReview, getReviewsByMenuItem, deleteReview } = require('./review.controller');

router.post('/', authenticate, validateCreateReview, createReview);
router.get('/menu/:menuItemId', cacheMiddleware((req) => cacheKeys.reviewsByItem(req.params.menuItemId), 600), getReviewsByMenuItem);
router.delete('/:id', authenticate, deleteReview);

module.exports = router;
