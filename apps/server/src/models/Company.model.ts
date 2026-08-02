import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface ICompany extends Document {
  name: string;
  slug: string;
  industry: string;
  logoUrl?: string;
  website?: string;
  headquarters?: string;
  employeeCount?: string;
  description?: string;
  benefits: string[];
  socialLinks: Array<{ platform: string; url: string }>;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
}

const companySchema = new Schema<ICompany>(
  {
    ...baseFields,
    name: { type: String, required: true, unique: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    industry: { type: String, required: true, index: true },
    logoUrl: { type: String },
    website: { type: String },
    headquarters: { type: String, index: true },
    employeeCount: { type: String },
    description: { type: String },
    benefits: { type: [String], default: [] },
    socialLinks: [
      {
        platform: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(companySchema);

companySchema.index({ name: 'text', industry: 'text', description: 'text' });
companySchema.index({ rating: -1 });

export const Company = mongoose.model<ICompany>('Company', companySchema);
