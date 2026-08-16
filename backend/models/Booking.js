import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    packageTour: { type: String, required: true },
    adults: { type: Number, required: true, default: 1 },
    children: { type: Number, default: 0 },
    travelDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    bookingRef: { type: String, unique: true },
    childDiscountPercent: { type: Number, default: 0 },
    referralSource: { type: String, default: '' },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
