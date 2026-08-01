import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@shared/utils/cn';

// ─────────────────────────────────────────────────────────────────────────────
// Input
// ─────────────────────────────────────────────────────────────────────────────

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label?: string;
  helperText?: string;
  errorText?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  isRequired?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      errorText,
      leftElement,
      rightElement,
      isRequired,
      className,
      id,
      disabled,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? `input-${Math.random().toString(36).slice(2, 9)}`;
    const hasError = Boolean(errorText);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[color:var(--text-primary)]"
          >
            {label}
            {isRequired && <span className="ml-0.5 text-error-500">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftElement && (
            <span className="absolute left-3 flex items-center text-[color:var(--text-muted)]">
              {leftElement}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            className={cn(
              'input-base',
              leftElement && 'pl-9',
              rightElement && 'pr-9',
              hasError && 'border-error-500 focus:border-error-500 focus:ring-error-500/20',
              disabled && 'opacity-50 cursor-not-allowed',
              className,
            )}
            {...props}
          />
          {rightElement && (
            <span className="absolute right-3 flex items-center text-[color:var(--text-muted)]">
              {rightElement}
            </span>
          )}
        </div>
        {hasError && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs font-medium text-error-500"
          >
            {errorText}
          </p>
        )}
        {!hasError && helperText && (
          <p id={`${inputId}-helper`} className="text-xs text-[color:var(--text-muted)]">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

// ─────────────────────────────────────────────────────────────────────────────
// Textarea
// ─────────────────────────────────────────────────────────────────────────────

export interface TextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  label?: string;
  helperText?: string;
  errorText?: string;
  isRequired?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, errorText, isRequired, className, id, ...props }, ref) => {
    const inputId = id ?? `textarea-${Math.random().toString(36).slice(2, 9)}`;
    const hasError = Boolean(errorText);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[color:var(--text-primary)]">
            {label}
            {isRequired && <span className="ml-0.5 text-error-500">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          aria-invalid={hasError}
          className={cn(
            'input-base resize-y min-h-[100px]',
            hasError && 'border-error-500 focus:border-error-500 focus:ring-error-500/20',
            className,
          )}
          {...props}
        />
        {hasError && (
          <p role="alert" className="text-xs font-medium text-error-500">{errorText}</p>
        )}
        {!hasError && helperText && (
          <p className="text-xs text-[color:var(--text-muted)]">{helperText}</p>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
