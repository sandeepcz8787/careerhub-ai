import mongoose, { Schema, Document, Model } from 'mongoose';

import { UserRole, AccountStatus } from '@careerhub/shared';
import { hashPassword } from '../utils/hash.util';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes

/**
 * User document interface — extends Mongoose Document.
 */
export interface IUser extends Document {
  email: string;
  passwordHash?: string;
  role: UserRole;
  status: AccountStatus;
  isEmailVerified: boolean;
  tokenVersion: number;
  lastLoginAt?: Date;
  failedLoginAttempts: number;
  lockUntil?: Date;
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

  // Virtuals
  isLocked: boolean;

  // Instance methods
  comparePassword(plaintext: string): Promise<boolean>;
  getFullName(): string;
  incLoginAttempts(): Promise<void>;
  resetLockout(): Promise<void>;
}

/**
 * User model interface with static methods.
 */
export interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  findByEmailWithPassword(email: string): Promise<IUser | null>;
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
      select: false,
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
    tokenVersion: { type: Number, default: 0 },
    lastLoginAt: { type: Date },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    profile: { type: profileSchema, required: true },
    oauthProviders: { type: [oauthProviderSchema], default: [] },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret['id'] = ret['_id'];
        delete ret['_id'];
        delete ret['__v'];
        delete ret['passwordHash'];
        delete ret['tokenVersion'];
        delete ret['failedLoginAttempts'];
        delete ret['lockUntil'];
        return ret;
      },
    },
  },
);

// Virtual for locked account
userSchema.virtual('isLocked').get(function () {
  return Boolean(this.lockUntil && this.lockUntil.getTime() > Date.now());
});

// Indexes
userSchema.index({ email: 1, status: 1 });
userSchema.index({ 'oauthProviders.provider': 1, 'oauthProviders.providerId': 1 });

// Hooks
userSchema.pre('save', async function (next) {
  if (!this.profile.displayName) {
    this.profile.displayName = `${this.profile.firstName} ${this.profile.lastName}`.trim();
  }

  if (this.isModified('passwordHash') && this.passwordHash) {
    this.passwordHash = await hashPassword(this.passwordHash);
  }

  next();
});

// Instance Methods
userSchema.methods['comparePassword'] = async function (plaintext: string): Promise<boolean> {
  if (!this.passwordHash) { return false; }
  const { comparePassword } = await import('../utils/hash.util');
  return comparePassword(plaintext, this.passwordHash as string);
};

userSchema.methods['getFullName'] = function (): string {
  return `${String(this.profile.firstName)} ${String(this.profile.lastName)}`.trim();
};

userSchema.methods['incLoginAttempts'] = async function (): Promise<void> {
  // If previously locked and lock expired, reset attempts count
  if (this.lockUntil && this.lockUntil.getTime() < Date.now()) {
    return this.updateOne({
      $set: { failedLoginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }

  const updates: mongoose.UpdateQuery<IUser> = {
    $inc: { failedLoginAttempts: 1 },
  };

  // Lock account if reached max failed attempts
  if (this.failedLoginAttempts + 1 >= MAX_FAILED_ATTEMPTS && !this.isLocked) {
    updates.$set = { lockUntil: new Date(Date.now() + LOCK_TIME_MS) };
  }

  await this.updateOne(updates);
};

userSchema.methods['resetLockout'] = async function (): Promise<void> {
  await this.updateOne({
    $set: { failedLoginAttempts: 0 },
    $unset: { lockUntil: 1 },
  });
};

// Static Methods
userSchema.statics['findByEmail'] = function (email: string) {
  return this.findOne({ email: email.toLowerCase().trim() });
};

userSchema.statics['findByEmailWithPassword'] = function (email: string) {
  return this.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
};

export const User = mongoose.model<IUser, IUserModel>('User', userSchema);
