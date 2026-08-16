import express from 'express';
import Booking from '../models/Booking.js';
import TourPackage from '../models/TourPackage.js';
import { auth } from '../middleware/authMiddleware.js';
import { bookingLimiter } from '../middleware/rateLimiter.js';
import { sendBookingEmail, sendStatusChangeEmail } from '../services/emailService.js';

const router = express.Router();

// Get all bookings (Admin)
router.get('/', auth, async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new booking (Customer)
router.post('/', bookingLimiter, async (req, res) => {
    const bookingData = req.body;
    const { travelDate, adults = 1, children = 0, referralSource = '' } = bookingData;
    if (!travelDate) return res.status(400).json({ message: 'Travel date is required.' });

    try {
        const tour = await TourPackage.findOne({ title: bookingData.packageTour });
        let childDiscount = 0;
        // Server-authoritative pricing: compute total from tour price + child discount
        let totalPrice = Number(bookingData.totalPrice) || 0;
        if (tour) {
            childDiscount = tour.childDiscountPercent || 0;
            const childPrice = tour.price * (1 - childDiscount / 100);
            totalPrice = Math.round((Number(adults) * tour.price + Number(children) * childPrice) * 100) / 100;
        }
        if (tour && tour.isGroupTour) {
            const pax = Number(adults) + Number(children);
            if (tour.currentBookings + pax > tour.maxCapacity) {
                return res.status(400).json({ message: `Sorry, only ${tour.maxCapacity - tour.currentBookings} spots left for this group tour.` });
            }
            tour.currentBookings += pax;
            await tour.save();
        }

        const bookingRef = 'MK-' + Math.random().toString(36).slice(2, 8).toUpperCase();
        const newBooking = new Booking({ ...bookingData, adults, children, referralSource, totalPrice, bookingRef, travelDate, childDiscountPercent: childDiscount });
        await newBooking.save();

        await sendBookingEmail(newBooking);

        res.status(201).json(newBooking);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

// Update booking status (Admin)
router.patch('/:id', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        const oldStatus = booking.status;
        booking.status = status;
        await booking.save();

        // Decrement group capacity when cancelled
        if (status === 'Cancelled' && oldStatus !== 'Cancelled') {
            const tour = await TourPackage.findOne({ title: booking.packageTour });
            if (tour && tour.isGroupTour) {
                tour.currentBookings = Math.max(0, tour.currentBookings - (Number(booking.adults) + Number(booking.children)));
                await tour.save();
            }
        }

        if (oldStatus !== status) await sendStatusChangeEmail(booking, oldStatus);
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a booking (Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (booking) {
            const tour = await TourPackage.findOne({ title: booking.packageTour });
            if (tour && tour.isGroupTour && booking.status !== 'Cancelled') {
                tour.currentBookings = Math.max(0, tour.currentBookings - (Number(booking.adults) + Number(booking.children)));
                await tour.save();
            }
        }
        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
