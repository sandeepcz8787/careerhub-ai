import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface INote extends Document {
  userId: Schema.Types.ObjectId;
  folderId?: Schema.Types.ObjectId;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
}

const noteSchema = new Schema<INote>(
  {
    ...baseFields,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    folderId: { type: Schema.Types.ObjectId, ref: 'Folder', index: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [], index: true },
    isPinned: { type: Boolean, default: false },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(noteSchema);

noteSchema.index({ title: 'text', content: 'text', tags: 'text' });
noteSchema.index({ userId: 1, isPinned: -1, updatedAt: -1 });

export const Note = mongoose.model<INote>('Note', noteSchema);
