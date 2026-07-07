import express from 'express';
import {
  createOrder,
  lookupOrder,
  listAllOrders,
  updateOrderStatus,
  getDashboardStats
} from './order.controller.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { requireRole } from '../../middlewares/requireRole.js';

const router = express.Router();

// Public
router.post('/', createOrder);
router.post('/lookup', lookupOrder);

// Admin only
router.get('/admin/list', verifyToken, requireRole('admin'), listAllOrders);
router.patch('/admin/status/:id', verifyToken, requireRole('admin'), updateOrderStatus);
router.get('/admin/stats', verifyToken, requireRole('admin'), getDashboardStats);

export default router;
