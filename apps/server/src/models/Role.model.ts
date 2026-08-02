import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IRole extends Document {
  name: string;
  code: string;
  description?: string;
  permissions: Schema.Types.ObjectId[];
  isSystem: boolean;
}

const roleSchema = new Schema<IRole>(
  {
    ...baseFields,
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true, index: true },
    description: { type: String },
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
    isSystem: { type: Boolean, default: false },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(roleSchema);

export const Role = mongoose.model<IRole>('Role', roleSchema);
