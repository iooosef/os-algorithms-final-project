function authMiddleware(requiredRole = null) {
  return function (req, res, next) {
    if (req.session && req.session.user) {
      if (requiredRole && req.session.user.role !== requiredRole) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
  };
}

module.exports = authMiddleware;
