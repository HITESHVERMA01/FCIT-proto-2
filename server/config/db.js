import mongoose from 'mongoose';
import fs from 'node:fs';
import path from 'node:path';
import { env } from './env.js';

let localMongoServer = null;

export async function connectDatabase() {
  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: env.enableLocalMongoFallback ? 2500 : 10000,
    });
    console.log(`[FCIT DB] Connected to MongoDB (${mongoose.connection.name})`);
    return mongoose.connection;
  } catch (err) {
    if (!env.enableLocalMongoFallback) {
      if (env.mongodbUri.includes('127.0.0.1') || env.mongodbUri.includes('localhost')) {
        console.error(
          '\n====================================================================\n' +
          '[FCIT DB] FATAL: Failed to connect to local MongoDB (127.0.0.1:27017).\n' +
          'If you are deploying to Render or another cloud host, you must configure\n' +
          'the MONGODB_URI environment variable in your hosting dashboard with your\n' +
          'MongoDB Atlas connection string: mongodb+srv://.../fcit_db\n' +
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
