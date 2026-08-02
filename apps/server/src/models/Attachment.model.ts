import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IAttachment extends Document {
  messageId: Schema.Types.ObjectId;
  conversationId: Schema.Types.ObjectId;
  uploaderId: Schema.Types.ObjectId;
  fileUrl: string;
  fileType: string;
  fileName: string;
  sizeBytes: number;
}

const attachmentSchema = new Schema<IAttachment>(
  {
    ...baseFields,
    messageId: { type: Schema.Types.ObjectId, ref: 'Message', required: true, index: true },
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    uploaderId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    fileName: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(attachmentSchema);

export const Attachment = mongoose.model<IAttachment>('Attachment', attachmentSchema);
