import mongoose from 'mongoose';

const customInquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    destinations: { type: String, required: true },
    duration: { type: String, required: true },
    budget: { type: String },
    services: [{ type: String }],
    message: { type: String },
    status: { type: String, enum: ['Pending', 'Contacted', 'Booked', 'Cancelled'], default: 'Pending' }
}, { timestamps: true });

const CustomInquiry = mongoose.model('CustomInquiry', customInquirySchema);
export default CustomInquiry;
