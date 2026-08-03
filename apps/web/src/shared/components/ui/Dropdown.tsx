import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@shared/utils/cn';

export interface DropdownItem {
  label: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  divider?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
  triggerClassName?: string;
}

export function Dropdown({
  trigger,
  items,
  align = 'right',
  className,
  triggerClassName,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className={cn('relative inline-block text-left', className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn('inline-flex items-center justify-center focus:outline-none', triggerClassName)}
      >
        {trigger}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'absolute z-dropdown mt-2 w-56 rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] p-1.5 shadow-xl backdrop-blur-md focus:outline-none',
              align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
            )}
          >
            <div className="py-0.5">
              {items.map((item, idx) => {
                if (item.divider) {
                  return <div key={idx} className="my-1 border-t border-[color:var(--border-subtle)]" />;
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={item.disabled}
                    onClick={() => {
                      if (item.onClick) item.onClick();
                      setIsOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-[color:var(--text-primary)] hover:bg-[color:var(--bg-subtle)] transition-colors disabled:opacity-40 disabled:pointer-events-none',
                      item.className
                    )}
                  >
                    {item.icon && <span className="shrink-0 text-[color:var(--text-muted)]">{item.icon}</span>}
                    <span className="flex-1">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
