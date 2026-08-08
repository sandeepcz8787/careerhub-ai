import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IResumeSection {
  id: string;
  name: string;
  type: string;
  content: Record<string, unknown>;
  order: number;
}

export interface IResume extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  templateId?: Schema.Types.ObjectId;
  atsScore?: number;
  sections: IResumeSection[];
  downloadCount: number;
  publicShareLink?: string;
  isPrimary: boolean;
  fileUrl?: string;
  privacy: 'public' | 'private' | 'unlisted';
  slug?: string;
  customization: Record<string, any>;
  status: string;
  createdBy?: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const resumeSectionSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'personal_info',
        'summary',
        'objective',
        'education',
        'experience',
        'internships',
        'projects',
        'skills',
        'soft_skills',
        'certifications',
        'achievements',
        'languages',
        'volunteer',
        'publications',
        'awards',
        'social_links',
        'portfolio',
        'custom',
      ],
      required: true,
    },
    content: { type: Schema.Types.Mixed, default: {} },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const resumeSchema = new Schema<IResume>(
  {
    ...baseFields,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    templateId: { type: Schema.Types.ObjectId, ref: 'ResumeTemplate' },
    atsScore: { type: Number, min: 0, max: 100 },
    sections: { type: [resumeSectionSchema], default: [] },
    downloadCount: { type: Number, default: 0 },
    publicShareLink: { type: String, unique: true, sparse: true },
    isPrimary: { type: Boolean, default: false },
    fileUrl: { type: String },
    privacy: { type: String, enum: ['public', 'private', 'unlisted'], default: 'private' },
    slug: { type: String, unique: true, sparse: true },
    customization: { type: Schema.Types.Mixed, default: {} },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(resumeSchema);

resumeSchema.index({ userId: 1, isPrimary: 1 });
resumeSchema.index({ userId: 1, updatedAt: -1 });
resumeSchema.index({ slug: 1 });

export const Resume = mongoose.model<IResume>('Resume', resumeSchema);
