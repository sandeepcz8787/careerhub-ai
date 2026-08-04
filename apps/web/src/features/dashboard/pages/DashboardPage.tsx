import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Routes } from '@careerhub/shared';
import { useAuth } from '@features/auth/hooks/useAuth';
import { Card } from '@shared/components/ui/Card';
import { Button } from '@shared/components/ui/Button';

// Reusable components
import { StatCard } from '../components/StatCard';
import { ProgressCard } from '../components/ProgressCard';
import { ActivityCard } from '../components/ActivityCard';
import { RecommendationCard } from '../components/RecommendationCard';
import { QuickActionCard } from '../components/QuickActionCard';
import { CalendarCard } from '../components/CalendarCard';

// Hooks & Services
import {
  useDashboardStats,
  useCareerProgress,
  useRecentActivities,
  useJobRecommendations,
  useCalendarEvents,
  useToggleSaveJob,
} from '../hooks/useDashboard';
import { dashboardService } from '../services/dashboard.service';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Queries
  const {
    data: stats,
    isLoading: isStatsLoading,
    isError: isStatsError,
    refetch: refetchStats,
  } = useDashboardStats();

  const { data: checklist, isLoading: isChecklistLoading } = useCareerProgress();
  const { data: activities, isLoading: isActivitiesLoading } = useRecentActivities();
  const { data: recommendations, isLoading: isRecsLoading } = useJobRecommendations();
  const { data: events, isLoading: isEventsLoading } = useCalendarEvents();
  
  // Mutation
  const { mutate: toggleSaveJob } = useToggleSaveJob();

  // Load Date & Motivational Quote
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const quote = dashboardService.getMotivationalQuote();

  // AI Assistant Suggestions list
  const aiSuggestions = [
    { text: 'Improve ATS resume score from 85% to 95%', action: Routes.RESUME_CHECKER },
    { text: 'Practice React Mock Interview (Senior level)', action: Routes.MOCK_INTERVIEW },
    { text: 'Complete Projects details in Profile section', action: Routes.PROFILE },
    { text: 'Generate cover letter for Vercel application', action: Routes.COVER_LETTER },
    { text: 'Apply to high-match Senior Frontend recommendation', action: '#jobs' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      
      {/* ── WELCOME BANNER ── */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-primary-500/10 via-accent-500/5 to-transparent border border-primary-500/15 text-left relative overflow-hidden"
      >
        {/* Background glow orb */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] sm:text-xs font-black tracking-wider text-primary-500 dark:text-primary-400 uppercase">
              {currentDate}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-heading text-[color:var(--text-primary)]">
              Welcome back, {user?.profile?.displayName || 'Candidate'}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-[color:var(--text-secondary)] font-semibold italic max-w-2xl pr-4">
              "{quote}"
            </p>
          </div>
          
          <div className="shrink-0 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="font-bold text-xs"
              onClick={() => navigate(Routes.RESUME_BUILDER)}
            >
              Resume Setup
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="font-bold text-xs shadow-md shadow-primary-500/20"
              onClick={() => navigate(Routes.MOCK_INTERVIEW)}
            >
              Start AI Mock 🤖
            </Button>
          </div>
        </div>
      </motion.section>

      {/* ── METRICS SUMMARY GRID ── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Job Applications"
          value={stats?.applications.count}
          trend={stats ? { value: stats.applications.change, label: 'vs last month', isPositive: true } : undefined}
          isLoading={isStatsLoading}
          isError={isStatsError}
          onRetry={refetchStats}
          icon="💼"
        />
        <StatCard
          label="Scheduled Interviews"
          value={stats?.interviews.count}
          trend={stats ? { value: stats.interviews.change, label: 'callback rate', isPositive: true } : undefined}
          isLoading={isStatsLoading}
          isError={isStatsError}
          onRetry={refetchStats}
          icon="🎯"
        />
        <StatCard
          label="ATS Resume Score"
          value={stats ? `${stats.resumeScore.score}/${stats.resumeScore.max}` : undefined}
          isLoading={isStatsLoading}
          isError={isStatsError}
          onRetry={refetchStats}
          icon="📈"
        />
        <StatCard
          label="Coding Streak"
          value={stats ? `${stats.codingStreak.days} Days` : undefined}
          trend={stats ? { value: stats.codingStreak.best, label: 'best record', isPositive: true } : undefined}
          isLoading={isStatsLoading}
          isError={isStatsError}
          onRetry={refetchStats}
          icon="🔥"
        />
      </section>

      {/* ── MAIN DASHBOARD SPLIT GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Career Progress, Activity, Job Listings (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Career checklist progress */}
          <section>
            <ProgressCard steps={checklist} isLoading={isChecklistLoading} />
          </section>

          {/* Job Recommendations header & list */}
          <section className="space-y-3.5">
            <div className="flex justify-between items-baseline">
              <h3 className="text-md font-bold tracking-tight font-heading text-[color:var(--text-primary)]">
                Recommended Jobs For You
              </h3>
              <button
                onClick={() => navigate(Routes.JOB_TRACKER)}
                className="text-xs font-bold text-primary-500 hover:underline"
              >
                View all jobs ➔
              </button>
            </div>

            {isRecsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} variant="glass" className="h-44 flex flex-col justify-between p-4">
                    <div className="flex gap-2">
                      <div className="w-10 h-10 rounded bg-[color:var(--bg-muted)] animate-pulse" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-4 bg-[color:var(--bg-muted)] animate-pulse rounded w-3/4" />
                        <div className="h-3 bg-[color:var(--bg-muted)] animate-pulse rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-3 bg-[color:var(--bg-muted)] animate-pulse rounded w-full" />
                    <div className="flex gap-2">
                      <div className="h-8 bg-[color:var(--bg-muted)] animate-pulse rounded flex-1" />
                      <div className="h-8 bg-[color:var(--bg-muted)] animate-pulse rounded w-12" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recommendations?.map((job) => (
                  <RecommendationCard
                    key={job.id}
                    job={job}
                    onSave={(id) => toggleSaveJob(id)}
                    onApply={() => alert(`Redirecting to mock application process for ${job.role} at ${job.companyName}!`)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Chronological user activity feed */}
          <section>
            <ActivityCard activities={activities} isLoading={isActivitiesLoading} />
          </section>

        </div>

        {/* Right Side: Quick Actions, AI Assistant, Calendar (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Actions Shortcuts */}
          <section className="space-y-3">
            <h3 className="text-xs font-black uppercase text-[color:var(--text-secondary)] tracking-wider">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              <QuickActionCard
                title="Build AI Resume"
                description="Optimize points & export PDF templates"
                icon="📄"
                variant="primary"
                onClick={() => navigate(Routes.RESUME_BUILDER)}
              />
              <QuickActionCard
                title="ATS Checker"
                description="Scan keywords & score matches"
                icon="🤖"
                variant="accent"
                onClick={() => navigate(Routes.RESUME_CHECKER)}
              />
              <QuickActionCard
                title="Practice AI Mock Interview"
                description="1-on-1 audio/video coaching"
                icon="🎯"
                variant="default"
                onClick={() => navigate(Routes.MOCK_INTERVIEW)}
              />
              <QuickActionCard
                title="Coding Challenges"
                description="Weekly algorithmic test runs"
                icon="💻"
                variant="default"
                onClick={() => navigate(Routes.CODING_CHALLENGES)}
              />
            </div>
          </section>

          {/* AI Assistant Widget Card */}
          <section>
            <Card variant="glass" className="border border-accent-500/20 shadow bg-gradient-to-br from-accent-500/5 to-primary-500/5 relative overflow-hidden p-5">
              {/* Star details glow overlay */}
              <div className="absolute right-0 top-0 w-24 h-24 bg-accent-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex gap-2.5 items-center mb-3">
                <span className="text-xl">✨</span>
                <h4 className="text-xs font-black uppercase text-[color:var(--text-primary)] tracking-wider">
                  AI Career Coach suggestions
                </h4>
              </div>

              <div className="space-y-2.5">
                {aiSuggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (sug.action.startsWith('#')) {
                        const target = document.querySelector(sug.action);
                        target?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        navigate(sug.action);
                      }
                    }}
                    className="w-full flex items-center justify-between text-left p-2 border border-[color:var(--border-subtle)] rounded-xl bg-[color:var(--bg-surface)] hover:border-accent-500/30 hover:shadow-xs transition-all text-[11px] font-bold text-[color:var(--text-secondary)] hover:text-accent-500"
                  >
                    <span className="line-clamp-1 pr-1">{sug.text}</span>
                    <span className="text-accent-500">➔</span>
                  </button>
                ))}
              </div>
            </Card>
          </section>

          {/* Mini Calendar widget */}
          <section className="h-[310px]">
            <CalendarCard events={events} isLoading={isEventsLoading} />
          </section>

        </div>

      </div>

    </div>
  );
}
