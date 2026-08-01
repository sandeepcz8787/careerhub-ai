import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import { Routes } from '@careerhub/shared';
import { ProtectedRoute } from '@shared/components/guards/ProtectedRoute';
import { PublicOnlyRoute } from '@shared/components/guards/PublicOnlyRoute';
import { Spinner } from '@shared/components/ui/Button';

// Lazy-loaded pages
const LoginPage = lazy(() => import('@features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@features/auth/pages/RegisterPage'));
const VerifyEmailPage = lazy(() => import('@features/auth/pages/VerifyEmailPage'));
const ForgotPasswordPage = lazy(() => import('@features/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@features/auth/pages/ResetPasswordPage'));
const ActiveSessionsPage = lazy(() => import('@features/auth/pages/ActiveSessionsPage'));
const SecuritySettingsPage = lazy(() => import('@features/auth/pages/SecuritySettingsPage'));

// Placeholder & error pages
import { ComingSoonPage } from '@shared/components/pages/ComingSoonPage';
import { NotFoundPage } from '@shared/components/pages/NotFoundPage';

const renderSuspense = (component: React.ReactNode) => (
  <Suspense
    fallback={
      <div className="min-h-screen flex items-center justify-center bg-[color:var(--bg-base)]">
        <Spinner size="lg" className="text-primary-500" />
      </div>
    }
  >
    {component}
  </Suspense>
);

const routes: RouteObject[] = [
  // Public Landing Page
  {
    path: Routes.HOME,
    element: <ComingSoonPage />,
  },

  // Auth Public Routes (Redirect logged in users to Dashboard)
  {
    path: Routes.LOGIN,
    element: <PublicOnlyRoute>{renderSuspense(<LoginPage />)}</PublicOnlyRoute>,
  },
  {
    path: Routes.REGISTER,
    element: <PublicOnlyRoute>{renderSuspense(<RegisterPage />)}</PublicOnlyRoute>,
  },
  {
    path: Routes.FORGOT_PASSWORD,
    element: <PublicOnlyRoute>{renderSuspense(<ForgotPasswordPage />)}</PublicOnlyRoute>,
  },

  // Verification & Reset Routes
  {
    path: Routes.VERIFY_EMAIL,
    element: renderSuspense(<VerifyEmailPage />),
  },
  {
    path: Routes.RESET_PASSWORD,
    element: renderSuspense(<ResetPasswordPage />),
  },

  // Protected Settings & Sessions
  {
    path: Routes.SETTINGS,
    element: <ProtectedRoute>{renderSuspense(<SecuritySettingsPage />)}</ProtectedRoute>,
  },
  {
    path: '/settings/sessions',
    element: <ProtectedRoute>{renderSuspense(<ActiveSessionsPage />)}</ProtectedRoute>,
  },
  {
    path: Routes.DASHBOARD,
    element: <ProtectedRoute>{renderSuspense(<ComingSoonPage />)}</ProtectedRoute>,
  },

  // Catch-all 404
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export const router = createBrowserRouter(routes, {
  future: {
    v7_relativeSplatPath: true,
  },
});
