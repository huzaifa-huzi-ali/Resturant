const pool = require('../shared/config/db');

const findAll = async ({ category_id, search, limit = 20, offset = 0 } = {}) => {
  let query = `
    SELECT mi.*, c.name AS category_name
    FROM menu_items mi
    LEFT JOIN categories c ON mi.category_id = c.id
    WHERE mi.is_available = TRUE
  `;
  const params = [];

  if (category_id) {
    params.push(category_id);
    query += ` AND mi.category_id = $${params.length}`;
  }
  if (search) {
    params.push(`%${search}%`);
    query += ` AND (mi.name ILIKE $${params.length} OR mi.description ILIKE $${params.length})`;
  }

  query += ` ORDER BY c.name, mi.name LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const { rows } = await pool.query(query, params);
  return rows;
};

const findById = async (id) => {
  const { rows } = await pool.query(
    `SELECT mi.*, c.name AS category_name
     FROM menu_items mi
     LEFT JOIN categories c ON mi.category_id = c.id
     WHERE mi.id = $1`,
    [id]
  );
  return rows[0] || null;
};

const create = async ({ id, category_id, name, description, price, image_url, is_available }) => {
  const { rows } = await pool.query(
    `INSERT INTO menu_items (id, category_id, name, description, price, image_url, is_available)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [id, category_id || null, name, description || null, price, image_url || null, is_available !== false]
  );
  return rows[0];
};

const update = async (id, { category_id, name, description, price, image_url, is_available }) => {
  const { rows } = await pool.query(
    `UPDATE menu_items
     SET category_id  = COALESCE($1, category_id),
         name         = COALESCE($2, name),
         description  = COALESCE($3, description),
         price        = COALESCE($4, price),
         image_url    = COALESCE($5, image_url),
         is_available = COALESCE($6, is_available)
     WHERE id = $7
     RETURNING *`,
    [category_id, name, description, price, image_url, is_available, id]
  );
  return rows[0] || null;
};

const remove = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM menu_items WHERE id = $1', [id]);
  return rowCount > 0;
};

module.exports = { findAll, findById, create, update, remove };
