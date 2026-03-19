/**
 * Middleware factory: restricts access to users with specified roles.
 * Must be used AFTER authenticate middleware.
 *
 * Usage: authorize('admin')  or  authorize('admin', 'customer')
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

module.exports = { authorize };
