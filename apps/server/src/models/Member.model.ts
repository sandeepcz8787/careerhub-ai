import mongoose, { Schema, Document } from 'mongoose';
import { CommunityMemberRole } from '@careerhub/shared';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IMember extends Document {
  communityId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  role: CommunityMemberRole;
  joinedAt: Date;
}

const memberSchema = new Schema<IMember>(
  {
    ...baseFields,
    communityId: { type: Schema.Types.ObjectId, ref: 'Community', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: {
      type: String,
      enum: Object.values(CommunityMemberRole),
      default: CommunityMemberRole.MEMBER,
    },
    joinedAt: { type: Date, default: Date.now },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(memberSchema);

memberSchema.index({ communityId: 1, userId: 1 }, { unique: true });

export const Member = mongoose.model<IMember>('Member', memberSchema);
