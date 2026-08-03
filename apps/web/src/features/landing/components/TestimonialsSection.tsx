import { motion } from 'framer-motion';
import { Card } from '@shared/components/ui/Card';
import { Avatar } from '@shared/components/ui/Avatar';
import { Badge } from '@shared/components/ui/Badge';

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Jenkins',
      role: 'Staff Product Manager',
      company: 'Stripe',
      image: '',
      initials: 'SJ',
      rating: 5,
      text: 'The AI Resume Review is pure gold. It highlighted grammatical errors I missed and helped me re-phrase bullets to focus on metrics. I received double the call-backs than my previous application rounds.',
    },
    {
      name: 'Alex Chen',
      role: 'Frontend Engineer',
      company: 'Vercel',
      image: '',
      initials: 'AC',
      rating: 5,
      text: 'Using the Job Tracker dashboard saved me hours of manual note-taking. Seeing my interview pipeline clearly in a Kanban layout allowed me to prepare target followups easily. Highly recommended.',
    },
    {
      name: 'Michael Torres',
      role: 'Data Scientist',
      company: 'Airbnb',
      image: '',
      initials: 'MT',
      rating: 5,
      text: 'Practicing behavioral questions with the Mock Interview Coach felt incredibly real. The AI asked relevant followup queries on data pipeline architectures that actually came up in my interviews!',
    },
    {
      name: 'Elena Rostova',
      role: 'UX Designer',
      company: 'Figma',
      image: '',
      initials: 'ER',
      rating: 5,
      text: 'The ATS scoring system showed me exactly why my resume was getting parsed poorly by company job portals. Adding a few key terminology matches bumped my score to 88% and got me my recruiter screen.',
    },
    {
      name: 'David Kim',
      role: 'DevOps Engineer',
      company: 'Slack',
      image: '',
      initials: 'DK',
      rating: 5,
      text: 'I loved the clean layout and responsive design. Dark mode looks gorgeous. The site is super fast, exports crisp PDFs, and keeps all my job hunt data in one central workspace.',
    },
    {
      name: 'Jessica Vance',
      role: 'Solutions Architect',
      company: 'AWS',
      image: '',
      initials: 'JV',
      rating: 5,
      text: 'CareerHub AI took the stress out of my tech career transition. I optimized my resume for cloud roles, practiced system design mock talks, and tracked 40+ positions to my final offer.',
    },
  ];

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-[color:var(--bg-subtle)] border-t border-[color:var(--border-subtle)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" className="mb-4">Real Results</Badge>
          <h2 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-[color:var(--text-primary)]">
            Success Stories from Real Builders
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[color:var(--text-secondary)]">
            See how ambitious software creators and product builders leveraged CareerHub to secure their roles.
          </p>
        </div>

        {/* Testimonials Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="flex"
            >
              <Card variant="default" hover className="flex flex-col justify-between w-full">
                <div>
                  {/* Rating Stars */}
                  <div className="flex gap-0.5 text-amber-400 mb-4.5">
                    {[...Array(item.rating)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed italic mb-6">
                    "{item.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3.5 pt-4 border-t border-[color:var(--border-subtle)]">
                  <Avatar name={item.name} size="md" className="border border-[color:var(--border-subtle)]" />
                  <div>
                    <h4 className="text-sm font-bold text-[color:var(--text-primary)]">{item.name}</h4>
                    <p className="text-2xs text-[color:var(--text-muted)] font-semibold mt-0.5">
                      {item.role} @ <span className="text-primary-500 font-extrabold">{item.company}</span>
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
