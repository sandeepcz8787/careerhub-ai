import { useState } from 'react';
import { motion } from 'framer-motion';
import { PricingCard } from '@shared/components/ui/PricingCard';
import { Badge } from '@shared/components/ui/Badge';

export function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const plans = [
    {
      name: 'Starter',
      price: 0,
      description: 'Perfect for exploring the platform and crafting your first resume.',
      features: [
        '1 ATS Optimized Resume',
        '3 AI Resume Scans / mo',
        'Standard PDF Export',
        'Basic Job Tracker (Kanban)',
      ],
      ctaText: 'Start Free',
      isPopular: false,
    },
    {
      name: 'Pro Developer',
      price: billingPeriod === 'monthly' ? 19 : 15,
      description: 'Our most popular plan. Best for active job hunters and interview prep.',
      features: [
        'Unlimited Resumes',
        'Unlimited AI Resume Scans',
        '10 Mock Interview Coach runs / mo',
        'Premium ATS Score Auditing',
        'Priority Referral Matching',
        'Advanced Job Tracker Analytics',
      ],
      ctaText: 'Upgrade to Pro',
      isPopular: true,
    },
    {
      name: 'Enterprise / Coach',
      price: 'Custom',
      description: 'For university career centres and coaching squads needing bulk access.',
      features: [
        'Everything in Pro Developer',
        'White-labeled Portals',
        'Dedicated Coach Dashboards',
        'API Resume Parsing Access',
        'Dedicated Account Support',
        'SLA Guarantee',
      ],
      ctaText: 'Contact Sales',
      isPopular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-[color:var(--bg-base)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="primary" className="mb-4">Flexible Billing</Badge>
          <h2 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-[color:var(--text-primary)]">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[color:var(--text-secondary)]">
            Choose the plan that fits your career roadmap. Save 20% by subscribing to annual billing.
          </p>

          {/* Period Toggle */}
          <div className="mt-8 flex justify-center items-center gap-3">
            <span className={`text-sm font-semibold transition-colors ${billingPeriod === 'monthly' ? 'text-[color:var(--text-primary)]' : 'text-[color:var(--text-muted)]'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-12 h-6.5 rounded-full bg-primary-500 p-1 flex items-center transition-colors focus:outline-none"
              aria-label="Toggle billing period"
            >
              <motion.span
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-4.5 h-4.5 rounded-full bg-white shadow-sm block"
                style={{
                  marginLeft: billingPeriod === 'monthly' ? '0px' : '22px',
                }}
              />
            </button>
            <span className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${billingPeriod === 'annual' ? 'text-[color:var(--text-primary)]' : 'text-[color:var(--text-muted)]'}`}>
              Annually
              <Badge variant="success" size="sm">Save 20%</Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex"
            >
              <PricingCard
                name={plan.name}
                price={plan.price}
                period={billingPeriod === 'monthly' ? '/mo' : '/mo, billed annually'}
                description={plan.description}
                features={plan.features}
                isPopular={plan.isPopular}
                ctaText={plan.ctaText}
                className="w-full"
              />
            </motion.div>
          ))}
        </div>

        {/* Feature comparison table link or mini grid */}
        <div className="mt-16 text-center">
          <p className="text-sm text-[color:var(--text-secondary)]">
            Need custom seats for a bootcamp or organization?{' '}
            <a href="#" className="font-semibold text-primary-500 hover:underline">
              Request a custom proposal
            </a>
          </p>
        </div>

      </div>
    </section>
  );
}
