import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import { AppError } from '../errors/AppError';
import { ValidationError } from '../errors/ValidationError';
import { HttpStatus } from '../constants/http.constants';
import { logger } from '../utils/logger.util';
import { env } from '../config/env.config';

/**
 * Centralized error handling middleware.
 * Must be registered LAST in the Express middleware chain.
 */
export function errorMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Normalize to AppError
  let appError: AppError;

  if (error instanceof AppError) {
    appError = error;
  } else if (error instanceof mongoose.Error.ValidationError) {
    // Mongoose validation error
    appError = new ValidationError('Database validation failed', [
      ...Object.values(error.errors).map((e) => ({
        field: e.path,
        message: e.message,
        code: 'mongoose_validation',
      })),
    ]);
  } else if ((error as NodeJS.ErrnoException).code === 11000) {
    // MongoDB duplicate key error
    appError = new AppError(
      'A record with this value already exists',
      HttpStatus.CONFLICT,
      'CONFLICT',
    );
  } else if (error.name === 'SyntaxError' && 'body' in error) {
    // JSON parse error
    appError = new AppError('Invalid JSON in request body', HttpStatus.BAD_REQUEST, 'VALIDATION_ERROR');
  } else {
    // Unknown / programming error
    appError = new AppError(
      env.NODE_ENV === 'production' ? 'An unexpected error occurred' : error.message,
      HttpStatus.INTERNAL_SERVER_ERROR,
      'INTERNAL_SERVER_ERROR',
      undefined,
      false,
    );
  }

  // Log non-operational errors (programming errors) at error level
  if (!appError.isOperational) {
    logger.error('Non-operational error caught:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
  } else {
    logger.warn('Operational error:', {
      message: appError.message,
      code: appError.code,
      statusCode: appError.statusCode,
    });
  }

  // Send response
  res.status(appError.statusCode).json({
    success: false,
    message: appError.message,
    error: {
      code: appError.code,
      ...(appError instanceof ValidationError && {
        details: appError.validationErrors,
      }),
      ...(env.NODE_ENV === 'development' && {
        stack: error.stack,
      }),
    },
    timestamp: new Date().toISOString(),
  });
}
