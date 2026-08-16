# Design: Navbar Image Dropdowns + Local Image Upload (1MB limit)

Date: 2026-08-16

## Overview

Two features for the Makolo Adventure Tours site:

1. **Navbar image dropdowns** — Destinations, Packages, and Blogs links get hover dropdowns that show live cards (image + name) fetched from the API. Other navbar links stay plain.
2. **Local image upload** — a reusable file picker with a 1MB limit added to all admin image fields (tours, blogs, gallery, visionaries, destinations hero, testimonials). Files are validated client-side, converted to base64, and stored in MongoDB. URL entry remains an alternative.

## Architecture

### 1. Navbar dropdowns

- Modify `src/components/Navbar/Navbar.jsx`:
  - Add `dropdown` config to the `NavbarLinks` entries for `Destinations`, `Packages`, and `Blogs` (each with a data-fetching key and API call).
  - On hover (CSS `group-hover`), show a dropdown panel rendered below the nav item.
  - The panel fetches live data once on mount via existing API functions (`fetchDestinations`, `fetchTours`, `fetchBlogs`), capping the list (e.g., 6 items).
  - Each item renders as a small card: image + name, linking to the detail page (`/destinations/:slug`, `/packages/:title`, `/blogs/:title`).
  - Mobile menu (`ResponsiveMenu.jsx`) stays unchanged.

- New component: `src/components/Navbar/Dropdown.jsx` — renders the fetched items as cards inside the hover panel.

### 2. Image upload (base64 into MongoDB)

- New reusable component: `src/components/UI/ImageUpload.jsx`
  - Props: `value` (current image URL/data URI), `onChange(newValue)`, `label`, `maxSizeMB` (default 1), `accept` (default `image/*`).
  - Renders the current image preview, a file input, and an optional URL text input.
  - On file selection:
    - Validates `file.size <= 1 * 1024 * 1024` (1MB). If larger, shows an error and rejects.
    - Reads the file via `FileReader.readAsDataURL`, then calls `onChange(dataUri)`.
  - User can still type/paste a URL instead (URL field shown as alternative).

- Backend (`backend/server.js`):
  - Raise JSON body limit from default (100kb) to `5mb` so base64 payloads are accepted: `app.use(express.json({ limit: "5mb" }))`.
  - Server-side validation: add a small helper/middleware that rejects image fields whose data-URI base64 length decodes to more than 1MB, returning 400. Applied in controllers that accept image fields (tours, blogs, gallery, visionaries, destinations, testimonials).

- Admin dashboard (`src/pages/AdminDashboard.jsx`):
  - Replace the plain image URL text inputs for tours, blogs, gallery, visionaries, destination hero image, and testimonials with `ImageUpload`.
  - Keep the existing `*FormData.image/heroImage/img` state fields — `ImageUpload` writes into them.

## Data flow

- Upload: user picks file → ImageUpload validates size → reads as data URI → state updated → on submit, JSON body (with data URI) POSTed to existing routes → stored in MongoDB as the image field value.
- Display: existing `<img src={image}>` tags work unchanged since data URIs are valid `src` values.

## Error handling

- Client: oversized files rejected with a clear message ("Image must be 1MB or smaller"). Non-image types rejected via `accept` and type check.
- Server: 400 response if a data-URI image exceeds 1MB; existing route try/catch still returns 500 for other failures.

## Testing

- Manual verification in dev:
  - Navbar hover dropdowns show live destination/package/blog cards with images and navigate correctly.
  - Upload an image < 1MB in each admin form field → saved and displayed.
  - Upload an image > 1MB → rejected client-side with the size message.
  - URL entry still works in every field.
- `npm run lint` passes.
