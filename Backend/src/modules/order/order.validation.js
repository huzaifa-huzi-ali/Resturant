const VALID_STATUSES = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

const validateCreateOrder = (req, res, next) => {
  // address_id and customer_note are optional
  next();
};

const validateUpdateStatus = (req, res, next) => {
  const { status } = req.body;
  if (!status || typeof status !== 'string') {
    return res.status(400).json({ error: 'status is required' });
  }
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` });
  }
  next();
};

module.exports = { validateCreateOrder, validateUpdateStatus };
