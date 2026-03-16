const validateContactMessage = (req, res, next) => {
  const { name, email, message } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) errors.push('Name is required (min 2 chars)');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Valid email is required');
  if (!message || typeof message !== 'string' || message.trim().length < 5) errors.push('Message is required (min 5 chars)');

  if (errors.length > 0) return res.status(400).json({ error: errors.join('; ') });

  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.message = message.trim();
  next();
};

module.exports = { validateContactMessage };
