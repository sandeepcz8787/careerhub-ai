import mongoose, { Schema, Document } from 'mongoose';
import { TicketPriority, TicketStatus } from '@careerhub/shared';
import { applyGlobalPlugins, baseFields, baseSchemaOptions } from './base.schema';

export interface ISupportTicketResponse {
  senderId: Schema.Types.ObjectId;
  message: string;
  createdAt: Date;
}

export interface ISupportTicket extends Document {
  userId: Schema.Types.ObjectId;
  ticketNumber: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  category: string;
  status: TicketStatus;
  assignedTo?: Schema.Types.ObjectId;
  responses: ISupportTicketResponse[];
}

const responseSchema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const supportTicketSchema = new Schema<ISupportTicket>(
  {
    ...baseFields,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    ticketNumber: { type: String, required: true, unique: true, index: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    priority: {
      type: String,
      enum: Object.values(TicketPriority),
      default: TicketPriority.MEDIUM,
      index: true,
    },
    category: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: Object.values(TicketStatus),
      default: TicketStatus.OPEN,
      index: true,
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    responses: { type: [responseSchema], default: [] },
  },
  baseSchemaOptions,
);

applyGlobalPlugins(supportTicketSchema);

supportTicketSchema.index({ userId: 1, createdAt: -1 });

export const SupportTicket = mongoose.model<ISupportTicket>('SupportTicket', supportTicketSchema);
