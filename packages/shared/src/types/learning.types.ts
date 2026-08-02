import type { ObjectId, ISODateString, BaseEntity } from './common.types';
import type { CourseLevel, CourseStatus } from '../constants/enums.constants';

export interface Folder extends BaseEntity {
  userId: ObjectId;
  name: string;
  color?: string;
  parentFolderId?: ObjectId;
}

export interface Note extends BaseEntity {
  userId: ObjectId;
  folderId?: ObjectId;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
}

export interface Document extends BaseEntity {
  userId: ObjectId;
  folderId?: ObjectId;
  title: string;
  fileUrl: string;
  mimeType: string;
  sizeBytes: number;
  tags: string[];
}

export interface StudyMaterial extends BaseEntity {
  title: string;
  description: string;
  category: string;
  tags: string[];
  url: string;
  format: 'pdf' | 'video' | 'article' | 'cheatsheet';
  upvotesCount: number;
  createdBy: ObjectId;
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  lessons: Array<{
    id: string;
    title: string;
    durationMinutes: number;
    videoUrl?: string;
    content?: string;
  }>;
}

export interface Course extends BaseEntity {
  title: string;
  slug: string;
  description: string;
  instructorName: string;
  level: CourseLevel;
  modules: CourseModule[];
  durationMinutes: number;
  rating: number;
  enrolledCount: number;
  status: CourseStatus;
}

export interface Progress extends BaseEntity {
  userId: ObjectId;
  courseId: ObjectId;
  completedLessonIds: string[];
  percentComplete: number;
  lastAccessedAt: ISODateString;
}
