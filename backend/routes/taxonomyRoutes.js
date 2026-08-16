import express from 'express';
import { getTaxonomies, createTaxonomy, deleteTaxonomy } from '../controllers/taxonomyController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getTaxonomies);
router.post('/', auth, createTaxonomy);
router.delete('/:id', auth, deleteTaxonomy);

export default router;
