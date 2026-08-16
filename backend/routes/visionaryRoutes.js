import express from 'express';
import Visionary from '../models/Visionary.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const visionaries = await Visionary.find();
        res.status(200).json(visionaries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const visionary = await Visionary.findById(req.params.id);
        if (!visionary) return res.status(404).json({ message: 'Visionary not found' });
        res.status(200).json(visionary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', auth, async (req, res) => {
    const visionary = new Visionary(req.body);
    try {
        await visionary.save();
        res.status(201).json(visionary);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const updated = await Visionary.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await Visionary.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Visionary deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
