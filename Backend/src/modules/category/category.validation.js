const validateCreateCategory = (req, res, next) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Category name is required (min 2 characters)' });
  }
  req.body.name = name.trim();
  next();
};

const validateUpdateCategory = (req, res, next) => {
  const { name } = req.body;
  if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2)) {
    return res.status(400).json({ error: 'Category name must be at least 2 characters' });
  }
  if (name) req.body.name = name.trim();
  next();
};

module.exports = { validateCreateCategory, validateUpdateCategory };
