import jwt from 'jsonwebtoken';

import type { AccessTokenPayload, RefreshTokenPayload } from '@careerhub/shared';
import { env } from '../config/env.config';
import { AuthError } from '../errors/AuthError';

/**
 * Sign an access token (short-lived).
 */
export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    issuer: 'careerhub-api',
    audience: 'careerhub-client',
  } as jwt.SignOptions);
}

/**
 * Sign a refresh token (long-lived).
 */
export function signRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    issuer: 'careerhub-api',
    audience: 'careerhub-client',
  } as jwt.SignOptions);
}

/**
 * Verify and decode an access token.
 * Throws AuthError on failure.
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET, {
      issuer: 'careerhub-api',
      audience: 'careerhub-client',
    }) as AccessTokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw AuthError.tokenExpired();
    }
    throw AuthError.tokenInvalid();
  }
}

/**
 * Verify and decode a refresh token.
 * Throws AuthError on failure.
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET, {
      issuer: 'careerhub-api',
      audience: 'careerhub-client',
    }) as RefreshTokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthError('Refresh token has expired', 'AUTH_REFRESH_TOKEN_INVALID');
    }
    throw new AuthError('Refresh token is invalid', 'AUTH_REFRESH_TOKEN_INVALID');
  }
}

/**
 * Extract the bearer token from Authorization header.
 */
export function extractBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader?.startsWith('Bearer ')) { return null; }
  return authHeader.slice(7);
}

/**
 * Calculate access token expiry in seconds.
 */
export function getAccessTokenExpirySeconds(): number {
  const expiresIn = env.JWT_ACCESS_EXPIRES_IN;
  if (expiresIn.endsWith('m')) { return parseInt(expiresIn) * 60; }
  if (expiresIn.endsWith('h')) { return parseInt(expiresIn) * 3600; }
  if (expiresIn.endsWith('d')) { return parseInt(expiresIn) * 86400; }
  return parseInt(expiresIn);
}
