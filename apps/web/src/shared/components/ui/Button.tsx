import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@shared/utils/cn';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Variant styles
// ─────────────────────────────────────────────────────────────────────────────

const variantStyles: Record<ButtonVariant, string> = {
  primary: cn(
    'bg-gradient-to-r from-primary-500 to-accent-500 text-white',
    'hover:from-primary-600 hover:to-accent-600',
    'shadow-sm hover:shadow-md hover:shadow-primary-500/20',
    'active:scale-[0.98]',
  ),
  secondary: cn(
    'bg-[color:var(--bg-subtle)] text-[color:var(--text-primary)]',
    'border border-[color:var(--border-default)]',
    'hover:bg-[color:var(--bg-muted)] hover:border-[color:var(--border-strong)]',
  ),
  outline: cn(
    'border-2 border-primary-500 text-primary-500 bg-transparent',
    'hover:bg-primary-500 hover:text-white',
    'dark:border-primary-400 dark:text-primary-400',
    'dark:hover:bg-primary-400 dark:hover:text-white',
  ),
  ghost: cn(
    'text-[color:var(--text-secondary)] bg-transparent',
    'hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--text-primary)]',
  ),
  danger: cn(
    'bg-error-500 text-white',
    'hover:bg-error-700',
    'shadow-sm hover:shadow-md hover:shadow-error-500/20',
  ),
  link: cn(
    'text-primary-500 bg-transparent underline-offset-4',
    'hover:underline hover:text-primary-600',
    'p-0 h-auto',
  ),
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'h-7 px-2.5 text-xs gap-1 rounded-md',
  sm: 'h-8 px-3 text-sm gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-11 px-5 text-base gap-2 rounded-xl',
  xl: 'h-12 px-6 text-base gap-2.5 rounded-xl',
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: isDisabled ? 1 : 0.97 }}
        transition={{ duration: 0.1 }}
        disabled={isDisabled}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center',
          'font-medium cursor-pointer select-none',
          'transition-all duration-200 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          // Variant + size
          variantStyles[variant],
          sizeStyles[size],
          // Full width
          fullWidth && 'w-full',
          className,
        )}
        {...(props as ComponentPropsWithoutRef<typeof motion.button>)}
      >
        {isLoading ? (
          <>
            <Spinner size="sm" className="text-current" />
            <span className="ml-1.5">Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  },
);

Button.displayName = 'Button';

// ─────────────────────────────────────────────────────────────────────────────
// Spinner (used by Button and standalone)
// ─────────────────────────────────────────────────────────────────────────────

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const spinnerSizes = {
  xs: 'w-3 h-3 border',
  sm: 'w-4 h-4 border-2',
  md: 'w-5 h-5 border-2',
  lg: 'w-6 h-6 border-2',
};

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block rounded-full border-current border-r-transparent animate-spin',
        spinnerSizes[size],
        className,
      )}
    />
  );
}
