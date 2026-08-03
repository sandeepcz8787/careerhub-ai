import { motion } from 'framer-motion';
import { cn } from '@shared/utils/cn';

export interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  gradient?: string;
  className?: string;
  badge?: string;
}

export function FeatureCard({
  title,
  description,
  icon,
  gradient = 'from-primary-500/10 to-accent-500/10',
  className,
  badge,
}: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] p-6 md:p-8 flex flex-col justify-between transition-smooth shadow-sm hover:shadow-xl hover:border-primary-500/20 dark:hover:border-primary-400/30',
        className
      )}
    >
      {/* Background Gradient Glow */}
      <div
        className={cn(
          'absolute -right-16 -top-16 w-36 h-36 rounded-full bg-gradient-to-br opacity-0 group-hover:opacity-40 blur-2xl transition-opacity duration-500 pointer-events-none',
          gradient
        )}
      />

      <div>
        {/* Icon wrapper */}
        {icon && (
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-50 dark:from-primary-950/30 to-accent-50 dark:to-accent-950/30 border border-primary-500/10 dark:border-primary-400/20 text-primary-500 dark:text-primary-400 mb-5 shrink-0 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        )}

        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-bold text-[color:var(--text-primary)] group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
            {title}
          </h3>
          {badge && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
              {badge}
            </span>
          )}
        </div>

        <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-6 flex items-center text-xs font-bold text-primary-500 dark:text-primary-400 group-hover:translate-x-1 transition-transform">
        <span>Learn more</span>
        <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.div>
  );
}
