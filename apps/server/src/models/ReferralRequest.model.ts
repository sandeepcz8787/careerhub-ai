import mongoose, { Schema, Document } from 'mongoose';
import { ReferralStatus } from '@careerhub/shared';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IReferralRequest extends Document {
  userId: Schema.Types.ObjectId;
  referrerId: Schema.Types.ObjectId;
  companyId: Schema.Types.ObjectId;
  jobId?: Schema.Types.ObjectId;
  message: string;
  status: ReferralStatus;
  resumeId: Schema.Types.ObjectId;
}

const referralRequestSchema = new Schema<IReferralRequest>(
  {
    ...baseFields,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    referrerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(ReferralStatus),
      default: ReferralStatus.PENDING,
      index: true,
    },
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', required: true },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(referralRequestSchema);

referralRequestSchema.index({ referrerId: 1, status: 1 });
referralRequestSchema.index({ userId: 1, companyId: 1 });

export const ReferralRequest = mongoose.model<IReferralRequest>('ReferralRequest', referralRequestSchema);
