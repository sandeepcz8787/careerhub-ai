import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IReferralPost extends Document {
  userId: Schema.Types.ObjectId;
  companyId: Schema.Types.ObjectId;
  jobTitle: string;
  description: string;
  location?: string;
  applicationUrl?: string;
  status: string;
}

const referralPostSchema = new Schema<IReferralPost>(
  {
    ...baseFields,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    jobTitle: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: { type: String },
    applicationUrl: { type: String },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(referralPostSchema);

referralPostSchema.index({ companyId: 1, createdAt: -1 });

export const ReferralPost = mongoose.model<IReferralPost>('ReferralPost', referralPostSchema);
