import { Document, Query } from 'mongoose';

export interface ISoftDeleteDocument extends Document {
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  softDelete(deletedByUserId?: string): Promise<this>;
  restore(): Promise<this>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function softDeletePlugin(schema: any): void {
  schema.add({
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    deletedBy: { type: String, ref: 'User' },
  });

  schema.pre(/^find/, function (this: Query<unknown, unknown>, next: () => void) {
    const options = this.getOptions();
    if (!options['includeDeleted']) {
      this.where({ isDeleted: { $ne: true } });
    }
    next();
  });

  schema.methods['softDelete'] = async function (deletedByUserId?: string) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    if (deletedByUserId) {
      this.deletedBy = deletedByUserId;
    }
    return this.save();
  };

  schema.methods['restore'] = async function () {
    this.isDeleted = false;
    this.deletedAt = undefined;
    this.deletedBy = undefined;
    return this.save();
  };
}
