import mongoose, { Schema, Document, Model } from 'mongoose';

import { UserRole, AccountStatus } from '@careerhub/shared';
import { hashPassword } from '../utils/hash.util';

/**
 * User document interface — extends Mongoose Document.
 */
export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: UserRole;
  status: AccountStatus;
  isEmailVerified: boolean;
  emailVerificationOtp?: string;
  emailVerificationOtpExpiry?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpiry?: Date;
  tokenVersion: number; // Incremented on logout/password change to invalidate all refresh tokens
  lastLoginAt?: Date;
  profile: {
    firstName: string;
    lastName: string;
    displayName: string;
    bio?: string;
    avatarUrl?: string;
    avatarPublicId?: string;
    headline?: string;
    location?: string;
    website?: string;
    socialLinks: Array<{
      platform: 'linkedin' | 'github' | 'twitter' | 'portfolio' | 'other';
      url: string;
    }>;
  };
  oauthProviders: Array<{
    provider: string;
    providerId: string;
    accessToken?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  comparePassword(plaintext: string): Promise<boolean>;
  getFullName(): string;
}

/**
 * User model interface with static methods.
 */
export interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}

const socialLinkSchema = new Schema(
  {
    platform: {
      type: String,
      enum: ['linkedin', 'github', 'twitter', 'portfolio', 'other'],
      required: true,
    },
    url: { type: String, required: true },
  },
  { _id: false },
);

const profileSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 50 },
    lastName: { type: String, required: true, trim: true, maxlength: 50 },
    displayName: { type: String, trim: true, maxlength: 100 },
    bio: { type: String, maxlength: 500 },
    avatarUrl: { type: String },
    avatarPublicId: { type: String },
    headline: { type: String, maxlength: 120 },
    location: { type: String, maxlength: 100 },
    website: { type: String },
    socialLinks: { type: [socialLinkSchema], default: [] },
  },
  { _id: false },
);

const oauthProviderSchema = new Schema(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
    accessToken: { type: String, select: false },
  },
  { _id: false },
);

const userSchema = new Schema<IUser, IUserModel>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
      index: true,
    },
    passwordHash: {
      type: String,
      required: false,
      select: false, // Never return in queries by default
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.STUDENT,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.PENDING_VERIFICATION,
      index: true,
    },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationOtp: { type: String, select: false },
    emailVerificationOtpExpiry: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetTokenExpiry: { type: Date, select: false },
    tokenVersion: { type: Number, default: 0 },
    lastLoginAt: { type: Date },
    profile: { type: profileSchema, required: true },
    oauthProviders: { type: [oauthProviderSchema], default: [] },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        delete ret.emailVerificationOtp;
        delete ret.emailVerificationOtpExpiry;
        delete ret.passwordResetToken;
        delete ret.passwordResetTokenExpiry;
        delete ret.tokenVersion;
        return ret;
      },
    },
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// Indexes
// ─────────────────────────────────────────────────────────────────────────────

userSchema.index({ email: 1, status: 1 });
userSchema.index({ 'oauthProviders.provider': 1, 'oauthProviders.providerId': 1 });

// ─────────────────────────────────────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────────────────────────────────────

userSchema.pre('save', async function (next) {
  // Auto-generate displayName if not set
  if (!this.profile.displayName) {
    this.profile.displayName = `${this.profile.firstName} ${this.profile.lastName}`.trim();
  }

  // Hash password if modified
  if (this.isModified('passwordHash') && this.passwordHash) {
    this.passwordHash = await hashPassword(this.passwordHash);
  }

  next();
});

// ─────────────────────────────────────────────────────────────────────────────
// Instance Methods
// ─────────────────────────────────────────────────────────────────────────────

userSchema.methods['comparePassword'] = async function (plaintext: string): Promise<boolean> {
  if (!this.passwordHash) { return false; }
  const { comparePassword } = await import('../utils/hash.util');
  return comparePassword(plaintext, this.passwordHash as string);
};

userSchema.methods['getFullName'] = function (): string {
  return `${String(this.profile.firstName)} ${String(this.profile.lastName)}`.trim();
};

// ─────────────────────────────────────────────────────────────────────────────
// Static Methods
// ─────────────────────────────────────────────────────────────────────────────

userSchema.statics['findByEmail'] = function (email: string) {
  return this.findOne({ email: email.toLowerCase().trim() });
};

export const User = mongoose.model<IUser, IUserModel>('User', userSchema);
