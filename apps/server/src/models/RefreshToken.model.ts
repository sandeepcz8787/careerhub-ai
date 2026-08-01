import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRefreshToken extends Document {
  tokenHash: string;
  userId: mongoose.Types.ObjectId;
  sessionId: mongoose.Types.ObjectId;
  isRevoked: boolean;
  replacedByTokenId?: mongoose.Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRefreshTokenModel extends Model<IRefreshToken> {
  findByTokenHash(tokenHash: string): Promise<IRefreshToken | null>;
  revokeTokenFamily(sessionId: mongoose.Types.ObjectId): Promise<number>;
}

const refreshTokenSchema = new Schema<IRefreshToken, IRefreshTokenModel>(
  {
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
      index: true,
    },
    isRevoked: {
      type: Boolean,
      default: false,
      index: true,
    },
    replacedByTokenId: {
      type: Schema.Types.ObjectId,
      ref: 'RefreshToken',
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

refreshTokenSchema.statics['findByTokenHash'] = function (tokenHash: string) {
  return this.findOne({ tokenHash });
};

/** Revokes all refresh tokens in a session family when token reuse / replay attack is detected */
refreshTokenSchema.statics['revokeTokenFamily'] = async function (sessionId: mongoose.Types.ObjectId) {
  const result = await this.updateMany({ sessionId, isRevoked: false }, { $set: { isRevoked: true } });
  return result.modifiedCount;
};

export const RefreshToken = mongoose.model<IRefreshToken, IRefreshTokenModel>('RefreshToken', refreshTokenSchema);
