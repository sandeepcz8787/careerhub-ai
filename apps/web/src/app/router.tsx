import { createBrowserRouter, type RouteObject } from 'react-router-dom';

import { Routes } from '@careerhub/shared';

// Layouts
// import { AppLayout } from '@shared/components/layout/AppLayout';
// import { AuthLayout } from '@shared/components/layout/AuthLayout';

// Pages — lazy loaded for code splitting
// const LoginPage = lazy(() => import('@features/auth/pages/LoginPage'));
// const DashboardPage = lazy(() => import('@features/dashboard/pages/DashboardPage'));

// Temporary placeholder pages until features are built
import { ComingSoonPage } from '@shared/components/pages/ComingSoonPage';
import { NotFoundPage } from '@shared/components/pages/NotFoundPage';

const routes: RouteObject[] = [
  // ── Public Routes ─────────────────────────────────────────────────────
  {
    path: Routes.HOME,
    element: <ComingSoonPage />,
  },
  {
    path: Routes.LOGIN,
    element: <ComingSoonPage />,
  },
  {
    path: Routes.REGISTER,
    element: <ComingSoonPage />,
  },

  // ── Protected Routes ──────────────────────────────────────────────────
  // {
  //   path: Routes.DASHBOARD,
  //   element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
  //   children: [
  //     { index: true, element: <DashboardPage /> },
  //     { path: Routes.RESUME_BUILDER, element: <ResumeBuilderPage /> },
  //   ],
  // },

  // ── Catch-all 404 ─────────────────────────────────────────────────────
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
