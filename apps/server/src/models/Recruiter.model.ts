import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IRecruiter extends Document {
  userId: Schema.Types.ObjectId;
  companyId: Schema.Types.ObjectId;
  designation: string;
  isVerified: boolean;
  department?: string;
}

const recruiterSchema = new Schema<IRecruiter>(
  {
    ...baseFields,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    designation: { type: String, required: true, trim: true },
    isVerified: { type: Boolean, default: false },
    department: { type: String },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(recruiterSchema);

export const Recruiter = mongoose.model<IRecruiter>('Recruiter', recruiterSchema);
