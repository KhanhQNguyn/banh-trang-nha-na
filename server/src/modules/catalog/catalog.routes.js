import express from 'express';
import {
  listProducts,
  getProduct,
  listCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory
} from './catalog.controller.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { requireRole } from '../../middlewares/requireRole.js';

const router = express.Router();

// Public routes
router.get('/products', listProducts);
router.get('/products/:slug', getProduct);
router.get('/categories', listCategories);

// Admin-only routes
router.post('/products', verifyToken, requireRole('admin'), createProduct);
router.patch('/products/:id', verifyToken, requireRole('admin'), updateProduct);
router.delete('/products/:id', verifyToken, requireRole('admin'), deleteProduct);

router.post('/categories', verifyToken, requireRole('admin'), createCategory);
router.patch('/categories/:id', verifyToken, requireRole('admin'), updateCategory);
router.delete('/categories/:id', verifyToken, requireRole('admin'), deleteCategory);

export default router;
