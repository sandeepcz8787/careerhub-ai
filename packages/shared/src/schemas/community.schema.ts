import { z } from 'zod';
import { PostVisibility, CommunityPrivacy, TargetType } from '../constants/enums.constants';

export const createPostSchema = z.object({
  communityId: z.string().optional(),
  title: z.string().max(200).optional(),
  content: z.string().min(1, 'Post content cannot be empty'),
  media: z
    .array(
      z.object({
        type: z.enum(['image', 'video', 'document']),
        url: z.string().url(),
        publicId: z.string().optional(),
        name: z.string().optional(),
      }),
    )
    .default([]),
  tags: z.array(z.string()).default([]),
  visibility: z.nativeEnum(PostVisibility).default(PostVisibility.PUBLIC),
});

export const createCommentSchema = z.object({
  postId: z.string().min(1, 'Post ID is required'),
  content: z.string().min(1, 'Comment content cannot be empty'),
});

export const createReplySchema = z.object({
  commentId: z.string().min(1, 'Comment ID is required'),
  replyToUserId: z.string().optional(),
  content: z.string().min(1, 'Reply content cannot be empty'),
});

export const toggleLikeSchema = z.object({
  targetType: z.nativeEnum(TargetType),
  targetId: z.string().min(1, 'Target ID is required'),
});

export const toggleBookmarkSchema = z.object({
  targetType: z.nativeEnum(TargetType),
  targetId: z.string().min(1, 'Target ID is required'),
  folderName: z.string().optional(),
});

export const createCommunitySchema = z.object({
  name: z.string().min(3, 'Community name must be at least 3 characters').max(80),
  description: z.string().min(10, 'Description must be detailed'),
  bannerUrl: z.string().url().optional(),
  avatarUrl: z.string().url().optional(),
  privacy: z.nativeEnum(CommunityPrivacy).default(CommunityPrivacy.PUBLIC),
  topics: z.array(z.string()).default([]),
  rules: z.array(z.string()).default([]),
});
