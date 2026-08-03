import { motion } from 'framer-motion';
import { cn } from '@shared/utils/cn';

export interface TabOption {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabOption[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'pills' | 'underline';
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'pills',
  className,
}: TabsProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 p-1 bg-[color:var(--bg-subtle)] border border-[color:var(--border-subtle)] rounded-xl relative',
        variant === 'underline' && 'bg-transparent border-0 border-b border-[color:var(--border-subtle)] rounded-none px-0 pb-0 gap-6',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative z-raised px-4 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 select-none transition-colors duration-200 focus-visible:outline-none text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]',
              isActive && 'text-primary-600 dark:text-white',
              variant === 'underline' && 'rounded-none px-1 pb-3 pt-2 border-b-2 border-transparent hover:border-[color:var(--border-strong)]',
              variant === 'underline' && isActive && 'border-primary-500 hover:border-primary-500'
            )}
          >
            {/* Background Slider for Pills */}
            {variant === 'pills' && isActive && (
              <motion.div
                layoutId="active-tab-indicator"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="absolute inset-0 bg-[color:var(--bg-surface)] border border-[color:var(--border-subtle)] shadow-sm rounded-lg z-hide"
              />
            )}

            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
