import express from 'express';
import { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog } from '../controllers/blogController.js';
import { generateDailyBlog } from '../controllers/blogAutomationController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/auto-generate', auth, generateDailyBlog);
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.post('/', auth, createBlog);
router.put('/:id', auth, updateBlog);
router.delete('/:id', auth, deleteBlog);

export default router;
