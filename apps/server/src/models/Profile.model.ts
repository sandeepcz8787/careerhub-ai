import mongoose, { Schema, Document } from 'mongoose';
import { ExperienceLevel, SkillProficiency } from '@careerhub/shared';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IProfile extends Document {
  userId: Schema.Types.ObjectId;
  headline?: string;
  bio?: string;
  
  // Personal Information
  firstName?: string;
  lastName?: string;
  dob?: Date;
  gender?: string;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  timezone?: string;
  language?: string;
  coverImageUrl?: string;
  coverImagePublicId?: string;

  // Career Information
  currentCompany?: string;
  currentDesignation?: string;
  experienceLevel: ExperienceLevel;
  noticePeriod?: string;
  expectedSalary?: number;
  currentSalary?: number;
  preferredJobRole?: string[];
  preferredJobType?: string[];
  preferredLocation?: string[];
  remotePreference?: string;
  isOpenToWork: boolean;

  // Skills
  skills: Array<{
    name: string;
    category: string;
    proficiency: SkillProficiency;
    yearsOfExperience: number;
  }>;
  softSkills: string[];

  // Portfolio
  portfolioTheme?: string;
  portfolioVisibility?: 'public' | 'private' | 'connections';
  featuredProjects?: Schema.Types.ObjectId[];

  // Privacy Settings
  privacySettings: {
    profileVisibility: 'public' | 'private' | 'connections';
    searchVisibility: boolean;
    emailVisibility: boolean;
    phoneVisibility: boolean;
  };

  // Backwards compatibility inline fields (optional)
  education?: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startYear?: number;
    endYear?: number;
  }>;
  projects?: Array<{
    title: string;
    description: string;
    url?: string;
  }>;
  certificates?: Array<{
    title: string;
    issuer: string;
    issueDate?: Date;
    url?: string;
  }>;
  portfolioLinks: string[];
  github?: string;
  linkedIn?: string;
  website?: string;
  resumeReference?: Schema.Types.ObjectId;
  status: string;
  createdBy?: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const userSkillSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    proficiency: {
      type: String,
      enum: Object.values(SkillProficiency),
      default: SkillProficiency.BEGINNER,
    },
    yearsOfExperience: { type: Number, default: 0 },
  },
  { _id: false }
);

const profileSchema = new Schema<IProfile>(
  {
    ...baseFields,
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    headline: { type: String, maxlength: 120, trim: true },
    bio: { type: String, maxlength: 2000, trim: true },
    
    // Personal Information
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    dob: { type: Date },
    gender: { type: String },
    phone: { type: String, trim: true },
    country: { type: String, trim: true, index: true },
    state: { type: String, trim: true },
    city: { type: String, trim: true, index: true },
    timezone: { type: String, default: 'UTC' },
    language: { type: String, default: 'en' },
    coverImageUrl: { type: String },
    coverImagePublicId: { type: String },

    // Career Information
    currentCompany: { type: String, maxlength: 100, trim: true, index: true },
    currentDesignation: { type: String, maxlength: 100, trim: true },
    experienceLevel: {
      type: String,
      enum: Object.values(ExperienceLevel),
      default: ExperienceLevel.ENTRY,
      index: true,
    },
    noticePeriod: { type: String, trim: true },
    expectedSalary: { type: Number },
    currentSalary: { type: Number },
    preferredJobRole: { type: [String], default: [] },
    preferredJobType: { type: [String], default: [] },
    preferredLocation: { type: [String], default: [] },
    remotePreference: { type: String, default: 'remote' },
    isOpenToWork: { type: Boolean, default: false, index: true },

    // Skills
    skills: { type: [userSkillSchema], default: [] },
    softSkills: { type: [String], default: [] },

    // Portfolio
    portfolioTheme: { type: String, default: 'modern' },
    portfolioVisibility: {
      type: String,
      enum: ['public', 'private', 'connections'],
      default: 'public',
    },
    featuredProjects: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
      default: [],
    },

    // Privacy Settings
    privacySettings: {
      profileVisibility: {
        type: String,
        enum: ['public', 'private', 'connections'],
        default: 'public',
      },
      searchVisibility: { type: Boolean, default: true },
      emailVisibility: { type: Boolean, default: true },
      phoneVisibility: { type: Boolean, default: false },
    },

    // Inline arrays for backwards compatibility
    education: [
      {
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        fieldOfStudy: { type: String, required: true },
        startYear: { type: Number },
        endYear: { type: Number },
      },
    ],
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        url: { type: String },
      },
    ],
    certificates: [
      {
        title: { type: String, required: true },
        issuer: { type: String, required: true },
        issueDate: { type: Date },
        url: { type: String },
      },
    ],
    portfolioLinks: { type: [String], default: [] },
    github: { type: String, trim: true },
    linkedIn: { type: String, trim: true },
    website: { type: String, trim: true },
    resumeReference: { type: Schema.Types.ObjectId, ref: 'Resume' },
    status: { type: String, default: 'active' },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(profileSchema);

profileSchema.index({ city: 1, country: 1, experienceLevel: 1 });
profileSchema.index({ isOpenToWork: 1 });
profileSchema.index({ 'skills.name': 1 });
profileSchema.index({ headline: 'text', bio: 'text', currentDesignation: 'text', currentCompany: 'text' });

export const Profile = mongoose.model<IProfile>('Profile', profileSchema);
