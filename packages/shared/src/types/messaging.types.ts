import type { ObjectId, ISODateString, BaseEntity } from './common.types';
import type { MessageType, NotificationType, TargetType } from '../constants/enums.constants';

export interface Conversation extends BaseEntity {
  participants: ObjectId[];
  lastMessageId?: ObjectId;
  lastMessageText?: string;
  lastMessageAt?: ISODateString;
  isGroup: boolean;
  title?: string;
  groupAvatarUrl?: string;
  status: 'active' | 'archived';
}

export interface MessageAttachment {
  fileUrl: string;
  fileType: string;
  fileName: string;
  sizeBytes: number;
}

export interface Message extends BaseEntity {
  conversationId: ObjectId;
  senderId: ObjectId;
  type: MessageType;
  text?: string;
  attachments: MessageAttachment[];
  readBy: ObjectId[];
  replyToId?: ObjectId;
  isEdited: boolean;
  isDeleted: boolean;
}

export interface Attachment extends BaseEntity {
  messageId: ObjectId;
  conversationId: ObjectId;
  uploaderId: ObjectId;
  fileUrl: string;
  fileType: string;
  fileName: string;
  sizeBytes: number;
}

export interface Notification extends BaseEntity {
  targetUserId: ObjectId;
  actorId?: ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  referenceId?: ObjectId;
  referenceType?: TargetType;
  isRead: boolean;
  readAt?: ISODateString;
}

export interface NotificationPreferences extends BaseEntity {
  userId: ObjectId;
  emailAlerts: boolean;
  pushAlerts: boolean;
  inAppAlerts: boolean;
  enabledTypes: NotificationType[];
}
