const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { register, login } = require('./auth.controller');
const { validateRegister, validateLogin } = require('./auth.validation');

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts, please try again after a minute' }
});

router.post('/register', validateRegister, register);
router.post('/login', loginLimiter, validateLogin, login);

module.exports = router;
