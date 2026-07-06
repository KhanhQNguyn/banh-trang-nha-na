import { AppError } from '../utils/AppError.js';

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError(401, 'Authentication required.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError(403, 'Access denied. Unauthorized role.'));
    }

    next();
  };
};
