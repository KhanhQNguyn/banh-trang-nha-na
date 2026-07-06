import express from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import customerRoutes from '../modules/customer/customer.routes.js';
import productRoutes from '../modules/catalog/catalog.routes.js'; // routes file handles products & categories
import cartRoutes from '../modules/cart/cart.routes.js';
import orderRoutes from '../modules/order/order.routes.js';
import voucherRoutes from '../modules/voucher/voucher.routes.js';
import mediaRoutes from '../modules/media/media.routes.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { requireRole } from '../middlewares/requireRole.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/customers', verifyToken, customerRoutes);
router.use('/', productRoutes); // This handles /products and /categories
router.use('/cart', verifyToken, cartRoutes);
router.use('/orders', orderRoutes);
router.use('/vouchers', voucherRoutes);
router.use('/media', verifyToken, requireRole('admin'), mediaRoutes);

export default router;
