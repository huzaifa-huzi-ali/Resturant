const express = require('express');
const router = express.Router();
const { authenticate } = require('../shared/middleware/auth.middleware');
const { authorize } = require('../shared/middleware/role.middleware');
const { validateContactMessage } = require('./contact.validation');
const { sendContactMessage, getContactMessages, deleteContactMessage } = require('./contact.controller');

router.post('/', validateContactMessage, sendContactMessage);
router.get('/', authenticate, authorize('admin'), getContactMessages);
router.delete('/:id', authenticate, authorize('admin'), deleteContactMessage);

module.exports = router;
