import { configureStore } from '@reduxjs/toolkit';

/**
 * Redux store configuration.
 * Feature slices are added here as modules are built.
 */
export const store = configureStore({
  reducer: {
    // Feature slices — uncomment as they are implemented:
    // auth: authReducer,
    // ui: uiReducer,
    // notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore certain paths for non-serializable values (e.g., Date objects)
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: [],
      },
    }),
  devTools: import.meta.env.MODE !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
