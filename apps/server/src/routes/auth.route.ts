import { Router } from 'express';

import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { authRateLimiter } from '../middlewares/rateLimit.middleware';

import {
  registerSchema,
  loginSchema,
  googleAuthSchema,
  sendOtpSchema,
  otpVerifySchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  sessionParamsSchema,
} from '@careerhub/shared';

const router = Router();

// ── Public Auth Routes (Strict Rate Limiting) ─────────────────────────────
router.post('/register', authRateLimiter, validate(registerSchema, 'body'), AuthController.register);
router.post('/login', authRateLimiter, validate(loginSchema, 'body'), AuthController.login);
router.post('/google', authRateLimiter, validate(googleAuthSchema, 'body'), AuthController.googleAuth);

// ── OTP & Verification Routes ──────────────────────────────────────────────
router.post('/send-otp', authRateLimiter, validate(sendOtpSchema, 'body'), AuthController.sendOtp);
router.post('/verify-otp', authRateLimiter, validate(otpVerifySchema, 'body'), AuthController.verifyOtp);
router.post('/resend-otp', authRateLimiter, validate(resendOtpSchema, 'body'), AuthController.resendOtp);

// ── Password Reset Routes ─────────────────────────────────────────────────
router.post('/forgot-password', authRateLimiter, validate(forgotPasswordSchema, 'body'), AuthController.forgotPassword);
router.post('/reset-password', authRateLimiter, validate(resetPasswordSchema, 'body'), AuthController.resetPassword);

// ── Token Refresh ────────────────────────────────────────────────────────
router.post('/refresh-token', AuthController.refreshToken);

// ── Protected Auth Routes (Requires Authentication) ───────────────────────
router.use(authMiddleware);

router.post('/logout', AuthController.logout);
router.get('/me', AuthController.getMe);
router.post('/change-password', validate(changePasswordSchema, 'body'), AuthController.changePassword);

// ── Session Management Routes ──────────────────────────────────────────────
router.get('/sessions', AuthController.getSessions);
router.delete('/session/:id', validate(sessionParamsSchema, 'params'), AuthController.deleteSession);
router.delete('/logout-all', AuthController.logoutAll);

export default router;
