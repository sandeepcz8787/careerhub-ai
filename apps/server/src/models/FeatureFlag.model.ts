import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IFeatureFlag extends Document {
  key: string;
  description?: string;
  isEnabled: boolean;
  percentageRollout: number;
  allowedUserIds: Schema.Types.ObjectId[];
}

const featureFlagSchema = new Schema<IFeatureFlag>(
  {
    ...baseFields,
    key: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    isEnabled: { type: Boolean, default: false, index: true },
    percentageRollout: { type: Number, default: 100, min: 0, max: 100 },
    allowedUserIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  baseSchemaOptions,
);

applyGlobalPlugins(featureFlagSchema);

export const FeatureFlag = mongoose.model<IFeatureFlag>('FeatureFlag', featureFlagSchema);
