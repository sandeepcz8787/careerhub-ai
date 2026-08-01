import 'dotenv/config';
import http from 'http';

import { createApp } from './app';
import { connectDatabase } from './config/db.config';
import { initSocketIO } from './config/socket.config';
import { initCloudinary } from './config/cloudinary.config';
import { initMailer } from './config/nodemailer.config';
import { env } from './config/env.config';
import { logger } from './utils/logger.util';

async function bootstrap(): Promise<void> {
  try {
    // ── Initialize Services ──────────────────────────────────────────────────
    logger.info(`🚀 Starting ${env.APP_NAME} in ${env.NODE_ENV} mode...`);

    // Connect to MongoDB
    await connectDatabase();

    // Initialize external services
    initCloudinary();
    initMailer();

    // ── Create HTTP Server ───────────────────────────────────────────────────
    const app = createApp();
    const httpServer = http.createServer(app);

    // Initialize Socket.io
    initSocketIO(httpServer);

    // ── Start Listening ──────────────────────────────────────────────────────
    httpServer.listen(env.PORT, () => {
      logger.info(`
╔══════════════════════════════════════════════════╗
║          ${env.APP_NAME} — API Server             ║
╠══════════════════════════════════════════════════╣
║  Environment : ${env.NODE_ENV.padEnd(33)}║
║  Port        : ${String(env.PORT).padEnd(33)}║
║  Health      : ${`http://localhost:${env.PORT}/api/v1/health`.padEnd(33)}║
╚══════════════════════════════════════════════════╝
      `);
    });

    // ── Graceful Shutdown ────────────────────────────────────────────────────
    const shutdown = (signal: string): void => {
      logger.info(`\n${signal} received. Shutting down gracefully...`);
      httpServer.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        logger.error('Forcing shutdown after timeout.');
        process.exit(1);
      }, 10_000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle unhandled rejections
    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled rejection:', reason);
      process.exit(1);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught exception:', error);
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

void bootstrap();
