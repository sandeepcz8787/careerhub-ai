import { z } from 'zod';
import { MessageType } from '../constants/enums.constants';

export const createConversationSchema = z.object({
  participants: z.array(z.string()).min(1, 'At least one participant is required'),
  isGroup: z.boolean().default(false),
  title: z.string().optional(),
  groupAvatarUrl: z.string().url().optional(),
});

export const sendMessageSchema = z.object({
  conversationId: z.string().min(1, 'Conversation ID is required'),
  type: z.nativeEnum(MessageType).default(MessageType.TEXT),
  text: z.string().optional(),
  attachments: z
    .array(
      z.object({
        fileUrl: z.string().url(),
        fileType: z.string(),
        fileName: z.string(),
        sizeBytes: z.number(),
      }),
    )
    .default([]),
  replyToId: z.string().optional(),
});

export const updateNotificationPreferencesSchema = z.object({
  emailAlerts: z.boolean().optional(),
  pushAlerts: z.boolean().optional(),
  inAppAlerts: z.boolean().optional(),
  enabledTypes: z.array(z.string()).optional(),
});
