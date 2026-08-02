import mongoose, { Schema, Document } from 'mongoose';
import { MockInterviewStatus } from '@careerhub/shared';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IMockInterview extends Document {
  userId: Schema.Types.ObjectId;
  peerId?: Schema.Types.ObjectId;
  type: 'ai' | 'peer';
  targetRole: string;
  status: MockInterviewStatus;
  scheduledAt?: Date;
  questions: string[];
  durationMinutes: number;
}

const mockInterviewSchema = new Schema<IMockInterview>(
  {
    ...baseFields,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    peerId: { type: Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['ai', 'peer'], default: 'ai' },
    targetRole: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: Object.values(MockInterviewStatus),
      default: MockInterviewStatus.SCHEDULED,
      index: true,
    },
    scheduledAt: { type: Date },
    questions: { type: [String], default: [] },
    durationMinutes: { type: Number, default: 45 },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(mockInterviewSchema);

mockInterviewSchema.index({ userId: 1, createdAt: -1 });

export const MockInterview = mongoose.model<IMockInterview>('MockInterview', mockInterviewSchema);
