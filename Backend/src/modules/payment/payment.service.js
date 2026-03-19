const paymentRepo = require('./payment.repository');
const orderRepo = require('../order/order.repository');
const { toPayment } = require('./payment.model');
const { uuidv7 } = require('uuidv7');

const initiatePayment = async (userId, { order_id, payment_method }) => {
  const order = await paymentRepo.findOrderForPayment(order_id, userId);
  if (!order) { const e = new Error('Order not found'); e.status = 404; throw e; }
  if (order.payment_status === 'paid') { const e = new Error('Order is already paid'); e.status = 400; throw e; }

  const intentId = `pi_mock_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const payment = await paymentRepo.insertPayment({
    id: uuidv7(), orderId: order_id, intentId, amount: order.total_price, method: payment_method,
  });

  await paymentRepo.updateOrderPaymentStatus(order_id, 'authorized');

  return { payment: toPayment(payment), client_secret: `${intentId}_secret_mock` };
};

const confirmPayment = async (paymentId) => {
  const payment = await paymentRepo.updatePaymentStatus(paymentId, 'paid', ['authorized']);
  if (!payment) { const e = new Error('Payment not found or not in authorized state'); e.status = 404; throw e; }

  await paymentRepo.updateOrderPaymentStatus(payment.order_id, 'paid', 'confirmed');
  await orderRepo.insertStatusHistory(orderRepo.pool, payment.order_id, 'confirmed');

  return toPayment(payment);
};

const getStatus = async (paymentId, user) => {
  const row = await paymentRepo.findPaymentWithOwner(paymentId);
  if (!row) { const e = new Error('Payment not found'); e.status = 404; throw e; }
  if (user.role !== 'admin' && row.user_id !== user.id) { const e = new Error('Access denied'); e.status = 403; throw e; }
  return toPayment(row);
};

const cancelPayment = async (paymentId) => {
  const payment = await paymentRepo.updatePaymentStatus(paymentId, 'failed', ['pending', 'authorized']);
  if (!payment) { const e = new Error('Payment not found or cannot be cancelled'); e.status = 404; throw e; }
  await paymentRepo.updateOrderPaymentStatus(payment.order_id, 'failed');
  return toPayment(payment);
};

module.exports = { initiatePayment, confirmPayment, getStatus, cancelPayment };
