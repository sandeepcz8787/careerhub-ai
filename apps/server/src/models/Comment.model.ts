import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IComment extends Document {
  postId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  content: string;
  likesCount: number;
  repliesCount: number;
  isEdited: boolean;
}

const commentSchema = new Schema<IComment>(
  {
    ...baseFields,
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true },
    likesCount: { type: Number, default: 0 },
    repliesCount: { type: Number, default: 0 },
    isEdited: { type: Boolean, default: false },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(commentSchema);

commentSchema.index({ postId: 1, createdAt: -1 });

export const Comment = mongoose.model<IComment>('Comment', commentSchema);
