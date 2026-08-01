import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

import { useAppDispatch, useAppSelector } from '@shared/hooks/useAppRedux';
import { fetchCurrentUser } from '@features/auth/store/authSlice';
import { Spinner } from '@shared/components/ui/Button';
import { Routes, UserRole, hasMinimumRole } from '@careerhub/shared';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { isAuthenticated, isInitialized, isLoading, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isInitialized && !isLoading) {
      void dispatch(fetchCurrentUser());
    }
  }, [dispatch, isInitialized, isLoading]);

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[color:var(--bg-base)]">
        <Spinner size="lg" className="text-primary-500" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={Routes.LOGIN} state={{ from: location }} replace />;
  }

  if (requiredRole && !hasMinimumRole(user.role, requiredRole)) {
    return <Navigate to={Routes.UNAUTHORIZED} replace />;
  }

  return <>{children}</>;
}
