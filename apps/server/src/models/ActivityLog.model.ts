import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IActivityLog extends Document {
  userId: Schema.Types.ObjectId;
  activityType: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  timestamp: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    ...baseFields,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    activityType: { type: String, required: true, index: true },
    metadata: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(activityLogSchema);

activityLogSchema.index({ userId: 1, timestamp: -1 });

export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);
