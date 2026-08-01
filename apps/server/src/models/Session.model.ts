import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId;
  refreshTokenId?: mongoose.Types.ObjectId;
  ipAddress: string;
  userAgent: string;
  deviceInfo: {
    browser: string;
    os: string;
    device: string;
    type: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  };
  location?: string;
  isRevoked: boolean;
  lastSeenAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISessionModel extends Model<ISession> {
  findActiveByUserId(userId: string | mongoose.Types.ObjectId): Promise<ISession[]>;
  revokeAllForUser(userId: string | mongoose.Types.ObjectId, exceptSessionId?: string): Promise<number>;
}

const sessionSchema = new Schema<ISession, ISessionModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    refreshTokenId: {
      type: Schema.Types.ObjectId,
      ref: 'RefreshToken',
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    deviceInfo: {
      browser: { type: String, default: 'Unknown' },
      os: { type: String, default: 'Unknown' },
      device: { type: String, default: 'Unknown' },
      type: {
        type: String,
        enum: ['desktop', 'mobile', 'tablet', 'unknown'],
        default: 'unknown',
      },
    },
    location: {
      type: String,
    },
    isRevoked: {
      type: Boolean,
      default: false,
      index: true,
    },
    lastSeenAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Automatic TTL expiration index
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret['id'] = ret['_id'];
        delete ret['_id'];
        delete ret['__v'];
        return ret;
      },
    },
  },
);

sessionSchema.index({ userId: 1, isRevoked: 1 });

sessionSchema.statics['findActiveByUserId'] = function (userId: string | mongoose.Types.ObjectId) {
  return this.find({
    userId,
    isRevoked: false,
    expiresAt: { $gt: new Date() },
  }).sort({ lastSeenAt: -1 });
};

sessionSchema.statics['revokeAllForUser'] = async function (
  userId: string | mongoose.Types.ObjectId,
  exceptSessionId?: string,
) {
  const query: mongoose.FilterQuery<ISession> = { userId, isRevoked: false };
  if (exceptSessionId) {
    query._id = { $ne: exceptSessionId };
  }
  const result = await this.updateMany(query, { $set: { isRevoked: true } });
  return result.modifiedCount;
};

export const Session = mongoose.model<ISession, ISessionModel>('Session', sessionSchema);
