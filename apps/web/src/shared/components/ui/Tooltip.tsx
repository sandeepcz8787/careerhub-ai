import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@shared/utils/cn';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const placementClasses = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2 origin-bottom',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2 origin-top',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2 origin-right',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2 origin-left',
};

const animationProperties = {
  top: { initial: { opacity: 0, scale: 0.95, y: 4 }, animate: { opacity: 1, scale: 1, y: 0 } },
  bottom: { initial: { opacity: 0, scale: 0.95, y: -4 }, animate: { opacity: 1, scale: 1, y: 0 } },
  left: { initial: { opacity: 0, scale: 0.95, x: 4 }, animate: { opacity: 1, scale: 1, x: 0 } },
  right: { initial: { opacity: 0, scale: 0.95, x: -4 }, animate: { opacity: 1, scale: 1, x: 0 } },
};

export function Tooltip({
  content,
  children,
  placement = 'top',
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const showTooltip = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setIsVisible(true);
  };

  const hideTooltip = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(false);
    }, 150);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={animationProperties[placement].initial}
            animate={animationProperties[placement].animate}
            exit={animationProperties[placement].initial}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'absolute z-tooltip pointer-events-none rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white shadow-md dark:bg-slate-800 dark:border dark:border-slate-700/50 whitespace-nowrap',
              placementClasses[placement],
              className
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
