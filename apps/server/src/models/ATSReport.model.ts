import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IATSReport extends Document {
  resumeId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  targetJobId?: Schema.Types.ObjectId;
  jobTitle?: string;
  matchScore: number;
  keywordMatches: Array<{ keyword: string; count: number }>;
  missingKeywords: string[];
  suggestions: string[];
  grammarIssues: string[];
  formattingScore: number;
}

const atsReportSchema = new Schema<IATSReport>(
  {
    ...baseFields,
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetJobId: { type: Schema.Types.ObjectId, ref: 'Job' },
    jobTitle: { type: String },
    matchScore: { type: Number, required: true, min: 0, max: 100 },
    keywordMatches: [
      {
        keyword: { type: String, required: true },
        count: { type: Number, default: 1 },
      },
    ],
    missingKeywords: { type: [String], default: [] },
    suggestions: { type: [String], default: [] },
    grammarIssues: { type: [String], default: [] },
    formattingScore: { type: Number, min: 0, max: 100, default: 100 },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(atsReportSchema);

atsReportSchema.index({ userId: 1, createdAt: -1 });

export const ATSReport = mongoose.model<IATSReport>('ATSReport', atsReportSchema);
