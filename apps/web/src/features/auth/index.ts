/**
 * Auth Feature — Scaffold
 *
 * This module will contain:
 * - components/: LoginForm, RegisterForm, OtpInput, SocialAuthButton
 * - hooks/: useAuth, useLogin, useRegister, useLogout
 * - services/: auth.service.ts (API calls)
 * - pages/: LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage
 * - types/: auth.types.ts (local augmentations)
 * - validation/: auth.validation.ts (re-exports from @careerhub/shared)
 * - store/: authSlice.ts (Redux slice)
 */

// Re-export shared auth types for convenience
export type { AuthResponse, AuthTokens, LoginInput, RegisterInput } from '@careerhub/shared';
