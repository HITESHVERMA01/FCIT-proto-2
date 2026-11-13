import multer from 'multer';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.maxUploadBytes,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      return cb(
        new ApiError(
          400,
          'Unsupported file format. Please upload a JPEG, PNG, or WebP image.'
        )
      );
    }
    return cb(null, true);
  },
});

export const uploadSingleImage = upload.single('image');
