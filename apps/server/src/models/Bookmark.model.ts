import mongoose, { Schema, Document } from 'mongoose';
import { TargetType } from '@careerhub/shared';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IBookmark extends Document {
  userId: Schema.Types.ObjectId;
  targetType: TargetType;
  targetId: Schema.Types.ObjectId;
  folderName?: string;
}

const bookmarkSchema = new Schema<IBookmark>(
  {
    ...baseFields,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetType: {
      type: String,
      enum: Object.values(TargetType),
      required: true,
      index: true,
    },
    targetId: { type: Schema.Types.ObjectId, required: true, index: true },
    folderName: { type: String, default: 'General' },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(bookmarkSchema);

bookmarkSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true });

export const Bookmark = mongoose.model<IBookmark>('Bookmark', bookmarkSchema);
