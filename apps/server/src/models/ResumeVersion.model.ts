import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IResumeVersion extends Document {
  resumeId: Schema.Types.ObjectId;
  versionNumber: number;
  title: string;
  templateId?: Schema.Types.ObjectId;
  sections: any[];
  customization: Record<string, any>;
  createdReason?: string;
  status: string;
  createdBy?: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const resumeVersionSchema = new Schema<IResumeVersion>(
  {
    ...baseFields,
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', required: true, index: true },
    versionNumber: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    templateId: { type: Schema.Types.ObjectId, ref: 'ResumeTemplate' },
    sections: { type: [Schema.Types.Mixed] as any, default: [] },
    customization: { type: Schema.Types.Mixed, default: {} },
    createdReason: { type: String, trim: true },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(resumeVersionSchema);

resumeVersionSchema.index({ resumeId: 1, versionNumber: -1 });

export const ResumeVersion = mongoose.model<IResumeVersion>('ResumeVersion', resumeVersionSchema);
