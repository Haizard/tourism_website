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
