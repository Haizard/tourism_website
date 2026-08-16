import express from 'express';
import { getGalleryPosts, createGalleryPost, deleteGalleryPost } from '../controllers/galleryController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getGalleryPosts);
router.post('/', auth, createGalleryPost);
router.delete('/:id', auth, deleteGalleryPost);

export default router;
