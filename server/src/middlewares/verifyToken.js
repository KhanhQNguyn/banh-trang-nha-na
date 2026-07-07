import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { statusCode: 401, message: 'Access token required.' }
    });
  }

  try {
    const decoded = jwt.verify(token, env.jwtAccessSecret);
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch {
    return res.status(401).json({
      success: false,
      error: { statusCode: 401, message: 'Invalid or expired access token.' }
    });
  }
};
