import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    packageTour: { type: String, required: true },
    pax: { type: Number, required: true, default: 1 },
    totalPrice: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
