import { HttpStatus } from '../constants/http.constants';
import { AppError } from './AppError';
import type { ValidationErrorDetail } from '@careerhub/shared';

/**
 * Thrown when request body/params fail Zod validation.
 */
export class ValidationError extends AppError {
  public readonly validationErrors: ValidationErrorDetail[];

  constructor(
    message = 'Validation failed',
    errors: ValidationErrorDetail[] = [],
  ) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY, 'VALIDATION_ERROR', errors);
    this.validationErrors = errors;
  }
}
