import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@shared/hooks/useAppRedux';
import { setAuthData, setPendingEmail, clearAuth, logoutUser } from '../store/authSlice';
import { authApiService } from '../services/auth.service';
import type {
  RegisterInput,
  LoginInput,
  OtpVerifyInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
  GoogleAuthInput,
  OtpPurpose,
} from '@careerhub/shared';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, isInitialized, pendingEmail, error } = useAppSelector(
    (state) => state.auth,
  );

  const login = useCallback(
    async (input: LoginInput) => {
      const response = await authApiService.login(input);
      dispatch(setAuthData(response));
      return response;
    },
    [dispatch],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const response = await authApiService.register(input);
      dispatch(setPendingEmail(input.email));
      return response;
    },
    [dispatch],
  );

  const googleAuth = useCallback(
    async (input: GoogleAuthInput) => {
      const response = await authApiService.googleAuth(input);
      dispatch(setAuthData(response));
      return response;
    },
    [dispatch],
  );

  const verifyOtp = useCallback(
    async (input: OtpVerifyInput) => {
      const response = await authApiService.verifyOtp(input);
      dispatch(setAuthData(response));
      return response;
    },
    [dispatch],
  );

  const resendOtp = useCallback(async (email: string, purpose: OtpPurpose) => {
    return authApiService.resendOtp({ email, purpose });
  }, []);

  const forgotPassword = useCallback(async (input: ForgotPasswordInput) => {
    return authApiService.forgotPassword(input);
  }, []);

  const resetPassword = useCallback(async (input: ResetPasswordInput) => {
    return authApiService.resetPassword(input);
  }, []);

  const changePassword = useCallback(async (input: ChangePasswordInput) => {
    return authApiService.changePassword(input);
  }, []);

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } finally {
      dispatch(clearAuth());
    }
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    pendingEmail,
    error,
    login,
    register,
    googleAuth,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    changePassword,
    logout,
  };
}
