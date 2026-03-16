/**
 * Shared test helper — provides app instance, auth helpers, test data cleanup.
 */
const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/modules/shared/config/db');

/**
 * Register a test user and return { user, token }
 */
const registerUser = async (overrides = {}) => {
  const data = {
    name: overrides.name || `TestUser_${Date.now()}`,
    email: overrides.email || `test_${Date.now()}@example.com`,
    password: overrides.password || 'TestPassword123',
    phone: overrides.phone || '+1-555-000-0000',
    ...overrides,
  };

  const res = await request(app).post('/api/auth/register').send(data);
  return { user: res.body.user, token: res.body.token, raw: res };
};

/**
 * Login and return { user, token }
 */
const loginUser = async (email, password) => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email, password });
  return { user: res.body.user, token: res.body.token, raw: res };
};

/**
 * Clean up test data created during tests.
 * Deletes users (and cascading data) whose email matches the test pattern.
 */
const cleanupTestData = async () => {
  try {
    await pool.query("DELETE FROM users WHERE email LIKE 'test_%@example.com'");
    await pool.query("DELETE FROM contact_messages WHERE email LIKE 'test_%@example.com'");
  } catch (err) {
    console.warn('Cleanup warning:', err.message);
  }
};

/**
 * Close database pool
 */
const closeDb = async () => {
  await pool.end();
};

module.exports = {
  app,
  request,
  pool,
  registerUser,
  loginUser,
  cleanupTestData,
  closeDb,
};
