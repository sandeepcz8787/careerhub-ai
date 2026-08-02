import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IAchievement extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  issuer: string;
  date: Date;
  description?: string;
  certificateUrl?: string;
}

const achievementSchema = new Schema<IAchievement>(
  {
    ...baseFields,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    description: { type: String },
    certificateUrl: { type: String },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(achievementSchema);

achievementSchema.index({ userId: 1, date: -1 });

export const Achievement = mongoose.model<IAchievement>('Achievement', achievementSchema);
