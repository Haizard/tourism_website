import express from 'express';
import { getTestimonials, createTestimonial, deleteTestimonial } from '../controllers/testimonialController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getTestimonials);
router.post('/', auth, createTestimonial);
router.delete('/:id', auth, deleteTestimonial);

export default router;
