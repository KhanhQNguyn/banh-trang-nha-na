import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export const verifyToken = (req, res, next) => {
  // Read token from cookies (HttpOnly cookie access_token)
  const token = req.cookies?.access_token;

  if (!token) {
    return next(new AppError(401, 'Authentication required. No token provided.'));
  }

  try {
    const decoded = jwt.verify(token, env.jwtAccessSecret);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError(401, 'Token expired.', 'JWT_EXPIRED'));
    }
    return next(new AppError(401, 'Invalid authentication token.'));
  }
};
