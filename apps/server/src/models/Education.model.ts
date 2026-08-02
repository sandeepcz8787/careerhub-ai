import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IEducation extends Document {
  userId: Schema.Types.ObjectId;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  grade?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  activities?: string;
}

const educationSchema = new Schema<IEducation>(
  {
    ...baseFields,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    institution: { type: String, required: true, trim: true, index: true },
    degree: { type: String, required: true, trim: true },
    fieldOfStudy: { type: String, required: true, trim: true },
    grade: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
    activities: { type: String },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(educationSchema);

educationSchema.index({ userId: 1, startDate: -1 });

export const Education = mongoose.model<IEducation>('Education', educationSchema);
