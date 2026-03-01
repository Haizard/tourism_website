import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import tourRoutes from './routes/tourRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import customInquiryRoutes from './routes/customInquiryRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/tours', tourRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/custom-inquiries', customInquiryRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('Tourism API is running...');
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is listening on port: ${PORT}`);
});

// Database connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message);
    });
