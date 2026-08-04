import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle } from '@shared/components/ui/Card';
import { Skeleton } from '@shared/components/ui/Skeleton';
import type { ActivityItem } from '../services/dashboard.service';

export interface ActivityCardProps {
  activities?: ActivityItem[];
  isLoading?: boolean;
}

const activityIcons: Record<ActivityItem['type'], string> = {
  application: '💼',
  resume: '📄',
  interview: '🎯',
  community: '🤝',
  referral: '✉️',
};

const activityColors: Record<ActivityItem['type'], string> = {
  application: 'bg-primary-500/10 text-primary-500 dark:bg-primary-500/20 dark:text-primary-400',
  resume: 'bg-info-500/10 text-info-500 dark:bg-info-500/20 dark:text-info-400',
  interview: 'bg-success-500/10 text-success-500 dark:bg-success-500/20 dark:text-success-400',
  community: 'bg-accent-500/10 text-accent-500 dark:bg-accent-500/20 dark:text-accent-400',
  referral: 'bg-warning-500/10 text-warning-500 dark:bg-warning-500/20 dark:text-warning-400',
};

export function ActivityCard({ activities = [], isLoading = false }: ActivityCardProps) {
  if (isLoading) {
    return (
      <Card variant="glass" className="space-y-4">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex gap-3">
              <Skeleton rounded className="w-9 h-9 shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card variant="glass" className="border border-[color:var(--glass-border)] flex flex-col h-full">
      <CardHeader className="mb-2">
        <CardTitle className="text-md font-bold tracking-tight font-heading">
          Recent Activity
        </CardTitle>
      </CardHeader>

      {activities.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
          <span className="text-3xl mb-2">⏳</span>
          <p className="text-sm font-semibold text-[color:var(--text-secondary)]">No recent activity</p>
          <p className="text-xs text-[color:var(--text-muted)]">Activities will appear as you interact with the app.</p>
        </div>
      ) : (
        <div className="relative border-l-2 border-[color:var(--border-subtle)] ml-4 pl-6 space-y-5 flex-1">
          {activities.map((act, index) => (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="relative group"
            >
              {/* Chronological Indicator Bullet */}
              <span className="absolute -left-[35px] top-0.5 flex items-center justify-center w-8 h-8 rounded-full border border-[color:var(--bg-surface)] bg-[color:var(--bg-base)] shadow-sm group-hover:scale-110 transition-transform">
                <span className={`flex items-center justify-center w-7 h-7 rounded-full text-sm ${activityColors[act.type]}`}>
                  {activityIcons[act.type]}
                </span>
              </span>

              {/* Text content */}
              <div className="space-y-1 pl-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="text-xs font-bold text-[color:var(--text-primary)] leading-tight group-hover:text-primary-500 transition-colors">
                    {act.title}
                  </h4>
                  <span className="text-[10px] text-[color:var(--text-muted)] shrink-0 font-medium">
                    {act.timestamp}
                  </span>
                </div>
                <p className="text-xs text-[color:var(--text-muted)] leading-normal">
                  {act.description}
                </p>
                {act.status && (
                  <span
                    className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize mt-1 ${
                      act.status === 'success'
                        ? 'bg-success-50 text-success-700 dark:bg-success-950/20 dark:text-success-400'
                        : act.status === 'warning'
                        ? 'bg-warning-50 text-warning-700 dark:bg-warning-950/20 dark:text-warning-400'
                        : act.status === 'info'
                        ? 'bg-info-50 text-info-700 dark:bg-info-950/20 dark:text-info-400'
                        : 'bg-[color:var(--bg-muted)] text-[color:var(--text-secondary)]'
                    }`}
                  >
                    {act.status}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
}
