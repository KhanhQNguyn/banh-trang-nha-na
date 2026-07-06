import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderDetails,
  lookupOrder,
  listAllOrders,
  updateOrderStatus,
  getDashboardStats
} from './order.controller.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { requireRole } from '../../middlewares/requireRole.js';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

const router = express.Router();

// Helper optional token reader for createOrder
const optionalVerifyToken = (req, res, next) => {
  const token = req.cookies?.access_token;
  if (token) {
    try {
      const decoded = jwt.verify(token, env.jwtAccessSecret);
      req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    } catch (e) {
      // Ignore invalid token
    }
  }
  next();
};

// Public endpoints
router.post('/', optionalVerifyToken, createOrder);
router.post('/lookup', lookupOrder);

// Customer endpoints
router.get('/my-orders', verifyToken, getMyOrders);
router.get('/my-orders/:id', verifyToken, getOrderDetails);

// Admin-only endpoints
router.get('/admin/list', verifyToken, requireRole('admin'), listAllOrders);
router.patch('/admin/status/:id', verifyToken, requireRole('admin'), updateOrderStatus);
router.get('/admin/stats', verifyToken, requireRole('admin'), getDashboardStats);

export default router;
