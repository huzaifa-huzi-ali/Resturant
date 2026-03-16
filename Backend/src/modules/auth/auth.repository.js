const pool = require('../shared/config/db');

/**
 * Find a user by email (includes password_hash for auth checks).
 */
const findByEmail = async (email) => {
  const { rows } = await pool.query(
    'SELECT id, name, email, password_hash, phone, role, created_at, updated_at FROM users WHERE email = $1',
    [email]
  );
  return rows[0] || null;
};

/**
 * Find a user by ID.
 */
const findById = async (id) => {
  const { rows } = await pool.query(
    'SELECT id, name, email, phone, role, created_at, updated_at FROM users WHERE id = $1',
    [id]
  );
  return rows[0] || null;
};

/**
 * Create a new user and return the created row.
 */
const create = async ({ id, name, email, password_hash, phone }) => {
  const { rows } = await pool.query(
    `INSERT INTO users (id, name, email, password_hash, phone, role)
     VALUES ($1, $2, $3, $4, $5, 'customer')
     RETURNING id, name, email, phone, role, created_at`,
    [id, name, email, password_hash, phone || null]
  );
  return rows[0];
};

module.exports = { findByEmail, findById, create };
