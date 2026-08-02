import { z } from 'zod';
import { ReportReason, TicketPriority, TargetType } from '../constants/enums.constants';

export const createReportSchema = z.object({
  targetType: z.nativeEnum(TargetType),
  targetId: z.string().min(1, 'Target ID is required'),
  reason: z.nativeEnum(ReportReason),
  description: z.string().optional(),
});

export const createSupportTicketSchema = z.object({
  subject: z.string().min(5, 'Subject is required').max(150),
  description: z.string().min(10, 'Description is required'),
  priority: z.nativeEnum(TicketPriority).default(TicketPriority.MEDIUM),
  category: z.string().min(1, 'Category is required'),
});

export const createFeedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  category: z.string().min(1),
  feedbackText: z.string().min(5),
});
