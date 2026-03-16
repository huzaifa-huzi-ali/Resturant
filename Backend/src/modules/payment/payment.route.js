const express = require('express');
const router = express.Router();
const { authenticate } = require('../shared/middleware/auth.middleware');
const { initiatePayment, confirmPayment, getPaymentStatus, cancelPayment } = require('./payment.controller');

router.post('/initiate', authenticate, initiatePayment);
router.post('/confirm/:id', authenticate, confirmPayment);
router.get('/status/:id', authenticate, getPaymentStatus);
router.post('/cancel/:id', authenticate, cancelPayment);

module.exports = router;
