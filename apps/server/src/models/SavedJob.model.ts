import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface ISavedJob extends Document {
  userId: Schema.Types.ObjectId;
  jobId: Schema.Types.ObjectId;
  notes?: string;
}

const savedJobSchema = new Schema<ISavedJob>(
  {
    ...baseFields,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    notes: { type: String },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(savedJobSchema);

savedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export const SavedJob = mongoose.model<ISavedJob>('SavedJob', savedJobSchema);
