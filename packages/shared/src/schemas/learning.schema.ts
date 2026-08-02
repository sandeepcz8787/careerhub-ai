import { z } from 'zod';
import { CourseLevel } from '../constants/enums.constants';

export const createNoteSchema = z.object({
  folderId: z.string().optional(),
  title: z.string().min(1, 'Title is required').max(150),
  content: z.string().min(1, 'Content is required'),
  tags: z.array(z.string()).default([]),
  isPinned: z.boolean().default(false),
});

export const createFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required').max(80),
  color: z.string().optional(),
  parentFolderId: z.string().optional(),
});

export const uploadDocumentSchema = z.object({
  folderId: z.string().optional(),
  title: z.string().min(1, 'Document title is required'),
  fileUrl: z.string().url('Invalid file URL'),
  mimeType: z.string().min(1),
  sizeBytes: z.number().min(1),
  tags: z.array(z.string()).default([]),
});

export const createCourseSchema = z.object({
  title: z.string().min(3).max(150),
  description: z.string().min(10),
  instructorName: z.string().min(1),
  level: z.nativeEnum(CourseLevel),
  durationMinutes: z.number().min(1),
});
