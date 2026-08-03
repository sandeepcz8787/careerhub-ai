import { motion } from 'framer-motion';

export function TrustedCompanies() {
  const logos = [
    {
      name: 'Stripe',
      svg: (
        <svg className="h-6 w-auto fill-current" viewBox="0 0 80 32" xmlns="http://www.w3.org/2000/svg">
          <path d="M40.2 13.9c0-2.3-1.8-3.4-4.8-3.4-2.8 0-5.7 1-7.7 2.2l1.3 4c1.8-1.1 3.9-1.9 5.4-1.9 1.4 0 1.9.5 1.9 1.1 0 2.2-8.3 1.6-8.3 7.3 0 3.3 2.6 5.4 6 5.4 2.8 0 4.9-1.2 5.9-2.2l.2 1.8h4.2V13.9zm-4.3 8.3c0 .8-.7 1.4-1.6 1.4-1 0-1.6-.5-1.6-1.3 0-1.8 3.2-1.4 3.2-.1zm15.1-15v4.5h3.4v3.6h-3.4v7.7c0 1 .6 1.4 1.5 1.4.7 0 1.3-.2 1.7-.4l.4 3.5c-.8.4-2.1.7-3.7.7-3.4 0-4.7-1.8-4.7-4.9v-8h-2.3V11.8h2.3V7.2h4.8zm9.5 4.8c-.3 0-.6.1-.8.2l-.2-4.1h4.8v2.7c1-.9 2.5-3.1 5.3-3.1.6 0 1.1.1 1.4.2l-.6 4.3c-.5-.2-1.1-.3-1.8-.3-2.3 0-3.6 1.8-4.1 3.3v8h-4v-11.3zm15 14.4h-4.3V11.8h4.3v11.3zm-2.1-14.8c-1.5 0-2.5-1.1-2.5-2.5s1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1 2.5-2.5 2.5z" />
        </svg>
      ),
    },
    {
      name: 'Vercel',
      svg: (
        <svg className="h-5 w-auto fill-current" viewBox="0 0 116 26" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.2 2L24.4 23H0L12.2 2zM38.8 6.1h3.3v12.2h5.7v2.7h-9V6.1zm11.7 5.7c0-3.9 2.7-6.8 6.6-6.8s6.6 2.9 6.6 6.8c0 3.9-2.7 6.8-6.6 6.8s-6.6-2.9-6.6-6.8zm9.9 0c0-2.3-1.4-4-3.3-4s-3.3 1.7-3.3 4 1.4 4 3.3 4 3.3-1.7 3.3-4zm7.6-5.7h3.3v12.2h5.7v2.7h-9V6.1zm15.1 0h3.3v12.2h5.7v2.7h-9V6.1zm13.1 5.7c0-3.9 2.7-6.8 6.6-6.8s6.6 2.9 6.6 6.8c0 3.9-2.7 6.8-6.6 6.8s-6.6-2.9-6.6-6.8zm9.9 0c0-2.3-1.4-4-3.3-4s-3.3 1.7-3.3 4 1.4 4 3.3 4 3.3-1.7 3.3-4z" />
        </svg>
      ),
    },
    {
      name: 'Slack',
      svg: (
        <svg className="h-5.5 w-auto fill-current" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.6 15c0-1.7-1.4-3-3-3s-3 1.4-3 3v6c0 1.7 1.4 3 3 3s3-1.4 3-3v-6zm0-9c0-1.7-1.4-3-3-3s-3 1.4-3 3s1.4 3 3 3h3V6zm9 9c1.7 0 3-1.4 3-3s-1.4-3-3-3h-6c-1.7 0-3 1.4-3 3s1.4 3 3 3h6zm9 0c1.7 0 3-1.4 3-3s-1.4-3-3-3s-3 1.4-3 3v3h3zm0 9c0 1.7 1.4 3 3 3s3-1.4 3-3v-6c0-1.7-1.4-3-3-3s-3 1.4-3 3v6zm0 6c0 1.7 1.4 3 3 3s3-1.4 3-3s-1.4-3-3-3h-3v3zm-9-9c-1.7 0-3 1.4-3 3s1.4 3 3 3h6c1.7 0 3-1.4 3-3s-1.4-3-3-3h-6zm-9 0c-1.7 0-3 1.4-3 3s1.4 3 3 3s3-1.4 3-3v-3h-3z" />
        </svg>
      ),
    },
    {
      name: 'Airbnb',
      svg: (
        <svg className="h-6 w-auto fill-current" viewBox="0 0 102 32" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 28.5c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm0-24C7.2 4.5 0 11.7 0 20.5S7.2 36.5 16 36.5 32 29.3 32 20.5 24.8 4.5 16 4.5z" />
        </svg>
      ),
    },
    {
      name: 'Linear',
      svg: (
        <svg className="h-5.5 w-auto fill-current" viewBox="0 0 100 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0L24 12L12 24L0 12L12 0ZM32 6H56V9H32V6ZM32 15H48V18H32V15Z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-12 border-y border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-wider text-[color:var(--text-muted)] mb-8">
          Empowering ambitious builders at top tier companies
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-16">
          {logos.map((logo, idx) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 0.4, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ opacity: 0.8, scale: 1.05 }}
              className="text-[color:var(--text-secondary)] transition-colors cursor-pointer"
            >
              {logo.svg}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
