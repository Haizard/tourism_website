import express from 'express';
import Newsletter from '../models/Newsletter.js';
import { auth } from '../middleware/authMiddleware.js';
import { newsletterLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const subscribers = await Newsletter.find().sort({ createdAt: -1 });
        res.status(200).json(subscribers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', newsletterLimiter, async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });
    try {
        const exists = await Newsletter.findOne({ email });
        if (exists) return res.status(200).json({ message: 'Already subscribed.' });
        const sub = new Newsletter({ email });
        await sub.save();
        res.status(201).json({ message: 'Subscribed successfully.' });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await Newsletter.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Subscriber removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
