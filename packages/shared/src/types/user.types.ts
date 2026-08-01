import type { ObjectId, ISODateString, Nullable } from './common.types';

/** Platform user roles */
export enum UserRole {
  STUDENT = 'student',
  FRESHER = 'fresher',
  PROFESSIONAL = 'professional',
  RECRUITER = 'recruiter',
  COLLEGE_ADMIN = 'college_admin',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

/** Account status */
export enum AccountStatus {
  PENDING_VERIFICATION = 'pending_verification',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DEACTIVATED = 'deactivated',
  BANNED = 'banned',
}

/** OAuth provider identifiers */
export enum OAuthProvider {
  GOOGLE = 'google',
  LINKEDIN = 'linkedin',
  GITHUB = 'github',
}

/** Social link entry */
export interface SocialLink {
  platform: 'linkedin' | 'github' | 'twitter' | 'portfolio' | 'other';
  url: string;
}

/** User profile — public-facing data */
export interface UserProfile {
  firstName: string;
  lastName: string;
  displayName: string;
  bio: Nullable<string>;
  avatarUrl: Nullable<string>;
  headline: Nullable<string>;
  location: Nullable<string>;
  website: Nullable<string>;
  socialLinks: SocialLink[];
}

/** Core user entity */
export interface User {
  id: ObjectId;
  email: string;
  role: UserRole;
  status: AccountStatus;
  profile: UserProfile;
  isEmailVerified: boolean;
  lastLoginAt: Nullable<ISODateString>;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/** Public user (safe to expose via API) */
export type PublicUser = Omit<User, 'status' | 'isEmailVerified' | 'lastLoginAt'>;

/** User update payload */
export type UpdateUserProfilePayload = Partial<UserProfile>;
