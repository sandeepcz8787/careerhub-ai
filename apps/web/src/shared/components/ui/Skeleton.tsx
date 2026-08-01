import { cn } from '@shared/utils/cn';

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  lines?: number;
}

/**
 * Skeleton loading placeholder.
 *
 * Usage:
 *   <Skeleton className="h-4 w-48" />
 *   <Skeleton lines={3} className="h-4" />
 *   <Skeleton rounded className="w-10 h-10" />  // Circle
 */
export function Skeleton({ className, lines, rounded = false }: SkeletonProps) {
  if (lines && lines > 1) {
    return (
      <div className="flex flex-col gap-2 w-full">
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={cn(
              'skeleton',
              rounded ? 'rounded-full' : 'rounded',
              i === lines - 1 && 'w-4/5', // Last line is shorter
              className,
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'skeleton',
        rounded ? 'rounded-full' : 'rounded',
        className,
      )}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pre-built skeleton composites
// ─────────────────────────────────────────────────────────────────────────────

export function CardSkeleton() {
  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton rounded className="w-10 h-10 shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton lines={3} className="h-3" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }, (_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton rounded className="w-20 h-20 shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton lines={4} className="h-4" />
    </div>
  );
}
