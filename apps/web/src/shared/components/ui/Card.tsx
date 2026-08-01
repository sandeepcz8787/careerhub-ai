import { motion } from 'framer-motion';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@shared/utils/cn';

// ─────────────────────────────────────────────────────────────────────────────
// Card
// ─────────────────────────────────────────────────────────────────────────────

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  variant?: 'default' | 'glass' | 'elevated' | 'bordered';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const cardVariants = {
  default: 'card',
  glass: 'glass-card',
  elevated: cn(
    'bg-[color:var(--bg-surface)] border border-[color:var(--border-subtle)]',
    'shadow-lg rounded-xl',
  ),
  bordered: cn(
    'bg-[color:var(--bg-surface)] border-2 border-[color:var(--border-default)]',
    'rounded-xl',
  ),
};

const cardPadding = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
};

export function Card({
  variant = 'default',
  hover = false,
  padding = 'md',
  children,
  className,
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: 'var(--shadow-lg)' } : undefined}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(cardVariants[variant], cardPadding[padding], className)}
      {...(props as ComponentPropsWithoutRef<typeof motion.div>)}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CardHeader / CardBody / CardFooter
// ─────────────────────────────────────────────────────────────────────────────

export function CardHeader({ className, children, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cn('flex flex-col gap-1 mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: ComponentPropsWithoutRef<'h3'>) {
  return (
    <h3 className={cn('text-lg font-semibold text-[color:var(--text-primary)]', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: ComponentPropsWithoutRef<'p'>) {
  return (
    <p className={cn('text-sm text-[color:var(--text-muted)]', className)} {...props}>
      {children}
    </p>
  );
}

export function CardBody({ className, children, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cn('flex-1', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn('flex items-center gap-3 mt-4 pt-4 border-t border-[color:var(--border-subtle)]', className)}
      {...props}
    >
      {children}
    </div>
  );
}
