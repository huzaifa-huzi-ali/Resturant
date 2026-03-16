const pool = require('../shared/config/db');

const findExisting = async (userId, menuItemId) => {
  const { rows } = await pool.query(
    'SELECT id FROM reviews WHERE user_id = $1 AND menu_item_id = $2',
    [userId, menuItemId]
  );
  return rows[0] || null;
};

const menuItemExists = async (id) => {
  const { rows } = await pool.query('SELECT id FROM menu_items WHERE id = $1', [id]);
  return rows.length > 0;
};

const create = async ({ id, userId, menuItemId, rating, comment }) => {
  const { rows } = await pool.query(
    'INSERT INTO reviews (id, user_id, menu_item_id, rating, comment) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [id, userId, menuItemId, rating, comment || null]
  );
  return rows[0];
};

const findByMenuItemId = async (menuItemId) => {
  const { rows } = await pool.query(
    `SELECT r.*, u.name AS user_name FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.menu_item_id = $1 ORDER BY r.created_at DESC`,
    [menuItemId]
  );
  return rows;
};

const remove = async (id, userId, isAdmin) => {
  let query = 'DELETE FROM reviews WHERE id = $1';
  const params = [id];
  if (!isAdmin) { query += ' AND user_id = $2'; params.push(userId); }
  const { rowCount } = await pool.query(query, params);
  return rowCount > 0;
};

module.exports = { findExisting, menuItemExists, create, findByMenuItemId, remove };
