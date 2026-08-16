import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateImageFile,
  compressImageFile,
  ACCEPTED_TYPES,
  MAX_SOURCE_SIZE,
} from './imageUtils.js';

function installBrowserMocks({
  readResult,
  imgWidth,
  imgHeight,
  imgDecodeError,
  webpSupported,
  canvases,
} = {}) {
  globalThis.FileReader = class {
    readAsDataURL() {
      if (readResult instanceof Error) {
        if (this.onerror) this.onerror();
      } else {
        this.result = readResult;
        if (this.onload) this.onload();
      }
    }
  };
  globalThis.Image = class {
    set src(value) {
      if (imgDecodeError) {
        if (this.onerror) this.onerror();
      } else {
        this.width = imgWidth;
        this.height = imgHeight;
        if (this.onload) this.onload();
      }
    }
  };
  globalThis.document = {
    createElement: () => {
      const canvas = {
        width: 0,
        height: 0,
        toDataURL: (format) => {
          if (format === 'image/webp') {
            return webpSupported
              ? 'data:image/webp;base64,webp'
              : 'data:image/png;base64,png';
          }
          return 'data:image/jpeg;base64,jpeg';
        },
      };
      canvas.getContext = () => ({ drawImage() {} });
      if (canvases) canvases.push(canvas);
      return canvas;
    },
  };
}

function uninstallBrowserMocks() {
  delete globalThis.FileReader;
  delete globalThis.Image;
  delete globalThis.document;
}

beforeEach(() => uninstallBrowserMocks());
afterEach(() => uninstallBrowserMocks());

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

test('compressImageFile passes through GIF files unchanged', async () => {
  installBrowserMocks({ readResult: 'data:image/gif;base64,AAAA' });
  const res = await compressImageFile({ type: 'image/gif', size: 1024 });
  assert.equal(res.ok, true);
  assert.equal(res.dataUrl, 'data:image/gif;base64,AAAA');
});

test('compressImageFile downscales to max dimension and uses webp', async () => {
  const canvases = [];
  installBrowserMocks({
    readResult: 'data:image/jpeg;base64,AAAA',
    imgWidth: 3200,
    imgHeight: 1600,
    webpSupported: true,
    canvases,
  });
  const res = await compressImageFile({ type: 'image/jpeg', size: 1024 });
  assert.equal(res.ok, true);
  assert.match(res.dataUrl, /^data:image\/webp/);
  assert.equal(canvases[0].width, 1600);
  assert.equal(canvases[0].height, 800);
});

test('compressImageFile falls back to jpeg when webp is unsupported', async () => {
  installBrowserMocks({
    readResult: 'data:image/jpeg;base64,AAAA',
    imgWidth: 800,
    imgHeight: 600,
    webpSupported: false,
  });
  const res = await compressImageFile({ type: 'image/png', size: 1024 });
  assert.equal(res.ok, true);
  assert.match(res.dataUrl, /^data:image\/jpeg/);
});

test('compressImageFile returns error on image decode failure', async () => {
  installBrowserMocks({
    readResult: 'data:image/jpeg;base64,AAAA',
    imgDecodeError: true,
  });
  const res = await compressImageFile({ type: 'image/jpeg', size: 1024 });
  assert.equal(res.ok, false);
  assert.match(res.error, /Failed to process image/);
});

test('compressImageFile rejects invalid files without touching browser APIs', async () => {
  const res = await compressImageFile({ type: 'application/pdf', size: 1024 });
  assert.equal(res.ok, false);
  assert.match(res.error, /Unsupported file type/);
});
