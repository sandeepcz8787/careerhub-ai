import mongoose, { Schema, Document } from 'mongoose';
import { JobStatus, EmploymentType, RemoteOption, ExperienceLevel } from '@careerhub/shared';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface ISalaryRange {
  min: number;
  max: number;
  currency: string;
  period: 'yearly' | 'monthly' | 'hourly';
}

export interface IJob extends Document {
  title: string;
  description: string;
  requirements: string[];
  salary?: ISalaryRange;
  location: string;
  employmentType: EmploymentType;
  remoteOption: RemoteOption;
  experienceRequired: ExperienceLevel;
  skills: string[];
  recruiterId: Schema.Types.ObjectId;
  companyId: Schema.Types.ObjectId;
  status: JobStatus;
  deadline?: Date;
  applicantsCount: number;
  viewsCount: number;
  createdBy?: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const salaryRangeSchema = new Schema(
  {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    period: { type: String, enum: ['yearly', 'monthly', 'hourly'], default: 'yearly' },
  },
  { _id: false },
);

const jobSchema = new Schema<IJob>(
  {
    ...baseFields,
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true },
    requirements: { type: [String], required: true },
    salary: { type: salaryRangeSchema },
    location: { type: String, required: true, index: true },
    employmentType: {
      type: String,
      enum: Object.values(EmploymentType),
      required: true,
      index: true,
    },
    remoteOption: {
      type: String,
      enum: Object.values(RemoteOption),
      required: true,
      index: true,
    },
    experienceRequired: {
      type: String,
      enum: Object.values(ExperienceLevel),
      required: true,
      index: true,
    },
    skills: { type: [String], required: true, index: true },
    recruiterId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    status: {
      type: String,
      enum: Object.values(JobStatus),
      default: JobStatus.PUBLISHED,
      index: true,
    },
    deadline: { type: Date, index: true },
    applicantsCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(jobSchema);

jobSchema.index({ title: 'text', description: 'text', skills: 'text' });
jobSchema.index({ companyId: 1, status: 1, createdAt: -1 });
jobSchema.index({ location: 1, employmentType: 1, status: 1 });

export const Job = mongoose.model<IJob>('Job', jobSchema);
