import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * 404 Not Found page — beautiful empty state.
 */
export function NotFoundPage() {
  return (
    <div className="page-wrapper flex items-center justify-center min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center max-w-lg"
      >
        {/* Animated 404 Number */}
        <div className="relative mb-8">
          <div className="text-[180px] font-black leading-none font-heading select-none">
            <span className="gradient-text opacity-20">404</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-8xl">🔍</div>
          </div>
        </div>

        <h1 className="text-3xl font-bold font-heading text-[color:var(--text-primary)] mb-3">
          Page Not Found
        </h1>
        <p className="text-[color:var(--text-muted)] mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center h-11 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 transition-all shadow-sm hover:shadow-md"
          >
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center h-11 px-6 rounded-xl font-semibold text-[color:var(--text-secondary)] border border-[color:var(--border-default)] hover:bg-[color:var(--bg-subtle)] transition-all"
          >
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
