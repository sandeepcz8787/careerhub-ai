import crypto from 'crypto';

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;

/**
 * Generate a cryptographically secure numeric OTP.
 */
export function generateOtp(): string {
  const max = Math.pow(10, OTP_LENGTH);
  const min = Math.pow(10, OTP_LENGTH - 1);
  const randomNum = crypto.randomInt(min, max);
  return String(randomNum);
}

/**
 * Calculate OTP expiry timestamp.
 */
export function getOtpExpiry(minutes = OTP_EXPIRY_MINUTES): Date {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + minutes);
  return expiry;
}

/**
 * Check if an OTP expiry timestamp is still valid.
 */
export function isOtpExpired(expiry: Date): boolean {
  return new Date() > expiry;
}

/**
 * Generate a secure random hex token (for password reset, email verification, etc.)
 */
export function generateSecureToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Hash a token for safe storage (one-way).
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
