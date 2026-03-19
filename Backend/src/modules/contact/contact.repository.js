const pool = require('../shared/config/db');

const create = async ({ id, name, email, message }) => {
  const { rows } = await pool.query(
    'INSERT INTO contact_messages (id, name, email, message) VALUES ($1, $2, $3, $4) RETURNING *',
    [id, name, email, message]
  );
  return rows[0];
};

const findAll = async (limit = 20, offset = 0) => {
  const { rows } = await pool.query(
    'SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
  return rows;
};

const remove = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM contact_messages WHERE id = $1', [id]);
  return rowCount > 0;
};

module.exports = { create, findAll, remove };
