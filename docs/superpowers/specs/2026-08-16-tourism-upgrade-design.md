# Design Spec: Makolo Adventure Tours — Completeness & Trust Upgrade

Date: 2026-08-16
Status: Approved by user

## Overview

Makolo Adventure Tours is a React (Vite) + Express/MongoDB tourism site. This spec
covers a broad upgrade across 6 modules: security, booking flow, trust & legal pages,
SEO, destination pages, and operations/growth. Payment processing is explicitly
**excluded** (upcoming feature).

## 1. Security Hardening

### Backend JWT Auth

- `POST /api/auth/login` validates `ADMIN_USERNAME` / `ADMIN_PASSWORD` from `.env`,
  returns `{ token }` (JWT signed with `JWT_SECRET`).
- New files:
  - `backend/middleware/authMiddleware.js` — verifies `Authorization: Bearer <token>`.
  - `backend/routes/authRoutes.js` — login endpoint (rate-limited).
  - `backend/controllers/authController.js` — login handler.
- Protect with `authMiddleware`:
  - POST/PUT/DELETE `/api/tours`
  - POST/PUT/DELETE `/api/blogs` and `/api/blogs/auto-generate`
  - GET/DELETE `/api/bookings`, PATCH `/api/bookings/:id` (status)
  - GET/PATCH/DELETE `/api/custom-inquiries`
  - POST/DELETE `/api/gallery`
  - POST/DELETE `/api/taxonomies`
  - POST/PUT/DELETE `/api/visionaries`
  - POST/PUT/DELETE `/api/destinations`
  - GET/DELETE `/api/newsletter` (admin), GET `/api/testimonials` is public
- Public (no auth): GET tours, GET tour/:id, POST bookings, POST custom-inquiries,
  POST chat, GET blogs, GET blog/:id, GET destinations, GET destination/:slug,
  POST newsletter, GET testimonials.

### Rate Limiting

- `express-rate-limit` applied to: login (5/min), bookings POST (10/min per IP),
  custom-inquiries POST (10/min), chat POST (20/min), newsletter POST (5/min).

### Frontend Auth

- `AdminLogin.jsx` calls the real API; no hardcoded credentials.
- `src/services/api.js` axios interceptor attaches `Bearer` token from
  `localStorage.adminToken`.
- New `ProtectedRoute` component guards `/admin` — redirects to `/login` if no token.
- AdminDashboard logout clears token and redirects.

## 2. Booking Flow Upgrade (no payment)

- **Booking model** adds: `travelDate` (Date, required), `adults` (Number, default 1),
  `children` (Number, default 0), `bookingRef` (String, unique, generated server-side
  like `MK-7F3K9Q`), `childDiscountPercent` snapshot (Number).
- **TourPackage model** adds: `childDiscountPercent` (Number, default 50).
- **OrderPopup**:
  - Date input (required).
  - Adults / children steppers.
  - Total = `adults * price + children * price * (1 - childDiscount/100)`.
  - On success shows booking reference.
- **Group capacity fix**: when a group booking is cancelled (PATCH status) or deleted,
  decrement `tour.currentBookings`.
- **Confirmation email** (nodemailer):
  - Only sends if `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`
    are set; otherwise logs "Email not configured".
  - Sent on booking creation; and on admin status change (if SMTP configured).

## 3. Trust & Legal Pages

- New static pages under `/privacy`, `/terms`, `/cancellation-policy`, `/faq`.
- Footer gets links to these + license badges (TALA, TATO) + office address/hours.
- Package detail gains a trust strip (licensed operator, 24/7 support, insured).
- **Testimonials DB-backed**:
  - New `Testimonial` model: name, role, text, rating, image, verified, date.
  - `GET /api/testimonials` public; POST/DELETE admin.
  - `Testimonial.jsx` fetches from API instead of hardcoded picsum data.
  - Admin dashboard: testimonial CRUD section.

## 4. SEO Foundation

- `index.html`: meta description, keywords, canonical, Open Graph, Twitter tags,
  JSON-LD `Organization` + `WebSite`.
- `public/sitemap.xml` and `public/robots.txt`.
- New `src/components/UI/PageMeta.jsx` — a `<head>` manager used in `Layout` that maps
  route -> title/description via `useLocation`.
- Add `loading="lazy"` + `decoding="async"` to `<img>` in PackageCard, BlogCard,
  PlaceCard, destination/hero images, gallery.
- Fix double hero video render (Home.jsx renders video AND Hero.jsx renders its own).

## 5. Destination Pages

- New `Destination` model: name, slug, heroImage, shortIntro, description,
  bestTimeToVisit (text), wildlifeCalendar `[{month, event}]`, highlights `[]`,
  gallery `[]`, location.
- Routes: `GET /api/destinations`, `GET /api/destinations/:slug` (public);
  POST/PUT/DELETE admin.
- Pages: `/destinations` (listing) and `/destinations/:slug` (detail w/ calendar +
  cross-linked tours matching `location`).
- Navbar adds "Destinations".
- Admin dashboard: destination CRUD section.

## 6. Operations & Growth

- **Newsletter**: `Newsletter` model (email, createdAt). `POST /api/newsletter`
  public + rate-limited; GET/DELETE admin. Footer signup form with success state.
- **GA4 placeholder**: gtag script loads only when `VITE_GA_ID` is set (env).
- **CRM status workflow**: booking status enum `Pending|Confirmed|Completed|Cancelled`;
  inquiry `Pending|Contacted|Booked|Cancelled`. Admin PATCH transitions status and
  (SMTP-gated) sends email.
- **Referral source** dropdown on booking form (values: Google, Instagram, Facebook,
  Friend/Family, Repeat Client, Other) stored on Booking.

## 7. Infrastructure & Data

- **Seed script** `backend/seed.js` (npm script `seed`): seeds tours, destinations,
  blogs, visionaries, taxonomies, testimonials, gallery, newsletter sample. Idempotent
  (checks by slug/title).
- **Dependency alignment**: backend package deps match root (Express 5 / Mongoose 9).
  Add to root: `jsonwebtoken`, `express-rate-limit`, `nodemailer`, `dotenv` (already).
- Add `dist/` to `.gitignore`.
- `.env` additions: `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET`, `SMTP_*`,
  `MAIL_FROM`, `CRON_SECRET` (existing).

## Out of Scope

- Payment processing / deposits / M-Pesa (upcoming feature).
- Multi-language / currency selector.
- Real email delivery (must be configured by operator via SMTP env).
- Real GA4 account (operator supplies `VITE_GA_ID`).

## Testing

- `node --check` on all backend files; `npm run build` for frontend.
- `npm run seed` against MongoDB; curl checks: login (200/401), auth-protected
  route without token (401), rate limit (429), booking with travelDate, newsletter.
