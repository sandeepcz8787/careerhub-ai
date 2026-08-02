import mongoose, { Schema, Document } from 'mongoose';
import { QuestionDifficulty } from '@careerhub/shared';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IInterviewExperience extends Document {
  userId: Schema.Types.ObjectId;
  companyId: Schema.Types.ObjectId;
  roleTitle: string;
  difficulty: QuestionDifficulty;
  outcome: 'offered' | 'rejected' | 'pending';
  rounds: Array<{ name: string; description: string; questions: string[] }>;
  content: string;
  upvotesCount: number;
  viewsCount: number;
}

const roundSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    questions: { type: [String], default: [] },
  },
  { _id: false },
);

const interviewExperienceSchema = new Schema<IInterviewExperience>(
  {
    ...baseFields,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    roleTitle: { type: String, required: true, trim: true, index: true },
    difficulty: {
      type: String,
      enum: Object.values(QuestionDifficulty),
      required: true,
      index: true,
    },
    outcome: { type: String, enum: ['offered', 'rejected', 'pending'], required: true },
    rounds: { type: [roundSchema], default: [] },
    content: { type: String, required: true },
    upvotesCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(interviewExperienceSchema);

interviewExperienceSchema.index({ roleTitle: 'text', content: 'text' });
interviewExperienceSchema.index({ companyId: 1, createdAt: -1 });

export const InterviewExperience = mongoose.model<IInterviewExperience>(
  'InterviewExperience',
  interviewExperienceSchema,
);
