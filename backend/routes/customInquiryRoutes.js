import express from 'express';
import CustomInquiry from '../models/CustomInquiry.js';

const router = express.Router();

// Get all inquiries (Admin)
router.get('/', async (req, res) => {
    try {
        const inquiries = await CustomInquiry.find().sort({ createdAt: -1 });
        res.status(200).json(inquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new inquiry (Customer)
router.post('/', async (req, res) => {
    const inquiryData = req.body;
    const newInquiry = new CustomInquiry(inquiryData);
    try {
        await newInquiry.save();
        res.status(201).json(newInquiry);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

// Update status (Admin)
router.patch('/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const updated = await CustomInquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete (Admin)
router.delete('/:id', async (req, res) => {
    try {
        await CustomInquiry.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Inquiry deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
