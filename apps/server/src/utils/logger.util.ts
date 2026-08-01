import winston from 'winston';
import path from 'path';

import { env } from '../config/env.config';

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

/**
 * Console format for development — human-readable, colorized.
 */
const developmentFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${String(timestamp)} [${level}]: ${String(message)}${metaStr}${stack ? `\n${String(stack)}` : ''}`;
  }),
);

/**
 * JSON format for production — structured, parseable by log aggregators.
 */
const productionFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json(),
);

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: env.NODE_ENV === 'production' ? productionFormat : developmentFormat,
  }),
];

// Add file transports in production
if (env.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({
      filename: path.join(env.LOG_DIR, 'error.log'),
      level: 'error',
      format: productionFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      tailable: true,
    }),
    new winston.transports.File({
      filename: path.join(env.LOG_DIR, 'combined.log'),
      format: productionFormat,
      maxsize: 10 * 1024 * 1024,
      maxFiles: 10,
      tailable: true,
    }),
  );
}

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  transports,
  exitOnError: false,
});
