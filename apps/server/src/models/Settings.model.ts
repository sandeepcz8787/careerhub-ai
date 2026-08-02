import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface ISettings extends Document {
  key: string;
  value: unknown;
  description?: string;
  isPublic: boolean;
  category: string;
}

const settingsSchema = new Schema<ISettings>(
  {
    ...baseFields,
    key: { type: String, required: true, unique: true, index: true },
    value: { type: Schema.Types.Mixed, required: true },
    description: { type: String },
    isPublic: { type: Boolean, default: false },
    category: { type: String, required: true, default: 'general', index: true },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(settingsSchema);

export const Settings = mongoose.model<ISettings>('Settings', settingsSchema);
