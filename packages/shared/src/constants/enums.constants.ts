/**
 * CareerHub AI Platform Global Enums
 * Consumed by both backend server and frontend applications.
 */

/** User Roles */
export enum UserRole {
  STUDENT = 'student',
  FRESHER = 'fresher',
  PROFESSIONAL = 'professional',
  RECRUITER = 'recruiter',
  COLLEGE_ADMIN = 'college_admin',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

/** Account Status */
export enum AccountStatus {
  PENDING_VERIFICATION = 'pending_verification',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DEACTIVATED = 'deactivated',
  BANNED = 'banned',
}

/** Email / Account Verification Status */
export enum VerificationStatus {
  UNVERIFIED = 'unverified',
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

/** OAuth Provider */
export enum OAuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  LINKEDIN = 'linkedin',
  GITHUB = 'github',
}

/** Experience Level */
export enum ExperienceLevel {
  ENTRY = 'entry',
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  LEAD = 'lead',
  EXECUTIVE = 'executive',
}

/** Job Status */
export enum JobStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  PAUSED = 'paused',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
}

/** Employment Type */
export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship',
  FREELANCE = 'freelance',
}

/** Remote Option */
export enum RemoteOption {
  REMOTE = 'remote',
  ONSITE = 'onsite',
  HYBRID = 'hybrid',
}

/** Application Status */
export enum ApplicationStatus {
  APPLIED = 'applied',
  OA = 'oa',
  INTERVIEW = 'interview',
  HR = 'hr',
  OFFER = 'offer',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

/** Application Stage */
export enum ApplicationStage {
  SCREENING = 'screening',
  ASSESSMENT = 'assessment',
  TECHNICAL_ROUND_1 = 'technical_round_1',
  TECHNICAL_ROUND_2 = 'technical_round_2',
  MANAGERIAL = 'managerial',
  HR_ROUND = 'hr_round',
  OFFER_EXTENDED = 'offer_extended',
  CLOSED = 'closed',
}

/** Interview Schedule Type */
export enum InterviewType {
  SCREENING = 'screening',
  TECHNICAL = 'technical',
  BEHAVIORAL = 'behavioral',
  SYSTEM_DESIGN = 'system_design',
  HR = 'hr',
  MOCK = 'mock',
}

/** Interview Schedule Status */
export enum InterviewScheduleStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RESCHEDULED = 'rescheduled',
}

/** Referral Status */
export enum ReferralStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

/** Notification Types */
export enum NotificationType {
  COMMENT = 'comment',
  LIKE = 'like',
  JOB = 'job',
  INTERVIEW = 'interview',
  MESSAGE = 'message',
  REFERRAL = 'referral',
  SYSTEM = 'system',
  SECURITY = 'security',
}

/** Community Post Visibility */
export enum PostVisibility {
  PUBLIC = 'public',
  CONNECTIONS = 'connections',
  COMMUNITY = 'community',
  PRIVATE = 'private',
}

/** Community Privacy */
export enum CommunityPrivacy {
  PUBLIC = 'public',
  PRIVATE = 'private',
  INVITE_ONLY = 'invite_only',
}

/** Community Member Role */
export enum CommunityMemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  MEMBER = 'member',
}

/** Target Resource Entity Types */
export enum TargetType {
  POST = 'post',
  COMMENT = 'comment',
  REPLY = 'reply',
  JOB = 'job',
  COURSE = 'course',
  DOCUMENT = 'document',
  NOTE = 'note',
  CODING_CHALLENGE = 'coding_challenge',
}

/** Question Difficulty */
export enum QuestionDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert',
}

/** Mock Interview Status */
export enum MockInterviewStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

/** Coding Languages */
export enum CodingLanguage {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  PYTHON = 'python',
  JAVA = 'java',
  CPP = 'cpp',
  GO = 'go',
  RUST = 'rust',
}

/** Coding Challenge Submission Status */
export enum SubmissionStatus {
  ACCEPTED = 'accepted',
  WRONG_ANSWER = 'wrong_answer',
  TIME_LIMIT_EXCEEDED = 'time_limit_exceeded',
  MEMORY_LIMIT_EXCEEDED = 'memory_limit_exceeded',
  RUNTIME_ERROR = 'runtime_error',
  COMPILATION_ERROR = 'compilation_error',
  PENDING = 'pending',
}

/** Skill Proficiency Level */
export enum SkillProficiency {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert',
}

/** Language Proficiency Level */
export enum LanguageProficiency {
  ELEMENTARY = 'elementary',
  LIMITED_WORKING = 'limited_working',
  PROFESSIONAL_WORKING = 'professional_working',
  FULL_PROFESSIONAL = 'full_professional',
  NATIVE_BILINGUAL = 'native_bilingual',
}

/** Course Level */
export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  ALL_LEVELS = 'all_levels',
}

/** Course Status */
export enum CourseStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

/** Chat Message Types */
export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  VOICE = 'voice',
  CODE = 'code',
}

/** System Audit Actions */
export enum AuditAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  EXPORT = 'export',
  PERMISSION_CHANGE = 'permission_change',
}

/** System Moderation Report Reason */
export enum ReportReason {
  SPAM = 'spam',
  INAPPROPRIATE = 'inappropriate',
  HARASSMENT = 'harassment',
  MISINFORMATION = 'misinformation',
  INTELLECTUAL_PROPERTY = 'intellectual_property',
  OTHER = 'other',
}

/** Moderation Report Status */
export enum ReportStatus {
  PENDING = 'pending',
  INVESTIGATING = 'investigating',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
}

/** Support Ticket Priority */
export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

/** Support Ticket Status */
export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}
