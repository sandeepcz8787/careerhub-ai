import crypto from 'crypto';
import type mongoose from 'mongoose';

import { RefreshToken } from '../models/RefreshToken.model';
import { Session } from '../models/Session.model';
import { User } from '../models/User.model';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.util';
import { AuthError } from '../errors/AuthError';
import type { AuthTokens, AccessTokenPayload, RefreshTokenPayload } from '@careerhub/shared';

const REFRESH_TOKEN_EXPIRY_DAYS = 7;

export class TokenService {
  /**
   * Hash a refresh token string for secure storage.
   */
  private static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Issue access + refresh token pair for a user session.
   */
  static async createTokenPair(
    userId: mongoose.Types.ObjectId | string,
    sessionId: mongoose.Types.ObjectId | string,
  ): Promise<AuthTokens> {
    const user = await User.findById(userId);
    if (!user) {
      throw AuthError.tokenInvalid();
    }

    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    // Create RefreshToken DB record placeholder
    const refreshTokenDoc = await RefreshToken.create({
      tokenHash: 'pending',
      userId: user._id,
      sessionId,
      expiresAt,
    });

    const refreshPayload: RefreshTokenPayload = {
      sub: user._id.toString() as AccessTokenPayload['sub'],
      sessionId: sessionId.toString(),
      tokenId: refreshTokenDoc._id.toString(),
    };

    const refreshTokenString = signRefreshToken(refreshPayload);
    const tokenHash = this.hashToken(refreshTokenString);

    // Update with computed token hash
    refreshTokenDoc.tokenHash = tokenHash;
    await refreshTokenDoc.save();

    // Link refresh token to session
    await Session.findByIdAndUpdate(sessionId, { refreshTokenId: refreshTokenDoc._id });

    const accessPayload: AccessTokenPayload = {
      sub: user._id.toString() as AccessTokenPayload['sub'],
      email: user.email,
      role: user.role,
      sessionId: sessionId.toString(),
    };

    const accessTokenString = signAccessToken(accessPayload);

    return {
      accessToken: accessTokenString,
      refreshToken: refreshTokenString,
      expiresIn: 15 * 60, // 15 minutes in seconds
    };
  }

  /**
   * Refresh access token with Refresh Token Rotation and Replay Attack Detection.
   */
  static async rotateRefreshToken(incomingRefreshToken: string): Promise<AuthTokens> {
    const payload = verifyRefreshToken(incomingRefreshToken);
    const tokenHash = this.hashToken(incomingRefreshToken);

    const existingTokenDoc = await RefreshToken.findByTokenHash(tokenHash);

    // Replay attack / Security breach detection
    if (!existingTokenDoc || existingTokenDoc.isRevoked) {
      if (existingTokenDoc) {
        // Token was already used/revoked — REPLAY ATTACK! Revoke entire token family and session
        await RefreshToken.revokeTokenFamily(existingTokenDoc.sessionId);
        await Session.findByIdAndUpdate(existingTokenDoc.sessionId, { isRevoked: true });
      }
      throw new AuthError('Security alert: Invalid or reused refresh token. Please login again.', 'AUTH_REFRESH_TOKEN_INVALID');
    }

    // Mark current refresh token as revoked and rotated
    existingTokenDoc.isRevoked = true;
    await existingTokenDoc.save();

    // Verify session is still valid
    const session = await Session.findById(payload.sessionId);
    if (!session || session.isRevoked || session.expiresAt.getTime() < Date.now()) {
      throw new AuthError('Session expired or revoked. Please login again.', 'AUTH_TOKEN_EXPIRED');
    }

    // Issue new token pair
    const newTokens = await this.createTokenPair(payload.sub, payload.sessionId);

    // Link old token to new token ID for audit trail
    const newTokenHash = this.hashToken(newTokens.refreshToken);
    const newTokenDoc = await RefreshToken.findByTokenHash(newTokenHash);
    if (newTokenDoc) {
      existingTokenDoc.replacedByTokenId = newTokenDoc._id as mongoose.Types.ObjectId;
      await existingTokenDoc.save();
    }

    // Touch session lastSeenAt
    session.lastSeenAt = new Date();
    await session.save();

    return newTokens;
  }

  /**
   * Revoke a refresh token on logout.
   */
  static async revokeRefreshToken(refreshTokenString: string): Promise<void> {
    try {
      const tokenHash = this.hashToken(refreshTokenString);
      const tokenDoc = await RefreshToken.findByTokenHash(tokenHash);
      if (tokenDoc) {
        tokenDoc.isRevoked = true;
        await tokenDoc.save();
      }
    } catch {
      // Non-critical cleanup
    }
  }
}
