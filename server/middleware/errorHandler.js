import multer from 'multer';
import { env } from '../config/env.js';

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(err, req, res, _next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'An unexpected server error occurred.';
  let details = err.details || null;

  if (err instanceof multer.MulterError) {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = `Upload failed. File exceeds the ${Math.round(env.maxUploadBytes / (1024 * 1024))} MB limit.`;
    } else {
      message = `Upload failed. ${err.message}`;
    }
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid record identifier format.';
  }

  if (err.code === 11000) {
    statusCode = 409;
    const duplicateKey = Object.keys(err.keyPattern || {})[0] || 'record';
    message = `A record with this ${duplicateKey} already exists.`;
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Database validation failed.';
    details = Object.values(err.errors || {}).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  if (statusCode >= 500 && env.isProd) {
    message = 'An internal server error occurred. Please try again shortly.';
    details = null;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
  });
}
