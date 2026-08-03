import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Routes } from '@careerhub/shared';
import { Button } from '@shared/components/ui/Button';
import { Card } from '@shared/components/ui/Card';
import { Badge } from '@shared/components/ui/Badge';

export function Hero() {
  const navigate = useNavigate();

  const handleScrollToFeatures = () => {
    const element = document.querySelector('#features');
    if (element) {
      const topOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28 min-h-screen flex flex-col justify-center bg-[color:var(--bg-base)]">
      {/* Background Glowing Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-primary-500/10 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -35, 25, 0],
            y: [0, 45, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/3 right-1/4 w-[350px] h-[350px] rounded-full bg-accent-500/10 blur-3xl"
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-raised">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-6 flex flex-col text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center lg:justify-start mb-6"
            >
              <Badge variant="secondary" size="lg" className="px-4 py-1 border border-accent-500/20 backdrop-blur-sm animate-pulse">
                ✨ CareerHub AI 2.0 is Live
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight leading-tight text-[color:var(--text-primary)]"
            >
              Land Your Dream Job with{' '}
              <span className="bg-gradient-to-r from-primary-500 via-purple-500 to-accent-500 bg-clip-text text-transparent">
                Career Intelligence
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-[color:var(--text-secondary)] leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Optimize your resume, master mock interviews, check real-time ATS scoring, and track every application in a unified career dashboard.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Button
                variant="primary"
                size="xl"
                onClick={() => navigate(Routes.REGISTER)}
                className="w-full sm:w-auto shadow-lg shadow-primary-500/20 px-8"
              >
                Start Free Trial
              </Button>
              <Button
                variant="secondary"
                size="xl"
                onClick={handleScrollToFeatures}
                className="w-full sm:w-auto border-[color:var(--border-default)] px-8"
              >
                Learn More
              </Button>
            </motion.div>

            {/* Statistics Mini Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-12 grid grid-cols-3 gap-4 border-t border-[color:var(--border-subtle)] pt-8 max-w-md mx-auto lg:mx-0"
            >
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-primary-500 dark:text-primary-400">92%</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--text-muted)] mt-1">
                  ATS Pass Rate
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-accent-500 dark:text-accent-400">14 Days</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--text-muted)] mt-1">
                  Avg. Placement
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-indigo-500 dark:text-indigo-400">3x</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--text-muted)] mt-1">
                  More Interviews
                </p>
              </div>
            </motion.div>
          </div>

          {/* Hero Right Dashboard Demonstration */}
          <div className="lg:col-span-6 relative mt-10 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mx-auto max-w-[500px] lg:max-w-none shadow-2xl rounded-2xl overflow-hidden border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] aspect-[4/3] p-4 lg:p-6"
            >
              {/* Header simulation */}
              <div className="flex items-center justify-between pb-4 border-b border-[color:var(--border-subtle)] mb-4">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="text-xs text-[color:var(--text-muted)] bg-[color:var(--bg-subtle)] px-3 py-1 rounded-lg border border-[color:var(--border-subtle)] font-medium">
                  app.careerhub.ai/dashboard
                </div>
              </div>

              {/* Main dashboard simulation grid */}
              <div className="grid grid-cols-12 gap-4 h-[calc(100%-48px)]">
                {/* Column 1 */}
                <div className="col-span-8 space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/10 flex flex-col justify-between h-[120px]">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-semibold text-primary-500">AI RESUME REVIEW</p>
                        <h3 className="text-md font-bold text-[color:var(--text-primary)] mt-1">Senior Product Manager</h3>
                      </div>
                      <Badge variant="success">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-1.5">
                        <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center text-[10px] font-bold">JD</span>
                        <span className="w-6 h-6 rounded-full bg-accent-100 dark:bg-accent-950 flex items-center justify-center text-[10px] font-bold">AI</span>
                      </div>
                      <span className="text-xs font-semibold text-success-500">89/100 ATS Score</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg-subtle)]/30 flex flex-col gap-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[color:var(--text-secondary)]">Mock Interview Coach</span>
                      <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">Ready</span>
                    </div>
                    <p className="text-xs text-[color:var(--text-secondary)] leading-relaxed italic bg-[color:var(--bg-surface)] p-2.5 border border-[color:var(--border-subtle)] rounded-lg">
                      "Tell me about a time you solved a complex conflict in your engineering team..."
                    </p>
                    <div className="flex gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse mt-1" />
                      <span className="text-xs font-medium text-[color:var(--text-muted)]">Voice input processing...</span>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="col-span-4 flex flex-col gap-4">
                  <div className="flex-1 p-4 rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] flex flex-col justify-between text-center">
                    <p className="text-xs font-bold text-[color:var(--text-muted)]">JOB APPLICATIONS</p>
                    <div className="py-2.5">
                      <p className="text-3xl font-extrabold text-[color:var(--text-primary)]">24</p>
                      <p className="text-[10px] text-success-500 font-semibold mt-1">+3 New Today</p>
                    </div>
                    <div className="h-1.5 w-full bg-[color:var(--bg-subtle)] rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full" style={{ width: '70%' }} />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-success-500/20 bg-emerald-500/5 dark:bg-emerald-500/5 flex flex-col gap-1 items-center justify-center text-center">
                    <div className="w-8 h-8 rounded-lg bg-success-500/10 flex items-center justify-center text-success-500 mb-1">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4" />
                      </svg>
                    </div>
                    <p className="text-[11px] font-extrabold text-success-500 uppercase">Referral Match</p>
                    <p className="text-[10px] text-[color:var(--text-muted)] mt-0.5">2 insiders at Stripe</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Card 1 */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -left-6 bottom-16 bg-[color:var(--glass-bg)] border border-[color:var(--glass-border)] rounded-xl p-3.5 shadow-xl backdrop-blur-md hidden sm:flex items-center gap-3 w-48"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-500 text-white flex items-center justify-center shadow-md">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xs font-extrabold text-[color:var(--text-muted)] uppercase">Interview Score</p>
                <p className="text-sm font-bold text-[color:var(--text-primary)]">94% Excellent</p>
              </div>
            </motion.div>

            {/* Floating Card 2 */}
            <motion.div
              initial={{ opacity: 0, x: 20, y: -20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -right-6 top-16 bg-[color:var(--glass-bg)] border border-[color:var(--glass-border)] rounded-xl p-3.5 shadow-xl backdrop-blur-md hidden sm:flex items-center gap-3 w-48"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-md">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div>
                <p className="text-2xs font-extrabold text-[color:var(--text-muted)] uppercase">ATS Checker</p>
                <p className="text-sm font-bold text-success-500">Perfect Match</p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
