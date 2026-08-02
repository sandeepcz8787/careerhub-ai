import mongoose, { Schema, Document } from 'mongoose';
import { ExperienceLevel } from '@careerhub/shared';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IProfile extends Document {
  userId: Schema.Types.ObjectId;
  headline?: string;
  bio?: string;
  location?: string;
  currentCompany?: string;
  currentRole?: string;
  experienceLevel: ExperienceLevel;
  skills: string[];
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startYear?: number;
    endYear?: number;
  }>;
  projects: Array<{
    title: string;
    description: string;
    url?: string;
  }>;
  certificates: Array<{
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
    location: { type: String, maxlength: 100, trim: true, index: true },
    currentCompany: { type: String, maxlength: 100, trim: true, index: true },
    currentRole: { type: String, maxlength: 100, trim: true },
    experienceLevel: {
      type: String,
      enum: Object.values(ExperienceLevel),
      default: ExperienceLevel.ENTRY,
      index: true,
    },
    skills: { type: [String], default: [], index: true },
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
  },
  baseSchemaOptions,
);

applyGlobalPlugins(profileSchema);

profileSchema.index({ location: 1, experienceLevel: 1 });
profileSchema.index({ skills: 1 });
profileSchema.index({ headline: 'text', bio: 'text', currentRole: 'text' });

export const Profile = mongoose.model<IProfile>('Profile', profileSchema);
