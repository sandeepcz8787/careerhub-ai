import type { ObjectId, ISODateString, BaseEntity } from './common.types';
import type {
  QuestionDifficulty,
  MockInterviewStatus,
  CodingLanguage,
  SubmissionStatus,
} from '../constants/enums.constants';

export interface InterviewExperience extends BaseEntity {
  userId: ObjectId;
  companyId: ObjectId;
  roleTitle: string;
  difficulty: QuestionDifficulty;
  outcome: 'offered' | 'rejected' | 'pending';
  rounds: Array<{ name: string; description: string; questions: string[] }>;
  content: string;
  upvotesCount: number;
  viewsCount: number;
  status: 'active' | 'flagged';
}

export interface InterviewQuestion extends BaseEntity {
  title: string;
  slug: string;
  content: string;
  category: string;
  companyIds: ObjectId[];
  roleTypes: string[];
  difficulty: QuestionDifficulty;
  answersCount: number;
  tags: string[];
}

export interface InterviewAnswer extends BaseEntity {
  questionId: ObjectId;
  userId: ObjectId;
  content: string;
  upvotesCount: number;
  isVerified: boolean;
}

export interface MockInterview extends BaseEntity {
  userId: ObjectId;
  peerId?: ObjectId;
  type: 'ai' | 'peer';
  targetRole: string;
  status: MockInterviewStatus;
  scheduledAt?: ISODateString;
  questions: string[];
  durationMinutes: number;
}

export interface MockResult extends BaseEntity {
  mockId: ObjectId;
  userId: ObjectId;
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  feedback: string;
  transcript?: Array<{ speaker: string; text: string }>;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface CodingChallenge extends BaseEntity {
  title: string;
  slug: string;
  difficulty: QuestionDifficulty;
  problemStatement: string;
  starterCode: Array<{ language: CodingLanguage; code: string }>;
  testCases: TestCase[];
  constraints?: string[];
  solutionExplanation?: string;
  submissionCount: number;
  acceptedCount: number;
}

export interface ChallengeSubmission extends BaseEntity {
  challengeId: ObjectId;
  userId: ObjectId;
  code: string;
  language: CodingLanguage;
  status: SubmissionStatus;
  executionTimeMs?: number;
  memoryKb?: number;
  testCasesPassed: number;
  totalTestCases: number;
}

export interface LeaderboardEntry extends BaseEntity {
  period: 'weekly' | 'monthly' | 'all_time';
  domain: 'coding' | 'mock_interviews' | 'contributions';
  userId: ObjectId;
  points: number;
  rank: number;
  metadata?: Record<string, unknown>;
}
