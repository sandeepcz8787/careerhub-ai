import { QueryClient } from '@tanstack/react-query';

/**
 * TanStack Query client configuration.
 * Tuned for a production SaaS: stale time, retry logic, error handling.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 minutes — data stays fresh
      gcTime: 10 * 60 * 1000,          // 10 minutes — keep in cache
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        const apiError = error as { status?: number };
        if (apiError.status && apiError.status >= 400 && apiError.status < 500) {
          return false;
        }
        return failureCount < 2; // Retry up to 2 times for server errors
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10_000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: false,
    },
  },
});
