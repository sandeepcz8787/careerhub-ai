import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IExperience extends Document {
  userId: Schema.Types.ObjectId;
  companyName: string;
  role: string;
  location?: string;
  employmentType: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  achievements: string[];
  skillsUsed: string[];
  description?: string;
}

const experienceSchema = new Schema<IExperience>(
  {
    ...baseFields,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    companyName: { type: String, required: true, trim: true, index: true },
    role: { type: String, required: true, trim: true, index: true },
    location: { type: String, trim: true },
    employmentType: { type: String, default: 'full_time' },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
    achievements: { type: [String], default: [] },
    skillsUsed: { type: [String], default: [] },
    description: { type: String },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(experienceSchema);

experienceSchema.index({ userId: 1, startDate: -1 });

export const Experience = mongoose.model<IExperience>('Experience', experienceSchema);
