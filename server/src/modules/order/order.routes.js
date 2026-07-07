import express from 'express';
import { createOrder, lookupOrder } from './order.controller.js';

const router = express.Router();

router.post('/', createOrder);
router.post('/lookup', lookupOrder);

export default router;
