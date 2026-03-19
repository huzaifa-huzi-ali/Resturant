const pool = require('../shared/config/db');

const findOrderForPayment = async (orderId, userId) => {
  const { rows } = await pool.query(
    'SELECT id, total_price, payment_status FROM orders WHERE id = $1 AND user_id = $2',
    [orderId, userId]
  );
  return rows[0] || null;
};

const insertPayment = async ({ id, orderId, intentId, amount, method }) => {
  const { rows } = await pool.query(
    `INSERT INTO payments (id, order_id, stripe_payment_intent_id, amount, currency, payment_method, payment_status)
     VALUES ($1, $2, $3, $4, 'USD', $5, 'authorized') RETURNING *`,
    [id, orderId, intentId, amount, method || 'card']
  );
  return rows[0];
};

const updatePaymentStatus = async (paymentId, status, condition) => {
  const cond = condition ? `AND payment_status IN (${condition.map(s => `'${s}'`).join(',')})` : '';
  const { rows } = await pool.query(
    `UPDATE payments SET payment_status = $1 WHERE id = $2 ${cond} RETURNING *`,
    [status, paymentId]
  );
  return rows[0] || null;
};

const findPaymentWithOwner = async (paymentId) => {
  const { rows } = await pool.query(
    `SELECT p.*, o.user_id FROM payments p JOIN orders o ON p.order_id = o.id WHERE p.id = $1`,
    [paymentId]
  );
  return rows[0] || null;
};

const updateOrderPaymentStatus = async (orderId, paymentStatus, orderStatus) => {
  const sets = ['payment_status = $1'];
  const params = [paymentStatus];
  if (orderStatus) { params.push(orderStatus); sets.push(`order_status = $${params.length}`); }
  params.push(orderId);
  await pool.query(`UPDATE orders SET ${sets.join(', ')} WHERE id = $${params.length}`, params);
};

module.exports = { findOrderForPayment, insertPayment, updatePaymentStatus, findPaymentWithOwner, updateOrderPaymentStatus };
