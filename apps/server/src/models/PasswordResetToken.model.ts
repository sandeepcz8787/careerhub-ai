import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPasswordResetToken extends Document {
  userId: mongoose.Types.ObjectId;
  tokenHash: string;
  isUsed: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPasswordResetTokenModel extends Model<IPasswordResetToken> {
  findByTokenHash(tokenHash: string): Promise<IPasswordResetToken | null>;
}

const passwordResetTokenSchema = new Schema<IPasswordResetToken, IPasswordResetTokenModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Automatic TTL cleanup
    },
  },
  {
    timestamps: true,
  },
);

passwordResetTokenSchema.statics['findByTokenHash'] = function (tokenHash: string) {
  return this.findOne({ tokenHash, isUsed: false, expiresAt: { $gt: new Date() } });
};

export const PasswordResetToken = mongoose.model<IPasswordResetToken, IPasswordResetTokenModel>(
  'PasswordResetToken',
  passwordResetTokenSchema,
);
