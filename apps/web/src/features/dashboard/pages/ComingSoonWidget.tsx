import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Card } from '@shared/components/ui/Card';
import { Button } from '@shared/components/ui/Button';

const routeLabels: Record<string, { title: string; icon: string; desc: string }> = {
  '/resume-builder': {
    title: 'AI Resume Builder',
    icon: '📄',
    desc: 'Craft a tailored, professional resume in minutes using our AI assistant. Auto-fill from LinkedIn, apply templates, and optimize language.',
  },
  '/resume-checker': {
    title: 'ATS Checker & Resume Score',
    icon: '🤖',
    desc: 'Upload your resume and test it against real industry descriptions. Get detailed feedback on bullet points, keywords, structure, and readability.',
  },
  '/cover-letter': {
    title: 'AI Cover Letter Generator',
    icon: '✉️',
    desc: 'Instantly generate a matching cover letter tailored precisely to the job description and your experience.',
  },
  '/jobs': {
    title: 'Job Tracker',
    icon: '💼',
    desc: 'Keep track of all your active applications, deadlines, contacts, and interview stages in one unified kanban pipeline.',
  },
  '/internships': {
    title: 'Internships Finder',
    icon: '🎓',
    desc: 'Discover vetted internship roles matching your academic year and technical skills. Apply with one click using optimized profiles.',
  },
  '/applications': {
    title: 'Applications Center',
    icon: '📁',
    desc: 'Track and manage details of your sent applications, responses, and offer letters.',
  },
  '/mock-interview': {
    title: 'AI Mock Interviews',
    icon: '🎯',
    desc: 'Practice custom interviews with an interactive AI Coach. Receive immediate feedback on body language, technical content, and speech pacing.',
  },
  '/coding-challenges': {
    title: 'Coding Challenges',
    icon: '💻',
    desc: 'Improve your programming skills with weekly challenges. Solve algorithmic puzzles, test execution speed, and review system designs.',
  },
  '/community': {
    title: 'CareerHub Community',
    icon: '🤝',
    desc: 'Network with industry professionals and peer applicants. Join groups, share interview experiences, and ask for referrals.',
  },
  '/referrals': {
    title: 'Referral Marketplace',
    icon: '🔗',
    desc: 'Connect with verified employees at top tech companies. Request referrals, review guidelines, and share opportunities.',
  },
  '/interview-experiences': {
    title: 'Interview Experiences',
    icon: '💬',
    desc: 'Read real questions and round descriptions shared by candidates for various engineering, product, and designer positions.',
  },
  '/chat': {
    title: 'Direct Messages & Chat',
    icon: '🗣️',
    desc: 'Chat directly with peers, community leaders, and recruiters. Get real-time answers to your career questions.',
  },
  '/analytics': {
    title: 'Career Analytics',
    icon: '📈',
    desc: 'Review stats on search performance, resume matches, application response rates, and coding speed.',
  },
  '/help': {
    title: 'Help & Support',
    icon: '❓',
    desc: 'Find answers in our knowledge base, review platform guides, or open a chat ticket with our support engineering team.',
  },
};

export function ComingSoonWidget() {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const feature = routeLabels[currentPath] || {
    title: 'Feature Module',
    icon: '🚀',
    desc: 'This career module is currently under active construction. We are building premium resources to speed up your job search.',
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-xl w-full"
      >
        <Card variant="glass" className="text-center p-8 border border-[color:var(--glass-border)] space-y-6 shadow-lg">
          {/* Feature category header */}
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-500/10 to-accent-500/10 text-4xl shadow-inner mb-2 animate-bounce">
              {feature.icon}
            </div>
            <h2 className="text-2xl font-black tracking-tight font-heading text-[color:var(--text-primary)]">
              {feature.title}
            </h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-500/10 text-accent-500 dark:text-accent-400 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
              Under Construction
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-[color:var(--text-muted)] leading-relaxed px-4">
            {feature.desc}
          </p>

          <hr className="border-[color:var(--border-subtle)]" />

          {/* Call to Action */}
          <div className="space-y-4">
            <p className="text-xs font-semibold text-[color:var(--text-secondary)]">
              Want early access when this feature goes live?
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full h-10 px-3.5 rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-surface)] text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 text-[color:var(--text-primary)]"
                defaultValue="user@careerhub.ai"
                readOnly
              />
              <Button variant="primary" size="sm" className="font-bold text-xs shrink-0 h-10">
                Join Waitlist 🔔
              </Button>
            </div>
            <p className="text-[10px] text-[color:var(--text-muted)]">
              No spam. Get notified once the module is fully validated.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
