import type { CorsOptions } from 'cors';

import { env } from './env.config';
import { logger } from '../utils/logger.util';

/**
 * CORS configuration.
 * Dynamically validates origin against the allowed origins whitelist.
 */
export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server requests (no origin) in development
    if (!origin && env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    if (!origin) {
      return callback(new Error('No origin header — request blocked'));
    }

    if (env.ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    logger.warn(`CORS blocked origin: ${origin}`);
    return callback(new Error(`CORS policy: Origin ${origin} is not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Request-ID',
  ],
  exposedHeaders: ['X-Request-ID', 'X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  maxAge: 86_400, // 24 hours preflight cache
};
