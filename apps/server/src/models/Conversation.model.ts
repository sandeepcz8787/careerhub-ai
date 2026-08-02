import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IConversation extends Document {
  participants: Schema.Types.ObjectId[];
  lastMessageId?: Schema.Types.ObjectId;
  lastMessageText?: string;
  lastMessageAt?: Date;
  isGroup: boolean;
  title?: string;
  groupAvatarUrl?: string;
  status: string;
}

const conversationSchema = new Schema<IConversation>(
  {
    ...baseFields,
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }],
    lastMessageId: { type: Schema.Types.ObjectId, ref: 'Message' },
    lastMessageText: { type: String },
    lastMessageAt: { type: Date, index: true },
    isGroup: { type: Boolean, default: false },
    title: { type: String, trim: true },
    groupAvatarUrl: { type: String },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(conversationSchema);

conversationSchema.index({ participants: 1, lastMessageAt: -1 });

export const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);
