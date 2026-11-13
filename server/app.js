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
  const devOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173',
    'http://127.0.0.1:4173',
    `http://localhost:${env.port}`,
    `http://127.0.0.1:${env.port}`,
  ];
  const staticOrigins = new Set([...configuredOrigins, ...devOrigins]);

  const isOriginAllowed = (origin) => {
    // Mobile apps, curl, server-to-server have no origin
    if (!origin) return true;
    if (staticOrigins.has(origin)) return true;
    // Allow any Vercel domain (e.g. production or preview deployments)
    if (/^https:\/\/([a-zA-Z0-9_-]+\.)*vercel\.app$/.test(origin)) return true;
    // Allow localhost or 127.0.0.1
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
    // Allow Render domains
    if (/^https:\/\/([a-zA-Z0-9_-]+\.)*onrender\.com$/.test(origin)) return true;
    return false;
  };

  app.use(
    cors({
      origin: (origin, callback) => {
        if (isOriginAllowed(origin)) {
          return callback(null, true);
        }
        return callback(null, false);
      },
      credentials: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
      exposedHeaders: ['Content-Range', 'X-Content-Range'],
      maxAge: 86400,
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
