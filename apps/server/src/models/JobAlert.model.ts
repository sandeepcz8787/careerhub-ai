import mongoose, { Schema, Document } from 'mongoose';
import { EmploymentType } from '@careerhub/shared';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IJobAlert extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  keywords: string[];
  location?: string;
  salaryMin?: number;
  employmentTypes: EmploymentType[];
  frequency: 'daily' | 'weekly' | 'instant';
  isActive: boolean;
}

const jobAlertSchema = new Schema<IJobAlert>(
  {
    ...baseFields,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    keywords: { type: [String], default: [] },
    location: { type: String },
    salaryMin: { type: Number },
    employmentTypes: { type: [String], default: [] },
    frequency: { type: String, enum: ['daily', 'weekly', 'instant'], default: 'daily' },
    isActive: { type: Boolean, default: true, index: true },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(jobAlertSchema);

export const JobAlert = mongoose.model<IJobAlert>('JobAlert', jobAlertSchema);
