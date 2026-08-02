import mongoose, { Schema, Document } from 'mongoose';
import { MessageType } from '@careerhub/shared';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IMessageAttachment {
  fileUrl: string;
  fileType: string;
  fileName: string;
  sizeBytes: number;
}

export interface IMessage extends Document {
  conversationId: Schema.Types.ObjectId;
  senderId: Schema.Types.ObjectId;
  type: MessageType;
  text?: string;
  attachments: IMessageAttachment[];
  readBy: Schema.Types.ObjectId[];
  replyToId?: Schema.Types.ObjectId;
  isEdited: boolean;
}

const attachmentSchema = new Schema(
  {
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    fileName: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
  },
  { _id: false },
);

const messageSchema = new Schema<IMessage>(
  {
    ...baseFields,
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: Object.values(MessageType),
      default: MessageType.TEXT,
    },
    text: { type: String },
    attachments: { type: [attachmentSchema], default: [] },
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    replyToId: { type: Schema.Types.ObjectId, ref: 'Message' },
    isEdited: { type: Boolean, default: false },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(messageSchema);

messageSchema.index({ conversationId: 1, createdAt: -1 });

export const Message = mongoose.model<IMessage>('Message', messageSchema);
