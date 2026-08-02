import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IFeedback extends Document {
  userId: Schema.Types.ObjectId;
  rating: number;
  category: string;
  feedbackText: string;
  status: 'new' | 'reviewed' | 'addressed';
}

const feedbackSchema = new Schema<IFeedback>(
  {
    ...baseFields,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    category: { type: String, required: true, index: true },
    feedbackText: { type: String, required: true },
    status: {
      type: String,
      enum: ['new', 'reviewed', 'addressed'],
      default: 'new',
      index: true,
    },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(feedbackSchema);

export const Feedback = mongoose.model<IFeedback>('Feedback', feedbackSchema);
