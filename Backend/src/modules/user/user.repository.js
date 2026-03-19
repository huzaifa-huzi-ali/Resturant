const pool = require('../shared/config/db');

const findById = async (id) => {
  const { rows } = await pool.query(
    'SELECT id, name, email, phone, role, created_at, updated_at FROM users WHERE id = $1',
    [id]
  );
  return rows[0] || null;
};

const findAddresses = async (userId) => {
  const { rows } = await pool.query(
    'SELECT * FROM addresses WHERE user_id = $1 ORDER BY created_at',
    [userId]
  );
  return rows;
};

const update = async (id, fields) => {
  const sets = [];
  const params = [];

  if (fields.name) { params.push(fields.name); sets.push(`name = $${params.length}`); }
  if (fields.phone) { params.push(fields.phone); sets.push(`phone = $${params.length}`); }
  if (fields.password_hash) { params.push(fields.password_hash); sets.push(`password_hash = $${params.length}`); }

  if (sets.length === 0) return null;

  params.push(id);
  const query = `UPDATE users SET ${sets.join(', ')} WHERE id = $${params.length} RETURNING id, name, email, phone, role, updated_at`;
  const { rows } = await pool.query(query, params);
  return rows[0] || null;
};

module.exports = { findById, findAddresses, update };
