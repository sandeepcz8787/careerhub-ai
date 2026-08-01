import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

import { ValidationError } from '../errors/ValidationError';
import { formatZodErrors } from '@careerhub/shared';

type ValidationTarget = 'body' | 'query' | 'params';

/**
 * Zod request validation middleware factory.
 * Validates the specified part of the request against a Zod schema.
 *
 * Usage:
 *   router.post('/register', validate(registerSchema, 'body'), handler)
 *   router.get('/users', validate(paginationSchema, 'query'), handler)
 */
export function validate<T>(schema: ZodSchema<T>, target: ValidationTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const errors = formatZodErrors(result.error);
      return next(new ValidationError('Validation failed', errors));
    }

    // Replace with parsed/coerced data
    (req as Record<string, unknown>)[target] = result.data;
    next();
  };
}
