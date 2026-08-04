import { motion } from 'framer-motion';
import { Card } from '@shared/components/ui/Card';

export interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'accent' | 'default';
}

export function QuickActionCard({
  title,
  description,
  icon,
  onClick,
  variant = 'default',
}: QuickActionCardProps) {
  
  // Custom theme borders/backgrounds for specific action themes
  const themeClasses = {
    primary: 'hover:border-primary-500/40 bg-gradient-to-tr hover:from-primary-500/5 hover:to-accent-500/5',
    accent: 'hover:border-accent-500/40 bg-gradient-to-tr hover:from-accent-500/5 hover:to-primary-500/5',
    default: 'hover:border-[color:var(--border-strong)] bg-gradient-to-tr hover:from-[color:var(--bg-muted)] hover:to-transparent',
  };

  const iconClasses = {
    primary: 'bg-primary-500/10 text-primary-500 dark:bg-primary-500/20 dark:text-primary-400',
    accent: 'bg-accent-500/10 text-accent-500 dark:bg-accent-500/20 dark:text-accent-400',
    default: 'bg-[color:var(--bg-muted)] text-[color:var(--text-secondary)] dark:bg-[color:var(--bg-muted)] dark:text-[color:var(--text-primary)]',
  };

  return (
    <Card
      variant="glass"
      padding="sm"
      className={`border border-[color:var(--glass-border)] cursor-pointer select-none transition-all duration-300 relative overflow-hidden group h-full ${themeClasses[variant]}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 relative z-10">
        {/* Rounded Action Icon */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-md shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110 ${iconClasses[variant]}`}>
          {icon}
        </div>

        {/* Text descriptions */}
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-[color:var(--text-primary)] leading-tight tracking-tight group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
            {title}
          </h4>
          <p className="text-[10px] text-[color:var(--text-muted)] leading-tight line-clamp-1 pr-1 font-medium">
            {description}
          </p>
        </div>
      </div>

      {/* Decorative pointer arrow appearing on hover */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-300">
        <span className="text-primary-500 dark:text-primary-400 text-sm font-black">➔</span>
      </div>
    </Card>
  );
}
