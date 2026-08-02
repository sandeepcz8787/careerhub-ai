import { OAuth2Client } from 'google-auth-library';
import { env } from '../config/env.config';
import { logger } from '../utils/logger.util';

export interface GoogleUserProfile {
  googleId: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  pictureUrl?: string;
}

export class GoogleOAuthService {
  private static client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

  /**
   * Verify Google ID token and return normalized profile payload.
   */
  static async verifyIdToken(idToken: string): Promise<GoogleUserProfile> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('Invalid Google token payload');
      }

      if (!payload.email) {
        throw new Error('Google account email not provided');
      }

      return {
        googleId: payload.sub,
        email: payload.email,
        emailVerified: Boolean(payload.email_verified),
        firstName: payload.given_name || 'User',
        lastName: payload.family_name || '',
        pictureUrl: payload.picture,
      };
    } catch (error) {
      logger.error('Google OAuth token verification failed:', error);
      throw new Error('Failed to authenticate with Google');
    }
  }
}
