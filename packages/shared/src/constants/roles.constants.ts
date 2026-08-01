import { UserRole } from '../types/user.types';

/**
 * Role hierarchy — higher index = more permissions.
 * Used for role-based access control guards.
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.STUDENT]: 0,
  [UserRole.FRESHER]: 1,
  [UserRole.PROFESSIONAL]: 2,
  [UserRole.RECRUITER]: 3,
  [UserRole.COLLEGE_ADMIN]: 4,
  [UserRole.ADMIN]: 5,
  [UserRole.SUPER_ADMIN]: 6,
} as const;

/**
 * Returns true if `userRole` has equal or higher permissions than `requiredRole`.
 */
export function hasMinimumRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/** Roles allowed to access the recruiter portal */
export const RECRUITER_ROLES: UserRole[] = [
  UserRole.RECRUITER,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
];

/** Roles with admin panel access */
export const ADMIN_ROLES: UserRole[] = [UserRole.ADMIN, UserRole.SUPER_ADMIN];

/** Roles representing job seekers */
export const JOB_SEEKER_ROLES: UserRole[] = [
  UserRole.STUDENT,
  UserRole.FRESHER,
  UserRole.PROFESSIONAL,
];

export { UserRole };
