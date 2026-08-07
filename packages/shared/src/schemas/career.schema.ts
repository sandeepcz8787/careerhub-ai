import { z } from 'zod';
import { LanguageProficiency, SkillProficiency, ExperienceLevel } from '../constants/enums.constants';

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

export const updateEducationSchema = createEducationSchema.partial();
export const updateExperienceSchema = createExperienceSchema.partial();
export const updateProjectSchema = createProjectSchema.partial();
export const updateCertificateSchema = createCertificateSchema.partial();
export const updateLanguageSchema = createLanguageSchema.partial();

export const createAchievementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  issuer: z.string().min(1, 'Organization/Issuer is required'),
  date: z.string(),
  description: z.string().optional(),
  certificateUrl: z.string().url().optional().or(z.literal('')),
});

export const updateAchievementSchema = createAchievementSchema.partial();

export const userSkillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  category: z.string().min(1, 'Category is required'),
  proficiency: z.nativeEnum(SkillProficiency),
  yearsOfExperience: z.number().min(0).default(0),
});

export const updateProfileDetailsSchema = z.object({
  headline: z.string().max(120).optional().or(z.literal('')),
  bio: z.string().max(2000).optional().or(z.literal('')),
  dob: z.string().optional().or(z.literal('')),
  gender: z.string().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  timezone: z.string().optional().or(z.literal('')),
  language: z.string().optional().or(z.literal('')),
  currentCompany: z.string().optional().or(z.literal('')),
  currentDesignation: z.string().optional().or(z.literal('')),
  experienceLevel: z.nativeEnum(ExperienceLevel).optional(),
  noticePeriod: z.string().optional().or(z.literal('')),
  expectedSalary: z.number().min(0).optional(),
  currentSalary: z.number().min(0).optional(),
  preferredJobRole: z.array(z.string()).optional(),
  preferredJobType: z.array(z.string()).optional(),
  preferredLocation: z.array(z.string()).optional(),
  remotePreference: z.string().optional().or(z.literal('')),
  isOpenToWork: z.boolean().optional(),
  softSkills: z.array(z.string()).optional(),
  socialLinks: z
    .array(
      z.object({
        platform: z.string(),
        url: z.string().url('Invalid URL').or(z.literal('')),
      })
    )
    .optional(),
  portfolioTheme: z.string().optional().or(z.literal('')),
  portfolioVisibility: z.enum(['public', 'private', 'connections']).optional(),
  featuredProjects: z.array(z.string()).optional(),
});

