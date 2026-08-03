import { useEffect } from 'react';
import { Navbar } from '@shared/components/layout/Navbar';
import { Footer } from '@shared/components/layout/Footer';
import { Hero } from '../components/Hero';
import { TrustedCompanies } from '../components/TrustedCompanies';
import { Features } from '../components/Features';
import { AIFeatures } from '../components/AIFeatures';
import { PricingSection } from '../components/PricingSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { FAQSection } from '../components/FAQSection';
import { CallToAction } from '../components/CallToAction';

export default function LandingPage() {
  // Update dynamic page meta details for SEO dynamically
  useEffect(() => {
    document.title = 'CareerHub AI — Land Your Dream Job with AI Career Assistant';
  }, []);

  return (
    <div className="page-wrapper flex flex-col min-h-screen">
      {/* Premium Navbar */}
      <Navbar />

      {/* Main page content sections */}
      <main className="flex-grow pt-16">
        <Hero />
        <TrustedCompanies />
        <Features />
        <AIFeatures />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
        <CallToAction />
      </main>

      {/* Structured Footer */}
      <Footer />
    </div>
  );
}
export { LandingPage };
