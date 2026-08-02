import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IMockResult extends Document {
  mockId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  feedback: string;
  transcript: Array<{ speaker: string; text: string }>;
}

const transcriptSchema = new Schema(
  {
    speaker: { type: String, required: true },
    text: { type: String, required: true },
  },
  { _id: false },
);

const mockResultSchema = new Schema<IMockResult>(
  {
    ...baseFields,
    mockId: { type: Schema.Types.ObjectId, ref: 'MockInterview', required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    overallScore: { type: Number, required: true, min: 0, max: 100 },
    communicationScore: { type: Number, required: true, min: 0, max: 100 },
    technicalScore: { type: Number, required: true, min: 0, max: 100 },
    feedback: { type: String, required: true },
    transcript: { type: [transcriptSchema], default: [] },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(mockResultSchema);

export const MockResult = mongoose.model<IMockResult>('MockResult', mockResultSchema);
