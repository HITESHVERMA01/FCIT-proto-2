import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { createApp } from './app.js';

async function bootstrap() {
  await connectDatabase();
  const app = createApp();

  const server = app.listen(env.port, () => {
    console.log(
      `[FCIT API] Server listening on http://localhost:${env.port} (${env.nodeEnv})`
    );
  });

  const shutdown = async (signal) => {
    console.log(`[FCIT API] Received ${signal}. Closing cleanly...`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

bootstrap().catch((err) => {
  console.error('[FCIT API] Failed to start server:', err);
  process.exit(1);
});
