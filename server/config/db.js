import mongoose from 'mongoose';
import fs from 'node:fs';
import path from 'node:path';
import { env } from './env.js';

let localMongoServer = null;

export async function connectDatabase() {
  mongoose.set('strictQuery', true);

  console.log('[FCIT DB] Connecting to MongoDB...');

  try {
    await mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: env.enableLocalMongoFallback ? 2500 : 10000,
    });
    console.log(`[FCIT DB] Connected successfully to database: "${mongoose.connection.name}"`);
    return mongoose.connection;
  } catch (err) {
    if (!env.enableLocalMongoFallback) {
      console.error(`[FCIT DB] Connection failed: ${err.name} - ${err.message}`);
      if (env.mongodbUri.includes('127.0.0.1') || env.mongodbUri.includes('localhost')) {
        console.error(
          '\n====================================================================\n' +
          '[FCIT DB] FATAL: MONGODB_URI is pointing to localhost (127.0.0.1:27017).\n' +
          'In Render / production, set MONGODB_URI in your dashboard (Environment tab)\n' +
          'to your MongoDB Atlas URI: mongodb+srv://<user>:<pass>@cluster0.xxxx.mongodb.net/fcit_db\n' +
          '====================================================================\n'
        );
      } else if (err.message.includes('bad auth') || err.message.includes('Authentication failed')) {
        console.error(
          '\n====================================================================\n' +
          '[FCIT DB] FATAL: Database authentication failed.\n' +
          'Check that the username and password in MONGODB_URI match your MongoDB Atlas user.\n' +
          '====================================================================\n'
        );
      } else if (
        err.name === 'MongoNetworkError' ||
        err.message.includes('SSL') ||
        err.message.includes('alert') ||
        err.name === 'MongooseServerSelectionError'
      ) {
        console.error(
          '\n====================================================================\n' +
          '[FCIT DB] FATAL: Network connection / SSL handshake failed.\n' +
          'Make sure you have added 0.0.0.0/0 (Allow Access from Anywhere)\n' +
          'in MongoDB Atlas -> Security -> Network Access tab!\n' +
          '====================================================================\n'
        );
      }
      throw err;
    }

    console.warn(
      `[FCIT DB] Could not reach ${env.mongodbUri}. Starting persistent local development MongoDB fallback...`
    );

    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const dbPath = path.join(env.serverRoot, '.data', 'mongodb');
    fs.mkdirSync(dbPath, { recursive: true });

    localMongoServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'fcit_db',
        dbPath,
        storageEngine: 'wiredTiger',
      },
    });

    const fallbackUri = localMongoServer.getUri('fcit_db');
    await mongoose.connect(fallbackUri);
    console.log(
      `[FCIT DB] Connected to persistent local MongoDB (${dbPath})`
    );
    return mongoose.connection;
  }
}

export async function disconnectDatabase() {
  if (localMongoServer && mongoose.connection.readyState === 1) {
    try {
      // Force WiredTiger checkpoint and graceful shutdown on Windows so local dev records persist
      await mongoose.connection.db.admin().command({ fsync: 1 });
      await mongoose.connection.db.admin().command({ shutdown: 1, force: true, timeoutSecs: 2 });
    } catch {
      // Expected socket close once mongod completes graceful shutdown
    }
  }
  await mongoose.disconnect().catch(() => {});
  if (localMongoServer) {
    await localMongoServer.stop({ doCleanup: false }).catch(() => {});
    localMongoServer = null;
  }
}
