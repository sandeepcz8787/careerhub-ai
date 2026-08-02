import mongoose, { Schema, Document } from 'mongoose';
import { InterviewType, InterviewScheduleStatus } from '@careerhub/shared';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IInterviewSchedule extends Document {
  applicationId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  recruiterId: Schema.Types.ObjectId;
  type: InterviewType;
  scheduledAt: Date;
  durationMinutes: number;
  meetingUrl?: string;
  status: InterviewScheduleStatus;
  feedback?: string;
}

const interviewScheduleSchema = new Schema<IInterviewSchedule>(
  {
    ...baseFields,
    applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    recruiterId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: Object.values(InterviewType),
      required: true,
    },
    scheduledAt: { type: Date, required: true, index: true },
    durationMinutes: { type: Number, default: 60 },
    meetingUrl: { type: String },
    status: {
      type: String,
      enum: Object.values(InterviewScheduleStatus),
      default: InterviewScheduleStatus.SCHEDULED,
      index: true,
    },
    feedback: { type: String },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(interviewScheduleSchema);

interviewScheduleSchema.index({ userId: 1, scheduledAt: 1 });
interviewScheduleSchema.index({ recruiterId: 1, scheduledAt: 1 });

export const InterviewSchedule = mongoose.model<IInterviewSchedule>('InterviewSchedule', interviewScheduleSchema);
