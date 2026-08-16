# Image Upload Design: Admin Forms

## Goal

Let administrators upload images from their device in every admin form section that currently only accepts an image URL text input. The URL field remains available as a fallback next to the new upload control.

## Context

- The app runs on Vercel serverless (ephemeral filesystem), so saving files to disk is not viable.
- All image fields are stored as `String` values in MongoDB models:
  - `TourPackage.image`
  - `Blog.image`
  - `Gallery.img`
  - `Visionary.image`
  - `Destination.heroImage`, `Destination.gallery` (array of strings)
  - `Testimonial.image` (optional)
- Write API routes (`POST/PUT/DELETE`) are protected by the `auth` middleware; controllers store request-body strings as-is.
- "Best Places" page (`/best-places`) renders the `Gallery` collection, so the Gallery form is the "Best Places" upload target.

## Storage Decision

Uploaded images are stored directly in MongoDB as **base64 data URLs** (e.g. `data:image/jpeg;base64,...`) in the existing string fields.

Rationale:
- No new services or accounts required.
- Persists across serverless invocations (MongoDB is durable).
- Existing `<img src={...}>` rendering works with data URLs unchanged.
- Client-side compression keeps each image ~150–500KB, well under MongoDB's 16MB document limit even for destinations with multi-image galleries.

## Approach

### 1. Reusable component: `src/components/Admin/ImageUpload.jsx`

A reusable upload control with two modes.

**Single mode** (default) — used for tour `image`, blog `image`, gallery `img`, visionary `image`, destination `heroImage`, testimonial `image`:
- File picker button accepting `image/*`.
- Client-side resize/compress via canvas: max dimension 1600px, output JPEG (or WebP when supported) at quality ~0.7.
- Live preview of the current value (renders both `http(s)://` URLs and `data:` URLs).
- URL text input below the preview as a fallback; both controls write to the same form field.
- "Remove" button clears the value.
- Animated GIFs are kept as-is if under the size limit (canvas would strip animation); otherwise recompressed.

**Multiple mode** — used for destination `gallery`:
- Same file handling, but accepts multiple files (`multiple` attr) and appends each compressed data URL to the array value.
- Thumbnail grid with per-item remove buttons.
- Keeps the existing newline-joined textarea fallback synchronized with the array value.
- Validation errors are shown inline.

**Shared validation/behavior:**
- Accepted types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`.
- Reject source files larger than 8MB with a clear error message.
- Non-image files rejected with a clear error message.
- Never throws or blocks form submission on failure — shows a visible error and leaves the previous value intact.

### 2. Backend: raise JSON body limit

`backend/server.js` — change `app.use(express.json())` to `app.use(express.json({ limit: '10mb' }))`.

Express 5's default JSON limit is 100kb, which would reject base64 image payloads. Vercel's platform request-body ceiling is 4.5MB, so compressed images (≤ ~2MB) remain within limits.

### 3. Wire into the admin dashboard

`src/pages/AdminDashboard.jsx` — replace the 6 URL text inputs with the `ImageUpload` component:

| Section | Field(s) | Mode |
|---|---|---|
| Tour Packages | `image` | single |
| Blogs | `image` | single |
| Gallery | `img` | single |
| Visionaries | `image` | single |
| Destinations | `heroImage`, `gallery` | single + multiple |
| Testimonials | `image` (optional) | single |

No model, route, or public-page changes are required.

## Data Flow

1. Admin clicks upload and selects a file.
2. Component validates type/size, resizes and compresses to a base64 data URL.
3. Component writes the data URL into the form state field (e.g. `tourFormData.image`).
4. Form submits normally through the existing API; the controller stores the string in MongoDB.
5. Public pages render the value via existing `<img src={...}>`.

## Error Handling

- Oversized or non-image files are rejected client-side with a visible message.
- A failed/removed upload never prevents saving; the previous value remains.
- URL fallback means admins can still paste external links for existing images.

## Testing

Manual verification:
- Upload an image in each of the 6 admin sections, save, and reload the page — image persists.
- Confirm rendered output on public pages (tour card, blog card, gallery/best-places, destination cards, team, testimonials).
- Verify a pasted URL still works alongside the upload control.
- Verify an oversized file (>8MB) and a non-image file show the error message and do not overwrite the value.
