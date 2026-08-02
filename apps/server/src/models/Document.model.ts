import mongoose, { Schema, Document as MongooseDocument } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IDocument extends MongooseDocument {
  userId: Schema.Types.ObjectId;
  folderId?: Schema.Types.ObjectId;
  title: string;
  fileUrl: string;
  mimeType: string;
  sizeBytes: number;
  tags: string[];
}

const documentSchema = new Schema<IDocument>(
  {
    ...baseFields,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    folderId: { type: Schema.Types.ObjectId, ref: 'Folder', index: true },
    title: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    tags: { type: [String], default: [], index: true },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(documentSchema);

documentSchema.index({ userId: 1, createdAt: -1 });

export const DocumentModel = mongoose.model<IDocument>('Document', documentSchema);
