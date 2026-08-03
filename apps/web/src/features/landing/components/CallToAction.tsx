import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Routes } from '@careerhub/shared';
import { Button } from '@shared/components/ui/Button';
import { Card } from '@shared/components/ui/Card';

export function CallToAction() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-[color:var(--bg-base)] relative overflow-hidden">
      {/* Decorative gradient glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-primary-500/10 to-accent-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-raised">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: 'spring', damping: 25 }}
        >
          <Card
            variant="glass"
            padding="lg"
            className="text-center flex flex-col items-center justify-center border-primary-500/20 shadow-xl overflow-hidden py-16 px-6 sm:px-12"
          >
            {/* Background floating decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-500/10 rounded-full blur-xl pointer-events-none" />

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight leading-tight text-[color:var(--text-primary)] max-w-2xl">
              Ready to Accelerate Your Career Success?
            </h2>
            <p className="mt-6 text-base sm:text-lg text-[color:var(--text-secondary)] leading-relaxed max-w-xl">
              Join thousands of software engineers, product managers, and tech professionals optimizing their job hunt today.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button
                variant="primary"
                size="xl"
                onClick={() => navigate(Routes.REGISTER)}
                className="w-full sm:w-auto shadow-lg shadow-primary-500/20 px-8"
              >
                Build Your Resume Now
              </Button>
              <Button
                variant="secondary"
                size="xl"
                onClick={() => navigate(Routes.LOGIN)}
                className="w-full sm:w-auto border-[color:var(--border-default)] px-8"
              >
                Sign In to Account
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
