import type { ObjectId, ISODateString, Nullable } from './common.types';
import { UserRole, AccountStatus, OAuthProvider } from '../constants/enums.constants';

export { UserRole, AccountStatus, OAuthProvider };

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
