import mongoose, { Schema, Document } from 'mongoose';
import { ReportReason, ReportStatus, TargetType } from '@careerhub/shared';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IReport extends Document {
  reporterId: Schema.Types.ObjectId;
  targetType: TargetType;
  targetId: Schema.Types.ObjectId;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  resolvedBy?: Schema.Types.ObjectId;
  resolutionNotes?: string;
}

const reportSchema = new Schema<IReport>(
  {
    ...baseFields,
    reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetType: {
      type: String,
      enum: Object.values(TargetType),
      required: true,
      index: true,
    },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
    reason: {
      type: String,
      enum: Object.values(ReportReason),
      required: true,
    },
    description: { type: String },
    status: {
      type: String,
      enum: Object.values(ReportStatus),
      default: ReportStatus.PENDING,
      index: true,
    },
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    resolutionNotes: { type: String },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(reportSchema);

reportSchema.index({ status: 1, createdAt: -1 });

export const Report = mongoose.model<IReport>('Report', reportSchema);
