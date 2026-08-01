import rateLimit from 'express-rate-limit';
import type { Request, Response } from 'express';

import { env } from '../config/env.config';
import { HttpStatus } from '../constants/http.constants';

const rateLimitHandler = (_req: Request, res: Response): void => {
  res.status(HttpStatus.TOO_MANY_REQUESTS).json({
    success: false,
    message: 'Too many requests. Please try again later.',
    error: { code: 'TOO_MANY_REQUESTS' },
    timestamp: new Date().toISOString(),
  });
};

/**
 * General API rate limiter (100 req / 15 min by default).
 */
export const apiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skip: (req) => req.method === 'OPTIONS',
});

/**
 * Strict rate limiter for auth endpoints (10 req / 15 min).
 * Prevents brute-force attacks.
 */
export const authRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  keyGenerator: (req) => {
    // Key by IP + email to prevent distributed attacks
    const email = (req.body as { email?: string })?.email ?? '';
    return `${req.ip}:${email}`;
  },
});

/**
 * File upload rate limiter (5 uploads / 15 min per user).
 */
export const uploadRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});
