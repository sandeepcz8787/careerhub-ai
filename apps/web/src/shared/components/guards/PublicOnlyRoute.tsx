import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

import { useAppSelector } from '@shared/hooks/useAppRedux';
import { Routes } from '@careerhub/shared';

interface PublicOnlyRouteProps {
  children: ReactNode;
}

export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);

  if (isInitialized && isAuthenticated) {
    return <Navigate to={Routes.DASHBOARD} replace />;
  }

  return <>{children}</>;
}
