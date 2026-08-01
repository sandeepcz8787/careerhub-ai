import type { ObjectId, ISODateString } from './common.types';
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
  tokenId: string;     // RefreshToken document ID for rotation tracking
  iat?: number;
  exp?: number;
}

/** Auth tokens returned to client */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

/** User summary in auth responses */
export interface AuthUserSummary {
  id: ObjectId;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  profile: {
    firstName: string;
    lastName: string;
    displayName: string;
    avatarUrl: string | null;
  };
}

/** Login / Registration response */
export interface AuthResponse {
  user: AuthUserSummary;
  tokens: AuthTokens;
  sessionId: string;
}

/** OTP purpose */
export enum OtpPurpose {
  EMAIL_VERIFICATION = 'email_verification',
  PASSWORD_RESET = 'password_reset',
  LOGIN = 'login',
  PHONE_VERIFICATION = 'phone_verification',
}

/** Device information parsed from request User-Agent */
export interface DeviceInfo {
  browser: string;
  os: string;
  device: string;
  type: 'desktop' | 'mobile' | 'tablet' | 'unknown';
}

/** User active session details */
export interface UserSession {
  id: ObjectId;
  userId: ObjectId;
  ipAddress: string;
  userAgent: string;
  deviceInfo: DeviceInfo;
  location?: string;
  isCurrentSession?: boolean;
  lastSeenAt: ISODateString;
  createdAt: ISODateString;
}

/** OAuth state parameter (CSRF protection) */
export interface OAuthState {
  provider: string;
  redirectUri: string;
  csrfToken: string;
}
