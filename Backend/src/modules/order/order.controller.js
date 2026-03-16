const orderService = require('./order.service');

const createOrder = async (req, res, next) => {
  try { res.status(201).json(await orderService.createOrder(req.user.id, req.body)); }
  catch (err) { next(err); }
};

const getOrders = async (req, res, next) => {
  try { 
    const { limit, offset } = req.query;
    res.json(await orderService.getUserOrders(req.user.id, limit, offset)); 
  }
  catch (err) { next(err); }
};

const getAllOrders = async (req, res, next) => {
  try { 
    const { status, limit, offset } = req.query;
    res.json(await orderService.getAllOrders(status, limit, offset)); 
  }
  catch (err) { next(err); }
};

const getOrderById = async (req, res, next) => {
  try { res.json(await orderService.getOrderById(req.params.id, req.user)); }
  catch (err) { next(err); }
};

const updateOrderStatus = async (req, res, next) => {
  try { res.json(await orderService.updateStatus(req.params.id, req.body.status)); }
  catch (err) { next(err); }
};

module.exports = { createOrder, getOrders, getAllOrders, getOrderById, updateOrderStatus };
