const validateUpdateProfile = (req, res, next) => {
  const { name, phone, password } = req.body;

  if (name !== undefined && (typeof name !== 'string' || name.trim().length < 2)) {
    return res.status(400).json({ error: 'Name must be at least 2 characters' });
  }
  if (phone !== undefined && (typeof phone !== 'string' || phone.trim().length < 7)) {
    return res.status(400).json({ error: 'Phone must be at least 7 characters' });
  }
  if (password !== undefined && (typeof password !== 'string' || password.length < 8)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  if (name) req.body.name = name.trim();
  if (phone) req.body.phone = phone.trim();
  next();
};

module.exports = { validateUpdateProfile };
