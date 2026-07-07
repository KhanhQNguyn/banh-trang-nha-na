import express from 'express';
import { validateVoucher } from './voucher.controller.js';

const router = express.Router();

router.post('/validate', validateVoucher);

export default router;
