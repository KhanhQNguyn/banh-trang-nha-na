import express from 'express';
import {
  validateVoucher,
  listVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher
} from './voucher.controller.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { requireRole } from '../../middlewares/requireRole.js';

const router = express.Router();

// Public
router.post('/validate', validateVoucher);

// Admin only
router.get('/', verifyToken, requireRole('admin'), listVouchers);
router.post('/', verifyToken, requireRole('admin'), createVoucher);
router.patch('/:id', verifyToken, requireRole('admin'), updateVoucher);
router.delete('/:id', verifyToken, requireRole('admin'), deleteVoucher);

export default router;
