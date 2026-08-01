import { HttpStatus } from '../constants/http.constants';
import { AppError } from './AppError';

/**
 * Resource not found error.
 */
export class NotFoundError extends AppError {
  constructor(resource = 'Resource', identifier?: string) {
    const message = identifier
      ? `${resource} with identifier "${identifier}" was not found`
      : `${resource} was not found`;
    super(message, HttpStatus.NOT_FOUND, 'NOT_FOUND');
  }
}
