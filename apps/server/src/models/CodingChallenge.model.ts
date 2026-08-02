import mongoose, { Schema, Document } from 'mongoose';
import { QuestionDifficulty, CodingLanguage } from '@careerhub/shared';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface ITestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface ICodingChallenge extends Document {
  title: string;
  slug: string;
  difficulty: QuestionDifficulty;
  problemStatement: string;
  starterCode: Array<{ language: CodingLanguage; code: string }>;
  testCases: ITestCase[];
  constraints?: string[];
  solutionExplanation?: string;
  submissionCount: number;
  acceptedCount: number;
}

const testCaseSchema = new Schema(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
  },
  { _id: false },
);

const starterCodeSchema = new Schema(
  {
    language: { type: String, enum: Object.values(CodingLanguage), required: true },
    code: { type: String, required: true },
  },
  { _id: false },
);

const codingChallengeSchema = new Schema<ICodingChallenge>(
  {
    ...baseFields,
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    difficulty: {
      type: String,
      enum: Object.values(QuestionDifficulty),
      required: true,
      index: true,
    },
    problemStatement: { type: String, required: true },
    starterCode: { type: [starterCodeSchema], default: [] },
    testCases: { type: [testCaseSchema], default: [] },
    constraints: { type: [String], default: [] },
    solutionExplanation: { type: String },
    submissionCount: { type: Number, default: 0 },
    acceptedCount: { type: Number, default: 0 },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(codingChallengeSchema);

codingChallengeSchema.index({ title: 'text', problemStatement: 'text' });

export const CodingChallenge = mongoose.model<ICodingChallenge>('CodingChallenge', codingChallengeSchema);
