import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@shared/utils/cn';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  className?: string;
}

const placementStyles = {
  right: 'right-0 top-0 bottom-0 h-full border-l',
  left: 'left-0 top-0 bottom-0 h-full border-r',
  top: 'top-0 left-0 right-0 w-full border-b',
  bottom: 'bottom-0 left-0 right-0 w-full border-t',
};

const sizeStyles = {
  right: {
    sm: 'max-w-xs w-full',
    md: 'max-w-sm w-full',
    lg: 'max-w-md w-full',
    xl: 'max-w-xl w-full',
    full: 'max-w-full w-full',
  },
  left: {
    sm: 'max-w-xs w-full',
    md: 'max-w-sm w-full',
    lg: 'max-w-md w-full',
    xl: 'max-w-xl w-full',
    full: 'max-w-full w-full',
  },
  top: {
    sm: 'h-64',
    md: 'h-96',
    lg: 'h-[50vh]',
    xl: 'h-[75vh]',
    full: 'h-full',
  },
  bottom: {
    sm: 'h-64',
    md: 'h-96',
    lg: 'h-[50vh]',
    xl: 'h-[75vh]',
    full: 'h-full',
  },
};

const slideAnimations = {
  right: { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } },
  left: { initial: { x: '-100%' }, animate: { x: 0 }, exit: { x: '-100%' } },
  top: { initial: { y: '-100%' }, animate: { y: 0 }, exit: { y: '-100%' } },
  bottom: { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } },
};

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  placement = 'right',
  size = 'md',
  closeOnOverlayClick = true,
  className,
}: DrawerProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === overlayRef.current) {
      onClose();
    }
  };

  const anim = slideAnimations[placement];
  const sizeClass = sizeStyles[placement][size];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-modal flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm dark:bg-slate-950/80"
          />

          {/* Drawer Content */}
          <motion.div
            initial={anim.initial}
            animate={anim.animate}
            exit={anim.exit}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className={cn(
              'fixed bg-[color:var(--bg-surface)] border-[color:var(--border-subtle)] shadow-2xl flex flex-col',
              placementStyles[placement],
              sizeClass,
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[color:var(--border-subtle)] px-6 py-4">
              <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">
                {title || ''}
              </h3>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-[color:var(--text-muted)] hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--text-primary)] transition-colors"
                aria-label="Close drawer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
