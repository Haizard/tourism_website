import express from 'express';
import CustomInquiry from '../models/CustomInquiry.js';
import { auth } from '../middleware/authMiddleware.js';
import { inquiryLimiter } from '../middleware/rateLimiter.js';
import { sendInquiryEmail, sendInquiryReply } from '../services/emailService.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const inquiries = await CustomInquiry.find().sort({ createdAt: -1 });
        res.status(200).json(inquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', inquiryLimiter, async (req, res) => {
    const inquiry = new CustomInquiry(req.body);
    try {
        const saved = await inquiry.save();
        await sendInquiryEmail(saved);
        res.status(201).json(saved);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

router.patch('/:id', auth, async (req, res) => {
    try {
        const inquiry = await CustomInquiry.findById(req.params.id);
        if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
        const oldStatus = inquiry.status;
        inquiry.status = req.body.status || inquiry.status;
        await inquiry.save();
        if (oldStatus !== inquiry.status) await sendInquiryReply(inquiry, inquiry.status);
        res.status(200).json(inquiry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await CustomInquiry.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Inquiry deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
