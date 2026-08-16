# Navbar Image Dropdowns + Local Image Upload Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add hover dropdowns with live image cards to the Destinations/Packages/Blogs navbar links, and add a reusable local image upload (1MB max) to all admin image fields, storing images as base64 data URIs in MongoDB.

**Architecture:** Navbar links get a `dropdown` config pointing to a shared `Dropdown` component that fetches live data and renders image+name cards. A reusable `ImageUpload` component reads files client-side (validating ≤1MB), converts to a base64 data URI, and writes into the existing form state; the backend raises its JSON body limit and validates data-URI image sizes server-side.

**Tech Stack:** React 18, Vite, Tailwind, Express 5, Mongoose 9, `node:test` for backend unit tests.

## Global Constraints

- Max uploaded image size: **1MB (1,048,576 bytes)** — enforced client-side AND server-side.
- Uploaded images stored as base64 data URIs (strings starting with `data:image/`). Existing URL entry must remain supported.
- No new npm dependencies.
- Express `express.json()` body limit must be raised (default 100kb is too small for 1MB base64).
- Lint must pass: `npm run lint`.
- Backend tests run with `node --test`.

---

### Task 1: Backend image-size validation middleware + body limit

**Files:**
- Create: `backend/middleware/validateImageSize.js`
- Test: `backend/tests/validateImageSize.test.js`
- Modify: `backend/server.js` (body limit + mount middleware)

**Interfaces:**
- Produces: `validateImageSize` middleware (default export of `backend/middleware/validateImageSize.js`) — `(req, res, next)`. Walks `req.body` (including nested arrays) for strings starting with `data:image/`; if any decoded size exceeds 1MB, responds `400 { message: 'Image "KEY" must be 1MB or smaller.' }` and does NOT call next; otherwise calls `next()`.

- [ ] **Step 1: Write the failing test**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import validateImageSize from '../middleware/validateImageSize.js';

const mb = 1024 * 1024;
const makeDataUri = (bytes) => {
    const fullGroups = Math.floor(bytes / 3);
    const remainder = bytes % 3;
    const totalChars = fullGroups * 4 + (remainder > 0 ? 4 : 0);
    const padding = remainder === 1 ? 2 : remainder === 2 ? 1 : 0;
    const data = 'A'.repeat(totalChars - padding) + '='.repeat(padding);
    return `data:image/png;base64,${data}`;
};

const mockRes = () => {
    const res = { statusCode: 200 };
    res.status = (code) => { res.statusCode = code; return res; };
    res.json = (body) => { res.body = body; return res; };
    return res;
};

test('allows image data URIs up to 1MB', () => {
    const req = { body: { image: makeDataUri(mb) } };
    const res = mockRes();
    let nextCalled = false;
    validateImageSize(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
    assert.equal(res.statusCode, 200);
});

test('rejects image data URIs larger than 1MB', () => {
    const req = { body: { image: makeDataUri(mb + 1) } };
    const res = mockRes();
    let nextCalled = false;
    validateImageSize(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, false);
    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /1MB or smaller/);
});

test('rejects oversized images nested inside arrays (destination gallery)', () => {
    const req = { body: { gallery: ['https://example.com/a.jpg', makeDataUri(mb + 1)] } };
    const res = mockRes();
    let nextCalled = false;
    validateImageSize(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, false);
    assert.equal(res.statusCode, 400);
});

test('ignores plain URLs and non-image strings', () => {
    const req = { body: { image: 'https://example.com/a.jpg', title: 'hello' } };
    const res = mockRes();
    let nextCalled = false;
    validateImageSize(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
    assert.equal(res.statusCode, 200);
});

test('handles empty/missing body', () => {
    const req = { body: {} };
    const res = mockRes();
    let nextCalled = false;
    validateImageSize(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test backend/tests/validateImageSize.test.js`
Expected: FAIL — "Cannot find module '../middleware/validateImageSize.js'"

- [ ] **Step 3: Write minimal implementation**

Create `backend/middleware/validateImageSize.js`:

```js
const MAX_IMAGE_BYTES = 1 * 1024 * 1024; // 1MB

const isDataImage = (value) => typeof value === 'string' && value.startsWith('data:image/');

const decodedSize = (dataUri) => {
    const comma = dataUri.indexOf(',');
    const b64 = comma >= 0 ? dataUri.slice(comma + 1) : dataUri;
    const padding = b64.endsWith('==') ? 2 : b64.endsWith('=') ? 1 : 0;
    return Math.floor((b64.length * 3) / 4) - padding;
};

const findOversized = (value, key) => {
    if (isDataImage(value) && decodedSize(value) > MAX_IMAGE_BYTES) {
        return key;
    }
    if (Array.isArray(value)) {
        for (const item of value) {
            const result = findOversized(item, key);
            if (result) return result;
        }
    }
    return null;
};

const validateImageSize = (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
        for (const [key, value] of Object.entries(req.body)) {
            const oversized = findOversized(value, key);
            if (oversized) {
                return res.status(400).json({ message: `Image "${oversized}" must be 1MB or smaller.` });
            }
        }
    }
    next();
};

export default validateImageSize;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test backend/tests/validateImageSize.test.js`
Expected: PASS (5 tests)

- [ ] **Step 5: Mount middleware + raise body limit in server.js**

In `backend/server.js`, change the JSON middleware line:

```js
app.use(express.json({ limit: '10mb' }));
```

and add the import at the top (after the other route imports):

```js
import validateImageSize from './middleware/validateImageSize.js';
```

and mount it immediately after `app.use(express.json({ limit: '10mb' }));`:

```js
app.use(validateImageSize);
```

- [ ] **Step 6: Verify server boots and endpoints still work**

Run: `node backend/server.js` (stop first if running)
Expected: "🚀 Server is listening on port: 5000" and "✅ Connected to MongoDB"

Then in another shell:
```
curl -s http://localhost:5000/api/tours -o /dev/null -w "%{http_code}\n"
```
Expected: `200`

- [ ] **Step 7: Commit**

```bash
git add backend/middleware/validateImageSize.js backend/tests/validateImageSize.test.js backend/server.js
git commit -m "feat(backend): validate 1MB image upload limit and raise body limit"
```

---

### Task 2: Reusable ImageUpload component

**Files:**
- Create: `src/components/UI/ImageUpload.jsx`

**Interfaces:**
- Consumes: none (self-contained).
- Produces: `ImageUpload` default export — props: `{ value, onChange, label, required }`. `value` is a string (URL or data URI); `onChange(newValue: string)` is called with the chosen value.

**Behavior:** Renders a current-image preview, a file input (accept `image/*`), a URL text input (alternative), and an inline error message. File selection validates type (must be `image/*`) and size (≤1MB); oversized/non-image files are rejected with a message and the input is cleared. Valid files are read via `FileReader.readAsDataURL` and passed to `onChange`.

- [ ] **Step 1: Create the component**

Create `src/components/UI/ImageUpload.jsx`:

```jsx
import React, { useState } from "react";

const MAX_IMAGE_BYTES = 1 * 1024 * 1024; // 1MB

const ImageUpload = ({ value = "", onChange, label, required }) => {
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setError("");
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (JPG, PNG, WebP, etc.).");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setError(`Image must be 1MB or smaller. This file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        {value && (
          <img
            src={value}
            alt="Preview"
            className="w-16 h-16 rounded-xl object-cover bg-gray-100 shrink-0"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full bg-gray-50 p-4 rounded-xl border-none focus:ring-2 focus:ring-primary text-sm font-medium"
        />
      </div>

      <input
        type="text"
        value={value && value.startsWith("data:") ? "" : value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste an image URL (https://...)"
        className="w-full bg-gray-50 p-4 rounded-xl border-none focus:ring-2 focus:ring-primary text-sm font-medium"
        required={required && !value}
      />

      {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
    </div>
  );
};

export default ImageUpload;
```

- [ ] **Step 2: Verify the dev server compiles**

Run: `npm run frontend`
Expected: Vite ready, no compile errors (check terminal log for `error`).

- [ ] **Step 3: Commit**

```bash
git add src/components/UI/ImageUpload.jsx
git commit -m "feat(ui): add reusable ImageUpload component with 1MB limit"
```

---

### Task 3: Wire ImageUpload into all admin image fields

**Files:**
- Modify: `src/pages/AdminDashboard.jsx` (6 image fields)

**Interfaces:**
- Consumes: `ImageUpload` from Task 2 (props `value`, `onChange`, `label`, `required`).
- Produces: all six admin image fields accept either a URL or a local file ≤1MB, writing into the existing `*FormData` state fields (`image`, `img`, `heroImage`).

**Replacement guide — each block below replaces the corresponding `<input type="text" ...>` image field (keep surrounding `<div className="space-y-2">` and label removed since ImageUpload renders its own label):**

- [ ] **Step 1: Replace tour Image URL field** (lines ~639-652)

Replace:
```jsx
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
                        Image URL
                      </label>
                      <input
                        type="text"
                        name="image"
                        value={tourFormData.image}
                        onChange={handleTourInputChange}
                        placeholder="https://..."
                        className="w-full bg-gray-50 p-4 rounded-xl border-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
```

With:
```jsx
                    <div className="space-y-2">
                      <ImageUpload
                        label="Image (upload or URL)"
                        value={tourFormData.image}
                        onChange={(img) => setTourFormData({ ...tourFormData, image: img })}
                        required
                      />
                    </div>
```

- [ ] **Step 2: Replace blog Cover Image field** (lines ~997-1010)

Replace:
```jsx
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
                      Cover Image URL
                    </label>
                    <input
                      type="text"
                      name="image"
                      value={blogFormData.image}
                      onChange={handleBlogInputChange}
                      placeholder="https://..."
                      className="w-full bg-gray-50 p-4 rounded-xl border-none focus:ring-2 focus:ring-secondary"
                      required
                    />
                  </div>
```

With:
```jsx
                  <div className="space-y-2">
                    <ImageUpload
                      label="Cover Image (upload or URL)"
                      value={blogFormData.image}
                      onChange={(img) => setBlogFormData({ ...blogFormData, image: img })}
                      required
                    />
                  </div>
```

- [ ] **Step 3: Replace gallery "Image URL" input** (lines ~1354-1362)

Replace:
```jsx
                    <input
                      type="text"
                      name="img"
                      value={galleryFormData.img}
                      onChange={handleGalleryInputChange}
                      placeholder="Image URL"
                      className="flex-1 bg-gray-50 p-4 rounded-xl border-none focus:ring-2 focus:ring-primary"
                      required
                    />
```

With:
```jsx
                    <div className="flex-1">
                      <ImageUpload
                        value={galleryFormData.img}
                        onChange={(img) => setGalleryFormData({ ...galleryFormData, img })}
                        required
                      />
                    </div>
```

- [ ] **Step 4: Replace visionary Image URL field** (lines ~1526-1536)

Replace:
```jsx
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Image URL</label>
                      <input
                        type="text"
                        name="image"
                        value={visionaryFormData.image}
                        onChange={handleVisionaryInputChange}
                        placeholder="https://..."
                        className="w-full bg-gray-50 p-4 rounded-xl border-none focus:ring-2 focus:ring-primary font-bold"
                        required
                      />
                    </div>
```

With:
```jsx
                    <div className="space-y-2">
                      <ImageUpload
                        label="Image (upload or URL)"
                        value={visionaryFormData.image}
                        onChange={(img) => setVisionaryFormData({ ...visionaryFormData, image: img })}
                        required
                      />
                    </div>
```

- [ ] **Step 5: Replace destination Hero Image field** (lines ~1650-1661)

Replace:
```jsx
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Hero Image URL</label>
                      <input
                        type="text"
                        name="heroImage"
                        value={destinationFormData.heroImage}
                        onChange={handleDestinationInputChange}
                        placeholder="https://..."
                        className="w-full bg-gray-50 p-4 rounded-xl border-none focus:ring-2 focus:ring-primary font-bold"
                        required
                      />
                    </div>
```

With:
```jsx
                    <div className="space-y-2">
                      <ImageUpload
                        label="Hero Image (upload or URL)"
                        value={destinationFormData.heroImage}
                        onChange={(img) => setDestinationFormData({ ...destinationFormData, heroImage: img })}
                        required
                      />
                    </div>
```

- [ ] **Step 6: Replace testimonial Avatar URL field** (lines ~1876-1886)

Replace:
```jsx
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Avatar URL (optional)</label>
                      <input
                        type="text"
                        name="image"
                        value={testimonialFormData.image}
                        onChange={handleTestimonialInputChange}
                        placeholder="https://..."
                        className="w-full bg-gray-50 p-4 rounded-xl border-none focus:ring-2 focus:ring-secondary font-medium"
                      />
                    </div>
```

With:
```jsx
                    <div className="space-y-2">
                      <ImageUpload
                        label="Avatar (upload or URL, optional)"
                        value={testimonialFormData.image}
                        onChange={(img) => setTestimonialFormData({ ...testimonialFormData, image: img })}
                      />
                    </div>
```

- [ ] **Step 7: Add the import**

At the top of `src/pages/AdminDashboard.jsx`, after the existing UI imports (around line 43):

```jsx
import ImageUpload from "../components/UI/ImageUpload";
```

- [ ] **Step 8: Verify compile + lint**

Run: `npm run frontend` (or restart dev server) — no compile errors.
Run: `npm run lint`
Expected: no errors.

- [ ] **Step 9: Manual verification**

Open the admin dashboard, and for each of the six forms (Packages, Blogs, Gallery, Visionaries, Destinations, Testimonials):
1. Upload an image under 1MB → preview shows, save works.
2. Upload an image over 1MB → error message shown, field cleared.
3. Paste a URL instead → still works.

- [ ] **Step 10: Commit**

```bash
git add src/pages/AdminDashboard.jsx
git commit -m "feat(admin): use ImageUpload with 1MB limit across all image fields"
```

---

### Task 4: Navbar Dropdown component (live image cards)

**Files:**
- Create: `src/components/Navbar/Dropdown.jsx`

**Interfaces:**
- Consumes: `fetchDestinations`, `fetchTours`, `fetchBlogs` from `../services/api`.
- Produces: `Dropdown` default export — props: `{ fetchItems, toPath, imageKey, labelKey }`. `fetchItems` is a function returning `{ data }` (the api.js pattern). `toPath(item)` returns a route string. Renders up to 6 image+name cards linking to `toPath(item)`.

- [ ] **Step 1: Create the component**

Create `src/components/Navbar/Dropdown.jsx`:

```jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Dropdown = ({ fetchItems, toPath, imageKey, labelKey }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems()
      .then((res) => setItems(Array.isArray(res.data) ? res.data.slice(0, 6) : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [fetchItems]);

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <p className="px-4 py-6 text-center text-gray-400 text-xs font-black uppercase tracking-wider">Loading...</p>
          ) : items.length === 0 ? (
            <p className="px-4 py-6 text-center text-gray-400 text-xs font-black uppercase tracking-wider">No items yet</p>
          ) : (
            items.map((item) => (
              <Link
                key={item._id}
                to={toPath(item)}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 transition"
              >
                <img
                  src={item[imageKey]}
                  alt={item[labelKey]}
                  className="w-14 h-14 rounded-lg object-cover shrink-0"
                />
                <span className="text-xs font-black text-gray-900 uppercase tracking-wide">{item[labelKey]}</span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
```

- [ ] **Step 2: Verify compile**

Run: `npm run frontend`
Expected: Vite ready, no compile errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar/Dropdown.jsx
git commit -m "feat(navbar): add Dropdown component with live image cards"
```

---

### Task 5: Wire dropdowns into Navbar links

**Files:**
- Modify: `src/components/Navbar/Navbar.jsx`

**Interfaces:**
- Consumes: `Dropdown` from Task 4; `fetchDestinations`, `fetchTours`, `fetchBlogs` from `../services/api`.
- Produces: Destinations, Packages, and Blogs navbar links show a hover dropdown with live image+name cards linking to `/destinations/:slug`, `/packages/:title`, `/blogs/:title`.

- [ ] **Step 1: Add imports and dropdown config**

In `src/components/Navbar/Navbar.jsx`:

Add to imports (after `import ResponsiveMenu from "./ResponsiveMenu";`):

```jsx
import Dropdown from "./Dropdown";
import { fetchDestinations, fetchTours, fetchBlogs } from "../../services/api";
```

Replace the `NavbarLinks` array so `Destinations`, `Packages`, and `Blogs` entries carry a `dropdown` config:

```jsx
export const NavbarLinks = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "About",
    link: "/about",
  },
  {
    name: "Blogs",
    link: "/blogs",
    dropdown: {
      fetchItems: fetchBlogs,
      toPath: (b) => `/blogs/${b.title}`,
      imageKey: "image",
      labelKey: "title",
    },
  },
  {
    name: "Packages",
    link: "/packages",
    dropdown: {
      fetchItems: fetchTours,
      toPath: (t) => `/packages/${t.title}`,
      imageKey: "image",
      labelKey: "title",
    },
  },
  {
    name: "Best Places",
    link: "/best-places",
  },
  {
    name: "Destinations",
    link: "/destinations",
    dropdown: {
      fetchItems: fetchDestinations,
      toPath: (d) => `/destinations/${d.slug}`,
      imageKey: "heroImage",
      labelKey: "name",
    },
  },
  {
    name: "Tailor-Made",
    link: "/tailor-made",
  },
];
```

- [ ] **Step 2: Render the dropdown in the link list**

Replace the `<li>` block inside the desktop `<ul>` (lines ~95-111) with:

```jsx
                {NavbarLinks.map((link) => (
                  <li
                    key={link.name}
                    className="relative group overflow-visible py-2"
                  >
                    <NavLink
                      to={link.link}
                      className={({ isActive }) =>
                        `transition-all duration-300 text-sm uppercase tracking-wider flex items-center gap-1.5 ${isActive ? "text-primary" : "hover:text-primary"
                        }`
                      }
                    >
                      {link.name}
                      {link.dropdown && <FaCaretDown className="text-[10px]" />}
                    </NavLink>
                    {link.dropdown && (
                      <Dropdown
                        fetchItems={link.dropdown.fetchItems}
                        toPath={link.dropdown.toPath}
                        imageKey={link.dropdown.imageKey}
                        labelKey={link.dropdown.labelKey}
                      />
                    )}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                  </li>
                ))}
```

Note: `overflow-hidden` on the `<li>` is changed to `overflow-visible` so the dropdown panel is not clipped.

- [ ] **Step 3: Verify compile + lint**

Run: `npm run frontend`
Expected: Vite ready, no compile errors.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Manual verification**

On the running site:
1. Hover **Destinations** → dropdown shows destination cards (image + name) linking to `/destinations/:slug`.
2. Hover **Packages** → dropdown shows tour cards linking to `/packages/:title`.
3. Hover **Blogs** → dropdown shows blog cards linking to `/blogs/:title`.
4. Clicking a card navigates to the correct detail page.
5. Non-dropdown links (Home, About, Best Places, Tailor-Made) behave as before.

- [ ] **Step 5: Commit**

```bash
git add src/components/Navbar/Navbar.jsx
git commit -m "feat(navbar): add live image dropdowns for Destinations, Packages, Blogs"
```

---

### Task 6: Full verification

**Files:**
- None (verification only).

- [ ] **Step 1: Run backend tests**

Run: `node --test backend/tests/validateImageSize.test.js`
Expected: PASS (5 tests)

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Run the app end-to-end**

Run: `npm run dev` (kill any existing dev server first)
Expected: Vite on 5173, backend on 5000, "✅ Connected to MongoDB".

Smoke test all data endpoints:
```
curl -s http://localhost:5000/api/tours -o /dev/null -w "%{http_code}\n"
curl -s http://localhost:5000/api/blogs -o /dev/null -w "%{http_code}\n"
curl -s http://localhost:5000/api/destinations -o /dev/null -w "%{http_code}\n"
curl -s http://localhost:5000/api/gallery -o /dev/null -w "%{http_code}\n"
```
Expected: all `200`.

- [ ] **Step 4: Commit any remaining changes**

```bash
git status --short
git add -A
git commit -m "chore: final verification"
```
(Only if there are uncommitted changes; otherwise skip.)
