import express from 'express';
import productRoutes from '../modules/catalog/catalog.routes.js';
import orderRoutes from '../modules/order/order.routes.js';
import voucherRoutes from '../modules/voucher/voucher.routes.js';

const router = express.Router();

router.use('/', productRoutes); // handles /products and /categories
router.use('/orders', orderRoutes);
router.use('/vouchers', voucherRoutes);

export default router;
