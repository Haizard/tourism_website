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
import taxonomyRoutes from './routes/taxonomyRoutes.js';
import visionaryRoutes from './routes/visionaryRoutes.js';
import authRoutes from './routes/authRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import destinationRoutes from './routes/destinationRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Cache the MongoDB connection across serverless (Vercel) warm invocations.
// Without this, every cold start re-connects and the first requests race the
// async connect(), producing intermittent 500s (mongoose buffer timeout).
let cached = global.__mongoose;
if (!cached) {
    cached = global.__mongoose = { conn: null, promise: null };
}

// Trust the preview/reverse proxy so express-rate-limit can read X-Forwarded-For correctly
app.set('trust proxy', 1);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors({
    origin: ["http://localhost:5173", "https://makoloafrika.com", "https://tourism-website-inky.vercel.app"],
    credentials: true
}));

// Ensure the database is connected before handling any request. On Vercel this
// must be awaited per-request (cold starts); locally it connects once on boot.
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        res.status(503).json({ message: 'Database temporarily unavailable, please retry.' });
    }
});

// Routes
app.use('/api/tours', tourRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/custom-inquiries', customInquiryRoutes);
app.use('/api/taxonomies', taxonomyRoutes);
app.use('/api/visionaries', visionaryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('Tourism API is running...');
});

// Database connection (cached across serverless warm invocations)
const connectDB = async () => {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        const MONGODB_URI = process.env.MONGODB_URI;

        if (!MONGODB_URI) {
            console.error('❌ MONGODB_URI is not defined in environment variables');
            cached.promise = Promise.reject(new Error('MONGODB_URI is not defined'));
        } else {
            cached.promise = mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        }
    }

    try {
        cached.conn = await cached.promise;
        console.log('✅ Connected to MongoDB');
        return cached.conn;
    } catch (error) {
        // Allow a retry on the next request instead of caching a permanent failure
        cached.promise = null;
        throw error;
    }
};

// Start server only when run directly (local/dev), not on Vercel serverless
if (!process.env.VERCEL) {
    // Start server
    app.listen(PORT, () => {
        console.log(`🚀 Server is listening on port: ${PORT}`);
    });

    // Execute connection on boot for local development
    connectDB().catch((error) => console.error('❌ MongoDB connection error:', error.message));
}

export default app;
