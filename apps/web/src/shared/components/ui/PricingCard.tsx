import { motion } from 'framer-motion';
import { cn } from '@shared/utils/cn';
import { Button } from './Button';

export interface PricingCardProps {
  name: string;
  price: string | number;
  period?: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
}

export function PricingCard({
  name,
  price,
  period = '/mo',
  description,
  features,
  isPopular = false,
  ctaText = 'Get Started',
  onCtaClick,
  className,
}: PricingCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'relative flex flex-col justify-between p-6 sm:p-8 rounded-2xl border bg-[color:var(--bg-surface)] transition-smooth shadow-sm',
        isPopular
          ? 'border-primary-500 ring-2 ring-primary-500/20 dark:border-primary-400'
          : 'border-[color:var(--border-subtle)]',
        className
      )}
    >
      {isPopular && (
        <span className="absolute -top-3.5 right-6 text-2xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-sm glow">
          Most Popular
        </span>
      )}

      <div>
        <div className="mb-5">
          <h3 className="text-lg font-extrabold text-[color:var(--text-primary)] mb-1">
            {name}
          </h3>
          <p className="text-xs text-[color:var(--text-muted)] min-h-[32px]">
            {description}
          </p>
        </div>

        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-4xl font-extrabold tracking-tight text-[color:var(--text-primary)]">
            {typeof price === 'number' ? `$${price}` : price}
          </span>
          {price !== 'Custom' && (
            <span className="text-sm font-medium text-[color:var(--text-muted)]">{period}</span>
          )}
        </div>

        <ul className="space-y-3.5 mb-8 text-sm text-[color:var(--text-secondary)]">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="shrink-0 mt-0.5 text-primary-500 dark:text-primary-400">
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button
        variant={isPopular ? 'primary' : 'secondary'}
        onClick={onCtaClick}
        fullWidth
        className={cn(isPopular ? 'shadow-md shadow-primary-500/20' : '')}
      >
        {ctaText}
      </Button>
    </motion.div>
  );
}
