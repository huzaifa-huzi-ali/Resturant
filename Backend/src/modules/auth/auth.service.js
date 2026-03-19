const authRepo = require('./auth.repository');
const { toPublicUser } = require('./auth.model');
const { hashPassword, comparePassword } = require('../shared/utils/hashpassword');
const { signToken } = require('../shared/utils/jwt');
const { uuidv7 } = require('uuidv7');

/**
 * Register a new user.
 * @returns {{ user, token }}
 * @throws {Error} with status 409 if email already exists
 */
const register = async ({ name, email, password, phone }) => {
  const existing = await authRepo.findByEmail(email);
  if (existing) {
    const err = new Error('Email already registered');
    err.status = 409;
    throw err;
  }

  const password_hash = await hashPassword(password);
  const user = await authRepo.create({ id: uuidv7(), name, email, password_hash, phone });
  const token = signToken({ id: user.id, role: user.role });

  return { user: toPublicUser(user), token };
};

/**
 * Login with email and password.
 * @returns {{ user, token }}
 * @throws {Error} with status 401 if credentials are invalid
 */
const login = async ({ email, password }) => {
  const user = await authRepo.findByEmail(email);
  if (!user) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  const valid = await comparePassword(password, user.password_hash);
  if (!valid) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  const token = signToken({ id: user.id, role: user.role });
  return { user: toPublicUser(user), token };
};

module.exports = { register, login };
