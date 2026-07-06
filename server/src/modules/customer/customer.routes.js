import express from 'express';
import { getMe, updateProfile, addAddress } from './customer.controller.js';

const router = express.Router();

router.get('/me', getMe);
router.patch('/me', updateProfile);
router.post('/addresses', addAddress);

export default router;
