import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IStudyMaterial extends Document {
  title: string;
  description: string;
  category: string;
  tags: string[];
  url: string;
  format: 'pdf' | 'video' | 'article' | 'cheatsheet';
  upvotesCount: number;
  createdBy?: Schema.Types.ObjectId;
}

const studyMaterialSchema = new Schema<IStudyMaterial>(
  {
    ...baseFields,
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    tags: { type: [String], default: [], index: true },
    url: { type: String, required: true },
    format: {
      type: String,
      enum: ['pdf', 'video', 'article', 'cheatsheet'],
      required: true,
    },
    upvotesCount: { type: Number, default: 0 },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(studyMaterialSchema);

studyMaterialSchema.index({ title: 'text', description: 'text', tags: 'text' });

export const StudyMaterial = mongoose.model<IStudyMaterial>('StudyMaterial', studyMaterialSchema);
