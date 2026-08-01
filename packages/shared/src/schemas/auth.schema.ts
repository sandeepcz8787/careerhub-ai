import { z } from 'zod';
import { UserRole } from '../types/user.types';
import { OtpPurpose } from '../types/auth.types';

/** Password requirements: 8-64 chars, uppercase, lowercase, digit, special char */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(64, 'Password must be at most 64 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/** Register schema */
export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, 'First name is required')
      .max(50, 'First name too long')
      .regex(/^[a-zA-Z\s'-]+$/, 'First name contains invalid characters'),
    lastName: z
      .string()
      .trim()
      .min(1, 'Last name is required')
      .max(50, 'Last name too long')
      .regex(/^[a-zA-Z\s'-]+$/, 'Last name contains invalid characters'),
    email: z.string().trim().toLowerCase().email('Invalid email address'),
    password: passwordSchema,
    confirmPassword: z.string(),
    role: z.nativeEnum(UserRole).default(UserRole.STUDENT),
    agreeToTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the terms and conditions' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/** Login schema */
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
});

/** Google OAuth Schema */
export const googleAuthSchema = z.object({
  idToken: z.string().min(1, 'Google ID token is required'),
});

/** Send OTP schema */
export const sendOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  purpose: z.nativeEnum(OtpPurpose).default(OtpPurpose.EMAIL_VERIFICATION),
});

/** OTP verification schema */
export const otpVerifySchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  otp: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only digits'),
  purpose: z.nativeEnum(OtpPurpose).default(OtpPurpose.EMAIL_VERIFICATION),
});

/** Resend OTP schema */
export const resendOtpSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  purpose: z.nativeEnum(OtpPurpose).default(OtpPurpose.EMAIL_VERIFICATION),
});

/** Forgot password schema */
export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
});

/** Reset password schema */
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/** Change password schema */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
    logoutOtherDevices: z.boolean().default(false),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

/** Token refresh schema */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().optional(),
});

/** Session delete schema */
export const sessionParamsSchema = z.object({
  id: z.string().min(1, 'Session ID is required'),
});

// Inferred types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;
export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type OtpVerifyInput = z.infer<typeof otpVerifySchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
