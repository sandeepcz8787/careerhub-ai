import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IFolder extends Document {
  userId: Schema.Types.ObjectId;
  name: string;
  color?: string;
  parentFolderId?: Schema.Types.ObjectId;
}

const folderSchema = new Schema<IFolder>(
  {
    ...baseFields,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    color: { type: String, default: '#3B82F6' },
    parentFolderId: { type: Schema.Types.ObjectId, ref: 'Folder' },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(folderSchema);

folderSchema.index({ userId: 1, parentFolderId: 1 });

export const Folder = mongoose.model<IFolder>('Folder', folderSchema);
