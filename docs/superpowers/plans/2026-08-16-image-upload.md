# Image Upload for Admin Forms Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let admins upload images from their device in all 6 admin form sections that currently accept only an image URL, storing uploads as compressed base64 data URLs in MongoDB while keeping the URL field as a fallback.

**Architecture:** A reusable `ImageUpload` React component (single and multiple modes) validates and compresses files client-side via canvas, then writes a base64 data URL into the existing string form fields. The Express JSON body limit is raised so base64 payloads are accepted. No model, route, or public-page changes are required because data URLs render natively in `<img src>`.

**Tech Stack:** React 18, Vite 5, Express 5, MongoDB/Mongoose, Node built-in `node:test` for unit tests.

## Global Constraints

- Backend uses ESM (`import`/`export`).
- Backend files live in `backend/`, admin dashboard in `src/pages/AdminDashboard.jsx`, shared UI in `src/components/UI/`, admin components in `src/components/Admin/`.
- Design tokens: `primary #0d9488`, `background #0f172a`, etc. Reuse existing `className` styling patterns (`bg-gray-50 p-4 rounded-xl border-none focus:ring-2 focus:ring-primary`).
- Accepted image types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`.
- Max source file size: 8MB (reject larger). Compress to max dimension 1600px, quality ~0.7.
- Never block form submission on upload failure — show an error message and keep the previous value.
- The URL text input must remain as a fallback alongside every upload control.
- No new runtime npm dependencies. Tests use Node's built-in `node:test` runner (already available in Node 22).

---

### Task 1: Raise Express JSON body limit

**Files:**
- Modify: `backend/server.js:35`

**Interfaces:**
- Consumes: none.
- Produces: an Express app that accepts JSON request bodies up to 10MB (required for base64 image payloads in later tasks).

- [ ] **Step 1: Change the JSON body parser limit**

Open `backend/server.js`. Find line 35:

```js
app.use(express.json());
```

Replace it with:

```js
app.use(express.json({ limit: '10mb' }));
```

- [ ] **Step 2: Verify the server starts and accepts payloads**

Run from the project root:

```bash
node backend/server.js
```

Expected: `Server is listening on port: 5000` (MongoDB connection may fail locally without `MONGODB_URI` — that is fine for this check; then Ctrl+C).

Then start a quick smoke test in another terminal to confirm a JSON POST body is parsed (use a dummy route-less check):

```bash
curl -s -X POST http://localhost:5000/api/tours -H "Content-Type: application/json" -d '{}' -w "\nHTTP %{http_code}\n"
```

Expected: HTTP 401 (`Not authorized, no token`) — proving the body was parsed and the auth middleware ran, rather than a 413 or parse error. Stop the server.

- [ ] **Step 3: Commit**

```bash
git add backend/server.js
git commit -m "feat(auth): raise JSON body limit to accept base64 image uploads"
```

---

### Task 2: Image validation and compression utilities (TDD)

**Files:**
- Create: `src/components/Admin/imageUtils.js`
- Test: `src/components/Admin/imageUtils.test.mjs`

**Interfaces:**
- Consumes: none.
- Produces:
  - `export const ACCEPTED_TYPES` — array of the 4 accepted MIME types.
  - `export const MAX_SOURCE_SIZE` — `8 * 1024 * 1024`.
  - `export const MAX_DIMENSION` — `1600`.
  - `export const COMPRESS_QUALITY` — `0.7`.
  - `export function validateImageFile(file)` — returns `{ ok: boolean, error: string | null }`.
  - `export async function compressImageFile(file)` — returns `{ ok: boolean, error: string | null, dataUrl: string | null }`. Used by Task 3.

- [ ] **Step 1: Write the failing test**

Create `src/components/Admin/imageUtils.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateImageFile,
  ACCEPTED_TYPES,
  MAX_SOURCE_SIZE,
} from './imageUtils.js';

test('accepts a valid JPEG file', () => {
  const file = { type: 'image/jpeg', size: 1024 };
  assert.deepEqual(validateImageFile(file), { ok: true, error: null });
});

test('accepts valid PNG, WEBP, and GIF types', () => {
  for (const type of ['image/png', 'image/webp', 'image/gif']) {
    assert.deepEqual(validateImageFile({ type, size: 1024 }), {
      ok: true,
      error: null,
    });
  }
});

test('rejects unsupported file types', () => {
  const res = validateImageFile({ type: 'application/pdf', size: 1024 });
  assert.equal(res.ok, false);
  assert.match(res.error, /Unsupported file type/);
});

test('rejects files over 8MB', () => {
  const res = validateImageFile({ type: 'image/jpeg', size: MAX_SOURCE_SIZE + 1 });
  assert.equal(res.ok, false);
  assert.match(res.error, /too large/i);
});

test('rejects a missing file', () => {
  const res = validateImageFile(null);
  assert.equal(res.ok, false);
  assert.ok(res.error);
});

test('ACCEPTED_TYPES contains exactly the supported types', () => {
  assert.deepEqual(
    ACCEPTED_TYPES,
    ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  );
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run from the project root:

```bash
node --test src/components/Admin/imageUtils.test.mjs
```

Expected: FAIL with `Cannot find module './imageUtils.js'`.

- [ ] **Step 3: Write the implementation**

Create `src/components/Admin/imageUtils.js`:

```js
export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const MAX_SOURCE_SIZE = 8 * 1024 * 1024;
export const MAX_DIMENSION = 1600;
export const COMPRESS_QUALITY = 0.7;

export function validateImageFile(file) {
  if (!file) return { ok: false, error: 'No file selected.' };
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return { ok: false, error: 'Unsupported file type. Use JPG, PNG, WEBP, or GIF.' };
  }
  if (file.size > MAX_SOURCE_SIZE) {
    return { ok: false, error: 'File is too large. Maximum size is 8MB.' };
  }
  return { ok: true, error: null };
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image.'));
    img.src = src;
  });
}

export async function compressImageFile(file) {
  const validation = validateImageFile(file);
  if (!validation.ok) return { ok: false, error: validation.error, dataUrl: null };

  if (file.type === 'image/gif') {
    const dataUrl = await readFileAsDataUrl(file);
    return { ok: true, error: null, dataUrl };
  }

  const original = await readFileAsDataUrl(file);
  const img = await loadImage(original);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(img, 0, 0, w, h);
  const webpTest = canvas.toDataURL('image/webp');
  const dataUrl = webpTest.startsWith('data:image/webp')
    ? canvas.toDataURL('image/webp', COMPRESS_QUALITY)
    : canvas.toDataURL('image/jpeg', COMPRESS_QUALITY);
  return { ok: true, error: null, dataUrl };
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```bash
node --test src/components/Admin/imageUtils.test.mjs
```

Expected: PASS — all 6 tests green.

- [ ] **Step 5: Commit**

```bash
git add src/components/Admin/imageUtils.js src/components/Admin/imageUtils.test.mjs
git commit -m "feat(admin): add image validation and compression utilities"
```

---

### Task 3: Reusable ImageUpload component

**Files:**
- Create: `src/components/Admin/ImageUpload.jsx`

**Interfaces:**
- Consumes: `compressImageFile` from `./imageUtils.js` (Task 2).
- Produces: default-exported component with props:
  - `value` — `string` for single mode, `string[]` for multiple mode.
  - `onChange(value)` — `(string) => void` or `(string[]) => void`.
  - `label` — optional label text.
  - `required` — optional boolean (single mode only; adds `required` to the URL input).
  - `multiple` — optional boolean; switches to multiple-image mode.
  - `placeholder` — optional placeholder for the URL input/textarea.
  Used by Task 4 in all 6 admin sections.

- [ ] **Step 1: Write the component**

Create `src/components/Admin/ImageUpload.jsx`:

```jsx
import React, { useRef, useState } from "react";
import { compressImageFile } from "./imageUtils";

const ImageUpload = ({
  value,
  onChange,
  label,
  required = false,
  multiple = false,
  placeholder = "Or paste an image URL",
}) => {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  const handleFiles = async (fileList) => {
    setError("");
    if (!fileList || fileList.length === 0) return;
    setBusy(true);
    try {
      const results = [];
      for (const file of fileList) {
        const res = await compressImageFile(file);
        if (!res.ok) {
          setError(res.error);
          return;
        }
        results.push(res.dataUrl);
      }
      if (multiple) {
        onChange([...(Array.isArray(value) ? value : []), ...results]);
      } else {
        onChange(results[0]);
      }
    } catch (e) {
      setError("Failed to process image. Please try again.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeAt = (index) => {
    const list = Array.isArray(value) ? value : [];
    onChange(list.filter((_, i) => i !== index));
  };

  const inputClass =
    "w-full bg-gray-50 p-3 rounded-xl border-none focus:ring-2 focus:ring-primary text-sm font-medium";

  const renderSingle = () => (
    <div className="space-y-3">
      {value && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Preview"
            className="h-32 w-32 object-cover rounded-xl shadow-md"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Remove image"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-black hover:bg-red-600 transition"
          >
            &times;
          </button>
        </div>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition disabled:opacity-50"
        >
          {busy ? "Processing..." : "Upload Image"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={inputClass}
      />
    </div>
  );

  const renderMultiple = () => {
    const list = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-3">
        {list.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {list.map((src, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-xl overflow-hidden group bg-gray-100"
              >
                <img
                  src={src}
                  alt={`Upload ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  aria-label={`Remove image ${i + 1}`}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-black opacity-0 group-hover:opacity-100 transition"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition disabled:opacity-50"
        >
          {busy ? "Processing..." : "Upload Images"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <textarea
          value={list.join("\n")}
          onChange={(e) => onChange(e.target.value.split("\n"))}
          placeholder={placeholder}
          rows={3}
          className={inputClass}
        />
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-[10px] font-black uppercase text-gray-400 ml-2">
          {label}
        </label>
      )}
      {multiple ? renderMultiple() : renderSingle()}
      {error && <p className="text-red-500 text-xs font-bold mt-1">{error}</p>}
    </div>
  );
};

export default ImageUpload;
```

- [ ] **Step 2: Verify it compiles**

Run from the project root:

```bash
npm run build
```

Expected: Vite build completes successfully with no errors.

- [ ] **Step 3: Lint the new file**

Run:

```bash
npx eslint src/components/Admin/ImageUpload.jsx --max-warnings 0
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Admin/ImageUpload.jsx
git commit -m "feat(admin): add reusable ImageUpload component with URL fallback"
```

---

### Task 4: Wire ImageUpload into all admin forms

**Files:**
- Modify: `src/pages/AdminDashboard.jsx`
- Modify: `src/services/api.js` (no functional change; listed for awareness only — not touched)

**Interfaces:**
- Consumes: `ImageUpload` (default export) from `../components/Admin/ImageUpload` (Task 3).
- Produces: admin forms that persist uploaded base64 data URLs in the existing string fields; destination `gallery` form state becomes a `string[]`.

- [ ] **Step 1: Add the import**

At the top of `AdminDashboard.jsx`, after the existing imports (around line 44), add:

```jsx
import ImageUpload from "../components/Admin/ImageUpload";
```

- [ ] **Step 2: Fix pre-existing lint errors in AdminDashboard.jsx**

These 6 errors exist before this feature and would otherwise fail the `--max-warnings 0` lint gate in Step 10. Fix them:

Line 1 — remove the unused `React` binding:

```jsx
import React, { useState, useEffect } from "react";
```

→

```jsx
import { useState, useEffect } from "react";
```

Line 20 — remove the unused import:

```jsx
  updateInquiryStatus,
```

→ (delete that line from the import list)

Line 1203 — escape the quotes around the JSX expression:

```jsx
                          "{i.message}"
```

→

```jsx
                          &ldquo;{i.message}&rdquo;
```

Line 1293 — escape the quotes around the JSX expression:

```jsx
                          "{selectedInquiry.message}"
```

→

```jsx
                          &ldquo;{selectedInquiry.message}&rdquo;
```

- [ ] **Step 3: Change destination `gallery` form state to an array**

Find the initial state (around line 119-130). Change:

```js
gallery: "",
```

to:

```js
gallery: [],
```

Find `handleDestinationSubmit` (around line 376-379). Change:

```js
      gallery: destinationFormData.gallery
        .split("\n")
        .map((g) => g.trim())
        .filter(Boolean),
```

to:

```js
      gallery: (destinationFormData.gallery || [])
        .map((g) => String(g).trim())
        .filter(Boolean),
```

Find the reset after a successful save (around line 404). Change:

```js
        gallery: "",
```

to:

```js
        gallery: [],
```

Find the Cancel button reset (around line 1753). Change:

```js
                            gallery: "",
```

to:

```js
                            gallery: [],
```

Find the edit handler (around line 1790). Change:

```js
                              gallery: (d.gallery || []).join("\n"),
```

to:

```js
                              gallery: d.gallery || [],
```

- [ ] **Step 4: Replace the Tour Package image URL field**

Find the Tour Package form's "Image URL" input (around line 640-652). Replace the entire `<div className="space-y-2">...</div>` block containing the label "Image URL" and its `<input name="image">` with:

```jsx
                    <ImageUpload
                      label="Image"
                      value={tourFormData.image}
                      onChange={(v) =>
                        setTourFormData({ ...tourFormData, image: v })
                      }
                      required
                      placeholder="Or paste an image URL"
                    />
```

- [ ] **Step 5: Replace the Blog cover image URL field**

Find the Blog form's "Cover Image URL" block (around line 997-1009). Replace the `<div className="space-y-2">...</div>` block containing the label "Cover Image URL" and its `<input name="image">` with:

```jsx
                  <ImageUpload
                    label="Cover Image"
                    value={blogFormData.image}
                    onChange={(v) =>
                      setBlogFormData({ ...blogFormData, image: v })
                    }
                    required
                    placeholder="Or paste an image URL"
                  />
```

- [ ] **Step 6: Replace the Gallery image URL field**

Find the Gallery form's "Image URL" input (around line 1353-1362). Replace the `<div className="flex gap-4">...</div>` block so the input becomes an `ImageUpload` and the submit button stays aligned:

```jsx
                  <div className="flex gap-4 items-start">
                    <div className="flex-1">
                      <ImageUpload
                        label="Image"
                        value={galleryFormData.img}
                        onChange={(v) =>
                          setGalleryFormData({ ...galleryFormData, img: v })
                        }
                        required
                        placeholder="Or paste an image URL"
                      />
                    </div>
                    <Button type="submit" disabled={loading} className="px-10">
                      Upload Asset
                    </Button>
                  </div>
```

- [ ] **Step 7: Replace the Visionary image URL field**

Find the Visionary form's "Image URL" input (around line 1525-1536). Replace the `<div className="space-y-2">...</div>` block containing the label "Image URL" and its `<input name="image">` with:

```jsx
                    <ImageUpload
                      label="Image"
                      value={visionaryFormData.image}
                      onChange={(v) =>
                        setVisionaryFormData({ ...visionaryFormData, image: v })
                      }
                      required
                      placeholder="Or paste an image URL"
                    />
```

- [ ] **Step 8: Replace the Destination hero image and gallery fields**

Find the Destination form's "Hero Image URL" input (around line 1650-1661). Replace the `<div className="space-y-2">...</div>` block containing the label "Hero Image URL" and its `<input name="heroImage">` with:

```jsx
                    <ImageUpload
                      label="Hero Image"
                      value={destinationFormData.heroImage}
                      onChange={(v) =>
                        setDestinationFormData({
                          ...destinationFormData,
                          heroImage: v,
                        })
                      }
                      required
                      placeholder="Or paste an image URL"
                    />
```

Find the "Gallery URLs (One per line)" textarea (around line 1714-1723). Replace the `<div className="space-y-2">...</div>` block containing that label and the `<textarea name="gallery">` with:

```jsx
                    <ImageUpload
                      label="Gallery Images"
                      value={destinationFormData.gallery}
                      onChange={(v) =>
                        setDestinationFormData({
                          ...destinationFormData,
                          gallery: v,
                        })
                      }
                      multiple
                      placeholder="Or paste image URLs, one per line"
                    />
```

- [ ] **Step 9: Replace the Testimonial avatar URL field**

Find the Testimonial form's "Avatar URL (optional)" input (around line 1876-1886). Replace the `<div className="space-y-2">...</div>` block containing that label and its `<input name="image">` with:

```jsx
                    <ImageUpload
                      label="Avatar"
                      value={testimonialFormData.image}
                      onChange={(v) =>
                        setTestimonialFormData({ ...testimonialFormData, image: v })
                      }
                      placeholder="Or paste an image URL"
                    />
```

- [ ] **Step 10: Build, lint, and run tests**

Run from the project root:

```bash
npm run build
```

Expected: Vite build succeeds.

```bash
npx eslint src/pages/AdminDashboard.jsx src/components/Admin/ImageUpload.jsx src/components/Admin/imageUtils.js --max-warnings 0
```

Expected: no errors (pre-existing unrelated lint errors in other files are out of scope).

```bash
node --test src/components/Admin/imageUtils.test.mjs
```

Expected: all 6 tests PASS.

- [ ] **Step 11: Commit**

```bash
git add src/pages/AdminDashboard.jsx
git commit -m "feat(admin): support device image uploads across all admin forms"
```

---

### Task 5: End-to-end verification

**Files:**
- None (verification only).

**Interfaces:**
- Consumes: the full feature from Tasks 1-4.

- [ ] **Step 1: Start the full stack**

Start MongoDB (ephemeral in-memory instance) and the backend + frontend, or reuse the existing local setup (`npm run dev` with a running MongoDB). Confirm both servers respond.

- [ ] **Step 2: Manually verify each admin form**

Open the admin dashboard at `http://localhost:5173/login` (local creds come from `.env`), then for each section upload an image, save, and reload the page:

1. **Tour Packages** — upload image, save; confirm thumbnail shows on the package card after reload.
2. **Blogs** — upload cover image, save; confirm it shows on the blog card.
3. **Gallery** (Best Places) — upload image, save; confirm it appears in the gallery grid and on `/best-places`.
4. **Visionaries** — upload image, save; confirm avatar renders.
5. **Destinations** — upload hero image and multiple gallery images, save; confirm hero + gallery thumbnails render; edit the destination and confirm gallery values reload as thumbnails.
6. **Testimonials** — upload avatar (optional), save; confirm it renders.

- [ ] **Step 3: Verify URL fallback still works**

In at least one single-mode form, clear the image and paste `https://images.unsplash.com/photo-1504735012399-55f659e1e78b?w=400&auto=format&fit=crop`, save, and confirm it renders.

- [ ] **Step 4: Verify error handling**

- Try uploading a non-image file (e.g. a `.txt`) — expect an inline error "Unsupported file type..." and the form value unchanged.
- Try uploading a file larger than 8MB — expect an inline error "File is too large..." and the value unchanged.
- In a multiple-mode field, remove a thumbnail and confirm the array updates and the textarea re-syncs.

- [ ] **Step 5: Final lint and build gate**

Run:

```bash
npm run build
npx eslint src/components/Admin/ImageUpload.jsx src/components/Admin/imageUtils.js src/components/Admin/imageUtils.test.mjs --max-warnings 0
node --test src/components/Admin/imageUtils.test.mjs
```

Expected: build succeeds, no lint errors, tests pass.

- [ ] **Step 6: Commit any verification fixes**

If any step revealed a bug, fix it and commit:

```bash
git add -A
git commit -m "fix(admin): resolve image upload edge cases found in verification"
```

(If no fixes were needed, skip this step.)
