import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IResumeTemplate extends Document {
  name: string;
  slug: string;
  description?: string;
  thumbnailUrl: string;
  category: string;
  layoutConfig: Record<string, unknown>;
  isPremium: boolean;
}

const resumeTemplateSchema = new Schema<IResumeTemplate>(
  {
    ...baseFields,
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    thumbnailUrl: { type: String, required: true },
    category: {
      type: String,
      enum: ['modern', 'professional', 'creative', 'minimal', 'executive'],
      default: 'modern',
      index: true,
    },
    layoutConfig: { type: Schema.Types.Mixed, default: {} },
    isPremium: { type: Boolean, default: false },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(resumeTemplateSchema);

export const ResumeTemplate = mongoose.model<IResumeTemplate>('ResumeTemplate', resumeTemplateSchema);
