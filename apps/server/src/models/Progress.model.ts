import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IProgress extends Document {
  userId: Schema.Types.ObjectId;
  courseId: Schema.Types.ObjectId;
  completedLessonIds: string[];
  percentComplete: number;
  lastAccessedAt: Date;
}

const progressSchema = new Schema<IProgress>(
  {
    ...baseFields,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    completedLessonIds: { type: [String], default: [] },
    percentComplete: { type: Number, default: 0, min: 0, max: 100 },
    lastAccessedAt: { type: Date, default: Date.now },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(progressSchema);

progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const Progress = mongoose.model<IProgress>('Progress', progressSchema);
