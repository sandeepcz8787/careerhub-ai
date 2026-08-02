import { z } from 'zod';
import {
  JobStatus,
  EmploymentType,
  RemoteOption,
  ExperienceLevel,
  ApplicationStatus,
  ApplicationStage,
  InterviewType,
  ReferralStatus,
} from '../constants/enums.constants';

export const createJobSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters').max(150),
  description: z.string().min(10, 'Job description must be detailed'),
  requirements: z.array(z.string()).min(1, 'At least one requirement is required'),
  salary: z
    .object({
      min: z.number().min(0),
      max: z.number().min(0),
      currency: z.string().default('USD'),
      period: z.enum(['yearly', 'monthly', 'hourly']).default('yearly'),
    })
    .optional(),
  location: z.string().min(1, 'Location is required'),
  employmentType: z.nativeEnum(EmploymentType),
  remoteOption: z.nativeEnum(RemoteOption),
  experienceRequired: z.nativeEnum(ExperienceLevel),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  companyId: z.string().min(1, 'Company ID is required'),
  deadline: z.string().optional(),
  status: z.nativeEnum(JobStatus).default(JobStatus.PUBLISHED),
});

export const updateJobSchema = createJobSchema.partial();

export const createCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required').max(100),
  industry: z.string().min(1, 'Industry is required'),
  logoUrl: z.string().url().optional(),
  website: z.string().url().optional(),
  headquarters: z.string().optional(),
  employeeCount: z.string().optional(),
  description: z.string().optional(),
  benefits: z.array(z.string()).default([]),
  socialLinks: z
    .array(
      z.object({
        platform: z.string(),
        url: z.string().url(),
      }),
    )
    .default([]),
});

export const applyJobSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  resumeId: z.string().min(1, 'Resume ID is required'),
  coverLetterId: z.string().optional(),
  notes: z.string().optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.nativeEnum(ApplicationStatus),
  currentStage: z.nativeEnum(ApplicationStage).optional(),
  notes: z.string().optional(),
});

export const scheduleInterviewSchema = z.object({
  applicationId: z.string().min(1, 'Application ID is required'),
  type: z.nativeEnum(InterviewType),
  scheduledAt: z.string(),
  durationMinutes: z.number().min(15).max(480).default(60),
  meetingUrl: z.string().url().optional(),
});

export const createReferralRequestSchema = z.object({
  referrerId: z.string().min(1, 'Referrer user ID is required'),
  companyId: z.string().min(1, 'Company ID is required'),
  jobId: z.string().optional(),
  message: z.string().min(10, 'Referral request message is required'),
  resumeId: z.string().min(1, 'Resume ID is required'),
});

export const createJobAlertSchema = z.object({
  title: z.string().min(1, 'Alert title is required'),
  keywords: z.array(z.string()).default([]),
  location: z.string().optional(),
  salaryMin: z.number().optional(),
  employmentTypes: z.array(z.nativeEnum(EmploymentType)).default([]),
  frequency: z.enum(['daily', 'weekly', 'instant']).default('daily'),
});
