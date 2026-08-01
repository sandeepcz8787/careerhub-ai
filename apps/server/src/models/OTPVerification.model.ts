import mongoose, { Schema, Document, Model } from 'mongoose';
import { OtpPurpose } from '@careerhub/shared';

export interface IOTPVerification extends Document {
  email: string;
  otpHash: string;
  purpose: OtpPurpose;
  attempts: number;
  resendCount: number;
  lastSentAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOTPVerificationModel extends Model<IOTPVerification> {
  findLatest(email: string, purpose: OtpPurpose): Promise<IOTPVerification | null>;
}

const otpVerificationSchema = new Schema<IOTPVerification, IOTPVerificationModel>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: Object.values(OtpPurpose),
      default: OtpPurpose.EMAIL_VERIFICATION,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    resendCount: {
      type: Number,
      default: 0,
    },
    lastSentAt: {
      type: Date,
      default: Date.now,
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

otpVerificationSchema.index({ email: 1, purpose: 1 });

otpVerificationSchema.statics['findLatest'] = function (email: string, purpose: OtpPurpose) {
  return this.findOne({ email: email.toLowerCase().trim(), purpose }).sort({ createdAt: -1 });
};

export const OTPVerification = mongoose.model<IOTPVerification, IOTPVerificationModel>(
  'OTPVerification',
  otpVerificationSchema,
);
