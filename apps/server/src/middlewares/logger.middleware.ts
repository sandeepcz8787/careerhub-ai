import morgan from 'morgan';
import type { Request, Response } from 'express';

import { logger } from '../utils/logger.util';
import { env } from '../config/env.config';

/**
 * Morgan HTTP request logger middleware.
 * Dev: colorized concise output.
 * Production: JSON stream to winston.
 */
const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

const skip = (req: Request, res: Response): boolean => {
  // Skip health check logs to reduce noise
  if (req.url === '/api/v1/health') { return true; }
  // In test environment, suppress all logs
  if (env.NODE_ENV === 'test') { return true; }
  return false;
};

export const loggerMiddleware = morgan(
  env.NODE_ENV === 'production'
    ? ':remote-addr :method :url :status :res[content-length] - :response-time ms'
    : ':method :url :status :response-time ms',
  { stream, skip },
);
