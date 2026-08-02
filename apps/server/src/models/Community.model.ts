import mongoose, { Schema, Document } from 'mongoose';
import { CommunityPrivacy } from '@careerhub/shared';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface ICommunity extends Document {
  name: string;
  slug: string;
  description: string;
  bannerUrl?: string;
  avatarUrl?: string;
  ownerId: Schema.Types.ObjectId;
  privacy: CommunityPrivacy;
  membersCount: number;
  topics: string[];
  rules: string[];
  status: string;
}

const communitySchema = new Schema<ICommunity>(
  {
    ...baseFields,
    name: { type: String, required: true, unique: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    bannerUrl: { type: String },
    avatarUrl: { type: String },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    privacy: {
      type: String,
      enum: Object.values(CommunityPrivacy),
      default: CommunityPrivacy.PUBLIC,
      index: true,
    },
    membersCount: { type: Number, default: 1 },
    topics: { type: [String], default: [] },
    rules: { type: [String], default: [] },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(communitySchema);

communitySchema.index({ name: 'text', description: 'text', topics: 'text' });

export const Community = mongoose.model<ICommunity>('Community', communitySchema);
