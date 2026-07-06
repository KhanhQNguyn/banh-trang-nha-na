import express from 'express';
import { getCart, addItem, updateQuantity, removeItem, clearCart } from './cart.controller.js';
import { verifyToken } from '../../middlewares/verifyToken.js';

const router = express.Router();

router.use(verifyToken); // All cart endpoints require authentication

router.get('/', getCart);
router.post('/items', addItem);
router.patch('/items/:itemId', updateQuantity);
router.delete('/items/:itemId', removeItem);
router.delete('/', clearCart);

export default router;
