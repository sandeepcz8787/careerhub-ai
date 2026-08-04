import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCareerProgress() {
  return useQuery({
    queryKey: ['dashboard', 'careerProgress'],
    queryFn: () => dashboardService.getCareerProgress(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useRecentActivities() {
  return useQuery({
    queryKey: ['dashboard', 'activities'],
    queryFn: () => dashboardService.getRecentActivities(),
    staleTime: 1000 * 60 * 2,
  });
}

export function useJobRecommendations() {
  return useQuery({
    queryKey: ['dashboard', 'recommendations'],
    queryFn: () => dashboardService.getJobRecommendations(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCalendarEvents() {
  return useQuery({
    queryKey: ['dashboard', 'events'],
    queryFn: () => dashboardService.getCalendarEvents(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useNotifications() {
  return useQuery({
    queryKey: ['dashboard', 'notifications'],
    queryFn: () => dashboardService.getNotifications(),
    staleTime: 1000 * 60 * 2,
  });
}

export function useToggleSaveJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => dashboardService.toggleSaveJob(id),
    onSuccess: (data) => {
      // Update recommendations query cache
      queryClient.setQueryData(['dashboard', 'recommendations'], data);
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dashboardService.markNotificationRead(id),
    onSuccess: (data) => {
      queryClient.setQueryData(['dashboard', 'notifications'], data);
      
      // Update stats query cache if available to decrement unread count
      queryClient.setQueryData(['dashboard', 'stats'], (oldStats: any) => {
        if (!oldStats) return oldStats;
        return {
          ...oldStats,
          unreadNotifications: {
            count: Math.max(0, oldStats.unreadNotifications.count - 1),
          },
        };
      });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => dashboardService.markAllNotificationsRead(),
    onSuccess: (data) => {
      queryClient.setQueryData(['dashboard', 'notifications'], data);
      
      // Reset unread counts in stats
      queryClient.setQueryData(['dashboard', 'stats'], (oldStats: any) => {
        if (!oldStats) return oldStats;
        return {
          ...oldStats,
          unreadNotifications: {
            count: 0,
          },
        };
      });
    },
  });
}
