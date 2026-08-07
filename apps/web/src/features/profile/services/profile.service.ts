import { api } from '@config/api.config';
import type {
  CareerProfile,
  Education,
  Experience,
  Project,
  Certificate,
  Achievement,
  Language,
  Resume,
  UserSession,
  NotificationType
} from '@careerhub/shared';

export interface ConsolidatedProfileResponse {
  user: {
    id: string;
    email: string;
    phone?: string;
    role: string;
    status: string;
    isEmailVerified: boolean;
    timezone?: string;
    language?: string;
    createdAt: string;
    updatedAt: string;
    profile: {
      firstName: string;
      lastName: string;
      displayName: string;
      avatarUrl?: string;
      headline?: string;
      bio?: string;
      location?: string;
    };
    oauthProviders?: Array<{ provider: string; providerId: string }>;
  };
  profile: CareerProfile & { id: string };
  education: Education[];
  experience: Experience[];
  projects: Project[];
  certificates: Certificate[];
  achievements: Achievement[];
  languages: Language[];
  resumes: Resume[];
  notificationPreferences: {
    emailAlerts: boolean;
    pushAlerts: boolean;
    inAppAlerts: boolean;
    enabledTypes: NotificationType[];
  } | null;
}

export interface ProfileCompletionResponse {
  completionPercentage: number;
  missingSections: string[];
  suggestions: Array<{
    section: string;
    message: string;
    points: number;
  }>;
}

export interface RecruiterSearchResponse {
  total: number;
  page: number;
  limit: number;
  results: Array<{
    profile: CareerProfile & { id: string };
    user: any;
    education: Education[];
    experience: Experience[];
    certificates: Certificate[];
  }>;
}

export const profileApiService = {
  /**
   * Fetch consolidate profile data
   */
  async getProfile() {
    return api.get<ConsolidatedProfileResponse>('/profiles/me');
  },

  /**
   * Update core profile and user sync
   */
  async updateProfile(data: any) {
    return api.put<ConsolidatedProfileResponse>('/profiles/me', data);
  },

  /**
   * Upload user profile avatar (accepts base64 data URL)
   */
  async uploadAvatar(base64Data: string) {
    return api.post<{ avatarUrl: string }>('/profiles/me/avatar', { file: base64Data });
  },

  /**
   * Upload user profile cover photo (accepts base64 data URL)
   */
  async uploadCover(base64Data: string) {
    return api.post<{ coverImageUrl: string }>('/profiles/me/cover', { file: base64Data });
  },

  /**
   * Upload resume document (accepts base64 or raw)
   */
  async uploadResume(base64Data: string, title: string, isPrimary = false) {
    return api.post<Resume>('/profiles/me/resume', { file: base64Data, title, isPrimary });
  },

  /**
   * Set a default resume
   */
  async setPrimaryResume(resumeId: string) {
    return api.patch<Resume>(`/profiles/me/resume/${resumeId}/primary`);
  },

  /**
   * Delete resume
   */
  async deleteResume(resumeId: string) {
    return api.delete(`/profiles/me/resume/${resumeId}`);
  },

  /**
   * Calculate Profile Completion recommendations
   */
  async getProfileCompletion() {
    return api.get<ProfileCompletionResponse>('/profiles/me/completion');
  },

  /**
   * Recruiter search profiles
   */
  async searchProfiles(params: {
    skills?: string;
    experienceLevel?: string;
    location?: string;
    availability?: string;
    keywords?: string;
    page?: number;
    limit?: number;
  }) {
    return api.get<RecruiterSearchResponse>('/profiles/search', { params });
  },

  /**
   * Export all data as JSON
   */
  async exportData() {
    return api.get<ConsolidatedProfileResponse>('/profiles/me/export');
  },

  /**
   * Deactivate user account
   */
  async deactivateAccount() {
    return api.delete<{ success: boolean }>('/profiles/me/account');
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Education CRUD
  // ─────────────────────────────────────────────────────────────────────────────
  async addEducation(data: any) {
    return api.post<Education>('/profiles/me/education', data);
  },
  async updateEducation(id: string, data: any) {
    return api.put<Education>(`/profiles/me/education/${id}`, data);
  },
  async deleteEducation(id: string) {
    return api.delete(`/profiles/me/education/${id}`);
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Experience CRUD
  // ─────────────────────────────────────────────────────────────────────────────
  async addExperience(data: any) {
    return api.post<Experience>('/profiles/me/experience', data);
  },
  async updateExperience(id: string, data: any) {
    return api.put<Experience>(`/profiles/me/experience/${id}`, data);
  },
  async deleteExperience(id: string) {
    return api.delete(`/profiles/me/experience/${id}`);
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Projects CRUD
  // ─────────────────────────────────────────────────────────────────────────────
  async addProject(data: any) {
    return api.post<Project>('/profiles/me/projects', data);
  },
  async updateProject(id: string, data: any) {
    return api.put<Project>(`/profiles/me/projects/${id}`, data);
  },
  async deleteProject(id: string) {
    return api.delete(`/profiles/me/projects/${id}`);
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Certificates CRUD
  // ─────────────────────────────────────────────────────────────────────────────
  async addCertificate(data: any) {
    return api.post<Certificate>('/profiles/me/certificates', data);
  },
  async updateCertificate(id: string, data: any) {
    return api.put<Certificate>(`/profiles/me/certificates/${id}`, data);
  },
  async deleteCertificate(id: string) {
    return api.delete(`/profiles/me/certificates/${id}`);
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Achievements CRUD
  // ─────────────────────────────────────────────────────────────────────────────
  async addAchievement(data: any) {
    return api.post<Achievement>('/profiles/me/achievements', data);
  },
  async updateAchievement(id: string, data: any) {
    return api.put<Achievement>(`/profiles/me/achievements/${id}`, data);
  },
  async deleteAchievement(id: string) {
    return api.delete(`/profiles/me/achievements/${id}`);
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Languages CRUD
  // ─────────────────────────────────────────────────────────────────────────────
  async addLanguage(data: any) {
    return api.post<Language>('/profiles/me/languages', data);
  },
  async updateLanguage(id: string, data: any) {
    return api.put<Language>(`/profiles/me/languages/${id}`, data);
  },
  async deleteLanguage(id: string) {
    return api.delete(`/profiles/me/languages/${id}`);
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Skills CRUD (Embedded Array)
  // ─────────────────────────────────────────────────────────────────────────────
  async addSkill(data: any) {
    return api.post<any>('/profiles/me/skills', data);
  },
  async deleteSkill(name: string) {
    return api.delete<any>(`/profiles/me/skills/${encodeURIComponent(name)}`);
  }
};
