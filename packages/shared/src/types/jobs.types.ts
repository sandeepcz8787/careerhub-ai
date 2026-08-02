import type { ObjectId, ISODateString, BaseEntity } from './common.types';
import type {
  JobStatus,
  EmploymentType,
  RemoteOption,
  ApplicationStatus,
  ApplicationStage,
  InterviewType,
  InterviewScheduleStatus,
  ReferralStatus,
  ExperienceLevel,
} from '../constants/enums.constants';

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  period: 'yearly' | 'monthly' | 'hourly';
}

export interface Job extends BaseEntity {
  title: string;
  description: string;
  requirements: string[];
  salary?: SalaryRange;
  location: string;
  employmentType: EmploymentType;
  remoteOption: RemoteOption;
  experienceRequired: ExperienceLevel;
  skills: string[];
  recruiterId: ObjectId;
  companyId: ObjectId;
  status: JobStatus;
  deadline?: ISODateString;
  applicantsCount: number;
  viewsCount: number;
  isDeleted: boolean;
}

export interface Company extends BaseEntity {
  name: string;
  slug: string;
  industry: string;
  logoUrl?: string;
  website?: string;
  headquarters?: string;
  employeeCount?: string;
  description?: string;
  benefits: string[];
  socialLinks: Array<{ platform: string; url: string }>;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
}

export interface Recruiter extends BaseEntity {
  userId: ObjectId;
  companyId: ObjectId;
  designation: string;
  isVerified: boolean;
  department?: string;
}

export interface ApplicationFeedback {
  interviewerId?: ObjectId;
  rating?: number;
  comments?: string;
  createdAt: ISODateString;
}

export interface Application extends BaseEntity {
  userId: ObjectId;
  jobId: ObjectId;
  currentStage: ApplicationStage;
  appliedDate: ISODateString;
  resumeId: ObjectId;
  coverLetterId?: ObjectId;
  notes?: string;
  status: ApplicationStatus;
  interviewDates: ISODateString[];
  feedback: ApplicationFeedback[];
  matchScore?: number;
}

export interface SavedJob extends BaseEntity {
  userId: ObjectId;
  jobId: ObjectId;
  notes?: string;
}

export interface InterviewSchedule extends BaseEntity {
  applicationId: ObjectId;
  userId: ObjectId;
  recruiterId: ObjectId;
  type: InterviewType;
  scheduledAt: ISODateString;
  durationMinutes: number;
  meetingUrl?: string;
  status: InterviewScheduleStatus;
  feedback?: string;
}

export interface JobAlert extends BaseEntity {
  userId: ObjectId;
  title: string;
  keywords: string[];
  location?: string;
  salaryMin?: number;
  employmentTypes: EmploymentType[];
  frequency: 'daily' | 'weekly' | 'instant';
  isActive: boolean;
}

export interface ReferralRequest extends BaseEntity {
  userId: ObjectId;
  referrerId: ObjectId;
  companyId: ObjectId;
  jobId?: ObjectId;
  message: string;
  status: ReferralStatus;
  resumeId: ObjectId;
}

export interface ReferralPost extends BaseEntity {
  userId: ObjectId;
  companyId: ObjectId;
  jobTitle: string;
  description: string;
  location?: string;
  applicationUrl?: string;
  status: 'active' | 'filled' | 'closed';
}
