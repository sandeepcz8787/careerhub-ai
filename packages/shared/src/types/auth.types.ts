import type { ObjectId } from './common.types';
import type { UserRole } from './user.types';

/** JWT access token payload */
export interface AccessTokenPayload {
  sub: ObjectId;       // userId
  email: string;
  role: UserRole;
  sessionId: string;
  iat?: number;
  exp?: number;
}

/** JWT refresh token payload */
export interface RefreshTokenPayload {
  sub: ObjectId;       // userId
  sessionId: string;
  tokenVersion: number;
  iat?: number;
  exp?: number;
}

/** Auth tokens returned to client */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

/** Login response */
export interface AuthResponse {
  user: {
    id: ObjectId;
    email: string;
    role: UserRole;
    profile: {
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    };
  };
  tokens: AuthTokens;
}

/** OTP purpose */
export enum OtpPurpose {
  EMAIL_VERIFICATION = 'email_verification',
  PASSWORD_RESET = 'password_reset',
  LOGIN = 'login',
  PHONE_VERIFICATION = 'phone_verification',
}

/** OAuth state parameter (CSRF protection) */
export interface OAuthState {
  provider: string;
  redirectUri: string;
  csrfToken: string;
}
