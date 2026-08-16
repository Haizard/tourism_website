import express from 'express';
import { getTourPackages, getTourPackage, createTourPackage, updateTourPackage, deleteTourPackage } from '../controllers/tourController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getTourPackages);
router.get('/:id', getTourPackage);
router.post('/', auth, createTourPackage);
router.put('/:id', auth, updateTourPackage);
router.delete('/:id', auth, deleteTourPackage);

export default router;
