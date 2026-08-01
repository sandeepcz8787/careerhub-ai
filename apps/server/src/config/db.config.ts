import mongoose from 'mongoose';

import { env } from './env.config';
import { logger } from '../utils/logger.util';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

/**
 * Connect to MongoDB Atlas with automatic retry logic.
 * Registers connection lifecycle event handlers.
 */
export async function connectDatabase(): Promise<void> {
  mongoose.set('strictQuery', true);

  // Connection event handlers
  mongoose.connection.on('connected', () => {
    logger.info('✅ MongoDB connected successfully');
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('⚠️  MongoDB disconnected');
  });

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error:', err);
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed on app termination');
    process.exit(0);
  });

  await connectWithRetry(MAX_RETRIES);
}

async function connectWithRetry(retriesLeft: number): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45_000,
      connectTimeoutMS: 10_000,
      serverSelectionTimeoutMS: 10_000,
    });
  } catch (error) {
    if (retriesLeft === 0) {
      logger.error('❌ MongoDB connection failed after maximum retries. Exiting.');
      process.exit(1);
    }
    logger.warn(
      `MongoDB connection failed. Retrying in ${RETRY_DELAY_MS / 1000}s... (${retriesLeft} retries left)`,
    );
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    await connectWithRetry(retriesLeft - 1);
  }
}

export { mongoose };
