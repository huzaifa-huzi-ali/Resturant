const express = require('express');
const router = express.Router();
const { authenticate } = require('../shared/middleware/auth.middleware');
const cacheMiddleware = require('../shared/middleware/cache.middleware');
const cacheKeys = require('../shared/utils/cacheKeys');
const { validateUpdateProfile } = require('./user.validation');
const { getProfile, updateProfile } = require('./user.controller');

router.get('/profile', authenticate, cacheMiddleware((req) => cacheKeys.userProfile(req.user.id), 300), getProfile);
router.put('/profile', authenticate, validateUpdateProfile, updateProfile);

module.exports = router;
