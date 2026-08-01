import { api, tokenStore } from '@config/api.config';
import type {
  RegisterInput,
  LoginInput,
  AuthResponse,
  OtpVerifyInput,
  ResendOtpInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
  GoogleAuthInput,
  AuthUserSummary,
  UserSession,
  OtpPurpose,
} from '@careerhub/shared';

export const authApiService = {
  async register(input: RegisterInput) {
    return api.post<{ message: string; email: string }>('/auth/register', input);
  },

  async login(input: LoginInput) {
    const response = await api.post<AuthResponse>('/auth/login', input);
    if (response.data?.tokens) {
      tokenStore.setAccessToken(response.data.tokens.accessToken);
      tokenStore.setRefreshToken(response.data.tokens.refreshToken);
    }
    return response.data;
  },

  async googleAuth(input: GoogleAuthInput) {
    const response = await api.post<AuthResponse>('/auth/google', input);
    if (response.data?.tokens) {
      tokenStore.setAccessToken(response.data.tokens.accessToken);
      tokenStore.setRefreshToken(response.data.tokens.refreshToken);
    }
    return response.data;
  },

  async verifyOtp(input: OtpVerifyInput) {
    const response = await api.post<AuthResponse>('/auth/verify-otp', input);
    if (response.data?.tokens) {
      tokenStore.setAccessToken(response.data.tokens.accessToken);
      tokenStore.setRefreshToken(response.data.tokens.refreshToken);
    }
    return response.data;
  },

  async resendOtp(input: ResendOtpInput) {
    return api.post<{ message: string }>('/auth/resend-otp', input);
  },

  async sendOtp(email: string, purpose: OtpPurpose) {
    return api.post<{ message: string }>('/auth/send-otp', { email, purpose });
  },

  async forgotPassword(input: ForgotPasswordInput) {
    return api.post<{ message: string }>('/auth/forgot-password', input);
  },

  async resetPassword(input: ResetPasswordInput) {
    return api.post<{ message: string }>('/auth/reset-password', input);
  },

  async changePassword(input: ChangePasswordInput) {
    return api.post<{ message: string }>('/auth/change-password', input);
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      tokenStore.clearTokens();
    }
  },

  async getMe() {
    return api.get<{ user: AuthUserSummary }>('/auth/me');
  },

  async getSessions() {
    return api.get<UserSession[]>('/auth/sessions');
  },

  async deleteSession(sessionId: string) {
    return api.delete(`/auth/session/${sessionId}`);
  },

  async logoutAll() {
    return api.delete('/auth/logout-all');
  },
};
