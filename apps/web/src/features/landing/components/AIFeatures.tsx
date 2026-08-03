import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs } from '@shared/components/ui/Tabs';
import { Card } from '@shared/components/ui/Card';
import { Badge } from '@shared/components/ui/Badge';

export function AIFeatures() {
  const [activeTab, setActiveTab] = useState('resume');

  const tabOptions = [
    {
      id: 'resume',
      label: 'Resume Review',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'ats',
      label: 'ATS Score Check',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'interview',
      label: 'Mock Interview',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="ai-features" className="py-20 lg:py-28 bg-[color:var(--bg-subtle)] border-y border-[color:var(--border-subtle)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <Badge variant="primary" className="mb-4">Intelligence Platform</Badge>
          <h2 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-[color:var(--text-primary)]">
            Powered by Specialized AI Agents
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[color:var(--text-secondary)] leading-relaxed">
            Toggle between our AI subagents to see how they audit your profile, optimize your ATS fit, and train you for real discussions.
          </p>
        </div>

        {/* Interactive Tabs */}
        <div className="flex justify-center mb-10">
          <Tabs
            tabs={tabOptions}
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="pills"
            className="shadow-sm"
          />
        </div>

        {/* Tab Content Display Area */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {activeTab === 'resume' && (
              <motion.div
                key="resume"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                {/* Visual Simulation */}
                <div className="lg:col-span-7">
                  <Card variant="glass" className="relative p-6 md:p-8 overflow-hidden aspect-[4/3] flex flex-col justify-between">
                    <div className="flex justify-between items-center pb-4 border-b border-[color:var(--border-subtle)]">
                      <span className="text-xs font-bold text-[color:var(--text-muted)]">audit_report_pm.docx</span>
                      <Badge variant="warning">5 Suggestions</Badge>
                    </div>
                    <div className="space-y-4 my-6 flex-1 text-xs sm:text-sm">
                      <div className="p-3.5 rounded-xl bg-[color:var(--bg-surface)] border border-[color:var(--border-subtle)] space-y-1">
                        <p className="font-extrabold text-[color:var(--text-primary)]">Summary</p>
                        <p className="text-[color:var(--text-secondary)]">Experienced Software Architect with history managing multi-tier cloud frameworks.</p>
                      </div>
                      <div className="p-3.5 rounded-xl border border-red-500/20 bg-rose-500/5 relative">
                        <span className="absolute -top-2 right-4 text-[10px] font-bold px-2 py-0.5 bg-error-500 text-white rounded-full">Weak verb</span>
                        <p className="text-[color:var(--text-secondary)] line-through">Helped build cloud solutions using AWS.</p>
                        <p className="text-success-500 font-bold mt-1">→ Engineered scalable serverless microservices, boosting throughput by 42%.</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[color:var(--text-muted)]">AI Audit Agent</span>
                      <span className="text-xs font-bold text-primary-500">Scan Complete</span>
                    </div>
                  </Card>
                </div>

                {/* Explanation */}
                <div className="lg:col-span-5 space-y-6">
                  <h3 className="text-2xl font-bold text-[color:var(--text-primary)]">
                    Deep Semantic Resume Auditing
                  </h3>
                  <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed">
                    Our AI reads resumes like human recruiters. It analyzes sentence impact, active verbs, numeric achievement values, and formatting structural errors, offering inline replacements.
                  </p>
                  <ul className="space-y-3.5 text-sm text-[color:var(--text-secondary)]">
                    <li className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">✓</span>
                      <span>Identifies weak passive phrasing</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">✓</span>
                      <span>Suggests metric-driven metrics alternatives</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">✓</span>
                      <span>Formats according to industry standards</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {activeTab === 'ats' && (
              <motion.div
                key="ats"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                {/* Visual Simulation */}
                <div className="lg:col-span-7">
                  <Card variant="glass" className="relative p-6 md:p-8 overflow-hidden aspect-[4/3] flex flex-col justify-between">
                    <div className="flex justify-between items-center pb-4 border-b border-[color:var(--border-subtle)]">
                      <span className="text-xs font-bold text-[color:var(--text-muted)]">Job: Stripe - Staff Frontend Engineer</span>
                      <Badge variant="success">Match Found</Badge>
                    </div>
                    
                    <div className="my-auto py-6 flex flex-col items-center justify-center gap-4">
                      {/* Interactive dial representation */}
                      <div className="relative w-36 h-36 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" stroke="var(--border-subtle)" strokeWidth="6" fill="transparent" />
                          <circle cx="50" cy="50" r="40" stroke="var(--brand-primary)" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset="37.6" strokeLinecap="round" />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-3xl font-extrabold text-[color:var(--text-primary)]">85%</span>
                          <span className="text-[10px] text-[color:var(--text-muted)] font-bold uppercase">ATS Score</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap justify-center gap-2 max-w-sm">
                        <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300">✓ React 19</span>
                        <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300">✓ TypeScript</span>
                        <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300">✗ Next.js Routing</span>
                        <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300">✓ TailwindCSS</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-[color:var(--text-muted)]">
                      <span>ATS Simulator Engine v1.4</span>
                      <span className="font-semibold text-warning-500">Missing 2 critical keywords</span>
                    </div>
                  </Card>
                </div>

                {/* Explanation */}
                <div className="lg:col-span-5 space-y-6">
                  <h3 className="text-2xl font-bold text-[color:var(--text-primary)]">
                    ATS Keyword Optimization
                  </h3>
                  <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed">
                    Don't get blocked by automatic filters. Our scoring system runs resumes against target job descriptions, identifying key missing technical terms, frameworks, and qualifications.
                  </p>
                  <ul className="space-y-3.5 text-sm text-[color:var(--text-secondary)]">
                    <li className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">✓</span>
                      <span>Real-time match scoring</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">✓</span>
                      <span>Interactive missing keyword suggestions</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">✓</span>
                      <span>Job description parser comparison</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {activeTab === 'interview' && (
              <motion.div
                key="interview"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                {/* Visual Simulation */}
                <div className="lg:col-span-7">
                  <Card variant="glass" className="relative p-6 md:p-8 overflow-hidden aspect-[4/3] flex flex-col justify-between">
                    <div className="flex justify-between items-center pb-4 border-b border-[color:var(--border-subtle)]">
                      <span className="text-xs font-bold text-[color:var(--text-muted)]">Live Audio Session</span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <Badge variant="outline">04:32</Badge>
                      </span>
                    </div>

                    <div className="space-y-4 my-4 flex-1 overflow-y-auto pr-1 text-xs">
                      {/* Message 1 */}
                      <div className="flex gap-2 items-start max-w-md">
                        <div className="w-7 h-7 rounded-lg bg-primary-500 text-white flex items-center justify-center shrink-0 font-bold">AI</div>
                        <div className="p-3 bg-[color:var(--bg-subtle)] border border-[color:var(--border-subtle)] rounded-xl rounded-tl-none">
                          "Great summary. How do you approach scaling Postgres databases when write loads spike?"
                        </div>
                      </div>
                      {/* Message 2 */}
                      <div className="flex gap-2 items-start max-w-md ml-auto justify-end">
                        <div className="p-3 bg-primary-500 text-white rounded-xl rounded-tr-none text-right">
                          "We implement connection pooling, read replicas, and horizontal sharding based on user IDs."
                        </div>
                        <div className="w-7 h-7 rounded-lg bg-indigo-500 text-white flex items-center justify-center shrink-0 font-bold">ME</div>
                      </div>
                    </div>

                    {/* Audio wave simulator */}
                    <div className="border-t border-[color:var(--border-subtle)] pt-4 flex items-center gap-3">
                      <button className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center shrink-0">
                        <span className="w-3.5 h-3.5 bg-red-500 rounded-full" />
                      </button>
                      <div className="flex-1 flex gap-0.5 items-center justify-center h-8">
                        <span className="w-1 bg-primary-500 rounded-full animate-pulse" style={{ height: '40%' }} />
                        <span className="w-1 bg-accent-500 rounded-full animate-pulse" style={{ height: '70%', animationDelay: '0.1s' }} />
                        <span className="w-1 bg-primary-500 rounded-full animate-pulse" style={{ height: '20%', animationDelay: '0.2s' }} />
                        <span className="w-1 bg-accent-500 rounded-full animate-pulse" style={{ height: '90%', animationDelay: '0.3s' }} />
                        <span className="w-1 bg-primary-500 rounded-full animate-pulse" style={{ height: '50%', animationDelay: '0.4s' }} />
                        <span className="w-1 bg-accent-500 rounded-full animate-pulse" style={{ height: '30%', animationDelay: '0.5s' }} />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Explanation */}
                <div className="lg:col-span-5 space-y-6">
                  <h3 className="text-2xl font-bold text-[color:var(--text-primary)]">
                    Realistic Mock Interviews
                  </h3>
                  <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed">
                    Practice answering behavioural and technical queries in a high-fidelity environment. Receive post-interview feedback indicating delivery speed, grammar quality, and core topic coverage.
                  </p>
                  <ul className="space-y-3.5 text-sm text-[color:var(--text-secondary)]">
                    <li className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">✓</span>
                      <span>Voice and text interaction modes</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">✓</span>
                      <span>Recruiter personality profiles</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">✓</span>
                      <span>Detailed metrics evaluation dashboards</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
