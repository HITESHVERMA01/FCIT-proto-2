import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import fs from 'node:fs';
import path from 'node:path';
import { env } from './config/env.js';
import apiRoutes from './routes/index.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);

  const cspDirectives = helmet.contentSecurityPolicy.getDefaultDirectives();
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: {
        directives: {
          ...cspDirectives,
          'img-src': ["'self'", 'data:', 'blob:', 'https:'],
          'upgrade-insecure-requests': env.isProd ? [] : null,
        },
      },
    })
  );

  const configuredOrigins = env.clientOrigin
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const devOrigins = env.isProd
    ? []
    : [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:4173',
        'http://127.0.0.1:4173',
        `http://localhost:${env.port}`,
        `http://127.0.0.1:${env.port}`,
      ];
  const allowedOrigins = Array.from(new Set([...configuredOrigins, ...devOrigins]));

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    })
  );

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieParser());

  // Ensure upload directory exists and serve safely
  fs.mkdirSync(env.uploadDir, { recursive: true });
  app.use(
    '/uploads',
    (_req, res, next) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      next();
    },
    express.static(env.uploadDir, {
      maxAge: '7d',
      index: false,
    })
  );

  app.use('/api', apiLimiter, apiRoutes);

  // Serve built SPA if present without intercepting /api or /uploads routes
  const clientDistDir = path.resolve(env.serverRoot, '..', 'client', 'dist');
  const clientIndexHtml = path.join(clientDistDir, 'index.html');
  if (fs.existsSync(clientIndexHtml)) {
    app.use(express.static(clientDistDir, { index: false }));
    app.get(/^(?!\/(?:api|uploads)(?:\/|$)).*/, (_req, res) => {
      res.sendFile(clientIndexHtml);
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
