import mongoose, { Schema, Document } from 'mongoose';
import { CourseLevel, CourseStatus } from '@careerhub/shared';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface ICourseLesson {
  id: string;
  title: string;
  durationMinutes: number;
  videoUrl?: string;
  content?: string;
}

export interface ICourseModule {
  id: string;
  title: string;
  description?: string;
  lessons: ICourseLesson[];
}

export interface ICourse extends Document {
  title: string;
  slug: string;
  description: string;
  instructorName: string;
  level: CourseLevel;
  modules: ICourseModule[];
  durationMinutes: number;
  rating: number;
  enrolledCount: number;
  status: CourseStatus;
}

const lessonSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    videoUrl: { type: String },
    content: { type: String },
  },
  { _id: false },
);

const moduleSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    lessons: { type: [lessonSchema], default: [] },
  },
  { _id: false },
);

const courseSchema = new Schema<ICourse>(
  {
    ...baseFields,
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    instructorName: { type: String, required: true },
    level: {
      type: String,
      enum: Object.values(CourseLevel),
      default: CourseLevel.ALL_LEVELS,
      index: true,
    },
    modules: { type: [moduleSchema], default: [] },
    durationMinutes: { type: Number, default: 0 },
    rating: { type: Number, default: 5, min: 0, max: 5 },
    enrolledCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: Object.values(CourseStatus),
      default: CourseStatus.PUBLISHED,
      index: true,
    },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(courseSchema);

courseSchema.index({ title: 'text', description: 'text' });

export const Course = mongoose.model<ICourse>('Course', courseSchema);
