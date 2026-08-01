import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthUserSummary, AuthResponse } from '@careerhub/shared';
import { authApiService } from '../services/auth.service';
import { tokenStore } from '@config/api.config';

export interface AuthState {
  user: AuthUserSummary | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  pendingEmail: string | null;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  pendingEmail: null,
  error: null,
};

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const token = tokenStore.getAccessToken();
    if (!token) {
      return null;
    }
    const response = await authApiService.getMe();
    return response.data.user;
  } catch (error) {
    tokenStore.clearTokens();
    return rejectWithValue((error as { message?: string }).message ?? 'Session expired');
  }
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await authApiService.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData(state, action: PayloadAction<AuthResponse>) {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.pendingEmail = null;
      state.error = null;
    },
    setPendingEmail(state, action: PayloadAction<string>) {
      state.pendingEmail = action.payload;
    },
    clearAuth(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.pendingEmail = null;
      state.error = null;
      tokenStore.clearTokens();
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.pendingEmail = null;
        tokenStore.clearTokens();
      });
  },
});

export const { setAuthData, setPendingEmail, clearAuth, setError } = authSlice.actions;
export default authSlice.reducer;
