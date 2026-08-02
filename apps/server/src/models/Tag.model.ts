import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface ITag extends Document {
  name: string;
  slug: string;
  category?: string;
  usageCount: number;
}

const tagSchema = new Schema<ITag>(
  {
    ...baseFields,
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, index: true },
    usageCount: { type: Number, default: 0, index: true },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(tagSchema);

export const Tag = mongoose.model<ITag>('Tag', tagSchema);
