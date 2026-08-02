import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
}

const categorySchema = new Schema<ICategory>(
  {
    ...baseFields,
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    iconUrl: { type: String },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(categorySchema);

export const Category = mongoose.model<ICategory>('Category', categorySchema);
