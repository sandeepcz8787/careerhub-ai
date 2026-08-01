import { OTPVerification } from '../models/OTPVerification.model';
import { generateOtp } from '../utils/otp.util';
import { hashPassword, comparePassword } from '../utils/hash.util';
import { AuthError } from '../errors/AuthError';
import { ValidationError } from '../errors/ValidationError';
import { sendEmailVerificationOtp } from '../utils/email.util';
import type { OtpPurpose } from '@careerhub/shared';

const OTP_EXPIRY_MINUTES = 5;
const MAX_VERIFICATION_ATTEMPTS = 5;
const MAX_RESEND_COUNT = 3;
const COOLDOWN_SECONDS = 60;

export class OtpService {
  /**
   * Generate and send a 6-digit OTP for email verification or password reset.
   */
  static async sendOtp(email: string, purpose: OtpPurpose, name = 'User'): Promise<{ expiresAt: Date; cooldownSeconds: number }> {
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await OTPVerification.findLatest(normalizedEmail, purpose);

    // Enforce 60-second resend cooldown
    if (existing) {
      const timeSinceLastSent = (Date.now() - existing.lastSentAt.getTime()) / 1000;
      if (timeSinceLastSent < COOLDOWN_SECONDS) {
        const remaining = Math.ceil(COOLDOWN_SECONDS - timeSinceLastSent);
        throw new ValidationError(`Please wait ${remaining} seconds before requesting a new OTP.`);
      }

      if (existing.resendCount >= MAX_RESEND_COUNT) {
        throw new ValidationError('Maximum OTP resend count reached. Please try again later.');
      }
    }

    const plainOtp = generateOtp();
    const otpHash = await hashPassword(plainOtp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    const resendCount = existing ? existing.resendCount + 1 : 0;

    // Save or update OTP record
    await OTPVerification.create({
      email: normalizedEmail,
      otpHash,
      purpose,
      attempts: 0,
      resendCount,
      lastSentAt: new Date(),
      expiresAt,
    });

    // Send email with OTP
    await sendEmailVerificationOtp(normalizedEmail, plainOtp, name);

    return { expiresAt, cooldownSeconds: COOLDOWN_SECONDS };
  }

  /**
   * Verify an OTP provided by the user.
   */
  static async verifyOtp(email: string, plainOtp: string, purpose: OtpPurpose): Promise<boolean> {
    const normalizedEmail = email.toLowerCase().trim();
    const record = await OTPVerification.findLatest(normalizedEmail, purpose);

    if (!record) {
      throw new AuthError('OTP expired or invalid. Please request a new code.', 'AUTH_OTP_INVALID');
    }

    if (record.expiresAt.getTime() < Date.now()) {
      await record.deleteOne();
      throw new AuthError('OTP has expired. Please request a new code.', 'AUTH_OTP_EXPIRED');
    }

    if (record.attempts >= MAX_VERIFICATION_ATTEMPTS) {
      await record.deleteOne();
      throw new AuthError('Too many failed attempts. Please request a new OTP.', 'AUTH_OTP_EXPIRED');
    }

    const isValid = await comparePassword(plainOtp, record.otpHash);

    if (!isValid) {
      record.attempts += 1;
      await record.save();
      throw new AuthError('Invalid OTP code. Please check and try again.', 'AUTH_OTP_INVALID');
    }

    // OTP verified successfully — delete record so it cannot be reused
    await record.deleteOne();
    return true;
  }
}
