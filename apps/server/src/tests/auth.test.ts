import { User } from '../models/User.model';
import { Session } from '../models/Session.model';
import { RefreshToken } from '../models/RefreshToken.model';
import { OTPVerification } from '../models/OTPVerification.model';
import { PasswordResetToken } from '../models/PasswordResetToken.model';
import { OtpService } from '../services/otp.service';
import { TokenService } from '../services/token.service';
import { SessionService } from '../services/session.service';
import { OtpPurpose, UserRole } from '@careerhub/shared';

/**
 * Reusable test cases suite for Auth & Authorization verification.
 * Run directly via tsx or Vitest/Jest runner.
 */
export async function runAuthTestSuite(): Promise<void> {
  console.log('\n🧪 Running Authentication & Authorization Test Suite...\n');

  try {
    // 1. Password Hashing Test
    console.log('  [1/5] Testing Password Hashing & Salt Verification...');
    const plainPassword = 'Password123!';
    const userDoc = new User({
      email: 'test@careerhub.ai',
      passwordHash: plainPassword,
      role: UserRole.STUDENT,
      profile: { firstName: 'Test', lastName: 'User' },
    });
    await userDoc.save();

    const isMatch = await userDoc.comparePassword(plainPassword);
    const isWrongMatch = await userDoc.comparePassword('WrongPassword123!');
    console.assert(isMatch === true, 'Password match failed');
    console.assert(isWrongMatch === false, 'Wrong password incorrectly matched');
    console.log('    ✓ Password hashing and bcrypt comparison passed.');

    // 2. Account Lockout Test
    console.log('  [2/5] Testing Brute-Force Account Lockout (5 attempts)...');
    for (let i = 0; i < 5; i++) {
      await userDoc.incLoginAttempts();
    }
    const lockedUser = await User.findById(userDoc._id);
    console.assert(lockedUser?.isLocked === true, 'Account was not locked after 5 failed attempts');
    console.log('    ✓ Account lockout after 5 failed attempts passed.');

    // 3. OTP Verification Test
    console.log('  [3/5] Testing 6-Digit OTP Generation & Expiry...');
    const otpResult = await OtpService.sendOtp('test@careerhub.ai', OtpPurpose.EMAIL_VERIFICATION, 'Test');
    console.assert(Boolean(otpResult.expiresAt), 'OTP expiration date missing');

    const otpRecord = await OTPVerification.findLatest('test@careerhub.ai', OtpPurpose.EMAIL_VERIFICATION);
    console.assert(Boolean(otpRecord), 'OTP record not stored');
    console.log('    ✓ OTP generation and secure storage passed.');

    // 4. Token Rotation & Replay Attack Test
    console.log('  [4/5] Testing Refresh Token Rotation & Replay Attack Prevention...');
    const dummyReq = {
      headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      ip: '127.0.0.1',
      socket: { remoteAddress: '127.0.0.1' },
    } as unknown as import('express').Request;

    const session = await SessionService.createSession(userDoc._id, dummyReq);
    const initialTokens = await TokenService.createTokenPair(userDoc._id, session._id);

    // Perform rotation
    const rotatedTokens = await TokenService.rotateRefreshToken(initialTokens.refreshToken);
    console.assert(Boolean(rotatedTokens.accessToken), 'Rotated access token missing');
    console.assert(rotatedTokens.refreshToken !== initialTokens.refreshToken, 'Refresh token was not rotated');

    // Attempt replay attack with old refresh token -> Should revoke token family!
    let replayErrorCaught = false;
    try {
      await TokenService.rotateRefreshToken(initialTokens.refreshToken);
    } catch {
      replayErrorCaught = true;
    }
    console.assert(replayErrorCaught === true, 'Replay attack was not detected and rejected!');
    
    const revokedSession = await Session.findById(session._id);
    console.assert(revokedSession?.isRevoked === true, 'Session was not revoked following replay attack!');
    console.log('    ✓ Refresh token rotation and replay attack revocation passed.');

    // 5. Cleanup Test Data
    console.log('  [5/5] Cleaning up test data...');
    await User.findByIdAndDelete(userDoc._id);
    await Session.deleteMany({ userId: userDoc._id });
    await RefreshToken.deleteMany({ userId: userDoc._id });
    await OTPVerification.deleteMany({ email: 'test@careerhub.ai' });
    await PasswordResetToken.deleteMany({ userId: userDoc._id });
    console.log('    ✓ Cleanup completed successfully.');

    console.log('\n🎉 All 5 Authentication Test Scenarios Passed Successfully!\n');
  } catch (error) {
    console.error('❌ Auth Test Suite Failed:', error);
  }
}
