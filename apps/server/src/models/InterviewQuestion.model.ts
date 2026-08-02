import mongoose, { Schema, Document } from 'mongoose';
import { QuestionDifficulty } from '@careerhub/shared';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IInterviewQuestion extends Document {
  title: string;
  slug: string;
  content: string;
  category: string;
  companyIds: Schema.Types.ObjectId[];
  roleTypes: string[];
  difficulty: QuestionDifficulty;
  answersCount: number;
  tags: string[];
}

const interviewQuestionSchema = new Schema<IInterviewQuestion>(
  {
    ...baseFields,
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: { type: String, required: true },
    category: { type: String, required: true, index: true },
    companyIds: [{ type: Schema.Types.ObjectId, ref: 'Company', index: true }],
    roleTypes: { type: [String], default: [], index: true },
    difficulty: {
      type: String,
      enum: Object.values(QuestionDifficulty),
      required: true,
      index: true,
    },
    answersCount: { type: Number, default: 0 },
    tags: { type: [String], default: [], index: true },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(interviewQuestionSchema);

interviewQuestionSchema.index({ title: 'text', content: 'text', tags: 'text' });

export const InterviewQuestion = mongoose.model<IInterviewQuestion>('InterviewQuestion', interviewQuestionSchema);
