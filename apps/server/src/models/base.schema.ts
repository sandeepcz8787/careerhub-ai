import { SchemaDefinition, SchemaOptions } from 'mongoose';
import { softDeletePlugin } from '../plugins/softDelete.plugin';
import { paginationPlugin } from '../plugins/pagination.plugin';

export const baseFields: SchemaDefinition = {
  status: {
    type: String,
    default: 'active',
    index: true,
  },
  createdBy: {
    type: String,
    ref: 'User',
    index: true,
  },
  updatedBy: {
    type: String,
    ref: 'User',
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const baseSchemaOptions: SchemaOptions<any> = {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: Record<string, unknown>) => {
      ret['id'] = ret['_id'];
      delete ret['_id'];
      delete ret['__v'];
      delete ret['isDeleted'];
      delete ret['deletedAt'];
      delete ret['deletedBy'];
      return ret;
    },
  },
  toObject: {
    virtuals: true,
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applyGlobalPlugins(schema: any): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (schema as any).plugin(softDeletePlugin);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (schema as any).plugin(paginationPlugin);
}
