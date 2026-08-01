import { useMemo } from 'react';
import { cn } from '@shared/utils/cn';

interface PasswordStrengthMeterProps {
  password?: string;
}

interface StrengthRequirement {
  id: string;
  label: string;
  met: boolean;
}

export function PasswordStrengthMeter({ password = '' }: PasswordStrengthMeterProps) {
  const requirements = useMemo<StrengthRequirement[]>(() => {
    return [
      { id: 'length', label: '8-64 characters', met: password.length >= 8 && password.length <= 64 },
      { id: 'uppercase', label: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
      { id: 'lowercase', label: 'One lowercase letter (a-z)', met: /[a-z]/.test(password) },
      { id: 'number', label: 'One number (0-9)', met: /[0-9]/.test(password) },
      { id: 'special', label: 'One special character (!@#$%^&*)', met: /[^A-Za-z0-9]/.test(password) },
    ];
  }, [password]);

  const score = useMemo(() => {
    if (!password) { return 0; }
    return requirements.filter((r) => r.met).length;
  }, [password, requirements]);

  const strengthConfig = useMemo(() => {
    if (score === 0) { return { label: 'Empty', color: 'bg-gray-200 dark:bg-gray-700', text: 'text-gray-400' }; }
    if (score <= 2) { return { label: 'Weak', color: 'bg-error-500', text: 'text-error-500' }; }
    if (score <= 4) { return { label: 'Medium', color: 'bg-warning-500', text: 'text-warning-500' }; }
    return { label: 'Strong', color: 'bg-success-500', text: 'text-success-500' };
  }, [score]);

  if (!password) { return null; }

  return (
    <div className="flex flex-col gap-2 my-2 w-full">
      {/* Progress Bars */}
      <div className="flex items-center gap-1.5 w-full">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-all duration-300',
              index < score ? strengthConfig.color : 'bg-gray-200 dark:bg-gray-700',
            )}
          />
        ))}
      </div>

      <div className="flex justify-between items-center text-xs">
        <span className="text-[color:var(--text-muted)]">Password Strength:</span>
        <span className={cn('font-semibold', strengthConfig.text)}>{strengthConfig.label}</span>
      </div>

      {/* Requirements Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1 text-xs">
        {requirements.map((req) => (
          <div key={req.id} className="flex items-center gap-1.5">
            <span className={cn('text-xs font-bold', req.met ? 'text-success-500' : 'text-gray-400')}>
              {req.met ? '✓' : '•'}
            </span>
            <span className={cn(req.met ? 'text-[color:var(--text-primary)]' : 'text-[color:var(--text-muted)]')}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
