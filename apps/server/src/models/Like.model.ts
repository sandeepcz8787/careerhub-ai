import mongoose, { Schema, Document } from 'mongoose';
import { TargetType } from '@careerhub/shared';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface ILike extends Document {
  userId: Schema.Types.ObjectId;
  targetType: TargetType;
  targetId: Schema.Types.ObjectId;
}

const likeSchema = new Schema<ILike>(
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
  },
  baseSchemaOptions,
);

applyGlobalPlugins(likeSchema);

likeSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true });

export const Like = mongoose.model<ILike>('Like', likeSchema);
