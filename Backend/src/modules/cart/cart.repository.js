const pool = require('../shared/config/db');

const findCartByUserId = async (userId) => {
  const { rows } = await pool.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
  return rows[0] || null;
};

const createCart = async (id, userId) => {
  const { rows } = await pool.query(
    'INSERT INTO carts (id, user_id) VALUES ($1, $2) RETURNING id',
    [id, userId]
  );
  return rows[0];
};

const findOrCreateCart = async (cartId, userId) => {
  let cart = await findCartByUserId(userId);
  if (!cart) cart = await createCart(cartId, userId);
  return cart;
};

const findCartItems = async (cartId) => {
  const { rows } = await pool.query(
    `SELECT ci.id, ci.quantity, ci.menu_item_id, ci.created_at,
            mi.name, mi.price, mi.image_url, mi.description
     FROM cart_items ci
     JOIN menu_items mi ON ci.menu_item_id = mi.id
     WHERE ci.cart_id = $1
     ORDER BY ci.created_at`,
    [cartId]
  );
  return rows;
};

const findCartItemByMenuId = async (cartId, menuItemId) => {
  const { rows } = await pool.query(
    'SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND menu_item_id = $2',
    [cartId, menuItemId]
  );
  return rows[0] || null;
};

const insertCartItem = async (id, cartId, menuItemId, quantity) => {
  const { rows } = await pool.query(
    'INSERT INTO cart_items (id, cart_id, menu_item_id, quantity) VALUES ($1, $2, $3, $4) RETURNING *',
    [id, cartId, menuItemId, quantity]
  );
  return rows[0];
};

const incrementCartItem = async (itemId, quantity) => {
  const { rows } = await pool.query(
    'UPDATE cart_items SET quantity = quantity + $1 WHERE id = $2 RETURNING *',
    [quantity, itemId]
  );
  return rows[0];
};

const updateCartItemQuantity = async (itemId, userId, quantity) => {
  const { rows } = await pool.query(
    `UPDATE cart_items ci
     SET quantity = $1
     FROM carts c
     WHERE ci.id = $2 AND ci.cart_id = c.id AND c.user_id = $3
     RETURNING ci.*`,
    [quantity, itemId, userId]
  );
  return rows[0] || null;
};

const removeCartItem = async (itemId, userId) => {
  const { rowCount } = await pool.query(
    `DELETE FROM cart_items ci
     USING carts c
     WHERE ci.id = $1 AND ci.cart_id = c.id AND c.user_id = $2`,
    [itemId, userId]
  );
  return rowCount > 0;
};

const isMenuItemAvailable = async (menuItemId) => {
  const { rows } = await pool.query(
    'SELECT id FROM menu_items WHERE id = $1 AND is_available = TRUE',
    [menuItemId]
  );
  return rows.length > 0;
};

module.exports = {
  findOrCreateCart, findCartItems, findCartItemByMenuId,
  insertCartItem, incrementCartItem, updateCartItemQuantity,
  removeCartItem, isMenuItemAvailable,
};
