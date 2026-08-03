import { motion } from 'framer-motion';
import { FAQCard } from '@shared/components/ui/FAQCard';
import { Badge } from '@shared/components/ui/Badge';

export function FAQSection() {
  const faqs = [
    {
      question: 'How does the AI Resume Review process work?',
      answer: 'Once you upload your resume or write it using our interactive builder, our AI audit agent scans the text. It parses technical key phrases, metrics impact, and structural formatting, cross-referencing your content against typical recruiter preferences to flag suggestions for active improvement.',
    },
    {
      question: 'Can I import my existing PDF or DOCX resume?',
      answer: 'Yes! You can drop your existing PDF or Word documents directly into our parser. The system extracts your work experiences, skills, and summary blocks into structured fields, ready for AI reviews or style templates changes.',
    },
    {
      question: 'What is an ATS score, and why is it important?',
      answer: 'An Applicant Tracking System (ATS) is software recruiters use to filter resumes by keywords. A high ATS score means your resume contains relevant terminology, skills, and correct document hierarchies, reducing the risk of auto-rejection by company screening software.',
    },
    {
      question: 'How realistic are the mock interview runs?',
      answer: 'Our Mock Interview Coach uses job descriptions and resume details to construct specialized conversational questions. You can converse via text or mic input, getting real-time followups. Afterwards, you receive scores covering structure, speed, and technical relevance.',
    },
    {
      question: 'Is my personal career data safe and private?',
      answer: 'Absolutely. We treat your personal documentation, resumes, and conversation logs with strict data security measures. We encrypt all payloads, never sell credentials, and allow you to request data deletions at any time in your account configurations.',
    },
    {
      question: 'Can I cancel my Pro Developer subscription anytime?',
      answer: 'Yes, there are no lock-in contracts. You can pause or cancel your subscription plan directly inside your billing settings at any point. You will retain access to Pro features until the end of your current active billing cycle.',
    },
  ];

  return (
    <section id="faq" className="py-20 lg:py-28 bg-[color:var(--bg-base)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="primary" className="mb-4">Common Questions</Badge>
          <h2 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-[color:var(--text-primary)]">
            Got Questions? We Have Answers.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[color:var(--text-secondary)]">
            Everything you need to know about the platform, templates, credits, and AI capabilities.
          </p>
        </div>

        {/* FAQs Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {faqs.map((faq, idx) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <FAQCard question={faq.question} answer={faq.answer} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
