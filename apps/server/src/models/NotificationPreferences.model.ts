import mongoose, { Schema, Document } from 'mongoose';
import { NotificationType } from '@careerhub/shared';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface INotificationPreferences extends Document {
  userId: Schema.Types.ObjectId;
  emailAlerts: boolean;
  pushAlerts: boolean;
  inAppAlerts: boolean;
  enabledTypes: NotificationType[];
}

const notificationPreferencesSchema = new Schema<INotificationPreferences>(
  {
    ...baseFields,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    emailAlerts: { type: Boolean, default: true },
    pushAlerts: { type: Boolean, default: true },
    inAppAlerts: { type: Boolean, default: true },
    enabledTypes: {
      type: [String],
      enum: Object.values(NotificationType),
      default: Object.values(NotificationType),
    },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(notificationPreferencesSchema);

export const NotificationPreferences = mongoose.model<INotificationPreferences>(
  'NotificationPreferences',
  notificationPreferencesSchema,
);
