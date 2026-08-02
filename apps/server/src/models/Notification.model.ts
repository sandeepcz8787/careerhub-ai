import mongoose, { Schema, Document } from 'mongoose';
import { NotificationType, TargetType } from '@careerhub/shared';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface INotification extends Document {
  targetUserId: Schema.Types.ObjectId;
  actorId?: Schema.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  referenceId?: Schema.Types.ObjectId;
  referenceType?: TargetType;
  isRead: boolean;
  readAt?: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    ...baseFields,
    targetUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    actorId: { type: Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    referenceId: { type: Schema.Types.ObjectId },
    referenceType: { type: String, enum: Object.values(TargetType) },
    isRead: { type: Boolean, default: false, index: true },
    readAt: { type: Date },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(notificationSchema);

notificationSchema.index({ targetUserId: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
