import express from 'express';
import { getTaxonomies, createTaxonomy, deleteTaxonomy } from '../controllers/taxonomyController.js';

const router = express.Router();

router.get('/', getTaxonomies);
router.post('/', createTaxonomy);
router.delete('/:id', deleteTaxonomy);

export default router;
