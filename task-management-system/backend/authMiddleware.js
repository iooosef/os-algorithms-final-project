function authMiddleware(requiredRoles = null) {
  return function (req, res, next) {
    if (req.session && req.session.user) {
      if (
        requiredRoles &&
        !requiredRoles.includes(req.session.user.role)
      ) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
  };
}

module.exports = authMiddleware;
