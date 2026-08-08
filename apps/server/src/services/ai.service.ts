import { logger } from '../utils/logger.util';

export interface IAiSummaryRequest {
  headline?: string;
  skills?: string[];
  experience?: string[];
}

export interface IAiImproveRequest {
  text: string;
  role?: string;
  tone?: 'professional' | 'creative' | 'bold' | 'minimal';
}

export interface IAiBulletRequest {
  action: string;
  task: string;
  technology?: string;
  result?: string;
  impact?: string;
}

export interface IAiKeywordSuggestionsRequest {
  jobDescription: string;
  resumeSections: any[];
}

export class AiService {
  /**
   * Stub for AI Resume Improvement
   */
  static async improveText(data: IAiImproveRequest): Promise<string> {
    logger.info(`AI improveText called for text length: ${data.text?.length || 0}`);
    // Future integration of Gemini API will go here
    return `[AI IMPROVEMENT STUB] ${data.text}`;
  }

  /**
   * Stub for AI Professional Summary Generator
   */
  static async generateSummary(data: IAiSummaryRequest): Promise<string> {
    logger.info(`AI generateSummary called. Headline: ${data.headline || ''}`);
    return `Highly motivated professional with skills in ${(data.skills || []).join(', ') || 'software engineering'}. Proven track record of delivery.`;
  }

  /**
   * Stub for AI Achievement Bullet Generator (Action, Task, Tech, Result, Impact)
   */
  static async generateBullet(data: IAiBulletRequest): Promise<string> {
    logger.info(`AI generateBullet called. Action: ${data.action}`);
    const techText = data.technology ? ` using ${data.technology}` : '';
    const resultText = data.result ? `, resulting in ${data.result}` : '';
    const impactText = data.impact ? `, impacting ${data.impact}` : '';
    return `${data.action} ${data.task}${techText}${resultText}${impactText}.`;
  }

  /**
   * Stub for AI Skill Suggestions based on a role
   */
  static async suggestSkills(role: string): Promise<string[]> {
    logger.info(`AI suggestSkills called for role: ${role}`);
    return ['React', 'Node.js', 'TypeScript', 'System Design', 'Git', 'Agile Methodology'];
  }

  /**
   * Stub for AI Keyword Suggestions based on Job Description
   */
  static async suggestKeywords(data: IAiKeywordSuggestionsRequest): Promise<{ matchScore: number; missingKeywords: string[]; suggestions: string[] }> {
    logger.info(`AI suggestKeywords called. JD length: ${data.jobDescription?.length || 0}`);
    return {
      matchScore: 65,
      missingKeywords: ['CI/CD', 'Docker', 'RESTful APIs', 'Unit Testing'],
      suggestions: [
        'Add details about CI/CD pipelines in your Work Experience.',
        'Include Docker under your Technical Skills section.',
        'Detail your experience building RESTful APIs under Projects.'
      ]
    };
  }
}
