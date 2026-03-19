const pool = require('../shared/config/db');

const findUserCart = async (client, userId) => {
  const { rows } = await client.query('SELECT id FROM carts WHERE user_id = $1', [userId]);
  return rows[0] || null;
};

const findCartItems = async (client, cartId) => {
  const { rows } = await client.query(
    `SELECT ci.menu_item_id, ci.quantity, mi.price, mi.name
     FROM cart_items ci
     JOIN menu_items mi ON ci.menu_item_id = mi.id
     WHERE ci.cart_id = $1`,
    [cartId]
  );
  return rows;
};

const insertOrder = async (client, { id, userId, addressId, totalPrice, customerNote }) => {
  const { rows } = await client.query(
    `INSERT INTO orders (id, user_id, address_id, total_price, customer_note)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [id, userId, addressId || null, totalPrice, customerNote || null]
  );
  return rows[0];
};

const insertOrderItem = async (client, { id, orderId, menuItemId, quantity, price }) => {
  await client.query(
    'INSERT INTO order_items (id, order_id, menu_item_id, quantity, price) VALUES ($1, $2, $3, $4, $5)',
    [id, orderId, menuItemId, quantity, price]
  );
};

const insertStatusHistory = async (clientOrPool, id, orderId, status) => {
  await clientOrPool.query(
    'INSERT INTO order_status_history (id, order_id, status) VALUES ($1, $2, $3)',
    [id, orderId, status]
  );
};

const clearCartItems = async (client, cartId) => {
  await client.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
};

const findOrderWithItems = async (orderId) => {
  const { rows } = await pool.query(
    `SELECT o.*,
            json_agg(json_build_object(
              'id', oi.id, 'menu_item_id', oi.menu_item_id, 'name', mi.name,
              'quantity', oi.quantity, 'price', oi.price, 'special_instructions', oi.special_instructions
            )) AS items
     FROM orders o
     LEFT JOIN order_items oi ON o.id = oi.order_id
     LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
     WHERE o.id = $1
     GROUP BY o.id`,
    [orderId]
  );
  return rows[0] || null;
};

const findUserOrders = async (userId, limit = 20, offset = 0) => {
  const { rows } = await pool.query(
    `SELECT o.*,
            json_agg(json_build_object(
              'id', oi.id, 'menu_item_id', oi.menu_item_id, 'name', mi.name,
              'quantity', oi.quantity, 'price', oi.price
            )) AS items
     FROM orders o
     LEFT JOIN order_items oi ON o.id = oi.order_id
     LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
     WHERE o.user_id = $1
     GROUP BY o.id
     ORDER BY o.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return rows;
};

const findAllOrders = async (statusFilter, limit = 20, offset = 0) => {
  let query = `
    SELECT o.*, u.name AS customer_name, u.email AS customer_email,
           json_agg(json_build_object(
             'id', oi.id, 'name', mi.name, 'quantity', oi.quantity, 'price', oi.price
           )) AS items
    FROM orders o
    JOIN users u ON o.user_id = u.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
  `;
  const params = [];
  if (statusFilter) {
    params.push(statusFilter);
    query += ` WHERE o.order_status = $1`;
  }
  
  query += ` GROUP BY o.id, u.name, u.email ORDER BY o.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const { rows } = await pool.query(query, params);
  return rows;
};

const updateOrderStatus = async (orderId, status) => {
  const { rows } = await pool.query(
    'UPDATE orders SET order_status = $1 WHERE id = $2 RETURNING *',
    [status, orderId]
  );
  return rows[0] || null;
};

module.exports = {
  pool, findUserCart, findCartItems, insertOrder, insertOrderItem,
  insertStatusHistory, clearCartItems, findOrderWithItems, findUserOrders,
  findAllOrders, updateOrderStatus,
};
