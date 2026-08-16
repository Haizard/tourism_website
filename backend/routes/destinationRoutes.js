import express from 'express';
import { getDestinations, getDestinationBySlug, createDestination, updateDestination, deleteDestination } from '../controllers/destinationController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getDestinations);
router.get('/:slug', getDestinationBySlug);
router.post('/', auth, createDestination);
router.put('/:id', auth, updateDestination);
router.delete('/:id', auth, deleteDestination);

export default router;
