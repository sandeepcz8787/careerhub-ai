import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@shared/utils/cn';

export interface FAQCardProps {
  question: string;
  answer: string;
  className?: string;
}

export function FAQCard({ question, answer, className }: FAQCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={cn(
        'group flex flex-col rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] overflow-hidden transition-smooth',
        isOpen ? 'border-primary-500/20 shadow-md' : 'shadow-sm hover:border-[color:var(--border-strong)]',
        className
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-base text-[color:var(--text-primary)] focus:outline-none select-none"
      >
        <span className="group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-[color:var(--text-muted)] p-1 rounded-lg hover:bg-[color:var(--bg-subtle)]"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-1 text-sm text-[color:var(--text-secondary)] leading-relaxed border-t border-[color:var(--border-subtle)] bg-[color:var(--bg-subtle)]/20">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
