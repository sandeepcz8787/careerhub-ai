import type { Request } from 'express';
import type mongoose from 'mongoose';

import { Session } from '../models/Session.model';
import { parseDeviceInfo, getClientIp } from '../utils/device.util';
import { AuthError } from '../errors/AuthError';
import type { UserSession } from '@careerhub/shared';

const SESSION_EXPIRY_DAYS = 7;

export class SessionService {
  /**
   * Create a new session record from HTTP request.
   */
  static async createSession(
    userId: mongoose.Types.ObjectId | string,
    req: Request,
  ) {
    const ipAddress = getClientIp(req);
    const userAgent = req.headers['user-agent'] ?? 'Unknown';
    const deviceInfo = parseDeviceInfo(req);
    const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    const session = await Session.create({
      userId,
      ipAddress,
      userAgent,
      deviceInfo,
      lastSeenAt: new Date(),
      expiresAt,
      isRevoked: false,
    });

    return session;
  }

  /**
   * Get all active sessions for a user formatted for API response.
   */
  static async getUserSessions(
    userId: string,
    currentSessionId?: string,
  ): Promise<UserSession[]> {
    const sessions = await Session.findActiveByUserId(userId);

    return sessions.map((s) => ({
      id: s._id.toString() as UserSession['id'],
      userId: s.userId.toString() as UserSession['userId'],
      ipAddress: s.ipAddress,
      userAgent: s.userAgent,
      deviceInfo: s.deviceInfo,
      location: s.location,
      isCurrentSession: currentSessionId ? s._id.toString() === currentSessionId : false,
      lastSeenAt: s.lastSeenAt.toISOString() as UserSession['lastSeenAt'],
      createdAt: s.createdAt.toISOString() as UserSession['createdAt'],
    }));
  }

  /**
   * Revoke a specific session by ID.
   */
  static async revokeSession(sessionId: string, userId: string): Promise<void> {
    const session = await Session.findById(sessionId);
    if (!session || session.userId.toString() !== userId) {
      throw new AuthError('Session not found or access denied.', 'NOT_FOUND');
    }
    session.isRevoked = true;
    await session.save();
  }

  /**
   * Revoke all sessions for a user (optionally keeping current session active).
   */
  static async revokeAllSessions(userId: string, exceptSessionId?: string): Promise<number> {
    return Session.revokeAllForUser(userId, exceptSessionId);
  }

  /**
   * Validate that a session exists and is active.
   */
  static async validateSession(sessionId: string): Promise<boolean> {
    const session = await Session.findById(sessionId);
    if (!session || session.isRevoked || session.expiresAt.getTime() < Date.now()) {
      return false;
    }
    // Update lastSeenAt
    session.lastSeenAt = new Date();
    await session.save();
    return true;
  }
}
