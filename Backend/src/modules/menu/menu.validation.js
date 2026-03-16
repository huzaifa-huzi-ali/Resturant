const validateCreateMenuItem = (req, res, next) => {
  const { name, price } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name is required (min 2 characters)');
  }
  if (price === undefined || price === null || isNaN(price) || Number(price) < 0) {
    errors.push('Price is required and must be >= 0');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join('; ') });
  }

  req.body.name = name.trim();
  req.body.price = Number(price);
  next();
};

const validateUpdateMenuItem = (req, res, next) => {
  const { price, name } = req.body;

  if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2)) {
    return res.status(400).json({ error: 'Name must be at least 2 characters' });
  }
  if (price !== undefined && (isNaN(price) || Number(price) < 0)) {
    return res.status(400).json({ error: 'Price must be >= 0' });
  }

  if (name) req.body.name = name.trim();
  if (price !== undefined) req.body.price = Number(price);
  next();
};

module.exports = { validateCreateMenuItem, validateUpdateMenuItem };
