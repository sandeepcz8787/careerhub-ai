import { api } from '@config/api.config';
import type { ApiResponse } from '@careerhub/shared';
import { ClientResume } from '../types/resume.types';

export const resumeApiService = {
  /**
   * List all resumes for the user
   */
  async getResumes() {
    const response = await api.get<ApiResponse<ClientResume[]>>('/resumes');
    return response.data.data;
  },

  /**
   * Get specific resume
   */
  async getResume(id: string) {
    const response = await api.get<ApiResponse<ClientResume>>(`/resumes/${id}`);
    return response.data.data;
  },

  /**
   * Create a new resume version from scratch or profile import
   */
  async createResume(data: {
    title: string;
    templateId?: string;
    importFromProfile?: boolean;
    selectedSections?: string[];
  }) {
    const response = await api.post<ApiResponse<ClientResume>>('/resumes', data);
    return response.data.data;
  },

  /**
   * Update resume fields (Autosave / Debounced)
   */
  async updateResume(id: string, data: Partial<ClientResume> & { importFromProfile?: boolean }) {
    const response = await api.patch<ApiResponse<ClientResume>>(`/resumes/${id}`, data);
    return response.data.data;
  },

  /**
   * Set primary default resume
   */
  async setDefaultResume(id: string) {
    const response = await api.post<ApiResponse<ClientResume>>(`/resumes/${id}/default`);
    return response.data.data;
  },

  /**
   * Clone / Duplicate a resume
   */
  async duplicateResume(id: string) {
    const response = await api.post<ApiResponse<ClientResume>>(`/resumes/${id}/duplicate`);
    return response.data.data;
  },

  /**
   * Delete resume (archive)
   */
  async deleteResume(id: string) {
    const response = await api.delete<ApiResponse<{ success: boolean }>>(`/resumes/${id}`);
    return response.data.data;
  },

  /**
   * Publish resume and set sharing options
   */
  async publishResume(id: string, body: { customSlug?: string; privacy?: 'public' | 'unlisted' }) {
    const response = await api.post<ApiResponse<ClientResume>>(`/resumes/${id}/publish`, body);
    return response.data.data;
  },

  /**
   * Unpublish resume and make it private
   */
  async unpublishResume(id: string) {
    const response = await api.post<ApiResponse<ClientResume>>(`/resumes/${id}/unpublish`);
    return response.data.data;
  },

  /**
   * Fetch public resume without authentication
   */
  async getPublicResume(username: string, slug: string) {
    const response = await api.get<ApiResponse<any>>(`/resumes/public/${username}/${slug}`);
    return response.data.data;
  },

  /**
   * Fetch historical version snapshots list
   */
  async getResumeVersions(id: string) {
    const response = await api.get<ApiResponse<any[]>>(`/resumes/${id}/versions`);
    return response.data.data;
  },

  /**
   * Restore resume to version snapshot
   */
  async restoreResumeVersion(id: string, versionId: string) {
    const response = await api.post<ApiResponse<ClientResume>>(`/resumes/${id}/versions/${versionId}/restore`);
    return response.data.data;
  },

  /**
   * Export resume as PDF document blob download
   */
  async exportPdf(id: string, title: string) {
    const response = await api.post(`/resumes/${id}/export/pdf`, {}, { responseType: 'blob' });
    const blob = new Blob([response.data as any], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return true;
  },

  // ── AI Helper Stubs ────────────────────────────────────────────────────────

  async aiImproveText(text: string, tone?: string, role?: string) {
    const response = await api.post<ApiResponse<string>>('/resumes/ai/improve', { text, tone, role });
    return response.data.data;
  },

  async aiGenerateSummary(headline?: string, skills?: string[], experience?: string[]) {
    const response = await api.post<ApiResponse<string>>('/resumes/ai/summary', { headline, skills, experience });
    return response.data.data;
  },

  async aiGenerateBullet(action: string, task: string, technology?: string, result?: string, impact?: string) {
    const response = await api.post<ApiResponse<string>>('/resumes/ai/bullet', { action, task, technology, result, impact });
    return response.data.data;
  },

  async aiSuggestSkills(role: string) {
    const response = await api.post<ApiResponse<string[]>>('/resumes/ai/suggest-skills', { role });
    return response.data.data;
  },

  async aiSuggestKeywords(jobDescription: string, resumeSections: any[]) {
    const response = await api.post<ApiResponse<{ matchScore: number; missingKeywords: string[]; suggestions: string[] }>>('/resumes/ai/suggest-keywords', {
      jobDescription,
      resumeSections
    });
    return response.data.data;
  }
};
