import express from 'express';
import { uploadImage, deleteImage } from './media.controller.js';
import { verifyToken } from '../../middlewares/verifyToken.js';
import { requireRole } from '../../middlewares/requireRole.js';
import { upload } from '../../middlewares/upload.js';

const router = express.Router();

// Both upload and delete require admin access
router.use(verifyToken);
router.use(requireRole('admin'));

router.post('/upload', upload.single('image'), uploadImage);
router.delete('/:publicId', deleteImage);

export default router;
