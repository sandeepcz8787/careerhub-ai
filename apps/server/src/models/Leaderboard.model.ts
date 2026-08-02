import mongoose, { Schema, Document } from 'mongoose';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface ILeaderboard extends Document {
  period: 'weekly' | 'monthly' | 'all_time';
  domain: 'coding' | 'mock_interviews' | 'contributions';
  userId: Schema.Types.ObjectId;
  points: number;
  rank: number;
  metadata?: Record<string, unknown>;
}

const leaderboardSchema = new Schema<ILeaderboard>(
  {
    ...baseFields,
    period: { type: String, enum: ['weekly', 'monthly', 'all_time'], required: true, index: true },
    domain: {
      type: String,
      enum: ['coding', 'mock_interviews', 'contributions'],
      required: true,
      index: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    points: { type: Number, required: true, default: 0 },
    rank: { type: Number, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(leaderboardSchema);

leaderboardSchema.index({ period: 1, domain: 1, points: -1 });
leaderboardSchema.index({ period: 1, domain: 1, userId: 1 }, { unique: true });

export const Leaderboard = mongoose.model<ILeaderboard>('Leaderboard', leaderboardSchema);
