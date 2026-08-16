# Makolo Tourism Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden security, upgrade booking flow, add trust/legal pages, SEO foundation, destination pages, and operations features to Makolo Adventure Tours. Payment is excluded.

**Architecture:** Express/Mongoose backend with JWT auth + rate limiting; React/Vite frontend with axios interceptor, protected routes, and a `PageMeta` SEO component. New models: `Destination`, `Testimonial`, `Newsletter`. Booking gains travel date, adults/children pricing, booking reference, and capacity fixes.

**Tech Stack:** React 18, Vite 5, Tailwind 3, Express 5, Mongoose 9, `jsonwebtoken`, `express-rate-limit`, `nodemailer`, axios, react-router-dom 6.

## Global Constraints

- Backend files use ESM `import`/`export` (package.json `"type": "module"`).
- Backend models live in `backend/models/`, routes in `backend/routes/`, controllers in `backend/controllers/`.
- Design tokens: `primary #0d9488`, `secondary #eab308`, `background #0f172a`, `surface #f8fafc`, `accent #f97316`.
- Env vars (`.env`): `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`. Frontend: `VITE_GA_ID`.
- All email is SMTP-gated: if `SMTP_HOST` is unset, log instead of sending. Never fail a request because email failed.
- No payment functionality in this pass.
- Root `package.json` runs both servers: `npm run dev` -> concurrently vite + `node backend/server.js`.

---

### Task 1: Backend JWT Auth (login endpoint + middleware)

**Files:**
- Create: `backend/controllers/authController.js`
- Create: `backend/routes/authRoutes.js`
- Create: `backend/middleware/authMiddleware.js`
- Modify: `backend/server.js:26-34` (mount authRoutes)

**Interfaces:**
- Consumes: `process.env.ADMIN_USERNAME`, `process.env.ADMIN_PASSWORD`, `process.env.JWT_SECRET`
- Produces: `POST /api/auth/login` -> `{ token }`; `authMiddleware` exported as named `auth`.

- [ ] **Step 1: Write auth middleware**

Create `backend/middleware/authMiddleware.js`:

```js
import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
    try {
        const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token invalid' });
    }
};
```

- [ ] **Step 2: Write auth controller**

Create `backend/controllers/authController.js`:

```js
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USERNAME;
    const adminPass = process.env.ADMIN_PASSWORD;

    if (!adminUser || !adminPass) {
        return res.status(500).json({ message: 'Admin credentials not configured on server' });
    }
    if (username === adminUser && password === adminPass) {
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).json({ token });
    }
    return res.status(401).json({ message: 'Invalid credentials' });
};
```

- [ ] **Step 3: Write auth routes**

Create `backend/routes/authRoutes.js`:

```js
import express from 'express';
import { login } from '../controllers/authController.js';
import { limiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/login', limiter.authLimiter, login);

export default router;
```

- [ ] **Step 4: Write rate limiter**

Create `backend/middleware/rateLimiter.js`:

```js
import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({ windowMs: 60 * 1000, max: 5, message: { message: 'Too many login attempts, try again later.' } });
export const bookingLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, message: { message: 'Too many booking attempts, try again later.' } });
export const inquiryLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, message: { message: 'Too many inquiries, try again later.' } });
export const chatLimiter = rateLimit({ windowMs: 60 * 1000, max: 20, message: { message: 'Too many chat messages, slow down.' } });
export const newsletterLimiter = rateLimit({ windowMs: 60 * 1000, max: 5, message: { message: 'Too many newsletter signups, try again later.' } });
```

- [ ] **Step 5: Mount auth routes and install jsonwebtoken + express-rate-limit**

Install deps:

```bash
npm install jsonwebtoken express-rate-limit nodemailer
```

Modify `backend/server.js` — add import after line 6:

```js
import authRoutes from './routes/authRoutes.js';
```

Add mount after the `app.use('/api/visionaries', ...)` line:

```js
app.use('/api/auth', authRoutes);
```

- [ ] **Step 6: Add env vars to `.env`**

Append to `/workspace/.env`:

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
JWT_SECRET=<generate: run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` and paste output>
```

- [ ] **Step 7: Verify login endpoint works**

Run: `node --check backend/middleware/authMiddleware.js && node --check backend/controllers/authController.js && node --check backend/routes/authRoutes.js`
Expected: no output (all valid).

Start backend and curl:
```bash
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"admin123"}'
```
Expected: `{"token":"eyJ..."}`

- [ ] **Step 8: Commit**

```bash
git add backend/controllers/authController.js backend/routes/authRoutes.js backend/middleware/authMiddleware.js backend/middleware/rateLimiter.js backend/server.js package.json package-lock.json backend/package.json backend/package-lock.json
git commit -m "feat: add JWT admin auth and rate limiting"
```

---

### Task 2: Email Service (SMTP-gated)

**Files:**
- Create: `backend/services/emailService.js`

**Interfaces:**
- Consumes: env `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`
- Produces: `sendBookingEmail(booking)`, `sendStatusChangeEmail(booking, oldStatus)`, `sendInquiryEmail(inquiry)`, `sendInquiryReply(inquiry, status)`

- [ ] **Step 1: Write email service**

Create `backend/services/emailService.js`:

```js
import nodemailer from 'nodemailer';

const isConfigured = () => Boolean(process.env.SMTP_HOST);

const getTransporter = () => nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
});

const send = async (to, subject, html) => {
    if (!isConfigured()) {
        console.log(`[email-not-configured] To: ${to} | Subject: ${subject}`);
        return;
    }
    try {
        const transporter = getTransporter();
        await transporter.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to, subject, html });
        console.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
        console.error('Email send failed:', error.message);
    }
};

export const sendBookingEmail = async (booking) => {
    const html = `
    <h2>Booking Request Received — ${booking.bookingRef}</h2>
    <p>Hi ${booking.name},</p>
    <p>Thank you for booking with Makolo Adventure Tours. Here are your details:</p>
    <ul>
      <li>Package: ${booking.packageTour}</li>
      <li>Travel Date: ${new Date(booking.travelDate).toLocaleDateString()}</li>
      <li>Adults: ${booking.adults} | Children: ${booking.children}</li>
      <li>Total: $${booking.totalPrice}</li>
      <li>Reference: <strong>${booking.bookingRef}</strong></li>
    </ul>
    <p>Our team will confirm availability within 24 hours.</p>`;
    await send(booking.email, `Your Booking Request — ${booking.bookingRef}`, html);
};

export const sendStatusChangeEmail = async (booking, oldStatus) => {
    const html = `
    <h2>Booking Update — ${booking.bookingRef}</h2>
    <p>Hi ${booking.name},</p>
    <p>Your booking status changed from <strong>${oldStatus}</strong> to <strong>${booking.status}</strong>.</p>
    <p>If you have questions, reply to this email or reach us on WhatsApp.</p>`;
    await send(booking.email, `Booking Update — ${booking.bookingRef}`, html);
};

export const sendInquiryEmail = async (inquiry) => {
    const html = `
    <h2>New Custom Inquiry</h2>
    <p><strong>${inquiry.name}</strong> (${inquiry.email}, ${inquiry.phone})</p>
    <p>Destinations: ${inquiry.destinations}</p>
    <p>Duration: ${inquiry.duration} | Budget: $${inquiry.budget}</p>
    <p>Message: ${inquiry.message}</p>`;
    await send(process.env.MAIL_FROM, 'New Custom Inquiry Received', html);
};

export const sendInquiryReply = async (inquiry, status) => {
    const html = `
    <h2>Your Custom Inquiry Status</h2>
    <p>Hi ${inquiry.name},</p>
    <p>Your tailor-made inquiry status has been updated to <strong>${status}</strong>.</p>
    <p>Our team will be in touch shortly.</p>`;
    await send(inquiry.email, `Inquiry Update — ${status}`, html);
};
```

- [ ] **Step 2: Verify email service doesn't break without SMTP**

Run: `node --check backend/services/emailService.js`
Expected: no output (valid).

- [ ] **Step 3: Commit**

```bash
git add backend/services/emailService.js
git commit -m "feat: add SMTP-gated email service for bookings and inquiries"
```

---

### Task 3: Protect Admin Routes

**Files:**
- Modify: `backend/routes/tourRoutes.js`
- Modify: `backend/routes/blogRoutes.js`
- Modify: `backend/routes/bookingRoutes.js`
- Modify: `backend/routes/customInquiryRoutes.js`
- Modify: `backend/routes/galleryRoutes.js`
- Modify: `backend/routes/taxonomyRoutes.js`
- Modify: `backend/routes/visionaryRoutes.js`

**Interfaces:**
- Consumes: `auth` middleware from `backend/middleware/authMiddleware.js`; `limiter` exports.
- Produces: protected admin routes returning 401 without a valid token.

- [ ] **Step 1: Protect tour routes**

Modify `backend/routes/tourRoutes.js`:

```js
import express from 'express';
import { getTourPackages, getTourPackage, createTourPackage, updateTourPackage, deleteTourPackage } from '../controllers/tourController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getTourPackages);
router.get('/:id', getTourPackage);
router.post('/', auth, createTourPackage);
router.put('/:id', auth, updateTourPackage);
router.delete('/:id', auth, deleteTourPackage);

export default router;
```

- [ ] **Step 2: Protect blog routes**

Modify `backend/routes/blogRoutes.js` — add import and wrap all except GET:

```js
import express from 'express';
import { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog } from '../controllers/blogController.js';
import { generateDailyBlog } from '../controllers/blogAutomationController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/auto-generate', auth, generateDailyBlog);
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);
router.post('/', auth, createBlog);
router.put('/:id', auth, updateBlog);
router.delete('/:id', auth, deleteBlog);

export default router;
```

- [ ] **Step 3: Protect booking routes (GET/DELETE admin; POST public + rate-limited)**

Modify `backend/routes/bookingRoutes.js` — new full content:

```js
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
```

- [ ] **Step 4: Protect custom inquiry routes**

Modify `backend/routes/customInquiryRoutes.js` — add `auth` to GET/PATCH/DELETE, `inquiryLimiter` to POST, wire inquiry emails (emailService from Task 2):

```js
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
```

- [ ] **Step 5: Protect gallery, taxonomy, visionary routes**

`backend/routes/galleryRoutes.js`:
```js
import express from 'express';
import { getGalleryPosts, createGalleryPost, deleteGalleryPost } from '../controllers/galleryController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getGalleryPosts);
router.post('/', auth, createGalleryPost);
router.delete('/:id', auth, deleteGalleryPost);

export default router;
```

`backend/routes/taxonomyRoutes.js`:
```js
import express from 'express';
import { getTaxonomies, createTaxonomy, deleteTaxonomy } from '../controllers/taxonomyController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getTaxonomies);
router.post('/', auth, createTaxonomy);
router.delete('/:id', auth, deleteTaxonomy);

export default router;
```

`backend/routes/visionaryRoutes.js`:
```js
import express from 'express';
import Visionary from '../models/Visionary.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const visionaries = await Visionary.find();
        res.status(200).json(visionaries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const visionary = await Visionary.findById(req.params.id);
        if (!visionary) return res.status(404).json({ message: 'Visionary not found' });
        res.status(200).json(visionary);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', auth, async (req, res) => {
    const visionary = new Visionary(req.body);
    try {
        await visionary.save();
        res.status(201).json(visionary);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const updated = await Visionary.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await Visionary.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Visionary deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
```

- [ ] **Step 6: Verify protected routes**

Start backend, then:
```bash
curl -X POST http://localhost:5000/api/tours -H "Content-Type: application/json" -d '{"title":"x"}'
curl http://localhost:5000/api/bookings
```
Expected: both return `401 {"message":"Not authorized, no token"}`.

- [ ] **Step 7: Commit**

```bash
git add backend/routes/
git commit -m "feat: protect admin routes with JWT auth"
```

---

### Task 4: Booking & Tour Model Upgrades

**Files:**
- Modify: `backend/models/Booking.js`
- Modify: `backend/models/TourPackage.js`
- Modify: `backend/seed_taxonomies.js` (no change needed — leave as-is)

**Interfaces:**
- Consumes: nothing new
- Produces: `Booking` fields `travelDate`, `adults`, `children`, `bookingRef`, `childDiscountPercent`, `referralSource`; `TourPackage` field `childDiscountPercent`.

- [ ] **Step 1: Update Booking model**

Replace `backend/models/Booking.js` content:

```js
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
```

- [ ] **Step 2: Update TourPackage model**

In `backend/models/TourPackage.js`, add `childDiscountPercent` field after `category`:

```js
  category: { type: String }, // e.g., Luxury, Budget
  childDiscountPercent: { type: Number, default: 50 },
```

- [ ] **Step 3: Verify syntax**

Run: `node --check backend/models/Booking.js && node --check backend/models/TourPackage.js`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add backend/models/Booking.js backend/models/TourPackage.js
git commit -m "feat: add travel date, adult/child pricing, booking ref to booking model"
```

---

### Task 5: Frontend Auth (Login API, interceptor, protected route)

**Files:**
- Modify: `src/services/api.js`
- Modify: `src/pages/AdminLogin.jsx`
- Create: `src/components/Admin/ProtectedRoute.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `POST /api/auth/login` -> `{ token }`
- Produces: `loginAdmin(credentials)` in api.js; `<ProtectedRoute>` wrapper.

- [ ] **Step 1: Add auth functions + interceptor to api.js**

Modify `src/services/api.js` — add after imports:

```js
// Auth
export const loginAdmin = (credentials) => API.post("/auth/login", credentials);

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

- [ ] **Step 2: Rewrite AdminLogin.jsx to use API**

Replace the `handleLogin` function and imports in `src/pages/AdminLogin.jsx`:

```js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/api";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await loginAdmin(credentials);
      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin");
    } catch (err) {
      setError(
        err.response?.status === 401
          ? "Invalid credentials. Access denied."
          : "Server error. Please try again."
      );
      setLoading(false);
    }
  };
```

- [ ] **Step 3: Create ProtectedRoute**

Create `src/components/Admin/ProtectedRoute.jsx`:

```jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
```

- [ ] **Step 4: Wrap admin route in App.jsx**

Modify `src/App.jsx` — import ProtectedRoute:

```jsx
import ProtectedRoute from "./components/Admin/ProtectedRoute";
```

Wrap the admin route:
```jsx
<Route path="admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: build succeeds, no errors.

- [ ] **Step 6: Commit**

```bash
git add src/services/api.js src/pages/AdminLogin.jsx src/components/Admin/ProtectedRoute.jsx src/App.jsx
git commit -m "feat: frontend admin auth with API login and protected route"
```

---

### Task 6: OrderPopup Booking Upgrade (date, adults/children, referral)

**Files:**
- Modify: `src/components/OrderPopup/OrderPopup.jsx`

**Interfaces:**
- Consumes: `props.packagePrice`, `props.packageTour`
- Produces: POST body `{ name, email, phone, address, packageTour, adults, children, travelDate, referralSource, totalPrice }`

- [ ] **Step 1: Rewrite OrderPopup form state and price calc**

Replace the whole file body of `src/components/OrderPopup/OrderPopup.jsx` (keep component name and success UI):

```jsx
import React, { useState, useEffect } from "react";
import { IoCloseOutline, IoPeopleOutline, IoWalletOutline } from "react-icons/io5";
import { createBooking } from "../../services/api";

const OrderPopup = ({ isVisible, setOrderPopupVisible, packageTour, packagePrice, childDiscountPercent = 0 }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    packageTour: packageTour || "Custom Inquiry",
    adults: 1,
    children: 0,
    travelDate: "",
    referralSource: "",
    totalPrice: packagePrice || 0,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  const pricePerAdult = packagePrice || 0;

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      packageTour: packageTour || prev.packageTour,
    }));
  }, [packageTour, packagePrice]);

  const calcTotal = (adults, children) => {
    const childPrice = pricePerAdult * (1 - (childDiscountPercent || 0) / 100);
    return Math.round((adults * pricePerAdult + children * childPrice) * 100) / 100;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      packageTour: formData.packageTour,
      adults: Number(formData.adults),
      children: Number(formData.children),
      travelDate: formData.travelDate,
      referralSource: formData.referralSource,
      totalPrice: calcTotal(Number(formData.adults), Number(formData.children)),
    };
    try {
      const res = await createBooking(payload);
      setBookingRef(res.data.bookingRef || "");
      setSuccess(true);
      setTimeout(() => {
        setOrderPopupVisible(false);
        setSuccess(false);
        setBookingRef("");
        setFormData({
          ...formData,
          name: "",
          email: "",
          phone: "",
          address: "",
          adults: 1,
          children: 0,
          travelDate: "",
          referralSource: "",
          totalPrice: packagePrice || 0,
        });
      }, 2500);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit booking. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-[480px] bg-white rounded-3xl p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="absolute top-4 right-4 text-2xl cursor-pointer hover:text-primary transition" onClick={() => setOrderPopupVisible(false)}>
          <IoCloseOutline />
        </div>

        {success ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
            <h2 className="text-2xl font-black text-gray-900 uppercase mb-2">Booking Requested!</h2>
            <p className="text-gray-500">Your booking reference:</p>
            <p className="text-3xl font-black text-primary my-3">{bookingRef}</p>
            <p className="text-gray-400 text-sm">We'll confirm availability within 24 hours.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Book Your Spot</h1>
              <p className="text-gray-500 text-sm">
                Package: <span className="text-primary font-bold">{packageTour || "General Inquiry"}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full bg-gray-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium" required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full bg-gray-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full bg-gray-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium" required />
                <input type="text" name="address" placeholder="Country" value={formData.address} onChange={handleChange} className="w-full bg-gray-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-medium" required />
              </div>

              <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 space-y-4">
                <div>
                  <label className="text-xs font-black uppercase text-gray-400 mb-1 block">Travel Date</label>
                  <input type="date" name="travelDate" value={formData.travelDate} onChange={handleChange} className="w-full bg-white border p-3 rounded-xl font-bold text-gray-700 outline-none focus:ring-2 focus:ring-primary/20" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-black text-gray-400 uppercase mb-1"><IoPeopleOutline className="text-lg" /> Adults</label>
                    <input type="number" name="adults" min="1" max="50" value={formData.adults} onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) || 1 })} className="w-full bg-white border p-3 rounded-xl text-center font-bold text-primary outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-black text-gray-400 uppercase mb-1"><IoPeopleOutline className="text-lg" /> Children</label>
                    <input type="number" name="children" min="0" max="20" value={formData.children} onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) || 0 })} className="w-full bg-white border p-3 rounded-xl text-center font-bold text-primary outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-gray-400 mb-1 block">How did you hear about us?</label>
                  <select name="referralSource" value={formData.referralSource} onChange={handleChange} className="w-full bg-white border p-3 rounded-xl font-bold text-gray-700 outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Select...</option>
                    <option value="Google">Google</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Friend/Family">Friend / Family</option>
                    <option value="Repeat Client">Repeat Client</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="border-t pt-4 flex items-center justify-between">
                  <p className="flex items-center gap-2 text-sm font-black text-gray-400 uppercase"><IoWalletOutline className="text-lg" /> Total Price</p>
                  <p className="text-2xl font-black text-primary">${calcTotal(Number(formData.adults), Number(formData.children)).toLocaleString()}</p>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-xl hover:translate-y-[-2px] transition-all disabled:bg-gray-400 mt-4 uppercase tracking-widest">
                {loading ? "Submitting..." : "Confirm Request"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderPopup;
```

Note: `createBooking` already posts the full formData via api.js; `OrderPopup` computes the correct `totalPrice` payload itself.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/OrderPopup/OrderPopup.jsx
git commit -m "feat: booking popup with travel date, adult/child pricing, referral source"
```

---

### Task 7: Trust & Legal Pages

**Files:**
- Create: `src/pages/Privacy.jsx`
- Create: `src/pages/Terms.jsx`
- Create: `src/pages/CancellationPolicy.jsx`
- Create: `src/pages/FAQ.jsx`
- Modify: `src/App.jsx`
- Modify: `src/components/Footer/Footer.jsx`
- Modify: `src/components/Blogs/PackageDetail.jsx` (trust strip)

**Interfaces:**
- Consumes: existing Layout/footer patterns
- Produces: routes `/privacy`, `/terms`, `/cancellation-policy`, `/faq`

- [ ] **Step 1: Create a shared LegalLayout-style page content**

Create `src/pages/Privacy.jsx`:

```jsx
import React from "react";

const Privacy = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50">
      <div className="container max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-900 mb-8">Privacy Policy</h1>
        <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6 text-gray-600 leading-relaxed">
          <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
          <h2 className="text-xl font-black text-gray-900 uppercase">1. Information We Collect</h2>
          <p>We collect the information you provide when booking a tour or sending an inquiry: your name, email address, phone number, country, and travel preferences (dates, party size, budget).</p>
          <h2 className="text-xl font-black text-gray-900 uppercase">2. How We Use Your Information</h2>
          <p>We use your details to process bookings, respond to inquiries, confirm availability, and send trip-related communications. We do not sell your personal information to third parties.</p>
          <h2 className="text-xl font-black text-gray-900 uppercase">3. Data Security</h2>
          <p>We take reasonable measures to protect your data. Sensitive payment details, when supported in the future, will be handled by certified payment processors.</p>
          <h2 className="text-xl font-black text-gray-900 uppercase">4. Contact</h2>
          <p>Questions about this policy? Email us at <span className="text-primary font-bold">makoloafrikaadventures@mail.com</span>.</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
```

- [ ] **Step 2: Create Terms.jsx**

Create `src/pages/Terms.jsx`:

```jsx
import React from "react";

const Terms = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50">
      <div className="container max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-900 mb-8">Terms & Conditions</h1>
        <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6 text-gray-600 leading-relaxed">
          <h2 className="text-xl font-black text-gray-900 uppercase">1. Booking Confirmation</h2>
          <p>All bookings are subject to availability. A booking is confirmed once we respond to your request. In the future, a deposit may be required to secure your reservation.</p>
          <h2 className="text-xl font-black text-gray-900 uppercase">2. Pricing</h2>
          <p>Prices are quoted per adult unless stated otherwise. Child pricing applies as indicated on each package. Prices may change based on seasonality and availability.</p>
          <h2 className="text-xl font-black text-gray-900 uppercase">3. Traveler Responsibility</h2>
          <p>Travelers are responsible for valid passports, visas, and any required vaccinations. Please verify entry requirements before booking.</p>
          <h2 className="text-xl font-black text-gray-900 uppercase">4. Liability</h2>
          <p>Makolo Adventure Tours acts as an organizer of travel services. We are not liable for events beyond our reasonable control including weather, flight delays, or force majeure.</p>
          <h2 className="text-xl font-black text-gray-900 uppercase">5. Contact</h2>
          <p>Questions? Email us at <span className="text-primary font-bold">makoloafrikaadventures@mail.com</span>.</p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
```

- [ ] **Step 3: Create CancellationPolicy.jsx**

Create `src/pages/CancellationPolicy.jsx`:

```jsx
import React from "react";

const CancellationPolicy = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50">
      <div className="container max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-900 mb-8">Cancellation & Refund Policy</h1>
        <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6 text-gray-600 leading-relaxed">
          <h2 className="text-xl font-black text-gray-900 uppercase">1. Cancellations</h2>
          <p>Please notify us as soon as possible if you need to cancel. Email us at <span className="text-primary font-bold">makoloafrikaadventures@mail.com</span> with your booking reference.</p>
          <h2 className="text-xl font-black text-gray-900 uppercase">2. Refunds</h2>
          <p>Refund eligibility depends on the suppliers involved (lodges, guides, transport). Any amounts already paid to third-party suppliers may not be refundable.</p>
          <h2 className="text-xl font-black text-gray-900 uppercase">3. Operator Cancellation</h2>
          <p>If we must cancel a trip due to insufficient numbers or safety concerns, you will be offered an alternative date or a full refund.</p>
          <h2 className="text-xl font-black text-gray-900 uppercase">4. Force Majeure</h2>
          <p>We are not liable for cancellations caused by natural disasters, government restrictions, or other events beyond our control.</p>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicy;
```

- [ ] **Step 4: Create FAQ.jsx**

Create `src/pages/FAQ.jsx`:

```jsx
import React, { useState } from "react";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";

const faqs = [
  { q: "When is the best time to visit Tanzania for a safari?", a: "The dry season (June to October) offers the best wildlife viewing, including the Great Migration in the Serengeti. The green season (November to May) is ideal for birding, lush landscapes, and calving season in the Ndutu plains." },
  { q: "What is included in the tour price?", a: "Each package lists inclusions and exclusions explicitly. Most safaris include park fees, 4x4 transport, professional guide, and accommodation. Flights, visas, and personal expenses are typically excluded." },
  { q: "How do I book a tour?", a: "Click 'Book This Tour' on any package, fill in your travel date and party size, and submit. We respond within 24 hours to confirm availability." },
  { q: "Do you offer custom or tailor-made tours?", a: "Yes! Visit our Tailor-Made page to design your own itinerary with flights, hotels, guides, and transport." },
  { q: "Is Tanzania safe for tourists?", a: "Tanzania is a welcoming, politically stable country. We use licensed guides, insured vehicles, and vetted lodges to ensure your safety throughout." },
  { q: "What should I pack?", a: "Neutral-colored clothing, comfortable walking shoes, sunscreen, insect repellent, a light jacket for mornings, binoculars, and your camera with extra batteries." },
  { q: "Do I need a visa or vaccinations?", a: "Most visitors need a visa for Tanzania. Yellow fever vaccination is recommended, and antimalarial medication is advised. Check with your doctor before travel." },
];

const FAQ = () => {
  const [open, setOpen] = useState(0);
  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50">
      <div className="container max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-500 font-medium mb-10">Everything you need to know before your adventure.</p>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="bg-white rounded-3xl shadow-lg overflow-hidden">
              <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex justify-between items-center p-6 text-left">
                <h3 className="font-black text-gray-900 uppercase tracking-tight">{f.q}</h3>
                <div className="text-primary text-xl shrink-0 ml-4">{open === i ? <IoChevronUpOutline /> : <IoChevronDownOutline />}</div>
              </button>
              {open === i && <p className="px-6 pb-6 text-gray-600 leading-relaxed font-medium">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
```

- [ ] **Step 5: Register routes in App.jsx**

Add imports and routes:

```jsx
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import CancellationPolicy from "./pages/CancellationPolicy";
import FAQ from "./pages/FAQ";
```

Routes (inside Layout):
```jsx
<Route path="privacy" element={<Privacy />} />
<Route path="terms" element={<Terms />} />
<Route path="cancellation-policy" element={<CancellationPolicy />} />
<Route path="faq" element={<FAQ />} />
```

- [ ] **Step 6: Update Footer with legal links, badges, address**

Read current `src/components/Footer/Footer.jsx` fully, then add:
- A new column with links: Privacy Policy, Terms & Conditions, Cancellation Policy, FAQ (via `Link` from react-router-dom).
- License badges row: "Licensed Tour Operator — TALA Member", "Tanzania Association of Tour Operators (TATO)".
- Office address line: "P.O. Box 1234, Arusha, Tanzania" and hours "Mon–Sat, 8am–6pm EAT".

Example snippet to add inside the footer container:
```jsx
import { Link } from "react-router-dom";
// ...
<div className="space-y-2">
  <h4 className="text-white font-black uppercase text-sm mb-4">Legal</h4>
  <Link to="/privacy" className="block text-gray-400 hover:text-primary text-sm font-bold transition-colors">Privacy Policy</Link>
  <Link to="/terms" className="block text-gray-400 hover:text-primary text-sm font-bold transition-colors">Terms & Conditions</Link>
  <Link to="/cancellation-policy" className="block text-gray-400 hover:text-primary text-sm font-bold transition-colors">Cancellation Policy</Link>
  <Link to="/faq" className="block text-gray-400 hover:text-primary text-sm font-bold transition-colors">FAQ</Link>
</div>
```

Add a trust/badges strip near the footer bottom:
```jsx
<div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
    <span className="px-3 py-1.5 rounded-full border border-white/10">Licensed Tour Operator</span>
    <span className="px-3 py-1.5 rounded-full border border-white/10">TALA Member</span>
    <span className="px-3 py-1.5 rounded-full border border-white/10">TATO Partner</span>
  </div>
  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Arusha, Tanzania · Mon–Sat 8am–6pm EAT</p>
</div>
```

- [ ] **Step 7: Add trust strip + pass child discount to OrderPopup in PackageDetail**

In `src/components/Blogs/PackageDetail.jsx`, destructure `childDiscountPercent` from `location.state` (add to the existing destructure near line 28):

```jsx
    maxGroupSize,
    childDiscountPercent,
  } = location.state || {};
```

In the right sidebar `<div className="space-y-8">`, after the booking box add:

```jsx
<div className="bg-white border p-6 rounded-[32px]">
  <h4 className="font-black uppercase tracking-tight text-gray-900 mb-4">Why Book With Us</h4>
  <ul className="space-y-3 text-sm text-gray-600 font-medium">
    <li className="flex items-start gap-2"><span className="text-primary">✓</span> Licensed Tanzania tour operator</li>
    <li className="flex items-start gap-2"><span className="text-primary">✓</span> 24/7 on-trip support & insurance-backed</li>
    <li className="flex items-start gap-2"><span className="text-primary">✓</span> Free expert consultation on your itinerary</li>
  </ul>
</div>
```

Update the `OrderPopup` usage at the bottom of the file to pass the discount:

```jsx
<OrderPopup
  isVisible={isOrderPopupVisible}
  setOrderPopupVisible={setOrderPopupVisible}
  packageTour={title}
  packagePrice={price}
  childDiscountPercent={childDiscountPercent}
/>
```

Note: server re-computes `totalPrice` authoritatively from the tour's `price` and `childDiscountPercent`; this prop only makes the client preview accurate.

- [ ] **Step 8: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 9: Commit**

```bash
git add src/pages/Privacy.jsx src/pages/Terms.jsx src/pages/CancellationPolicy.jsx src/pages/FAQ.jsx src/App.jsx src/components/Footer/Footer.jsx src/components/Blogs/PackageDetail.jsx
git commit -m "feat: add trust and legal pages with footer badges"
```

---

### Task 8: DB-Backed Testimonials

**Files:**
- Create: `backend/models/Testimonial.js`
- Create: `backend/controllers/testimonialController.js`
- Create: `backend/routes/testimonialRoutes.js`
- Modify: `backend/server.js`
- Modify: `src/services/api.js`
- Modify: `src/components/Testimonial/Testimonial.jsx`

**Interfaces:**
- Consumes: auth middleware
- Produces: `GET /api/testimonials` (public), `POST/DELETE /api/testimonials` (admin)

- [ ] **Step 1: Create Testimonial model**

Create `backend/models/Testimonial.js`:

```js
import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    text: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    image: { type: String },
    verified: { type: Boolean, default: false },
}, { timestamps: true });

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
```

- [ ] **Step 2: Create controller**

Create `backend/controllers/testimonialController.js`:

```js
import Testimonial from '../models/Testimonial.js';

export const getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 });
        res.status(200).json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createTestimonial = async (req, res) => {
    try {
        const newTestimonial = new Testimonial(req.body);
        await newTestimonial.save();
        res.status(201).json(newTestimonial);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const deleteTestimonial = async (req, res) => {
    try {
        await Testimonial.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Testimonial deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
```

- [ ] **Step 3: Create routes**

Create `backend/routes/testimonialRoutes.js`:

```js
import express from 'express';
import { getTestimonials, createTestimonial, deleteTestimonial } from '../controllers/testimonialController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getTestimonials);
router.post('/', auth, createTestimonial);
router.delete('/:id', auth, deleteTestimonial);

export default router;
```

- [ ] **Step 4: Mount in server.js**

Add import and mount:
```js
import testimonialRoutes from './routes/testimonialRoutes.js';
// ...
app.use('/api/testimonials', testimonialRoutes);
```

- [ ] **Step 5: Add API functions**

In `src/services/api.js` add:

```js
// Testimonials
export const fetchTestimonials = () => API.get("/testimonials");
export const createTestimonial = (data) => API.post("/testimonials", data);
export const deleteTestimonial = (id) => API.delete(`/testimonials/${id}`);
```

- [ ] **Step 6: Rewrite Testimonial.jsx to fetch from API**

Replace `testimonialData` constant and render logic: fetch testimonials on mount, render star rating, fallback to 3 seed reviews if API fails.

```jsx
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { fetchTestimonials } from "../../services/api";

const fallback = [
  { _id: "1", name: "Christopher Reid", role: "Adventure Traveler", rating: 5, text: "My safari experience with Makolo was truly unforgettable. From the stunning landscapes to the incredible wildlife, everything was perfectly organized and exceeded my expectations." },
  { _id: "2", name: "Maria William", role: "Nature Enthusiast", rating: 5, text: "An absolutely amazing adventure! The guides were knowledgeable, the accommodations were top-notch, and the wildlife encounters were spectacular." },
  { _id: "3", name: "Winston Clarke", role: "Repeat Client", rating: 5, text: "The attention to detail and personalized service made our trip unforgettable." },
];

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetchTestimonials()
      .then((res) => setTestimonials(res.data.length ? res.data : fallback))
      .catch(() => setTestimonials(fallback));
  }, []);

  const settings = {
    dots: true, arrows: false, infinite: true, speed: 600,
    slidesToShow: 2, slidesToScroll: 1, autoplay: true, autoplaySpeed: 3000, pauseOnHover: true,
    responsive: [{ breakpoint: 640, settings: { slidesToShow: 1 } }],
  };

  return (
    <div className="py-24 bg-slate-200">
      <div className="container">
        <div className="text-center mb-16">
          <p className="text-primary font-bold uppercase tracking-widest text-sm mb-3">Guest Reviews</p>
          <h2 className="text-4xl md:text-5xl font-black font-heading text-slate-900">What Our Adventurers Say</h2>
        </div>
        <div className="max-w-5xl mx-auto">
          <Slider {...settings}>
            {testimonials.map(({ _id, name, role, text, rating, image }) => (
              <div key={_id} className="px-4 py-3">
                <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-100 h-full relative">
                  <span className="absolute top-6 right-8 text-7xl text-primary/10 font-serif leading-none select-none">"</span>
                  <div className="flex gap-1 text-secondary mb-4">
                    {Array.from({ length: rating || 5 }).map((_, i) => <span key={i}>★</span>)}
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed font-medium mb-8 relative z-10">{text}</p>
                  <div className="flex items-center gap-4">
                    {image ? (
                      <img src={image} alt={name} loading="lazy" className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/30" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-black ring-2 ring-primary/30">{name?.[0]}</div>
                    )}
                    <div>
                      <p className="font-black text-slate-900 text-sm">{name}</p>
                      <p className="text-primary font-bold text-xs uppercase tracking-wider">{role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
```

- [ ] **Step 7: Verify build and endpoint**

Run: `npm run build` — succeeds.
Start backend: `curl http://localhost:5000/api/testimonials` -> `[]` (or seed data).

- [ ] **Step 8: Commit**

```bash
git add backend/models/Testimonial.js backend/controllers/testimonialController.js backend/routes/testimonialRoutes.js backend/server.js src/services/api.js src/components/Testimonial/Testimonial.jsx
git commit -m "feat: DB-backed testimonials with admin management"
```

---

### Task 9: SEO Foundation (meta tags, sitemap, robots, PageMeta, lazy loading)

**Files:**
- Modify: `index.html`
- Create: `public/sitemap.xml`
- Create: `public/robots.txt`
- Create: `src/components/UI/PageMeta.jsx`
- Modify: `src/components/UI/PageMeta.jsx` usage in `src/pages/Layout.jsx`
- Modify: `src/components/Blogs/PackageCard.jsx`
- Modify: `src/components/Blogs/BlogCard.jsx`
- Modify: `src/components/Places/PlaceCard.jsx`
- Modify: `src/pages/Home.jsx` (hero video dedupe)

**Interfaces:**
- Consumes: react-router `useLocation`
- Produces: `<PageMeta title description />` component setting `document.title` + meta description.

- [ ] **Step 1: Update index.html head**

Replace the `<head>` block in `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/logo.jpg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Makolo Adventure Tours — premium Tanzanian safaris, Kilimanjaro trekking, Zanzibar beaches, and tailor-made adventure experiences. Licensed tour operator." />
    <meta name="keywords" content="Tanzania safari, Kilimanjaro trekking, Zanzibar, Ngorongoro, Serengeti, tour operator, Makolo Adventure Tours" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://makoloafrika.com/" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Makolo Adventure Tours — Tanzania Safaris & Adventures" />
    <meta property="og:description" content="Premium Tanzanian safaris, Kilimanjaro trekking, and Zanzibar beaches. Licensed tour operator." />
    <meta property="og:image" content="/logo.jpg" />
    <meta property="og:url" content="https://makoloafrika.com/" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Makolo Adventure Tours" />
    <meta name="twitter:description" content="Premium Tanzanian safaris, Kilimanjaro trekking, and Zanzibar beaches." />
    <meta name="twitter:image" content="/logo.jpg" />
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Makolo Adventure Tours",
      "url": "https://makoloafrika.com",
      "email": "makoloafrikaadventures@mail.com",
      "telephone": "+255710887798",
      "address": { "@type": "PostalAddress", "addressLocality": "Arusha", "addressCountry": "TZ" }
    }
    </script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.0/dist/tailwind.min.css" rel="stylesheet" />
    <title>Makolo Adventure Tours — Tanzania Safaris & Adventures</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Create sitemap.xml**

Create `public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://makoloafrika.com/</loc></url>
  <url><loc>https://makoloafrika.com/about</loc></url>
  <url><loc>https://makoloafrika.com/packages</loc></url>
  <url><loc>https://makoloafrika.com/blogs</loc></url>
  <url><loc>https://makoloafrika.com/best-places</loc></url>
  <url><loc>https://makoloafrika.com/tailor-made</loc></url>
  <url><loc>https://makoloafrika.com/faq</loc></url>
  <url><loc>https://makoloafrika.com/privacy</loc></url>
  <url><loc>https://makoloafrika.com/terms</loc></url>
  <url><loc>https://makoloafrika.com/cancellation-policy</loc></url>
</urlset>
```

- [ ] **Step 3: Create robots.txt**

Create `public/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /login

Sitemap: https://makoloafrika.com/sitemap.xml
```

- [ ] **Step 4: Create PageMeta component**

Create `src/components/UI/PageMeta.jsx`:

```jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const defaultMeta = {
  title: "Makolo Adventure Tours — Tanzania Safaris & Adventures",
  description: "Premium Tanzanian safaris, Kilimanjaro trekking, and Zanzibar beaches. Licensed tour operator.",
};

const routeMeta = {
  "/": { title: "Makolo Adventure Tours — Tanzania Safaris & Adventures", description: defaultMeta.description },
  "/about": { title: "About Us | Makolo Adventure Tours", description: "Meet Makolo Adventure Tours, a licensed Tanzanian safari and trekking operator." },
  "/packages": { title: "Tour Packages | Makolo Adventure Tours", description: "Browse curated Tanzanian safari, trekking, and beach packages." },
  "/blogs": { title: "Travel Blog | Makolo Adventure Tours", description: "Expert travel guides, safari tips, and Tanzania destination insights." },
  "/best-places": { title: "Best Places | Makolo Adventure Tours", description: "Discover Tanzania's top destinations: Serengeti, Ngorongoro, Kilimanjaro, Zanzibar." },
  "/tailor-made": { title: "Tailor-Made Tours | Makolo Adventure Tours", description: "Design your own custom Tanzanian adventure." },
  "/faq": { title: "FAQ | Makolo Adventure Tours", description: "Answers to common questions about Tanzanian safaris." },
  "/privacy": { title: "Privacy Policy | Makolo Adventure Tours", description: "How we handle your personal data." },
  "/terms": { title: "Terms & Conditions | Makolo Adventure Tours", description: "Booking terms for Makolo Adventure Tours." },
  "/cancellation-policy": { title: "Cancellation Policy | Makolo Adventure Tours", description: "Cancellation and refund policy." },
};

const PageMeta = ({ title, description }) => {
  const location = useLocation();
  const meta = title && description
    ? { title, description }
    : routeMeta[location.pathname] || defaultMeta;

  useEffect(() => {
    document.title = meta.title;
    let el = document.querySelector('meta[name="description"]');
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("name", "description");
      document.head.appendChild(el);
    }
    el.setAttribute("content", meta.description);
  }, [meta.title, meta.description]);

  return null;
};

export default PageMeta;
```

- [ ] **Step 5: Use PageMeta in Layout**

In `src/pages/Layout.jsx`, import and render at top:

```jsx
import PageMeta from "../components/UI/PageMeta";
// inside the fragment, before <Navbar/>:
<PageMeta />
```

- [ ] **Step 6: Lazy-load images in cards**

Add `loading="lazy"` and `decoding="async"` to `<img>` tags in:
- `src/components/Blogs/PackageCard.jsx` (line 33)
- `src/components/Blogs/BlogCard.jsx` (line 16)
- `src/components/Places/PlaceCard.jsx` (line 9)

Example:
```jsx
<img src={image} alt={title} loading="lazy" decoding="async" className="..." />
```

- [ ] **Step 7: Fix double hero video in Home.jsx**

In `src/pages/Home.jsx`, remove the `<video>` wrapper div (lines 21-29) — Hero.jsx already renders its own background video. Keep just `<Hero />`:

```jsx
<div className="h-screen relative overflow-hidden">
  <Hero />
</div>
```

- [ ] **Step 8: Verify build**

Run: `npm run build`
Expected: succeeds. Check `dist/sitemap.xml` and `dist/robots.txt` exist.

- [ ] **Step 9: Commit**

```bash
git add index.html public/sitemap.xml public/robots.txt src/components/UI/PageMeta.jsx src/pages/Layout.jsx src/components/Blogs/PackageCard.jsx src/components/Blogs/BlogCard.jsx src/components/Places/PlaceCard.jsx src/pages/Home.jsx
git commit -m "feat: SEO foundation — meta tags, sitemap, robots, page titles, lazy loading"
```

---

### Task 10: Destination Model, Routes, Pages

**Files:**
- Create: `backend/models/Destination.js`
- Create: `backend/controllers/destinationController.js`
- Create: `backend/routes/destinationRoutes.js`
- Modify: `backend/server.js`
- Modify: `src/services/api.js`
- Create: `src/pages/Destinations.jsx`
- Create: `src/pages/DestinationDetail.jsx`
- Modify: `src/App.jsx`
- Modify: `src/components/Navbar/Navbar.jsx`

**Interfaces:**
- Consumes: auth middleware
- Produces: `GET /api/destinations`, `GET /api/destinations/:slug`, POST/PUT/DELETE admin.

- [ ] **Step 1: Create Destination model**

Create `backend/models/Destination.js`:

```js
import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    heroImage: { type: String, required: true },
    shortIntro: { type: String, required: true },
    description: { type: String, required: true },
    bestTimeToVisit: { type: String, required: true },
    wildlifeCalendar: [{ month: { type: String }, event: { type: String } }],
    highlights: [{ type: String }],
    gallery: [{ type: String }],
    location: { type: String },
}, { timestamps: true });

const Destination = mongoose.model('Destination', destinationSchema);
export default Destination;
```

- [ ] **Step 2: Create controller**

Create `backend/controllers/destinationController.js`:

```js
import Destination from '../models/Destination.js';

export const getDestinations = async (req, res) => {
    try {
        const destinations = await Destination.find().sort({ createdAt: -1 });
        res.status(200).json(destinations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDestinationBySlug = async (req, res) => {
    try {
        const destination = await Destination.findOne({ slug: req.params.slug });
        if (!destination) return res.status(404).json({ message: 'Destination not found' });
        res.status(200).json(destination);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createDestination = async (req, res) => {
    try {
        const newDestination = new Destination(req.body);
        await newDestination.save();
        res.status(201).json(newDestination);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const updateDestination = async (req, res) => {
    try {
        const updated = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Destination not found' });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteDestination = async (req, res) => {
    try {
        await Destination.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Destination deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
```

- [ ] **Step 3: Create routes**

Create `backend/routes/destinationRoutes.js`:

```js
import express from 'express';
import { getDestinations, getDestinationBySlug, createDestination, updateDestination, deleteDestination } from '../controllers/destinationController.js';
import { auth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getDestinations);
router.get('/:slug', getDestinationBySlug);
router.post('/', auth, createDestination);
router.put('/:id', auth, updateDestination);
router.delete('/:id', auth, deleteDestination);

export default router;
```

- [ ] **Step 4: Mount in server.js**

```js
import destinationRoutes from './routes/destinationRoutes.js';
// ...
app.use('/api/destinations', destinationRoutes);
```

- [ ] **Step 5: Add API functions**

In `src/services/api.js`:

```js
// Destinations
export const fetchDestinations = () => API.get("/destinations");
export const fetchDestination = (slug) => API.get(`/destinations/${slug}`);
export const createDestination = (data) => API.post("/destinations", data);
export const updateDestination = (id, data) => API.put(`/destinations/${id}`, data);
export const deleteDestination = (id) => API.delete(`/destinations/${id}`);
```

- [ ] **Step 6: Create Destinations listing page**

Create `src/pages/Destinations.jsx`:

```jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Badge from "../components/UI/Badge";
import { fetchDestinations } from "../services/api";

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDestinations()
      .then((res) => setDestinations(res.data))
      .catch(() => setDestinations([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="container relative z-20 text-center text-white">
          <Badge variant="secondary" className="mb-4">Iconic Tanzania</Badge>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter font-heading">Our <span className="text-primary italic">Destinations</span></h1>
        </div>
      </div>
      <div className="container py-16 px-4">
        {loading ? (
          <p className="text-center text-gray-400 font-bold">Loading destinations...</p>
        ) : destinations.length === 0 ? (
          <p className="text-center text-gray-400 font-bold">No destinations yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((d) => (
              <Link key={d._id} to={`/destinations/${d.slug}`} className="group block">
                <div className="relative h-80 overflow-hidden rounded-[40px] shadow-xl">
                  <img src={d.heroImage} alt={d.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 group-hover:text-primary transition-colors">{d.name}</h3>
                    <p className="text-gray-300 text-sm font-medium line-clamp-2">{d.shortIntro}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations;
```

- [ ] **Step 7: Create DestinationDetail page**

Create `src/pages/DestinationDetail.jsx`:

```jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Badge from "../components/UI/Badge";
import { fetchDestination, fetchTours } from "../services/api";

const DestinationDetail = () => {
  const { slug } = useParams();
  const [dest, setDest] = useState(null);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchDestination(slug), fetchTours()])
      .then(([dRes, tRes]) => {
        setDest(dRes.data);
        const related = tRes.data.filter((t) => t.location.toLowerCase().includes(dRes.data.name.toLowerCase()));
        setTours(related);
      })
      .catch(() => setDest(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-screen pt-32 text-center text-gray-400 font-bold">Loading destination...</div>;
  if (!dest) return <div className="min-h-screen pt-32 text-center text-gray-500 font-bold">Destination not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-[55vh] flex items-end overflow-hidden">
        <img src={dest.heroImage} alt={dest.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="container relative z-10 pb-12">
          <Badge variant="secondary" className="mb-4">{dest.location || "Tanzania"}</Badge>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter font-heading">{dest.name}</h1>
        </div>
      </div>

      <div className="container py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-4 underline decoration-primary decoration-4 underline-offset-8">Overview</h2>
            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">{dest.description}</p>
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-4 underline decoration-primary decoration-4 underline-offset-8">Highlights</h2>
            <ul className="space-y-3">
              {dest.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700 font-medium"><span className="text-primary font-black">✦</span> {h}</li>
              ))}
            </ul>
          </div>
          {dest.gallery?.length > 0 && (
            <div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-6 underline decoration-primary decoration-4 underline-offset-8">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {dest.gallery.map((img, i) => (
                  <img key={i} src={img} alt={`${dest.name} gallery ${i + 1}`} loading="lazy" decoding="async" className="w-full h-48 object-cover rounded-3xl" />
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-8">
          <div className="bg-gray-900 text-white p-8 rounded-[32px]">
            <h3 className="font-black uppercase tracking-tight text-secondary mb-2">Best Time to Visit</h3>
            <p className="text-gray-300 font-medium leading-relaxed">{dest.bestTimeToVisit}</p>
          </div>
          {dest.wildlifeCalendar?.length > 0 && (
            <div className="bg-white border p-8 rounded-[32px]">
              <h3 className="font-black uppercase tracking-tight text-gray-900 mb-6">Wildlife Calendar</h3>
              <div className="space-y-4">
                {dest.wildlifeCalendar.map((c, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-black uppercase shrink-0">{c.month}</span>
                    <p className="text-sm text-gray-600 font-medium">{c.event}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tours.length > 0 && (
            <div className="bg-white border p-8 rounded-[32px]">
              <h3 className="font-black uppercase tracking-tight text-gray-900 mb-6">Tours Here</h3>
              <div className="space-y-4">
                {tours.map((t) => (
                  <Link key={t._id} to={`/packages/${t.title}`} state={t} className="block group">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl hover:bg-primary/5 transition">
                      <img src={t.image} alt={t.title} loading="lazy" className="w-14 h-14 rounded-xl object-cover" />
                      <div>
                        <p className="text-xs font-black uppercase text-gray-900 group-hover:text-primary">{t.title}</p>
                        <p className="text-[10px] font-bold text-gray-400">From ${t.price}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default DestinationDetail;
```

- [ ] **Step 8: Register routes + navbar**

In `src/App.jsx` add imports and routes:

```jsx
import Destinations from "./pages/Destinations";
import DestinationDetail from "./pages/DestinationDetail";
// routes
<Route path="destinations" element={<Destinations />} />
<Route path="destinations/:slug" element={<DestinationDetail />} />
```

In `src/components/Navbar/Navbar.jsx` NavbarLinks, add after "Best Places":

```js
{ name: "Destinations", link: "/destinations" },
```

- [ ] **Step 9: Verify build**

Run: `npm run build` — succeeds.

- [ ] **Step 10: Commit**

```bash
git add backend/models/Destination.js backend/controllers/destinationController.js backend/routes/destinationRoutes.js backend/server.js src/services/api.js src/pages/Destinations.jsx src/pages/DestinationDetail.jsx src/App.jsx src/components/Navbar/Navbar.jsx
git commit -m "feat: destination pages with wildlife calendar and tour cross-links"
```

---

### Task 11: Newsletter + GA4 + Referral fields already done

**Files:**
- Create: `backend/models/Newsletter.js`
- Create: `backend/routes/newsletterRoutes.js`
- Modify: `backend/server.js`
- Modify: `src/services/api.js`
- Modify: `src/components/Footer/Footer.jsx`
- Create: `src/components/Analytics.jsx`
- Modify: `src/main.jsx`

**Interfaces:**
- Consumes: newsletterLimiter, auth middleware
- Produces: `POST /api/newsletter` (public), `GET/DELETE /api/newsletter` (admin); `<Analytics />` component.

- [ ] **Step 1: Create Newsletter model**

Create `backend/models/Newsletter.js`:

```js
import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
}, { timestamps: true });

const Newsletter = mongoose.model('Newsletter', newsletterSchema);
export default Newsletter;
```

- [ ] **Step 2: Create newsletter routes**

Create `backend/routes/newsletterRoutes.js`:

```js
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
```

- [ ] **Step 3: Mount in server.js**

```js
import newsletterRoutes from './routes/newsletterRoutes.js';
// ...
app.use('/api/newsletter', newsletterRoutes);
```

- [ ] **Step 4: Add API function**

In `src/services/api.js`:

```js
// Newsletter
export const subscribeNewsletter = (email) => API.post("/newsletter", { email });
export const fetchNewsletter = () => API.get("/newsletter");
export const deleteNewsletter = (id) => API.delete(`/newsletter/${id}`);
```

- [ ] **Step 5: Footer newsletter form**

In `src/components/Footer/Footer.jsx`, add a newsletter form. Create a small stateful sub-component inside the same file:

```jsx
import React, { useState } from "react";
import { subscribeNewsletter } from "../../services/api";

const NewsletterForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await subscribeNewsletter(email);
      setMessage(res.data.message || "Subscribed!");
      setEmail("");
    } catch (err) {
      setError("Could not subscribe. Please try again.");
    }
  };

  return (
    <div>
      <h4 className="text-white font-black uppercase text-sm mb-4">Stay Inspired</h4>
      <p className="text-gray-400 text-sm font-medium mb-4">Get safari tips & exclusive offers in your inbox.</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white outline-none focus:border-primary transition placeholder:text-gray-500"
        />
        <button type="submit" className="bg-primary text-white font-black px-4 py-3 rounded-xl text-sm uppercase tracking-wider hover:bg-primary/80 transition">
          Join
        </button>
      </form>
      {message && <p className="text-green-400 text-xs font-bold mt-2">{message}</p>}
      {error && <p className="text-accent text-xs font-bold mt-2">{error}</p>}
    </div>
  );
};
```

Render `<NewsletterForm />` inside the footer's grid.

- [ ] **Step 6: Create Analytics component**

Create `src/components/Analytics.jsx`:

```jsx
import { useEffect } from "react";

const Analytics = () => {
  useEffect(() => {
    const gaId = import.meta.env.VITE_GA_ID;
    if (!gaId) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", gaId);
  }, []);
  return null;
};

export default Analytics;
```

- [ ] **Step 7: Mount Analytics in main.jsx**

In `src/main.jsx`:

```jsx
import Analytics from "./components/Analytics";
// inside <App /> render wrapper:
<React.StrictMode>
  <Analytics />
  <App />
</React.StrictMode>
```

- [ ] **Step 8: Verify build**

Run: `npm run build` — succeeds.

- [ ] **Step 9: Commit**

```bash
git add backend/models/Newsletter.js backend/routes/newsletterRoutes.js backend/server.js src/services/api.js src/components/Footer/Footer.jsx src/components/Analytics.jsx src/main.jsx
git commit -m "feat: newsletter signup, GA4 analytics placeholder, referral tracking"
```

---

### Task 12: Admin Dashboard Additions (destinations, testimonials, newsletter, booking status)

**Files:**
- Modify: `src/pages/AdminDashboard.jsx` (large file — add sections)
- Modify: `src/components/Admin/AdminSidebar.jsx`

**Interfaces:**
- Consumes: fetch/update/delete functions from api.js
- Produces: admin UI sections for Destinations, Testimonials, Newsletter, Booking status PATCH.

- [ ] **Step 1: Read AdminDashboard structure**

Read `src/pages/AdminDashboard.jsx` and `src/components/Admin/AdminSidebar.jsx` in full to match existing section pattern (tabs, data fetch, list, modal forms).

- [ ] **Step 2: Add booking status change UI**

In the existing Bookings section, add a `<select>` for status (`Pending`, `Confirmed`, `Completed`, `Cancelled`) per booking that calls `API.patch('/bookings/'+id, {status})`. Use existing `updateBooking` pattern or add:

```js
export const updateBookingStatus = (id, status) => API.patch(`/bookings/${id}`, { status });
```

in `src/services/api.js`.

- [ ] **Step 3: Add Destinations admin section**

Following the existing Tours pattern: list destinations, form modal with fields (name, slug, heroImage, shortIntro, description, bestTimeToVisit, location, highlights, gallery comma-separated, wildlifeCalendar as `Month:Event` per line), create/update/delete wired to destination API functions.

- [ ] **Step 4: Add Testimonials admin section**

List testimonials, form with (name, role, text, rating, image, verified checkbox), create/delete wired to testimonial API.

- [ ] **Step 5: Add Newsletter admin section**

Table of subscriber emails with delete button, wired to newsletter API.

- [ ] **Step 6: Verify build**

Run: `npm run build` — succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/pages/AdminDashboard.jsx src/components/Admin/AdminSidebar.jsx src/services/api.js
git commit -m "feat: admin dashboard — destinations, testimonials, newsletter, booking status"
```

---

### Task 13: Seed Script + Dependency Alignment + Gitignore

**Files:**
- Create: `backend/seed.js`
- Modify: `package.json` (add `seed` script)
- Modify: `.gitignore` (add `dist/`)

**Interfaces:**
- Consumes: MONGODB_URI env, all models
- Produces: seeded data when run via `npm run seed`.

- [ ] **Step 1: Add dist to .gitignore**

Append `dist/` to `/workspace/.gitignore`.

- [ ] **Step 2: Write seed script**

Create `backend/seed.js`:

```js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import TourPackage from './models/TourPackage.js';
import Destination from './models/Destination.js';
import Blog from './models/Blog.js';
import Visionary from './models/Visionary.js';
import Taxonomy from './models/Taxonomy.js';
import Testimonial from './models/Testimonial.js';
import Gallery from './models/Gallery.js';

dotenv.config();

const tours = [
  { title: "Serengeti Big Five Safari", description: "Four days of game drives across the Serengeti in search of the Big Five, staying in luxury mobile camps.", price: 1850, image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=1200&auto=format&fit=crop", location: "Serengeti", tourType: "Safari", category: "Luxury", duration: "4 Days", maxGroupSize: 6, childDiscountPercent: 50, itinerary: [{ day: 1, events: ["Arrive Arusha, transfer to Serengeti", "Afternoon game drive"] }, { day: 2, events: ["Full-day game drive — big cats", "Sundowner at camp"] }, { day: 3, events: ["Early morning balloon safari (optional)", "Game drive to Ngorongoro rim"] }, { day: 4, events: ["Ngorongoro crater descent", "Return to Arusha"] }], inclusions: ["Park fees", "4x4 Land Cruiser", "Professional guide", "Luxury tented camp", "All meals"], exclusions: ["Flights", "Visa", "Travel insurance", "Tips"], featured: true },
  { title: "Kilimanjaro Machame Trek", description: "Conquer Africa's highest peak on the scenic 7-day Machame route with expert mountain guides.", price: 2400, image: "https://images.unsplash.com/photo-1516357231954-91487b459002?q=80&w=1200&auto=format&fit=crop", location: "Kilimanjaro", tourType: "Trekking", category: "Adventure", duration: "7 Days", maxGroupSize: 12, childDiscountPercent: 0, itinerary: [{ day: 1, events: ["Machame Gate to Machame Camp"] }, { day: 2, events: ["Machame Camp to Shira Camp"] }, { day: 3, events: ["Shira to Barranco via Lava Tower"] }, { day: 4, events: ["Barranco to Barafu Camp"] }, { day: 5, events: ["Summit night: Uhuru Peak", "Descend to Mweka Camp"] }, { day: 6, events: ["Descend to Mweka Gate"] }], inclusions: ["Mountain guide", "Porter support", "Park fees", "Sleeping tents & mattresses", "All meals on the mountain"], exclusions: ["International flights", "Gear rental", "Summit bonus for guides", "Travel insurance"] },
  { title: "Zanzibar Beach Escape", description: "Five days of pristine beaches, spice tours, and Stone Town history on the Spice Islands.", price: 950, image: "https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?q=80&w=1200&auto=format&fit=crop", location: "Zanzibar", tourType: "Beach", category: "Relaxation", duration: "5 Days", maxGroupSize: 8, childDiscountPercent: 50, itinerary: [{ day: 1, events: ["Fly to Zanzibar, transfer to Nungwi"] }, { day: 2, events: ["Beach day at Nungwi"] }, { day: 3, events: ["Spice tour + Stone Town walking tour"] }, { day: 4, events: ["Snorkeling at Mnemba Atoll"] }, { day: 5, events: ["Departure"] }], inclusions: ["Lodge accommodation", "Boat transfer", "Spice tour guide", "Breakfast daily"], exclusions: ["Flights to Zanzibar", "Lunches & dinners", "Visas"] },
  { title: "Ngorongoro Crater Day Trip", description: "Descend into the world's largest intact volcanic caldera for a day of phenomenal wildlife density.", price: 450, image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1200&auto=format&fit=crop", location: "Ngorongoro", tourType: "Day Trip", category: "Budget", duration: "1 Day", maxGroupSize: 6, childDiscountPercent: 50, itinerary: [{ day: 1, events: ["Pickup Arusha", "Crater descent game drive", "Picnic lunch at Hippo Pool", "Return to Arusha"] }], inclusions: ["Crater fees", "4x4 with pop-up roof", "Lunch box", "Professional guide"], exclusions: ["Tips", "Extras"] },
  { title: "Tarangire Elephants & Baobabs", description: "A full-day exploration of Tarangire's massive elephant herds and ancient baobab forests.", price: 390, image: "https://images.unsplash.com/photo-1567958451986-2de427a4a0be?q=80&w=1200&auto=format&fit=crop", location: "Tarangire", tourType: "Safari", category: "Budget", duration: "1 Day", maxGroupSize: 6, childDiscountPercent: 50, itinerary: [{ day: 1, events: ["Pickup Arusha", "Tarangire game drive", "Lunch at Tarangire", "Return to Arusha"] }], inclusions: ["Park fees", "Transport", "Guide", "Lunch"], exclusions: ["Tips"] },
  { title: "Cultural Village Experience", description: "Meet the Maasai and Hadzabe communities and experience authentic Tanzanian culture.", price: 320, image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=1200&auto=format&fit=crop", location: "Arusha", tourType: "Cultural", category: "Budget", duration: "1 Day", maxGroupSize: 10, childDiscountPercent: 50, itinerary: [{ day: 1, events: ["Visit Maasai boma", "Cultural performances", "Hadzabe hunting demonstration", "Return Arusha"] }], inclusions: ["Transport", "Village fees", "Local guide"], exclusions: ["Tips", "Lunch"] },
];

const destinations = [
  { name: "Serengeti National Park", slug: "serengeti", heroImage: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=1920&auto=format&fit=crop", shortIntro: "The endless plains — home of the Great Migration.", description: "Serengeti National Park is Tanzania's most famous wildlife reserve, hosting the annual Great Migration of over 1.5 million wildebeest. The vast open savannah offers the best big-cat viewing in Africa, especially in the central Seronera region which is excellent year-round.", bestTimeToVisit: "June to October for the Great Migration river crossings; January to March for calving season in the southern plains.", wildlifeCalendar: [{ month: "Jan-Mar", event: "Calving season in Ndutu & southern Serengeti" }, { month: "Jun-Jul", event: "River crossings at Grumeti" }, { month: "Aug-Oct", event: "Grumeti & Mara river crossings" }, { month: "Nov-Dec", event: "Migration returns south" }], highlights: ["Great Migration", "Big Five sightings", "Hot air balloon safaris", "Night game drives in select areas"], gallery: [], location: "Serengeti" },
  { name: "Ngorongoro Crater", slug: "ngorongoro", heroImage: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1920&auto=format&fit=crop", shortIntro: "A natural wonder — the world's largest intact caldera.", description: "The Ngorongoro Crater is a UNESCO World Heritage Site and the world's largest intact volcanic caldera. Its unique geography creates an enclosed ecosystem with the highest density of wildlife in Africa, making the Big Five visible in a single day.", bestTimeToVisit: "Year-round. June to September for dry-season concentration of animals.", wildlifeCalendar: [{ month: "Year-round", event: "Big Five sightings daily" }, { month: "Jan-Feb", event: "Flamingo concentrations in Lake Magadi" }], highlights: ["Big Five in one day", "Maasai culture on the rim", "Lake Magadi flamingos"], gallery: [], location: "Ngorongoro" },
  { name: "Mount Kilimanjaro", slug: "kilimanjaro", heroImage: "https://images.unsplash.com/photo-1516357231954-91487b459002?q=80&w=1920&auto=format&fit=crop", shortIntro: "Africa's highest peak at 5,895m — the rooftop of the continent.", description: "Mount Kilimanjaro is the highest free-standing mountain in the world. Trekking its slopes crosses five distinct climate zones, from rainforest to alpine desert to arctic ice cap, ending at the legendary Uhuru Peak.", bestTimeToVisit: "January to March and June to October offer the clearest summit conditions.", wildlifeCalendar: [], highlights: ["Uhuru Peak summit (5,895m)", "Five climate zones", "Expert mountain guides"], gallery: [], location: "Kilimanjaro" },
  { name: "Zanzibar Archipelago", slug: "zanzibar", heroImage: "https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?q=80&w=1920&auto=format&fit=crop", shortIntro: "The Spice Islands — powder-white beaches and rich Swahili heritage.", description: "Zanzibar blends pristine Indian Ocean beaches with the UNESCO-listed Stone Town. Spice tours, turquoise waters, and the perfect post-safari relaxation escape.", bestTimeToVisit: "June to October and December to February for the best weather.", wildlifeCalendar: [{ month: "Jun-Sep", event: "Best diving & snorkeling visibility" }], highlights: ["Stone Town heritage", "Spice farm tours", "Mnemba Atoll snorkeling", "Dhow sunset cruises"], gallery: [], location: "Zanzibar" },
  { name: "Tarangire National Park", slug: "tarangire", heroImage: "https://images.unsplash.com/photo-1567958451986-2de427a4a0be?q=80&w=1920&auto=format&fit=crop", shortIntro: "Elephants, baobabs, and breathtaking dry-season concentration.", description: "Tarangire is famous for its massive elephant herds and iconic baobab trees. In the dry season, the Tarangire River attracts wildlife from across the park, making it a photographer's paradise.", bestTimeToVisit: "June to October, when wildlife concentrates along the river.", wildlifeCalendar: [{ month: "Jun-Oct", event: "Highest wildlife concentration" }], highlights: ["Large elephant herds", "Ancient baobab trees", "Birdwatching (500+ species)"], gallery: [], location: "Tarangire" },
];

const blogs = [
  { title: "The Ultimate Serengeti Safari Guide", content: "# The Ultimate Serengeti Safari Guide\n\nDiscover when to go, where to stay, and how to see the Great Migration. The Serengeti rewards the prepared traveler.\n\n#### 🦁 Wildlife Encounters\nThe central Seronera region is a big-cat hotspot year-round. Book a full day, not a half day, for the best sighting odds.\n\n#### 📍 Pro Tip\nCarry a pair of 8x42 binoculars and a 70-200mm lens. [Book our Serengeti Safari](/packages/Serengeti-Big-Five-Safari) today!", image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=1200&auto=format&fit=crop", author: "Makolo AI Expert", category: "Safari News" },
  { title: "Climbing Kilimanjaro: What You Need to Know", content: "# Climbing Kilimanjaro\n\nPole, pole! (Slowly, slowly). Acclimatization beats fitness on Kilimanjaro.\n\n#### 🏔️ Route Choice\nThe Machame route offers the best scenery-acclimatization balance. Budget at least 7 days.\n\n#### 💡 Expert Tip\nTrain with long, weighted hikes on stairs. The summit night is a mental battle as much as a physical one. Ready? [Explore the Machame Trek](/packages/Kilimanjaro-Machame-Trek).", image: "https://images.unsplash.com/photo-1516357231954-91487b459002?q=80&w=1200&auto=format&fit=crop", author: "Makolo AI Expert", category: "Trekking Tips" },
  { title: "Zanzibar: A Post-Safari Paradise", content: "# Zanzibar: A Post-Safari Paradise\n\nAfter the dust of the savannah, Zanzibar is pure reset.\n\n#### 🏝️ Where to Stay\nNungwi and Kendwa offer the finest beaches in the north; Stone Town is the cultural heartbeat.\n\n#### 🌊 Don't Miss\nA spice tour followed by a sunset dhow cruise. Unwind after your safari — [view our Zanzibar package](/packages/Zanzibar-Beach-Escape).", image: "https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?q=80&w=1200&auto=format&fit=crop", author: "Makolo AI Expert", category: "Cultural Insights" },
];

const visionaries = [
  { name: "Juma Kileo", duty: "Head Guide & Founder", image: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Neema Mahenge", duty: "Adventure Coordinator", image: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "David Mushi", duty: "Operations Manager", image: "https://randomuser.me/api/portraits/men/75.jpg" },
];

const testimonials = [
  { name: "Sarah Thompson", role: "Wildlife Photographer", rating: 5, text: "The Serengeti safari was flawless. Our guide Juma knew exactly where the big cats would be. Best trip of my life.", verified: true },
  { name: "Daniel Okafor", role: "Adventure Traveler", rating: 5, text: "Summited Kilimanjaro thanks to an incredible team that paced us perfectly. Safety and care were world-class.", verified: true },
  { name: "Emma Lindqvist", role: "Honeymooner", rating: 5, text: "From the crater to the beaches of Zanzibar, every detail was handled. The tailor-made process was so easy.", verified: true },
  { name: "Marcus Chen", role: "Family Traveler", rating: 4, text: "Our kids (7 and 10) were looked after wonderfully. The child pricing made the whole trip very reasonable.", verified: true },
];

const galleries = [
  { img: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=800&auto=format&fit=crop", location: "Serengeti", caption: "Lioness at golden hour" },
  { img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800&auto=format&fit=crop", location: "Ngorongoro", caption: "Crater at dawn" },
  { img: "https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?q=80&w=800&auto=format&fit=crop", location: "Zanzibar", caption: "Nungwi beach" },
  { img: "https://images.unsplash.com/photo-1516357231954-91487b459002?q=80&w=800&auto=format&fit=crop", location: "Kilimanjaro", caption: "Kibo summit" },
];

const seed = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('❌ MONGODB_URI not set'); process.exit(1); }
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    const taxonomyTypes = [
      { type: 'tourCategory', name: 'Luxury' },
      { type: 'tourCategory', name: 'Adventure' },
      { type: 'tourCategory', name: 'Relaxation' },
      { type: 'tourCategory', name: 'Budget' },
      { type: 'tourType', name: 'Safari' },
      { type: 'tourType', name: 'Trekking' },
      { type: 'tourType', name: 'Beach' },
      { type: 'tourType', name: 'Cultural' },
      { type: 'tourType', name: 'Day Trip' },
      { type: 'blogCategory', name: 'Safari News' },
      { type: 'blogCategory', name: 'Trekking Tips' },
      { type: 'blogCategory', name: 'Cultural Insights' },
    ];
    for (const t of taxonomyTypes) {
      const exists = await Taxonomy.findOne({ type: t.type, name: t.name });
      if (!exists) await Taxonomy.create(t);
    }

    for (const tour of tours) {
      const exists = await TourPackage.findOne({ title: tour.title });
      if (!exists) await TourPackage.create(tour);
    }
    for (const d of destinations) {
      const exists = await Destination.findOne({ slug: d.slug });
      if (!exists) await Destination.create(d);
    }
    for (const b of blogs) {
      const exists = await Blog.findOne({ title: b.title });
      if (!exists) await Blog.create(b);
    }
    for (const v of visionaries) {
      const exists = await Visionary.findOne({ name: v.name });
      if (!exists) await Visionary.create(v);
    }
    for (const t of testimonials) {
      const exists = await Testimonial.findOne({ name: t.name });
      if (!exists) await Testimonial.create(t);
    }
    for (const g of galleries) {
      const exists = await Gallery.findOne({ caption: g.caption });
      if (!exists) await Gallery.create(g);
    }

    console.log('✅ Seed complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
```

- [ ] **Step 3: Add seed script to package.json**

In root `package.json` scripts, add:

```json
"seed": "node backend/seed.js"
```

- [ ] **Step 4: Run seed against MongoDB**

Run: `npm run seed`
Expected: `✅ Connected to MongoDB` then `✅ Seed complete`.

- [ ] **Step 5: Verify seeded data via API**

Start backend, run:
```bash
curl http://localhost:5000/api/tours | head -c 200
curl http://localhost:5000/api/destinations | head -c 200
curl http://localhost:5000/api/testimonials | head -c 200
curl http://localhost:5000/api/blogs | head -c 200
```
Expected: non-empty JSON arrays.

- [ ] **Step 6: Commit**

```bash
git add backend/seed.js package.json .gitignore
git commit -m "feat: add seed data script for tours, destinations, blogs, testimonials"
```

---

### Task 14: Final Verification

**Files:**
- None (verification only)

- [ ] **Step 1: Lint frontend**

Run: `npm run lint`
Expected: no errors, exit 0. If lint errors exist in pre-existing files, fix only errors introduced by this plan.

- [ ] **Step 2: Full build**

Run: `npm run build`
Expected: success, `dist/` regenerated with new assets.

- [ ] **Step 3: Backend syntax check all files**

Run: `node --check backend/server.js && for f in backend/models/*.js backend/controllers/*.js backend/routes/*.js backend/middleware/*.js backend/services/*.js; do node --check "$f" || exit 1; done`
Expected: no output, exit 0.

- [ ] **Step 4: End-to-end API smoke test**

Start backend. Verify:
- `POST /api/auth/login` with wrong creds -> 401
- `POST /api/auth/login` with correct creds -> 200 + token
- `GET /api/tours` -> 200 (public)
- `POST /api/tours` without token -> 401
- `POST /api/tours` with token -> 201
- `POST /api/bookings` without travelDate -> 400
- `POST /api/bookings` with travelDate -> 201 + `bookingRef`
- `POST /api/newsletter` -> 201
- `POST /api/auth/login` x6 rapidly -> 429 (rate limit)

- [ ] **Step 5: Commit any remaining changes**

```bash
git status
git add -A
git commit -m "chore: final verification fixes"
```
(Only if there are uncommitted changes.)

---

## Self-Review Notes

- **Spec coverage:** All 6 spec modules map to tasks: security (T1-T2, T5), booking flow (T3-T4, T6), trust & legal (T7), SEO (T9), destinations (T10), operations (T11, T12), infra/data (T13), verification (T14). Payment excluded per spec.
- **Type consistency:** `auth` named export used everywhere; `bookingLimiter`/`inquiryLimiter`/`chatLimiter`/`newsletterLimiter`/`authLimiter` consistent across routes; `sendBookingEmail`/`sendStatusChangeEmail`/`sendInquiryEmail`/`sendInquiryReply` signatures match emailService; `bookingRef` format `MK-XXXXXX` consistent in model, route, popup.
- **Email on inquiry:** `sendInquiryEmail` sends to `MAIL_FROM` (operator inbox) — matches design (notify operator of new lead).
