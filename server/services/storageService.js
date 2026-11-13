import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { URLSearchParams } from 'node:url';
import { env } from '../config/env.js';
import { detectImageExtension } from '../utils/magicBytes.js';
import { ApiError } from '../utils/apiError.js';

const ALLOWED_FOLDERS = new Set([
  'faculty',
  'team',
  'events',
  'history',
  'gallery',
  'achievements',
  'projects',
  'alumni',
  'general',
]);

class LocalDiskStorageProvider {
  async saveImage(buffer, folder = 'general') {
    const safeFolder = ALLOWED_FOLDERS.has(folder) ? folder : 'general';
    const ext = detectImageExtension(buffer);
    if (!ext) {
      throw new ApiError(
        400,
        'Invalid image content. Upload a genuine JPEG, PNG, or WebP file.'
      );
    }

    const targetDir = path.join(env.uploadDir, safeFolder);
    await fs.mkdir(targetDir, { recursive: true });

    const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${ext}`;
    const fullPath = path.join(targetDir, filename);
    await fs.writeFile(fullPath, buffer);

    return {
      url: `/uploads/${safeFolder}/${filename}`,
      provider: 'local',
      key: `${safeFolder}/${filename}`,
    };
  }

  async deleteImage(urlOrKey) {
    if (!urlOrKey || typeof urlOrKey !== 'string') return;
    if (!urlOrKey.startsWith('/uploads/')) return;

    const relative = urlOrKey.replace(/^\/uploads\//, '');
    const resolved = path.resolve(env.uploadDir, relative);
    const rootResolved = path.resolve(env.uploadDir);

    // Prevent path traversal outside uploads root
    if (!resolved.startsWith(rootResolved + path.sep)) {
      return;
    }

    try {
      await fs.unlink(resolved);
    } catch {
      // Ignore already-deleted files
    }
  }
}

/**
 * Optional zero-dependency Cloudinary adapter used ONLY when
 * STORAGE_PROVIDER=cloudinary and valid API credentials are configured in .env.
 */
class CloudinaryStorageProvider {
  isConfigured() {
    return Boolean(
      env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret
    );
  }

  async saveImage(buffer, folder = 'general') {
    const ext = detectImageExtension(buffer);
    if (!ext) {
      throw new ApiError(
        400,
        'Invalid image content. Upload a genuine JPEG, PNG, or WebP file.'
      );
    }

    const safeFolder = `${env.cloudinaryFolder}/${
      ALLOWED_FOLDERS.has(folder) ? folder : 'general'
    }`;
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = `folder=${safeFolder}&timestamp=${timestamp}${env.cloudinaryApiSecret}`;
    const signature = crypto
      .createHash('sha1')
      .update(paramsToSign)
      .digest('hex');

    const form = new FormData();
    form.append('file', new Blob([buffer], { type: `image/${ext}` }), `upload.${ext}`);
    form.append('api_key', env.cloudinaryApiKey);
    form.append('timestamp', String(timestamp));
    form.append('folder', safeFolder);
    form.append('signature', signature);

    const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(
      env.cloudinaryCloudName
    )}/image/upload`;
    const res = await fetch(endpoint, { method: 'POST', body: form });
    const data = await res.json();
    if (!res.ok || !data?.secure_url) {
      throw new ApiError(502, data?.error?.message || 'Cloudinary upload failed.');
    }

    return {
      url: data.secure_url,
      provider: 'cloudinary',
      key: data.public_id || '',
    };
  }

  async deleteImage(url) {
    if (!url || !url.includes('res.cloudinary.com')) return;
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
    if (!match?.[1]) return;

    const publicId = match[1];
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}${env.cloudinaryApiSecret}`;
    const signature = crypto
      .createHash('sha1')
      .update(paramsToSign)
      .digest('hex');

    const body = new URLSearchParams({
      public_id: publicId,
      api_key: env.cloudinaryApiKey,
      timestamp: String(timestamp),
      signature,
    });
    const endpoint = `https://api.cloudinary.com/v1_1/${encodeURIComponent(
      env.cloudinaryCloudName
    )}/image/destroy`;
    await fetch(endpoint, { method: 'POST', body }).catch(() => {});
  }
}

const localProvider = new LocalDiskStorageProvider();
const cloudinaryProvider = new CloudinaryStorageProvider();

export const storageService =
  env.storageProvider === 'cloudinary' && cloudinaryProvider.isConfigured()
    ? cloudinaryProvider
    : localProvider;
