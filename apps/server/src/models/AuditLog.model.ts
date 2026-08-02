import mongoose, { Schema, Document } from 'mongoose';
import { AuditAction } from '@careerhub/shared';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IAuditLog extends Document {
  userId?: Schema.Types.ObjectId;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  changes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    ...baseFields,
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    action: {
      type: String,
      enum: Object.values(AuditAction),
      required: true,
      index: true,
    },
    resource: { type: String, required: true, index: true },
    resourceId: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
    changes: { type: Schema.Types.Mixed },
    metadata: { type: Schema.Types.Mixed },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(auditLogSchema);

auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ resource: 1, resourceId: 1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
