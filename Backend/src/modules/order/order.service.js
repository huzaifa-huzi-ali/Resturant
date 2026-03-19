const orderRepo = require('./order.repository');
const { toOrder, toOrderList } = require('./order.model');
const { uuidv7 } = require('uuidv7');

const VALID_STATUSES = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

const createOrder = async (userId, { address_id, customer_note }) => {
  const client = await orderRepo.pool.connect();
  try {
    await client.query('BEGIN');

    const cart = await orderRepo.findUserCart(client, userId);
    if (!cart) { const e = new Error('Cart is empty'); e.status = 400; throw e; }

    const items = await orderRepo.findCartItems(client, cart.id);
    if (items.length === 0) { const e = new Error('Cart is empty'); e.status = 400; throw e; }

    const totalPrice = items.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0);

    const orderId = uuidv7();
    const order = await orderRepo.insertOrder(client, {
      id: orderId, userId, addressId: address_id, totalPrice, customerNote: customer_note,
    });

    for (const item of items) {
      await orderRepo.insertOrderItem(client, {
        id: uuidv7(), orderId: orderId, menuItemId: item.menu_item_id,
        quantity: item.quantity, price: item.price,
      });
    }

    await orderRepo.insertStatusHistory(client, uuidv7(), orderId, 'pending');
    await orderRepo.clearCartItems(client, cart.id);
    await client.query('COMMIT');

    const full = await orderRepo.findOrderWithItems(order.id);
    return toOrder(full);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const getUserOrders = async (userId, limit, offset) => {
  const rows = await orderRepo.findUserOrders(userId, limit, offset);
  return toOrderList(rows);
};

const getAllOrders = async (statusFilter, limit, offset) => {
  const rows = await orderRepo.findAllOrders(statusFilter, limit, offset);
  return toOrderList(rows);
};

const getOrderById = async (orderId, user) => {
  const row = await orderRepo.findOrderWithItems(orderId);
  if (!row) { const e = new Error('Order not found'); e.status = 404; throw e; }
  if (user.role !== 'admin' && row.user_id !== user.id) {
    const e = new Error('Access denied');
    e.status = 403;
    throw e;
  }
  return toOrder(row);
};

const updateStatus = async (orderId, status) => {
  if (!VALID_STATUSES.includes(status)) {
    const e = new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
    e.status = 400;
    throw e;
  }
  const row = await orderRepo.updateOrderStatus(orderId, status);
  if (!row) { const e = new Error('Order not found'); e.status = 404; throw e; }

  await orderRepo.insertStatusHistory(orderRepo.pool, uuidv7(), orderId, status);
  return toOrder(row);
};

module.exports = { createOrder, getUserOrders, getAllOrders, getOrderById, updateStatus };
