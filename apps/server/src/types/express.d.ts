import type { AccessTokenPayload } from '@careerhub/shared';

declare global {
  namespace Express {
    interface Request {
      /**
       * Authenticated user payload from JWT verification.
       * Populated by `authMiddleware` or `optionalAuthMiddleware`.
       */
      user?: AccessTokenPayload;

      /**
       * Unique request identifier (populated by request ID middleware).
       */
      requestId?: string;
    }
  }
}

export {};
