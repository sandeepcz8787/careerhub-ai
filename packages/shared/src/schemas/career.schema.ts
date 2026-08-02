import { z } from 'zod';
import { LanguageProficiency } from '../constants/enums.constants';

export const createResumeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  templateId: z.string().optional(),
  sections: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      type: z.enum(['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'custom']),
      content: z.record(z.unknown()),
      order: z.number(),
    }),
  ),
  isPrimary: z.boolean().default(false),
  fileUrl: z.string().url().optional(),
});

export const updateResumeSchema = createResumeSchema.partial();

export const createCoverLetterSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  content: z.string().min(1, 'Content is required'),
  targetCompany: z.string().optional(),
  targetRole: z.string().optional(),
  jobId: z.string().optional(),
  template: z.string().optional(),
});

export const createCertificateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  issueDate: z.string().datetime(),
  expiryDate: z.string().datetime().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url().optional(),
  mediaUrl: z.string().url().optional(),
});

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  description: z.string().min(1, 'Description is required'),
  role: z.string().optional(),
  techStack: z.array(z.string()),
  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  mediaUrls: z.array(z.string().url()).default([]),
  startDate: z.string(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

export const createExperienceSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role is required'),
  location: z.string().optional(),
  employmentType: z.string().default('full_time'),
  startDate: z.string(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  achievements: z.array(z.string()).default([]),
  skillsUsed: z.array(z.string()).default([]),
  description: z.string().optional(),
});

export const createEducationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  fieldOfStudy: z.string().min(1, 'Field of study is required'),
  grade: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  activities: z.string().optional(),
});

export const createLanguageSchema = z.object({
  language: z.string().min(1, 'Language name is required'),
  proficiency: z.nativeEnum(LanguageProficiency),
});
