import { motion } from 'framer-motion';

const features = [
  { icon: '📄', label: 'AI Resume Builder' },
  { icon: '🤖', label: 'ATS Checker' },
  { icon: '💼', label: 'Job Tracker' },
  { icon: '🎯', label: 'Mock Interview' },
  { icon: '🏢', label: 'Company Reviews' },
  { icon: '🤝', label: 'Referral Network' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/**
 * Coming Soon landing page — shown while the app is under construction.
 * Showcases the brand, upcoming features, and collects interest.
 */
export function ComingSoonPage() {
  return (
    <div className="page-wrapper relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Background gradient orbs */}
      <div
        aria-hidden="true"
        className="absolute -top-40 -left-40 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl pointer-events-none"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-6 py-16 max-w-3xl mx-auto"
      >
        {/* Logo / Brand */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--bg-surface)] border border-[color:var(--border-subtle)] shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
            <span className="text-sm font-medium text-[color:var(--text-secondary)]">
              Coming Soon
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl shadow-lg">
              🚀
            </div>
            <h1 className="text-4xl sm:text-5xl font-black font-heading">
              <span className="gradient-text">CareerHub AI</span>
            </h1>
          </div>

          <p className="text-xl sm:text-2xl font-medium text-[color:var(--text-secondary)] mb-2">
            The AI-Powered Career Platform
          </p>
          <p className="text-[color:var(--text-muted)] text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            We're building something extraordinary. Land your dream job with AI-powered resumes,
            mock interviews, job tracking, and a thriving career community.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10"
        >
          {features.map((f) => (
            <div
              key={f.label}
              className="glass-card p-4 flex items-center gap-3 text-left"
            >
              <span className="text-2xl shrink-0">{f.icon}</span>
              <span className="text-sm font-medium text-[color:var(--text-primary)]">{f.label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="mailto:hello@careerhub.ai"
            className="inline-flex items-center justify-center h-12 px-8 rounded-xl font-semibold text-white text-base bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 transition-all shadow-md hover:shadow-lg hover:shadow-primary-500/20 hover:-translate-y-0.5"
          >
            Get Early Access ✨
          </a>
        </motion.div>

        {/* Footer */}
        <motion.p variants={itemVariants} className="mt-12 text-xs text-[color:var(--text-muted)]">
          © {new Date().getFullYear()} CareerHub AI. Built with ❤️ for job seekers worldwide.
        </motion.p>
      </motion.div>
    </div>
  );
}
