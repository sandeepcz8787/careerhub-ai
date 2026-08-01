import type { Request, Response, NextFunction } from 'express';

import { verifyAccessToken, extractBearerToken } from '../utils/jwt.util';
import { AuthError } from '../errors/AuthError';
import { UserRole, hasMinimumRole } from '@careerhub/shared';
import type { AccessTokenPayload } from '@careerhub/shared';

/**
 * Augment Express Request with authenticated user data.
 * Declared here — the full declaration is in types/express.d.ts
 */

/**
 * Verify JWT access token and attach user to request.
 */
export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    return next(AuthError.tokenMissing());
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional auth — attaches user if token exists, continues if not.
 * Use for routes that work for both guests and authenticated users.
 */
export function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const token = extractBearerToken(req.headers.authorization);

  if (token) {
    try {
      req.user = verifyAccessToken(token);
    } catch {
      // Non-critical — continue as guest
    }
  }
  next();
}

/**
 * Role-based access control guard.
 * Requires `authMiddleware` to run first.
 *
 * Usage:
 *   router.get('/admin', authMiddleware, requireRole(UserRole.ADMIN), handler)
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

/**
 * Minimum role guard factory (more ergonomic than requireRole for hierarchy checks).
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
