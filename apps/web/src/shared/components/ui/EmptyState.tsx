import { cn } from '@shared/utils/cn';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 border border-dashed border-[color:var(--border-default)] rounded-2xl bg-[color:var(--bg-surface)] max-w-lg mx-auto',
        className
      )}
    >
      {icon ? (
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/20 text-primary-500 mb-4 shrink-0">
          {icon}
        </div>
      ) : (
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/20 text-primary-500 mb-4 shrink-0">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
        </div>
      )}
      <h3 className="text-md font-semibold text-[color:var(--text-primary)] mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[color:var(--text-muted)] max-w-sm mb-5 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-1 shrink-0">{action}</div>}
    </div>
  );
}
