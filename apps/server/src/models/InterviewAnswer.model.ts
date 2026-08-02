import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IInterviewAnswer extends Document {
  questionId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  content: string;
  upvotesCount: number;
  isVerified: boolean;
}

const interviewAnswerSchema = new Schema<IInterviewAnswer>(
  {
    ...baseFields,
    questionId: { type: Schema.Types.ObjectId, ref: 'InterviewQuestion', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true },
    upvotesCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(interviewAnswerSchema);

interviewAnswerSchema.index({ questionId: 1, upvotesCount: -1 });

export const InterviewAnswer = mongoose.model<IInterviewAnswer>('InterviewAnswer', interviewAnswerSchema);
