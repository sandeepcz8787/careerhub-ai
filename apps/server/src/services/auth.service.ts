import type { Request } from 'express';
import { OAuth2Client } from 'google-auth-library';

import { User } from '../models/User.model';
import { PasswordResetToken } from '../models/PasswordResetToken.model';
import { OtpService } from './otp.service';
import { TokenService } from './token.service';
import { SessionService } from './session.service';
import { AuthError } from '../errors/AuthError';
import { ValidationError } from '../errors/ValidationError';
import { sendPasswordResetEmail, sendWelcomeEmail } from '../utils/email.util';
import { generateSecureToken, hashToken } from '../utils/otp.util';
import { env } from '../config/env.config';
import { AccountStatus, OtpPurpose, UserRole } from '@careerhub/shared';
import type {
  RegisterInput,
  LoginInput,
  AuthResponse,
  ChangePasswordInput,
  AuthUserSummary,
} from '@careerhub/shared';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);
const PASSWORD_RESET_EXPIRY_MINUTES = 15;

export class AuthService {
  /**
   * Helper to format User model into AuthUserSummary shape.
   */
  private static formatUserSummary(user: {
    _id: unknown;
    email: string;
    role: UserRole;
    isEmailVerified: boolean;
    profile: {
      firstName: string;
      lastName: string;
      displayName: string;
      avatarUrl?: string | null;
    };
  }): AuthUserSummary {
    return {
      id: String(user._id) as AuthUserSummary['id'],
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      profile: {
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        displayName: user.profile.displayName,
        avatarUrl: user.profile.avatarUrl ?? null,
      },
    };
  }

  /**
   * Register a new user.
   */
  static async register(input: RegisterInput): Promise<{ message: string; email: string }> {
    const existing = await User.findByEmail(input.email);
    if (existing) {
      throw new ValidationError('An account with this email address already exists.');
    }

    const user = await User.create({
      email: input.email,
      passwordHash: input.password, // Pre-save hook hashes password
      role: input.role ?? UserRole.STUDENT,
      status: AccountStatus.PENDING_VERIFICATION,
      isEmailVerified: false,
      profile: {
        firstName: input.firstName,
        lastName: input.lastName,
        displayName: `${input.firstName} ${input.lastName}`.trim(),
        socialLinks: [],
      },
    });

    // Send 6-digit OTP email
    await OtpService.sendOtp(
      user.email,
      OtpPurpose.EMAIL_VERIFICATION,
      user.profile.firstName,
    );

    return {
      message: 'Registration successful! Please check your email for your verification code.',
      email: user.email,
    };
  }

  /**
   * Login with Email & Password.
   */
  static async login(input: LoginInput, req: Request): Promise<AuthResponse> {
    const user = await User.findByEmailWithPassword(input.email);

    // Generic error message to prevent user enumeration
    if (!user || !user.passwordHash) {
      throw AuthError.invalidCredentials();
    }

    // Check brute-force lockout
    if (user.isLocked) {
      const minutesLeft = Math.ceil((user.lockUntil!.getTime() - Date.now()) / (60 * 1000));
      throw new AuthError(
        `Account locked due to multiple failed login attempts. Please try again in ${minutesLeft} minutes.`,
        'AUTH_ACCOUNT_SUSPENDED',
      );
    }

    const isMatch = await user.comparePassword(input.password);

    if (!isMatch) {
      await user.incLoginAttempts();
      throw AuthError.invalidCredentials();
    }

    // Reset lockout on successful password match
    await user.resetLockout();

    // Check account status
    if (user.status === AccountStatus.SUSPENDED || user.status === AccountStatus.BANNED) {
      throw AuthError.accountSuspended();
    }

    // Check email verification
    if (!user.isEmailVerified) {
      throw AuthError.emailNotVerified();
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Create session & issue token pair
    const session = await SessionService.createSession(user._id, req);
    const tokens = await TokenService.createTokenPair(user._id, session._id);

    return {
      user: this.formatUserSummary(user),
      tokens,
      sessionId: session._id.toString(),
    };
  }

  /**
   * Verify Email OTP and complete registration login.
   */
  static async verifyEmailOtp(
    email: string,
    otp: string,
    req: Request,
  ): Promise<AuthResponse> {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new ValidationError('User account not found.');
    }

    // Verify OTP code
    await OtpService.verifyOtp(email, otp, OtpPurpose.EMAIL_VERIFICATION);

    // Update email status
    user.isEmailVerified = true;
    user.status = AccountStatus.ACTIVE;
    await user.save();

    // Send welcome email asynchronously
    void sendWelcomeEmail(user.email, user.profile.firstName);

    // Create session & tokens
    const session = await SessionService.createSession(user._id, req);
    const tokens = await TokenService.createTokenPair(user._id, session._id);

    return {
      user: this.formatUserSummary(user),
      tokens,
      sessionId: session._id.toString(),
    };
  }

  /**
   * Resend Verification OTP.
   */
  static async resendOtp(email: string, purpose: OtpPurpose): Promise<{ message: string }> {
    const user = await User.findByEmail(email);
    if (!user) {
      // Don't leak existence
      return { message: 'If an account exists, a new verification code has been sent.' };
    }

    await OtpService.sendOtp(user.email, purpose, user.profile.firstName);
    return { message: 'Verification code sent to your email.' };
  }

  /**
   * Request Password Reset Email.
   */
  static async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await User.findByEmail(email);

    // Generic response to prevent user enumeration
    if (!user) {
      return { message: 'If an account exists with that email, reset instructions have been sent.' };
    }

    const resetToken = generateSecureToken(32);
    const tokenHash = hashToken(resetToken);
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_EXPIRY_MINUTES * 60 * 1000);

    await PasswordResetToken.create({
      userId: user._id,
      tokenHash,
      expiresAt,
    });

    const resetUrl = `${env.CLIENT_URL}/reset-password?token=${resetToken}`;
    await sendPasswordResetEmail(user.email, resetUrl, user.profile.firstName);

    return { message: 'If an account exists with that email, reset instructions have been sent.' };
  }

  /**
   * Reset Password using token.
   */
  static async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const tokenHash = hashToken(token);
    const resetRecord = await PasswordResetToken.findByTokenHash(tokenHash);

    if (!resetRecord) {
      throw new ValidationError('Password reset link is invalid or has expired.');
    }

    const user = await User.findById(resetRecord.userId);
    if (!user) {
      throw new ValidationError('User not found.');
    }

    // Update password
    user.passwordHash = newPassword;
    user.tokenVersion += 1;
    await user.save();

    // Mark reset token as used
    resetRecord.isUsed = true;
    await resetRecord.save();

    // Revoke ALL active sessions across all devices for security
    await SessionService.revokeAllSessions(user._id.toString());

    return { message: 'Password reset successful! Please login with your new password.' };
  }

  /**
   * Change Password (for logged in user).
   */
  static async changePassword(
    userId: string,
    input: ChangePasswordInput,
    currentSessionId?: string,
  ): Promise<{ message: string }> {
    const user = await User.findById(userId).select('+passwordHash');
    if (!user) {
      throw new ValidationError('User not found.');
    }

    const isMatch = await user.comparePassword(input.currentPassword);
    if (!isMatch) {
      throw new ValidationError('Current password is incorrect.');
    }

    user.passwordHash = input.newPassword;
    user.tokenVersion += 1;
    await user.save();

    if (input.logoutOtherDevices) {
      await SessionService.revokeAllSessions(userId, currentSessionId);
    }

    return { message: 'Password updated successfully.' };
  }

  /**
   * Google OAuth Login / Registration.
   */
  static async googleAuth(idToken: string, req: Request): Promise<AuthResponse> {
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch {
      throw new AuthError('Invalid Google authentication token.', 'AUTH_TOKEN_INVALID');
    }

    if (!payload?.email) {
      throw new AuthError('Google account does not provide an email address.', 'AUTH_TOKEN_INVALID');
    }

    const email = payload.email.toLowerCase().trim();
    let user = await User.findByEmail(email);

    if (!user) {
      // Auto-create new user from Google profile
      user = await User.create({
        email,
        role: UserRole.STUDENT,
        status: AccountStatus.ACTIVE,
        isEmailVerified: true,
        profile: {
          firstName: payload.given_name ?? 'User',
          lastName: payload.family_name ?? '',
          displayName: payload.name ?? `${payload.given_name} ${payload.family_name}`.trim(),
          avatarUrl: payload.picture ?? null,
          socialLinks: [],
        },
        oauthProviders: [
          {
            provider: 'google',
            providerId: payload.sub,
          },
        ],
      });
    } else {
      // Link Google provider if not present
      const hasGoogle = user.oauthProviders.some((p) => p.provider === 'google');
      if (!hasGoogle) {
        user.oauthProviders.push({ provider: 'google', providerId: payload.sub });
      }
      user.isEmailVerified = true;
      user.status = AccountStatus.ACTIVE;
      if (!user.profile.avatarUrl && payload.picture) {
        user.profile.avatarUrl = payload.picture;
      }
      await user.save();
    }

    const session = await SessionService.createSession(user._id, req);
    const tokens = await TokenService.createTokenPair(user._id, session._id);

    return {
      user: this.formatUserSummary(user),
      tokens,
      sessionId: session._id.toString(),
    };
  }

  /**
   * Logout session.
   */
  static async logout(sessionId: string, refreshTokenString?: string): Promise<void> {
    await SessionService.revokeSession(sessionId, sessionId);
    if (refreshTokenString) {
      await TokenService.revokeRefreshToken(refreshTokenString);
    }
  }
}
