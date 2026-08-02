import mongoose, { Schema, Document } from 'mongoose';
import { PostVisibility } from '@careerhub/shared';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IPostMedia {
  type: 'image' | 'video' | 'document';
  url: string;
  publicId?: string;
  name?: string;
}

export interface IPost extends Document {
  userId: Schema.Types.ObjectId;
  communityId?: Schema.Types.ObjectId;
  title?: string;
  content: string;
  media: IPostMedia[];
  tags: string[];
  likesCount: number;
  commentsCount: number;
  bookmarksCount: number;
  viewsCount: number;
  visibility: PostVisibility;
  status: string;
  isEdited: boolean;
}

const postMediaSchema = new Schema(
  {
    type: { type: String, enum: ['image', 'video', 'document'], required: true },
    url: { type: String, required: true },
    publicId: { type: String },
    name: { type: String },
  },
  { _id: false },
);

const postSchema = new Schema<IPost>(
  {
    ...baseFields,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    communityId: { type: Schema.Types.ObjectId, ref: 'Community', index: true },
    title: { type: String, trim: true },
    content: { type: String, required: true },
    media: { type: [postMediaSchema], default: [] },
    tags: { type: [String], default: [], index: true },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    bookmarksCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
    visibility: {
      type: String,
      enum: Object.values(PostVisibility),
      default: PostVisibility.PUBLIC,
      index: true,
    },
    isEdited: { type: Boolean, default: false },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(postSchema);

postSchema.index({ title: 'text', content: 'text', tags: 'text' });
postSchema.index({ communityId: 1, createdAt: -1 });
postSchema.index({ userId: 1, createdAt: -1 });

export const Post = mongoose.model<IPost>('Post', postSchema);
