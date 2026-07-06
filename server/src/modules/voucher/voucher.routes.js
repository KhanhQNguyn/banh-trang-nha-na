import express from 'express';
import { validateVoucher, listVouchers, createVoucher, updateVoucher, deleteVoucher } from './voucher.controller.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { requireRole } from '../../middlewares/requireRole.js';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

const router = express.Router();

// Helper optional token reader for validateVoucher
const optionalVerifyToken = (req, res, next) => {
  const token = req.cookies?.access_token;
  if (token) {
    try {
      const decoded = jwt.verify(token, env.jwtAccessSecret);
      req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    } catch (e) {
      // Ignore invalid token for optional checks
    }
  }
  next();
};

// Customer validates a code before checking out
router.post('/validate', optionalVerifyToken, validateVoucher);

// Admin-only CRUD operations
router.get('/', verifyToken, requireRole('admin'), listVouchers);
router.post('/', verifyToken, requireRole('admin'), createVoucher);
router.patch('/:id', verifyToken, requireRole('admin'), updateVoucher);
router.delete('/:id', verifyToken, requireRole('admin'), deleteVoucher);

export default router;
