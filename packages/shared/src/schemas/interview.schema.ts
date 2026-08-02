import { z } from 'zod';
import { QuestionDifficulty, CodingLanguage } from '../constants/enums.constants';

export const createInterviewExperienceSchema = z.object({
  companyId: z.string().min(1, 'Company ID is required'),
  roleTitle: z.string().min(1, 'Role title is required'),
  difficulty: z.nativeEnum(QuestionDifficulty),
  outcome: z.enum(['offered', 'rejected', 'pending']),
  rounds: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      questions: z.array(z.string()),
    }),
  ),
  content: z.string().min(20, 'Content must be detailed'),
});

export const createInterviewQuestionSchema = z.object({
  title: z.string().min(5).max(200),
  content: z.string().min(10),
  category: z.string().min(1),
  companyIds: z.array(z.string()).default([]),
  roleTypes: z.array(z.string()).default([]),
  difficulty: z.nativeEnum(QuestionDifficulty),
  tags: z.array(z.string()).default([]),
});

export const submitChallengeSchema = z.object({
  challengeId: z.string().min(1, 'Challenge ID is required'),
  code: z.string().min(1, 'Code cannot be empty'),
  language: z.nativeEnum(CodingLanguage),
});

export const scheduleMockInterviewSchema = z.object({
  type: z.enum(['ai', 'peer']),
  peerId: z.string().optional(),
  targetRole: z.string().min(1, 'Target role is required'),
  scheduledAt: z.string().optional(),
  durationMinutes: z.number().min(15).max(120).default(45),
});
