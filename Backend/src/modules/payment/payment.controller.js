const paymentService = require('./payment.service');

const initiatePayment = async (req, res, next) => {
  try { res.status(201).json(await paymentService.initiatePayment(req.user.id, req.body)); }
  catch (err) { next(err); }
};
const confirmPayment = async (req, res, next) => {
  try { res.json(await paymentService.confirmPayment(req.params.id)); }
  catch (err) { next(err); }
};
const getPaymentStatus = async (req, res, next) => {
  try { res.json(await paymentService.getStatus(req.params.id, req.user)); }
  catch (err) { next(err); }
};
const cancelPayment = async (req, res, next) => {
  try { res.json(await paymentService.cancelPayment(req.params.id)); }
  catch (err) { next(err); }
};

module.exports = { initiatePayment, confirmPayment, getPaymentStatus, cancelPayment };
