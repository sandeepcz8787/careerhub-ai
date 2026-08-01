import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';

import { corsOptions } from './config/cors.config';
import { env } from './config/env.config';
import { apiRateLimiter } from './middlewares/rateLimit.middleware';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { notFoundMiddleware } from './middlewares/notFound.middleware';
import { errorMiddleware } from './middlewares/error.middleware';
import apiRouter from './routes';

/**
 * Express application factory.
 * Separated from server.ts so it can be imported in tests without starting HTTP.
 */
export function createApp(): express.Application {
  const app = express();

  // ─────────────────────────────────────────────────────────────────────────
  // Security Middleware
  // ─────────────────────────────────────────────────────────────────────────

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  app.use(cors(corsOptions));

  // ─────────────────────────────────────────────────────────────────────────
  // Request Parsing
  // ─────────────────────────────────────────────────────────────────────────

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser(env.COOKIE_SECRET));
  app.use(compression());

  // ─────────────────────────────────────────────────────────────────────────
  // Request Tracing
  // ─────────────────────────────────────────────────────────────────────────

  app.use((req, _res, next) => {
    req.requestId = (req.headers['x-request-id'] as string | undefined) ?? crypto.randomUUID();
    next();
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Logging
  // ─────────────────────────────────────────────────────────────────────────

  app.use(loggerMiddleware);

  // ─────────────────────────────────────────────────────────────────────────
  // Rate Limiting
  // ─────────────────────────────────────────────────────────────────────────

  app.use('/api', apiRateLimiter);

  // ─────────────────────────────────────────────────────────────────────────
  // Trust Proxy (required for rate limiting behind Render/Vercel)
  // ─────────────────────────────────────────────────────────────────────────

  app.set('trust proxy', 1);

  // ─────────────────────────────────────────────────────────────────────────
  // API Routes
  // ─────────────────────────────────────────────────────────────────────────

  app.use('/api/v1', apiRouter);

  // ─────────────────────────────────────────────────────────────────────────
  // 404 Handler (must come after all routes)
  // ─────────────────────────────────────────────────────────────────────────

  app.use(notFoundMiddleware);

  // ─────────────────────────────────────────────────────────────────────────
  // Global Error Handler (must be last)
  // ─────────────────────────────────────────────────────────────────────────

  app.use(errorMiddleware);

  return app;
}
