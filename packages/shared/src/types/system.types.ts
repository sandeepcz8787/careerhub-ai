import type { ObjectId, ISODateString, BaseEntity } from './common.types';
import type {
  AuditAction,
  ReportReason,
  ReportStatus,
  TicketPriority,
  TicketStatus,
  TargetType,
} from '../constants/enums.constants';

export interface AuditLog extends BaseEntity {
  userId?: ObjectId;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  changes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface Report extends BaseEntity {
  reporterId: ObjectId;
  targetType: TargetType;
  targetId: ObjectId;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  resolvedBy?: ObjectId;
  resolutionNotes?: string;
}

export interface SupportTicket extends BaseEntity {
  userId: ObjectId;
  ticketNumber: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  category: string;
  status: TicketStatus;
  assignedTo?: ObjectId;
  responses: Array<{
    senderId: ObjectId;
    message: string;
    createdAt: ISODateString;
  }>;
}

export interface Feedback extends BaseEntity {
  userId: ObjectId;
  rating: number;
  category: string;
  feedbackText: string;
  status: 'new' | 'reviewed' | 'addressed';
}

export interface Settings extends BaseEntity {
  key: string;
  value: unknown;
  description?: string;
  isPublic: boolean;
  category: string;
}

export interface FeatureFlag extends BaseEntity {
  key: string;
  description?: string;
  isEnabled: boolean;
  percentageRollout: number;
  allowedUserIds: ObjectId[];
}

export interface ActivityLog extends BaseEntity {
  userId: ObjectId;
  activityType: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  timestamp: ISODateString;
}
