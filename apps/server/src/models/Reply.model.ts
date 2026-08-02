import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IReply extends Document {
  commentId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  replyToUserId?: Schema.Types.ObjectId;
  content: string;
  likesCount: number;
  isEdited: boolean;
}

const replySchema = new Schema<IReply>(
  {
    ...baseFields,
    commentId: { type: Schema.Types.ObjectId, ref: 'Comment', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    replyToUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    likesCount: { type: Number, default: 0 },
    isEdited: { type: Boolean, default: false },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(replySchema);

replySchema.index({ commentId: 1, createdAt: 1 });

export const Reply = mongoose.model<IReply>('Reply', replySchema);
