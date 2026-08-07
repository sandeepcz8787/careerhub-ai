import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApiService } from '../services/profile.service';
import { useToast } from '@shared/components/ui/Toast';

export const PROFILE_QUERY_KEY = ['profile'];
export const PROFILE_COMPLETION_QUERY_KEY = ['profile-completion'];

export function useProfileDetails() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => profileApiService.getProfile()
  });
}

export function useProfileCompletion() {
  return useQuery({
    queryKey: PROFILE_COMPLETION_QUERY_KEY,
    queryFn: () => profileApiService.getProfileCompletion()
  });
}

export function useUpdateProfileDetails() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: any) => profileApiService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PROFILE_COMPLETION_QUERY_KEY });
      success('Profile updated successfully');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to update profile');
    }
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (base64Data: string) => profileApiService.uploadAvatar(base64Data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PROFILE_COMPLETION_QUERY_KEY });
      success('Profile photo updated successfully');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to upload photo');
    }
  });
}

export function useUploadCover() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (base64Data: string) => profileApiService.uploadCover(base64Data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PROFILE_COMPLETION_QUERY_KEY });
      success('Cover image updated successfully');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to upload cover');
    }
  });
}

export function useUploadResume() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ base64Data, title, isPrimary }: { base64Data: string; title: string; isPrimary?: boolean }) =>
      profileApiService.uploadResume(base64Data, title, isPrimary),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PROFILE_COMPLETION_QUERY_KEY });
      success('Resume uploaded successfully');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to upload resume');
    }
  });
}

export function useSetPrimaryResume() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (resumeId: string) => profileApiService.setPrimaryResume(resumeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      success('Primary resume updated');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to update primary resume');
    }
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (resumeId: string) => profileApiService.deleteResume(resumeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PROFILE_COMPLETION_QUERY_KEY });
      success('Resume deleted successfully');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to delete resume');
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Education Hooks
// ─────────────────────────────────────────────────────────────────────────────
export function useCreateEducation() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: any) => profileApiService.addEducation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PROFILE_COMPLETION_QUERY_KEY });
      success('Education added successfully');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to add education');
    }
  });
}

export function useUpdateEducation() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => profileApiService.updateEducation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      success('Education updated successfully');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to update education');
    }
  });
}

export function useDeleteEducation() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => profileApiService.deleteEducation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PROFILE_COMPLETION_QUERY_KEY });
      success('Education record removed');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to delete education');
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Experience Hooks
// ─────────────────────────────────────────────────────────────────────────────
export function useCreateExperience() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: any) => profileApiService.addExperience(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PROFILE_COMPLETION_QUERY_KEY });
      success('Work experience added');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to add experience');
    }
  });
}

export function useUpdateExperience() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => profileApiService.updateExperience(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      success('Experience updated successfully');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to update experience');
    }
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => profileApiService.deleteExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PROFILE_COMPLETION_QUERY_KEY });
      success('Experience record removed');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to delete experience');
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Project Hooks
// ─────────────────────────────────────────────────────────────────────────────
export function useCreateProject() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: any) => profileApiService.addProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PROFILE_COMPLETION_QUERY_KEY });
      success('Project added successfully');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to add project');
    }
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => profileApiService.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      success('Project updated successfully');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to update project');
    }
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => profileApiService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PROFILE_COMPLETION_QUERY_KEY });
      success('Project record removed');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to delete project');
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Certificate Hooks
// ─────────────────────────────────────────────────────────────────────────────
export function useCreateCertificate() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: any) => profileApiService.addCertificate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PROFILE_COMPLETION_QUERY_KEY });
      success('Certificate added successfully');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to add certificate');
    }
  });
}

export function useUpdateCertificate() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => profileApiService.updateCertificate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      success('Certificate updated successfully');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to update certificate');
    }
  });
}

export function useDeleteCertificate() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => profileApiService.deleteCertificate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PROFILE_COMPLETION_QUERY_KEY });
      success('Certificate record removed');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to delete certificate');
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Achievement Hooks
// ─────────────────────────────────────────────────────────────────────────────
export function useCreateAchievement() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: any) => profileApiService.addAchievement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PROFILE_COMPLETION_QUERY_KEY });
      success('Achievement added successfully');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to add achievement');
    }
  });
}

export function useUpdateAchievement() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => profileApiService.updateAchievement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      success('Achievement updated successfully');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to update achievement');
    }
  });
}

export function useDeleteAchievement() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => profileApiService.deleteAchievement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PROFILE_COMPLETION_QUERY_KEY });
      success('Achievement record removed');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to delete achievement');
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Language Hooks
// ─────────────────────────────────────────────────────────────────────────────
export function useCreateLanguage() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: any) => profileApiService.addLanguage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PROFILE_COMPLETION_QUERY_KEY });
      success('Language added successfully');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to add language');
    }
  });
}

export function useUpdateLanguage() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => profileApiService.updateLanguage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      success('Language proficiency updated');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to update language');
    }
  });
}

export function useDeleteLanguage() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (id: string) => profileApiService.deleteLanguage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PROFILE_COMPLETION_QUERY_KEY });
      success('Language record removed');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to delete language');
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Skills Hooks (Nested Skills Array inside Profile)
// ─────────────────────────────────────────────────────────────────────────────
export function useAddSkill() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (data: any) => profileApiService.addSkill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PROFILE_COMPLETION_QUERY_KEY });
      success('Skill added/updated successfully');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to save skill');
    }
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: (name: string) => profileApiService.deleteSkill(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: PROFILE_COMPLETION_QUERY_KEY });
      success('Skill removed from profile');
    },
    onError: (err: any) => {
      error(err.message || 'Failed to delete skill');
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Recruiter Search Hooks
// ─────────────────────────────────────────────────────────────────────────────
export function useRecruiterSearch(params: {
  skills?: string;
  experienceLevel?: string;
  location?: string;
  availability?: string;
  keywords?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['recruiter-search', params],
    queryFn: () => profileApiService.searchProfiles(params),
    enabled: Object.keys(params).some(key => (params as any)[key] !== undefined && (params as any)[key] !== '')
  });
}
