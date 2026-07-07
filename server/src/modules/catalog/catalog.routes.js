import express from 'express';
import { listProducts, getProduct, listCategories } from './catalog.controller.js';

const router = express.Router();

router.get('/products', listProducts);
router.get('/products/:slug', getProduct);
router.get('/categories', listCategories);

export default router;
