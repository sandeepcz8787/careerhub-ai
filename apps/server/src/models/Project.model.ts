import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IProject extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  description: string;
  role?: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  mediaUrls: string[];
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  isFeatured: boolean;
}

const projectSchema = new Schema<IProject>(
  {
    ...baseFields,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    role: { type: String },
    techStack: { type: [String], default: [], index: true },
    githubUrl: { type: String },
    liveUrl: { type: String },
    mediaUrls: { type: [String], default: [] },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(projectSchema);

projectSchema.index({ userId: 1, isFeatured: 1 });
projectSchema.index({ techStack: 1 });

export const Project = mongoose.model<IProject>('Project', projectSchema);
