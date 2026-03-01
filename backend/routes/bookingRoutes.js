import express from 'express';
import Booking from '../models/Booking.js';

const router = express.Router();

// Get all bookings (Admin)
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new booking (Customer)
router.post('/', async (req, res) => {
    const booking = req.body;
    const newBooking = new Booking(booking);
    try {
        await newBooking.save();
        res.status(201).json(newBooking);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

// Delete a booking (Admin)
router.delete('/:id', async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
