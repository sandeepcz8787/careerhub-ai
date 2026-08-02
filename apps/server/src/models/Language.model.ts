import mongoose, { Schema, Document } from 'mongoose';
import { LanguageProficiency } from '@careerhub/shared';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface ILanguage extends Document {
  userId: Schema.Types.ObjectId;
  language: string;
  proficiency: LanguageProficiency;
}

const languageSchema = new Schema<ILanguage>(
  {
    ...baseFields,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    language: { type: String, required: true, trim: true },
    proficiency: {
      type: String,
      enum: Object.values(LanguageProficiency),
      default: LanguageProficiency.PROFESSIONAL_WORKING,
    },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(languageSchema);

languageSchema.index({ userId: 1, language: 1 });

export const Language = mongoose.model<ILanguage>('Language', languageSchema);
