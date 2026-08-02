import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface IPermission extends Document {
  code: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
}

const permissionSchema = new Schema<IPermission>(
  {
    ...baseFields,
    code: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    resource: { type: String, required: true, index: true },
    action: { type: String, required: true },
    description: { type: String },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(permissionSchema);

export const Permission = mongoose.model<IPermission>('Permission', permissionSchema);
