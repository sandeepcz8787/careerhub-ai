import { useRef, useState, type KeyboardEvent, type ClipboardEvent } from 'react';
import { cn } from '@shared/utils/cn';

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  disabled?: boolean;
  hasError?: boolean;
}

export function OtpInput({ length = 6, onComplete, disabled = false, hasError = false }: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const focusInput = (index: number) => {
    if (index >= 0 && index < length) {
      inputRefs.current[index]?.focus();
    }
  };

  const handleChange = (index: number, value: string) => {
    if (disabled) { return; }

    const char = value.slice(-1);
    if (char && !/^\d$/.test(char)) { return; } // Allow numbers only

    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    const combined = newDigits.join('');
    if (combined.length === length && !newDigits.includes('')) {
      onComplete(combined);
    } else if (char && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) { return; }

    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        focusInput(index - 1);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1);
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) { return; }

    const pasted = e.clipboardData.getData('text').trim();
    if (!/^\d+$/.test(pasted)) { return; }

    const pastedDigits = pasted.slice(0, length).split('');
    const newDigits = [...digits];

    pastedDigits.forEach((digit, idx) => {
      newDigits[idx] = digit;
    });

    setDigits(newDigits);

    const combined = newDigits.join('');
    if (combined.length === length && !newDigits.includes('')) {
      onComplete(combined);
    }

    focusInput(Math.min(pastedDigits.length, length - 1));
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 my-4">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={cn(
            'w-11 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl border',
            'bg-[color:var(--bg-surface)] text-[color:var(--text-primary)] transition-all duration-150',
            'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none',
            hasError
              ? 'border-error-500 text-error-500 focus:border-error-500 focus:ring-error-500/20'
              : digit
                ? 'border-primary-500 bg-primary-500/5'
                : 'border-[color:var(--border-default)]',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        />
      ))}
    </div>
  );
}
