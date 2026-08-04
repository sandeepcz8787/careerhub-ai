import { motion } from 'framer-motion';
import { Card } from '@shared/components/ui/Card';
import { Skeleton } from '@shared/components/ui/Skeleton';
import { Button } from '@shared/components/ui/Button';

export interface StatCardProps {
  label: string;
  value?: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  isLoading = false,
  isError = false,
  isEmpty = false,
  errorMessage = 'Failed to load metric',
  onRetry,
}: StatCardProps) {
  if (isLoading) {
    return (
      <Card variant="glass" padding="md" className="flex flex-col justify-between h-36 relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton rounded className="w-10 h-10 shrink-0" />
        </div>
        <Skeleton className="h-3 w-32" />
      </Card>
    );
  }

  if (isError) {
    return (
      <Card variant="elevated" padding="md" className="flex flex-col items-center justify-center text-center h-36 border border-error-100 dark:border-error-900/30 bg-error-50/10 dark:bg-error-950/5">
        <span className="text-2xl text-error-500 mb-1">⚠️</span>
        <p className="text-xs font-semibold text-[color:var(--text-primary)] line-clamp-1">{errorMessage}</p>
        {onRetry && (
          <Button variant="link" size="xs" onClick={onRetry} className="mt-1 text-xs text-primary-500">
            Retry
          </Button>
        )}
      </Card>
    );
  }

  if (isEmpty) {
    return (
      <Card variant="glass" padding="md" className="flex flex-col justify-between h-36 opacity-75">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-xs font-medium text-[color:var(--text-muted)]">{label}</span>
            <div className="text-2xl font-black text-[color:var(--text-disabled)]">—</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[color:var(--bg-muted)] flex items-center justify-center text-[color:var(--text-muted)] shrink-0">
            {icon}
          </div>
        </div>
        <span className="text-2xs text-[color:var(--text-muted)] font-medium">No data available</span>
      </Card>
    );
  }

  return (
    <Card
      variant="glass"
      hover
      padding="md"
      className="flex flex-col justify-between h-36 relative overflow-hidden border border-[color:var(--glass-border)] hover:border-primary-500/30 transition-all group"
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-300" />
      
      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-1">
          <span className="text-xs font-semibold tracking-wide text-[color:var(--text-secondary)] uppercase">
            {label}
          </span>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-[color:var(--text-primary)]"
          >
            {value}
          </motion.div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 dark:from-primary-500/20 dark:to-accent-500/20 text-primary-500 dark:text-primary-400 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 shrink-0">
          {icon}
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs relative z-10 font-medium">
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 font-bold rounded-md px-1.5 py-0.5 ${
              trend.isPositive
                ? 'bg-success-50 text-success-700 dark:bg-success-950/20 dark:text-success-400'
                : 'bg-error-50 text-error-700 dark:bg-error-950/20 dark:text-error-400'
            }`}
          >
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
        {trend && <span className="text-[color:var(--text-muted)] line-clamp-1">{trend.label}</span>}
        {!trend && <span className="text-[color:var(--text-muted)]">Tracked in real-time</span>}
      </div>
    </Card>
  );
}
