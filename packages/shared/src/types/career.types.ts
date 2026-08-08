import type { ObjectId, ISODateString, Nullable, BaseEntity } from './common.types';
import type { SkillProficiency, LanguageProficiency, ExperienceLevel } from '../constants/enums.constants';

export interface ResumeSection {
  id: string;
  name: string;
  type:
    | 'personal_info'
    | 'summary'
    | 'objective'
    | 'education'
    | 'experience'
    | 'internships'
    | 'projects'
    | 'skills'
    | 'soft_skills'
    | 'certifications'
    | 'achievements'
    | 'languages'
    | 'volunteer'
    | 'publications'
    | 'awards'
    | 'social_links'
    | 'portfolio'
    | 'custom';
  content: Record<string, unknown>;
  order: number;
}

export interface Resume extends BaseEntity {
  userId: ObjectId;
  title: string;
  templateId?: ObjectId;
  atsScore?: number;
  sections: ResumeSection[];
  downloadCount: number;
  publicShareLink?: string;
  isPrimary: boolean;
  fileUrl?: string;
  status: 'active' | 'archived';
  privacy: 'public' | 'private' | 'unlisted';
  slug?: string;
  customization: {
    font?: string;
    fontSize?: string;
    headingSize?: string;
    lineHeight?: string;
    margins?: string;
    spacing?: string;
    accentColor?: string;
    pageSize?: string;
  };
  isDeleted: boolean;
  deletedAt?: ISODateString;
}

export interface ResumeTemplate extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  thumbnailUrl: string;
  category: 'modern' | 'professional' | 'creative' | 'minimal' | 'executive';
  layoutConfig: Record<string, unknown>;
  isPremium: boolean;
  status: 'active' | 'inactive';
}

export interface ATSReport extends BaseEntity {
  resumeId: ObjectId;
  userId: ObjectId;
  targetJobId?: ObjectId;
  jobTitle?: string;
  matchScore: number;
  keywordMatches: Array<{ keyword: string; count: number }>;
  missingKeywords: string[];
  suggestions: string[];
  grammarIssues?: string[];
  formattingScore?: number;
}

export interface CoverLetter extends BaseEntity {
  userId: ObjectId;
  title: string;
  content: string;
  targetCompany?: string;
  targetRole?: string;
  jobId?: ObjectId;
  template?: string;
  status: 'draft' | 'final';
}

export interface Certificate extends BaseEntity {
  userId: ObjectId;
  title: string;
  issuer: string;
  issueDate: ISODateString;
  expiryDate?: ISODateString;
  credentialId?: string;
  credentialUrl?: string;
  mediaUrl?: string;
}

export interface Project extends BaseEntity {
  userId: ObjectId;
  title: string;
  description: string;
  role?: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  mediaUrls: string[];
  startDate: ISODateString;
  endDate?: ISODateString;
  isCurrent: boolean;
  isFeatured: boolean;
}

export interface Skill extends BaseEntity {
  name: string;
  slug: string;
  category: string;
  usageCount: number;
  isVerified?: boolean;
}

export interface Experience extends BaseEntity {
  userId: ObjectId;
  companyName: string;
  role: string;
  location?: string;
  employmentType: string;
  startDate: ISODateString;
  endDate?: ISODateString;
  isCurrent: boolean;
  achievements: string[];
  skillsUsed: string[];
  description?: string;
}

export interface Education extends BaseEntity {
  userId: ObjectId;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  grade?: string;
  startDate: ISODateString;
  endDate?: ISODateString;
  isCurrent: boolean;
  activities?: string;
}

export interface Achievement extends BaseEntity {
  userId: ObjectId;
  title: string;
  issuer: string;
  date: ISODateString;
  description?: string;
  certificateUrl?: string;
}

export interface Language extends BaseEntity {
  userId: ObjectId;
  language: string;
  proficiency: LanguageProficiency;
}

export interface UserSkill {
  name: string;
  category: string;
  proficiency: SkillProficiency;
  yearsOfExperience: number;
}

export interface ProfilePrivacySettings {
  profileVisibility: 'public' | 'private' | 'connections';
  searchVisibility: boolean;
  emailVisibility: boolean;
  phoneVisibility: boolean;
}

export interface CareerProfile extends BaseEntity {
  userId: ObjectId;
  headline?: string;
  bio?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  
  // Personal Info
  dob?: ISODateString;
  gender?: string;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  timezone?: string;
  language?: string;
  coverImageUrl?: string;
  coverImagePublicId?: string;

  // Career Info
  currentCompany?: string;
  currentDesignation?: string;
  experienceLevel: ExperienceLevel;
  noticePeriod?: string;
  expectedSalary?: number;
  currentSalary?: number;
  preferredJobRole?: string[];
  preferredJobType?: string[];
  preferredLocation?: string[];
  remotePreference?: string;
  isOpenToWork: boolean;

  // Skills
  skills: UserSkill[];
  softSkills: string[];

  // Portfolio
  portfolioTheme?: string;
  portfolioVisibility?: 'public' | 'private' | 'connections';
  featuredProjects?: ObjectId[];

  // Settings & Privacy
  privacySettings: ProfilePrivacySettings;
}
