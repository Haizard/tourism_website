import express from 'express';
import { getTourPackages, getTourPackage, createTourPackage, updateTourPackage, deleteTourPackage } from '../controllers/tourController.js';

const router = express.Router();

router.get('/', getTourPackages);
router.get('/:id', getTourPackage);
router.post('/', createTourPackage);
router.put('/:id', updateTourPackage);
router.delete('/:id', deleteTourPackage);

export default router;
