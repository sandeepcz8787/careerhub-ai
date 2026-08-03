import { useState, useRef } from 'react';
import { cn } from '@shared/utils/cn';

export interface SearchBoxProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
  className?: string;
}

export function SearchBox({
  placeholder = 'Search...',
  onSearch,
  onChange,
  className,
}: SearchBoxProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    setValue('');
    if (onChange) onChange('');
    if (inputRef.current) inputRef.current.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    if (onChange) onChange(val);
  };

  return (
    <div className={cn('relative w-full flex items-center', className)}>
      <span className="absolute left-3.5 text-[color:var(--text-muted)] pointer-events-none">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          'w-full pl-11 pr-10 py-2.5 text-sm bg-[color:var(--bg-surface)] border border-[color:var(--border-default)] rounded-xl placeholder:text-[color:var(--text-muted)] text-[color:var(--text-primary)] transition-smooth',
          'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10'
        )}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3.5 p-0.5 rounded-lg text-[color:var(--text-muted)] hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--text-primary)] transition-colors"
          aria-label="Clear search input"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
