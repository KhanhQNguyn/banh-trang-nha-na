export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: { statusCode: 401, message: 'Authentication required.' }
    });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      error: { statusCode: 403, message: 'Insufficient permissions.' }
    });
  }
  next();
};
