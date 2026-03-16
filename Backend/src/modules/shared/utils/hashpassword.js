const bcrypt = require('bcryptjs');
const env = require('../config/env');

const hashPassword = async (plainText) => {
  return bcrypt.hash(plainText, env.BCRYPT_SALT_ROUNDS);
};

const comparePassword = async (plainText, hash) => {
  return bcrypt.compare(plainText, hash);
};

module.exports = { hashPassword, comparePassword };
