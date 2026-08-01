import { Provider as ReduxProvider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';

import { store } from './store';
import { queryClient } from './queryClient';
import { isDev } from '@config/env';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Root application providers.
 * Wraps the entire app with Redux, TanStack Query, and future providers.
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        {isDev && <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />}
      </QueryClientProvider>
    </ReduxProvider>
  );
}
