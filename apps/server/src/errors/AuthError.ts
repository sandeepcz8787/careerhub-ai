import { HttpStatus } from '../constants/http.constants';
import { AppError } from './AppError';
import type { ErrorCodeType } from '../constants/error.constants';

/**
 * Authentication and authorization errors.
 */
export class AuthError extends AppError {
  constructor(
    message: string,
    code: ErrorCodeType = 'AUTH_TOKEN_INVALID',
    statusCode: number = HttpStatus.UNAUTHORIZED,
  ) {
    super(message, statusCode, code);
  }

  static invalidCredentials(): AuthError {
    return new AuthError('Invalid email or password', 'AUTH_INVALID_CREDENTIALS');
  }

  static tokenExpired(): AuthError {
    return new AuthError('Access token has expired', 'AUTH_TOKEN_EXPIRED');
  }

  static tokenInvalid(): AuthError {
    return new AuthError('Access token is invalid', 'AUTH_TOKEN_INVALID');
  }

  static tokenMissing(): AuthError {
    return new AuthError('Access token is missing', 'AUTH_TOKEN_MISSING');
  }

  static insufficientPermissions(): AuthError {
    return new AuthError(
      'You do not have permission to perform this action',
      'AUTH_INSUFFICIENT_PERMISSIONS',
      HttpStatus.FORBIDDEN,
    );
  }

  static accountSuspended(): AuthError {
    return new AuthError(
      'Your account has been suspended. Please contact support.',
      'AUTH_ACCOUNT_SUSPENDED',
      HttpStatus.FORBIDDEN,
    );
  }

  static emailNotVerified(): AuthError {
    return new AuthError(
      'Please verify your email address before continuing.',
      'AUTH_EMAIL_NOT_VERIFIED',
      HttpStatus.FORBIDDEN,
    );
  }
}
