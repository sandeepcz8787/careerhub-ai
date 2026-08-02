import mongoose, { Schema, Document } from 'mongoose';
import { CodingLanguage, SubmissionStatus } from '@careerhub/shared';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IChallengeSubmission extends Document {
  challengeId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  code: string;
  language: CodingLanguage;
  status: SubmissionStatus;
  executionTimeMs?: number;
  memoryKb?: number;
  testCasesPassed: number;
  totalTestCases: number;
}

const challengeSubmissionSchema = new Schema<IChallengeSubmission>(
  {
    ...baseFields,
    challengeId: { type: Schema.Types.ObjectId, ref: 'CodingChallenge', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    code: { type: String, required: true },
    language: {
      type: String,
      enum: Object.values(CodingLanguage),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(SubmissionStatus),
      default: SubmissionStatus.PENDING,
      index: true,
    },
    executionTimeMs: { type: Number },
    memoryKb: { type: Number },
    testCasesPassed: { type: Number, default: 0 },
    totalTestCases: { type: Number, default: 0 },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(challengeSubmissionSchema);

challengeSubmissionSchema.index({ userId: 1, challengeId: 1, createdAt: -1 });

export const ChallengeSubmission = mongoose.model<IChallengeSubmission>(
  'ChallengeSubmission',
  challengeSubmissionSchema,
);
