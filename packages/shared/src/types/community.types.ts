import type { ObjectId, ISODateString, BaseEntity } from './common.types';
import type {
  PostVisibility,
  CommunityPrivacy,
  CommunityMemberRole,
  TargetType,
} from '../constants/enums.constants';

export interface PostMedia {
  type: 'image' | 'video' | 'document';
  url: string;
  publicId?: string;
  name?: string;
}

export interface Post extends BaseEntity {
  userId: ObjectId;
  communityId?: ObjectId;
  title?: string;
  content: string;
  media: PostMedia[];
  tags: string[];
  likesCount: number;
  commentsCount: number;
  bookmarksCount: number;
  viewsCount: number;
  visibility: PostVisibility;
  status: 'active' | 'archived' | 'flagged';
  isEdited: boolean;
}

export interface Comment extends BaseEntity {
  postId: ObjectId;
  userId: ObjectId;
  content: string;
  likesCount: number;
  repliesCount: number;
  isEdited: boolean;
  status: 'active' | 'flagged';
}

export interface Reply extends BaseEntity {
  commentId: ObjectId;
  userId: ObjectId;
  replyToUserId?: ObjectId;
  content: string;
  likesCount: number;
  isEdited: boolean;
  status: 'active' | 'flagged';
}

export interface Like extends BaseEntity {
  userId: ObjectId;
  targetType: TargetType;
  targetId: ObjectId;
}

export interface Bookmark extends BaseEntity {
  userId: ObjectId;
  targetType: TargetType;
  targetId: ObjectId;
  folderName?: string;
}

export interface Tag extends BaseEntity {
  name: string;
  slug: string;
  category?: string;
  usageCount: number;
}

export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
}

export interface Community extends BaseEntity {
  name: string;
  slug: string;
  description: string;
  bannerUrl?: string;
  avatarUrl?: string;
  ownerId: ObjectId;
  privacy: CommunityPrivacy;
  membersCount: number;
  topics: string[];
  rules: string[];
  status: 'active' | 'archived';
}

export interface Member extends BaseEntity {
  communityId: ObjectId;
  userId: ObjectId;
  role: CommunityMemberRole;
  status: 'active' | 'banned';
  joinedAt: ISODateString;
}
