import type { Request, Response, NextFunction } from 'express';

import { verifyAccessToken, extractBearerToken } from '../utils/jwt.util';
import { SessionService } from '../services/session.service';
import { AuthError } from '../errors/AuthError';
import { UserRole, hasMinimumRole } from '@careerhub/shared';

/**
 * Verify JWT access token and validate active session status.
 */
export async function authMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    return next(AuthError.tokenMissing());
  }

  try {
    const payload = verifyAccessToken(token);

    // Validate that the session has not been revoked or expired
    if (payload.sessionId) {
      const isValidSession = await SessionService.validateSession(payload.sessionId);
      if (!isValidSession) {
        return next(new AuthError('Session has been revoked or expired. Please login again.', 'AUTH_TOKEN_EXPIRED'));
      }
    }

    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
}

/** Alias for authMiddleware */
export const authenticate = authMiddleware;

/**
 * Optional auth — attaches user if valid token & session exists, continues if not.
 */
export async function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const token = extractBearerToken(req.headers.authorization);

  if (token) {
    try {
      const payload = verifyAccessToken(token);
      const isValid = await SessionService.validateSession(payload.sessionId);
      if (isValid) {
        req.user = payload;
      }
    } catch {
      // Non-critical — continue as guest
    }
  }
  next();
}

/**
 * Role-based access control guard.
 * Alias: authorize(...roles)
 */
export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(AuthError.tokenMissing());
    }

    const userRole = req.user.role as UserRole;
    const hasPermission = roles.some((role) => hasMinimumRole(userRole, role));

    if (!hasPermission) {
      return next(AuthError.insufficientPermissions());
    }

    next();
  };
}

/** Alias for requireRole */
export const authorize = requireRole;

/**
 * Minimum role guard factory.
 */
export function requireMinRole(minimumRole: UserRole) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(AuthError.tokenMissing());
    }

    if (!hasMinimumRole(req.user.role as UserRole, minimumRole)) {
      return next(AuthError.insufficientPermissions());
    }

    next();
  };
}
