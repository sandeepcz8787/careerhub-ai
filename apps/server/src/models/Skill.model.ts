import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface ISkill extends Document {
  name: string;
  slug: string;
  category: string;
  usageCount: number;
  isVerified: boolean;
}

const skillSchema = new Schema<ISkill>(
  {
    ...baseFields,
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true, index: true },
    usageCount: { type: Number, default: 0, index: true },
    isVerified: { type: Boolean, default: false },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(skillSchema);

skillSchema.index({ name: 'text', category: 'text' });

export const Skill = mongoose.model<ISkill>('Skill', skillSchema);
