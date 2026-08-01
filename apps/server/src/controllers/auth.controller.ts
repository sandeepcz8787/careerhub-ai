import type { Request, Response } from 'express';

import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { SessionService } from '../services/session.service';
import { User } from '../models/User.model';
import { asyncHandler } from '../utils/asyncHandler.util';
import { sendSuccess, sendCreated } from '../utils/response.util';
import { AuthError } from '../errors/AuthError';
import { env } from '../config/env.config';
import type {
  RegisterInput,
  LoginInput,
  OtpVerifyInput,
  ResendOtpInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
  GoogleAuthInput,
  OtpPurpose,
} from '@careerhub/shared';

const REFRESH_COOKIE_NAME = 'refreshToken';
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Set HTTP-Only refresh token cookie on response.
 */
function setRefreshTokenCookie(res: Response, refreshToken: string): void {
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    maxAge: COOKIE_MAX_AGE_MS,
    path: '/api/v1/auth',
  });
}

/**
 * Clear refresh token cookie on logout.
 */
function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    path: '/api/v1/auth',
  });
}

export class AuthController {
  /**
   * POST /api/v1/auth/register
   */
  static register = asyncHandler(async (req: Request, res: Response) => {
    const input = req.body as RegisterInput;
    const result = await AuthService.register(input);
    sendCreated(res, result, result.message);
  });

  /**
   * POST /api/v1/auth/login
   */
  static login = asyncHandler(async (req: Request, res: Response) => {
    const input = req.body as LoginInput;
    const result = await AuthService.login(input, req);

    setRefreshTokenCookie(res, result.tokens.refreshToken);
    sendSuccess(res, result, 'Login successful');
  });

  /**
   * POST /api/v1/auth/logout
   */
  static logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = (req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined) ?? req.body?.refreshToken;
    const sessionId = req.user?.sessionId;

    if (sessionId) {
      await AuthService.logout(sessionId, refreshToken);
    }

    clearRefreshTokenCookie(res);
    sendSuccess(res, null, 'Logged out successfully');
  });

  /**
   * POST /api/v1/auth/google
   */
  static googleAuth = asyncHandler(async (req: Request, res: Response) => {
    const { idToken } = req.body as GoogleAuthInput;
    const result = await AuthService.googleAuth(idToken, req);

    setRefreshTokenCookie(res, result.tokens.refreshToken);
    sendSuccess(res, result, 'Google authentication successful');
  });

  /**
   * POST /api/v1/auth/send-otp
   */
  static sendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email, purpose } = req.body as { email: string; purpose: OtpPurpose };
    const result = await AuthService.resendOtp(email, purpose);
    sendSuccess(res, result, result.message);
  });

  /**
   * POST /api/v1/auth/verify-otp
   */
  static verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body as OtpVerifyInput;
    const result = await AuthService.verifyEmailOtp(email, otp, req);

    setRefreshTokenCookie(res, result.tokens.refreshToken);
    sendSuccess(res, result, 'Email verified successfully');
  });

  /**
   * POST /api/v1/auth/resend-otp
   */
  static resendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email, purpose } = req.body as ResendOtpInput;
    const result = await AuthService.resendOtp(email, purpose);
    sendSuccess(res, result, result.message);
  });

  /**
   * POST /api/v1/auth/forgot-password
   */
  static forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body as ForgotPasswordInput;
    const result = await AuthService.forgotPassword(email);
    sendSuccess(res, result, result.message);
  });

  /**
   * POST /api/v1/auth/reset-password
   */
  static resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, password } = req.body as ResetPasswordInput;
    const result = await AuthService.resetPassword(token, password);
    clearRefreshTokenCookie(res);
    sendSuccess(res, result, result.message);
  });

  /**
   * POST /api/v1/auth/change-password
   */
  static changePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.sub;
    const currentSessionId = req.user!.sessionId;
    const input = req.body as ChangePasswordInput;

    const result = await AuthService.changePassword(userId, input, currentSessionId);
    sendSuccess(res, result, result.message);
  });

  /**
   * POST /api/v1/auth/refresh-token
   */
  static refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const incomingToken =
      (req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined) ??
      (req.body as { refreshToken?: string })?.refreshToken;

    if (!incomingToken) {
      throw AuthError.tokenMissing();
    }

    const newTokens = await TokenService.rotateRefreshToken(incomingToken);
    setRefreshTokenCookie(res, newTokens.refreshToken);

    sendSuccess(res, { tokens: newTokens }, 'Token refreshed successfully');
  });

  /**
   * GET /api/v1/auth/me
   */
  static getMe = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.sub;
    const user = await User.findById(userId);

    if (!user) {
      throw AuthError.tokenInvalid();
    }

    sendSuccess(
      res,
      {
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          status: user.status,
          isEmailVerified: user.isEmailVerified,
          profile: user.profile,
          createdAt: user.createdAt,
        },
      },
      'User profile fetched successfully',
    );
  });

  /**
   * GET /api/v1/auth/sessions
   */
  static getSessions = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.sub;
    const currentSessionId = req.user!.sessionId;

    const sessions = await SessionService.getUserSessions(userId, currentSessionId);
    sendSuccess(res, sessions, 'Active sessions retrieved successfully');
  });

  /**
   * DELETE /api/v1/auth/session/:id
   */
  static deleteSession = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.sub;
    const targetSessionId = req.params['id'] as string;

    await SessionService.revokeSession(targetSessionId, userId);
    sendSuccess(res, null, 'Session revoked successfully');
  });

  /**
   * DELETE /api/v1/auth/logout-all
   */
  static logoutAll = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.sub;
    const currentSessionId = req.user!.sessionId;

    const count = await SessionService.revokeAllSessions(userId, currentSessionId);
    sendSuccess(res, { revokedCount: count }, 'All other sessions revoked successfully');
  });
}
