/**
 * Client-side route paths.
 * Single source of truth — prevents broken links and typos.
 */
export const Routes = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  OAUTH_CALLBACK: '/auth/callback',

  // Protected — General
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOTIFICATIONS: '/notifications',

  // Features (future modules)
  RESUME_BUILDER: '/resume-builder',
  RESUME_CHECKER: '/resume-checker',
  COVER_LETTER: '/cover-letter',
  JOB_TRACKER: '/jobs',
  INTERNSHIP_TRACKER: '/internships',
  COMMUNITY: '/community',
  INTERVIEW_EXPERIENCES: '/interview-experiences',
  REFERRAL_MARKETPLACE: '/referrals',
  MOCK_INTERVIEW: '/mock-interview',
  CODING_CHALLENGES: '/coding-challenges',
  COMPANY_REVIEWS: '/companies',
  CHAT: '/chat',

  // Admin
  ADMIN_DASHBOARD: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_ANALYTICS: '/admin/analytics',

  // Error pages
  NOT_FOUND: '/404',
  SERVER_ERROR: '/500',
  UNAUTHORIZED: '/401',
} as const;

export type RouteKey = keyof typeof Routes;
export type RoutePath = (typeof Routes)[RouteKey];

/**
 * API route prefixes.
 */
export const ApiRoutes = {
  BASE: '/api/v1',
  AUTH: '/api/v1/auth',
  USERS: '/api/v1/users',
  HEALTH: '/api/v1/health',
} as const;
