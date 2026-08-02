import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface ICertificate extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
  mediaUrl?: string;
}

const certificateSchema = new Schema<ICertificate>(
  {
    ...baseFields,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date },
    credentialId: { type: String, trim: true },
    credentialUrl: { type: String, trim: true },
    mediaUrl: { type: String },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(certificateSchema);

certificateSchema.index({ userId: 1, issueDate: -1 });

export const Certificate = mongoose.model<ICertificate>('Certificate', certificateSchema);
