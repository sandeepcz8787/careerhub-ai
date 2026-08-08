import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import { Routes } from '@careerhub/shared';
import { ProtectedRoute } from '@shared/components/guards/ProtectedRoute';
import { PublicOnlyRoute } from '@shared/components/guards/PublicOnlyRoute';
import { Spinner } from '@shared/components/ui/Button';

// Lazy-loaded pages
const LandingPage = lazy(() => import('@features/landing/pages/LandingPage'));
const LoginPage = lazy(() => import('@features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@features/auth/pages/RegisterPage'));
const VerifyEmailPage = lazy(() => import('@features/auth/pages/VerifyEmailPage'));
const ForgotPasswordPage = lazy(() => import('@features/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@features/auth/pages/ResetPasswordPage'));
const ActiveSessionsPage = lazy(() => import('@features/auth/pages/ActiveSessionsPage'));
const SecuritySettingsPage = lazy(() => import('@features/auth/pages/SecuritySettingsPage'));

// Profile & Settings
const ProfilePage = lazy(() => import('@features/profile/pages/ProfilePage'));
const SettingsPage = lazy(() => import('@features/profile/pages/SettingsPage'));

// Resume Builder
const ResumeBuilderPage = lazy(() => import('@features/resume/pages/ResumeBuilderPage'));
const ResumeCreatePage = lazy(() => import('@features/resume/pages/ResumeCreatePage'));
const ResumeEditorPage = lazy(() => import('@features/resume/pages/ResumeEditorPage'));
const PublicResumePage = lazy(() => import('@features/resume/pages/PublicResumePage'));

// Dashboard pages
const DashboardLayout = lazy(() => import('@features/dashboard/components/DashboardLayout'));
const DashboardPage = lazy(() => import('@features/dashboard/pages/DashboardPage'));
const ComingSoonWidget = lazy(() =>
  import('@features/dashboard/pages/ComingSoonWidget').then((m) => ({ default: m.ComingSoonWidget }))
);

// Placeholder & error pages
const ComingSoonPage = lazy(() =>
  import('@shared/components/pages/ComingSoonPage').then((m) => ({ default: m.ComingSoonPage }))
);
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
    element: renderSuspense(<LandingPage />),
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
  {
    path: 'resume/public/:username/:resumeSlug',
    element: renderSuspense(<PublicResumePage />),
  },

  // Protected Area (Sidebar Navigation & Sub-views)
  {
    path: '/',
    element: <ProtectedRoute>{renderSuspense(<DashboardLayout />)}</ProtectedRoute>,
    children: [
      {
        path: 'dashboard',
        element: renderSuspense(<DashboardPage />),
      },
      {
        path: 'profile',
        element: renderSuspense(<ProfilePage />),
      },
      {
        path: 'settings',
        element: renderSuspense(<SettingsPage />),
      },
      {
        path: 'settings/sessions',
        element: renderSuspense(<ActiveSessionsPage />),
      },
      {
        path: 'resume-builder',
        element: renderSuspense(<ResumeBuilderPage />),
      },
      {
        path: 'resume-builder/create',
        element: renderSuspense(<ResumeCreatePage />),
      },
      {
        path: 'resume-builder/edit/:id',
        element: renderSuspense(<ResumeEditorPage />),
      },
      {
        path: 'resume-checker',
        element: renderSuspense(<ComingSoonWidget />),
      },
      {
        path: 'cover-letter',
        element: renderSuspense(<ComingSoonWidget />),
      },
      {
        path: 'jobs',
        element: renderSuspense(<ComingSoonWidget />),
      },
      {
        path: 'internships',
        element: renderSuspense(<ComingSoonWidget />),
      },
      {
        path: 'applications',
        element: renderSuspense(<ComingSoonWidget />),
      },
      {
        path: 'mock-interview',
        element: renderSuspense(<ComingSoonWidget />),
      },
      {
        path: 'coding-challenges',
        element: renderSuspense(<ComingSoonWidget />),
      },
      {
        path: 'community',
        element: renderSuspense(<ComingSoonWidget />),
      },
      {
        path: 'referrals',
        element: renderSuspense(<ComingSoonWidget />),
      },
      {
        path: 'interview-experiences',
        element: renderSuspense(<ComingSoonWidget />),
      },
      {
        path: 'chat',
        element: renderSuspense(<ComingSoonWidget />),
      },
      {
        path: 'notes',
        element: renderSuspense(<ComingSoonWidget />),
      },
      {
        path: 'analytics',
        element: renderSuspense(<ComingSoonWidget />),
      },
      {
        path: 'notifications',
        element: renderSuspense(<ComingSoonWidget />),
      },
      {
        path: 'help',
        element: renderSuspense(<ComingSoonWidget />),
      },
    ],
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
