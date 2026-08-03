import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@shared/utils/cn';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = 'info', duration = 4000) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type, duration }]);
      setTimeout(() => removeToast(id), duration);
    },
    [removeToast]
  );

  const success = useCallback((msg: string, dur?: number) => toast(msg, 'success', dur), [toast]);
  const error = useCallback((msg: string, dur?: number) => toast(msg, 'error', dur), [toast]);
  const warning = useCallback((msg: string, dur?: number) => toast(msg, 'warning', dur), [toast]);
  const info = useCallback((msg: string, dur?: number) => toast(msg, 'info', dur), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-toast flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((item) => (
            <ToastCard key={item.id} item={item} onClose={() => removeToast(item.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

const toastStyles: Record<ToastType, { border: string; bg: string; text: string; icon: React.ReactNode }> = {
  success: {
    border: 'border-success-500/30',
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    text: 'text-success-700 dark:text-emerald-400',
    icon: (
      <svg className="w-5 h-5 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  info: {
    border: 'border-primary-500/30',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    text: 'text-primary-700 dark:text-blue-400',
    icon: (
      <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  warning: {
    border: 'border-warning-500/30',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    text: 'text-warning-700 dark:text-amber-400',
    icon: (
      <svg className="w-5 h-5 text-warning-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  error: {
    border: 'border-error-500/30',
    bg: 'bg-rose-50 dark:bg-rose-950/20',
    text: 'text-error-700 dark:text-rose-400',
    icon: (
      <svg className="w-5 h-5 text-error-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

function ToastCard({ item, onClose }: { item: ToastItem; onClose: () => void }) {
  const type = item.type || 'info';
  const styles = toastStyles[type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md pointer-events-auto',
        styles.bg,
        styles.border
      )}
    >
      <div className="shrink-0 mt-0.5">{styles.icon}</div>
      <div className="flex-1 text-sm font-medium text-[color:var(--text-primary)]">
        {item.message}
      </div>
      <button
        onClick={onClose}
        className="shrink-0 rounded-lg p-0.5 text-[color:var(--text-muted)] hover:bg-[color:var(--bg-subtle)] hover:text-[color:var(--text-primary)] transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
}
