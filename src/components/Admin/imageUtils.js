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

  try {
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
  } catch (error) {
    return { ok: false, error: 'Failed to process image. Please try again.', dataUrl: null };
  }
}
