import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from '@shared/components/ui/Card';
import { Skeleton } from '@shared/components/ui/Skeleton';
import type { CareerStep } from '../services/dashboard.service';

export interface ProgressCardProps {
  steps?: CareerStep[];
  isLoading?: boolean;
}

export function ProgressCard({ steps = [], isLoading = false }: ProgressCardProps) {
  if (isLoading) {
    return (
      <Card variant="glass" className="space-y-4">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <Skeleton rounded className="w-5 h-5 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  const completedSteps = steps.filter((s) => s.completed);
  const percent = steps.length > 0 ? Math.round((completedSteps.length / steps.length) * 100) : 0;

  return (
    <Card variant="glass" className="border border-[color:var(--glass-border)] h-full">
      <CardHeader className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <CardTitle className="text-md font-bold tracking-tight font-heading">
            Career Journey Progress
          </CardTitle>
          <span className="text-sm font-bold text-primary-500 bg-primary-500/10 px-2 py-0.5 rounded-full dark:text-primary-400">
            {percent}% Completed
          </span>
        </div>
        <CardDescription className="text-xs text-[color:var(--text-muted)]">
          Complete the milestones to unlock advanced AI recommendation engines and mock reviews.
        </CardDescription>
      </CardHeader>

      {/* Progress Bar */}
      <div className="relative w-full h-2.5 bg-[color:var(--bg-muted)] rounded-full overflow-hidden mb-6">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
        />
      </div>

      {/* Checklist list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {steps
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                step.completed
                  ? 'border-success-100 bg-success-50/5 dark:border-success-900/10 dark:bg-success-950/5'
                  : 'border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)]'
              }`}
            >
              {/* Checkmark bubble */}
              <div className="mt-0.5 shrink-0">
                {step.completed ? (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-success-500 text-white shadow-sm shadow-success-500/20 text-[10px]">
                    ✓
                  </span>
                ) : (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-[color:var(--border-strong)] text-transparent text-[10px]">
                    ○
                  </span>
                )}
              </div>
              
              {/* Title & Description */}
              <div className="space-y-0.5">
                <p
                  className={`text-xs font-semibold leading-tight ${
                    step.completed
                      ? 'text-[color:var(--text-primary)] line-through opacity-75'
                      : 'text-[color:var(--text-primary)]'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[10px] leading-tight text-[color:var(--text-muted)]">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
      </div>
    </Card>
  );
}
