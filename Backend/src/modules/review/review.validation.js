const validateCreateReview = (req, res, next) => {
  const { menu_item_id, rating } = req.body;
  const errors = [];

  if (!menu_item_id) errors.push('menu_item_id is required');
  if (rating === undefined || rating === null || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    errors.push('rating is required (integer 1-5)');
  }

  if (errors.length > 0) return res.status(400).json({ error: errors.join('; ') });
  next();
};

module.exports = { validateCreateReview };
