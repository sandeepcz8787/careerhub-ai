import mongoose, { Schema, Document } from 'mongoose';
import { ApplicationStatus, ApplicationStage } from '@careerhub/shared';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IApplicationFeedback {
  interviewerId?: Schema.Types.ObjectId;
  rating?: number;
  comments?: string;
  createdAt: Date;
}

export interface IApplication extends Document {
  userId: Schema.Types.ObjectId;
  jobId: Schema.Types.ObjectId;
  currentStage: ApplicationStage;
  appliedDate: Date;
  resumeId: Schema.Types.ObjectId;
  coverLetterId?: Schema.Types.ObjectId;
  notes?: string;
  status: ApplicationStatus;
  interviewDates: Date[];
  feedback: IApplicationFeedback[];
  matchScore?: number;
}

const feedbackSchema = new Schema(
  {
    interviewerId: { type: Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comments: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const applicationSchema = new Schema<IApplication>(
  {
    ...baseFields,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    currentStage: {
      type: String,
      enum: Object.values(ApplicationStage),
      default: ApplicationStage.SCREENING,
    },
    appliedDate: { type: Date, default: Date.now, index: true },
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', required: true },
    coverLetterId: { type: Schema.Types.ObjectId, ref: 'CoverLetter' },
    notes: { type: String },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.APPLIED,
      index: true,
    },
    interviewDates: { type: [Date], default: [] },
    feedback: { type: [feedbackSchema], default: [] },
    matchScore: { type: Number, min: 0, max: 100 },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(applicationSchema);

applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });
applicationSchema.index({ jobId: 1, status: 1 });
applicationSchema.index({ userId: 1, status: 1 });

export const Application = mongoose.model<IApplication>('Application', applicationSchema);
