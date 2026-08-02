import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface ICoverLetter extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  content: string;
  targetCompany?: string;
  targetRole?: string;
  jobId?: Schema.Types.ObjectId;
  template?: string;
}

const coverLetterSchema = new Schema<ICoverLetter>(
  {
    ...baseFields,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    targetCompany: { type: String, trim: true },
    targetRole: { type: String, trim: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
    template: { type: String, default: 'standard' },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(coverLetterSchema);

coverLetterSchema.index({ userId: 1, createdAt: -1 });

export const CoverLetter = mongoose.model<ICoverLetter>('CoverLetter', coverLetterSchema);
