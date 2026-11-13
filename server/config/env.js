import dotenv from 'dotenv';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(serverRoot, '..');

// Load server/.env first, falling back to repo root .env if present
dotenv.config({ path: path.join(serverRoot, '.env') });
dotenv.config({ path: path.join(repoRoot, '.env') });

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

let jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.startsWith('replace_with_') || jwtSecret.length < 32) {
  jwtSecret = crypto.randomBytes(48).toString('hex');
  console.warn(
    '[FCIT Config] WARNING: No valid JWT_SECRET provided. Using generated secret for this session. Add JWT_SECRET in environment variables to persist sessions across restarts.'
  );
}

function sanitizeMongoUri(raw) {
  if (!raw) return 'mongodb://127.0.0.1:27017/fcit_db';
  let uri = raw.trim().replace(/^['"]|['"]$/g, '');
  // Auto-strip accidental documentation angle brackets: <password>
  uri = uri.replace(/:(<)([^>@]+)(>)@/, ':$2@');
  // Auto-ensure database name if omitted or trailing slash
  const match = uri.match(/^(mongodb(?:\+srv)?:\/\/[^/]+)(\/)?([^?]*)(.*)$/);
  if (match) {
    const base = match[1];
    let db = match[3];
    const query = match[4] || '';
    if (!db) db = 'fcit_db';
    uri = base + '/' + db + (query ? query : '?retryWrites=true&w=majority');
  }
  return uri;
}

const rawMongoUri =
  process.env.MONGODB_URI ||
  process.env.mongodb_uri ||
  process.env.MONGODB_URL ||
  process.env.mongodb_url ||
  process.env.DATABASE_URL ||
  '';

export const env = {
  nodeEnv,
  isProd,
  port: Number(process.env.PORT || 5000),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  mongodbUri: sanitizeMongoUri(rawMongoUri),
  enableLocalMongoFallback:
    process.env.ENABLE_LOCAL_MONGO_FALLBACK !== 'false' && !isProd,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieName: process.env.COOKIE_NAME || 'fcit_session',
  storageProvider: process.env.STORAGE_PROVIDER || 'local',
  uploadDir: path.resolve(serverRoot, process.env.UPLOAD_DIR || 'uploads'),
  maxUploadBytes: Number(process.env.MAX_UPLOAD_MB || 5) * 1024 * 1024,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
  cloudinaryFolder: process.env.CLOUDINARY_FOLDER || 'fcit-archive',
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpSecure: process.env.SMTP_SECURE === 'true',
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  contactRecipientEmail: process.env.CONTACT_RECIPIENT_EMAIL || '',
  serverRoot,
};
