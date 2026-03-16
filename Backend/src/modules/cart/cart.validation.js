const validateAddCartItem = (req, res, next) => {
  const { menu_item_id, quantity } = req.body;
  const errors = [];

  if (!menu_item_id) errors.push('menu_item_id is required');
  if (!quantity || !Number.isInteger(quantity) || quantity < 1) {
    errors.push('quantity is required and must be a positive integer');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join('; ') });
  }
  next();
};

const validateUpdateCartItem = (req, res, next) => {
  const { quantity } = req.body;
  if (!quantity || !Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ error: 'quantity must be a positive integer' });
  }
  next();
};

module.exports = { validateAddCartItem, validateUpdateCartItem };
