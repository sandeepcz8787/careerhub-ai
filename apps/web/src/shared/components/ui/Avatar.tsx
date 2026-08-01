import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@shared/utils/cn';
import { getInitials } from '@careerhub/shared';

// ─────────────────────────────────────────────────────────────────────────────
// Avatar
// ─────────────────────────────────────────────────────────────────────────────

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface AvatarProps extends ComponentPropsWithoutRef<'div'> {
  src?: string | null;
  name?: string;
  size?: AvatarSize;
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'busy' | 'away';
}

const sizeStyles: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-2xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
  '2xl': 'w-20 h-20 text-xl',
};

const statusColors = {
  online: 'bg-success-500',
  offline: 'bg-[color:var(--text-muted)]',
  busy: 'bg-error-500',
  away: 'bg-warning-500',
};

const statusSizes: Record<AvatarSize, string> = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-3.5 h-3.5',
  '2xl': 'w-4 h-4',
};

export function Avatar({
  src,
  name = '',
  size = 'md',
  shape = 'circle',
  status,
  className,
  ...props
}: AvatarProps) {
  const initials = getInitials(name);
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-lg';

  return (
    <div className={cn('relative inline-flex shrink-0', className)} {...props}>
      {src ? (
        <img
          src={src}
          alt={name || 'User avatar'}
          className={cn(
            'object-cover bg-[color:var(--bg-muted)]',
            sizeStyles[size],
            shapeClass,
          )}
          loading="lazy"
        />
      ) : (
        <div
          aria-label={name || 'User avatar'}
          className={cn(
            'flex items-center justify-center font-semibold select-none',
            'bg-gradient-to-br from-primary-500 to-accent-500 text-white',
            sizeStyles[size],
            shapeClass,
          )}
        >
          {initials || '?'}
        </div>
      )}

      {status && (
        <span
          aria-label={`Status: ${status}`}
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-[color:var(--bg-surface)]',
            statusColors[status],
            statusSizes[size],
          )}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AvatarGroup
// ─────────────────────────────────────────────────────────────────────────────

interface AvatarGroupProps {
  avatars: Array<{ src?: string | null; name: string }>;
  max?: number;
  size?: AvatarSize;
}

export function AvatarGroup({ avatars, max = 4, size = 'sm' }: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((avatar, i) => (
        <Avatar
          key={i}
          src={avatar.src}
          name={avatar.name}
          size={size}
          className="ring-2 ring-[color:var(--bg-surface)]"
        />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'flex items-center justify-center font-medium',
            'bg-[color:var(--bg-muted)] text-[color:var(--text-secondary)]',
            'ring-2 ring-[color:var(--bg-surface)] rounded-full',
            sizeStyles[size],
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
