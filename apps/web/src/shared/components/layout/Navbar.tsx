import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Routes } from '@careerhub/shared';
import { useDarkMode } from '@shared/hooks/useDarkMode';
import { Button } from '@shared/components/ui/Button';
import { cn } from '@shared/utils/cn';

export function Navbar() {
  const { isDark, toggleTheme } = useDarkMode();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'AI Tools', href: '#ai-features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleScrollTo = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
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
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-sticky w-full transition-smooth border-b border-transparent',
        isScrolled
          ? 'bg-[color:var(--glass-bg)] border-[color:var(--glass-border)] shadow-sm backdrop-blur-md'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to={Routes.HOME} className="flex items-center gap-2.5 focus-ring">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-500 to-accent-500 text-white font-extrabold text-lg shadow-md glow">
              C
            </span>
            <span className="font-heading text-lg font-black tracking-tight text-[color:var(--text-primary)]">
              CareerHub<span className="text-primary-500 dark:text-primary-400">.AI</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleScrollTo(link.href)}
                className="text-sm font-medium text-[color:var(--text-secondary)] hover:text-primary-500 dark:hover:text-primary-400 transition-colors focus-ring"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-xl p-2.5 border border-[color:var(--border-default)] hover:bg-[color:var(--bg-subtle)] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] transition-colors focus-ring"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                // Sun icon
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                  />
                </svg>
              ) : (
                // Moon icon
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            <Button variant="ghost" size="sm" onClick={() => navigate(Routes.LOGIN)}>
              Sign In
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate(Routes.REGISTER)}>
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2.5 md:hidden">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-xl p-2.5 border border-[color:var(--border-default)] hover:bg-[color:var(--bg-subtle)] text-[color:var(--text-secondary)] transition-colors focus-ring"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-xl p-2.5 border border-[color:var(--border-default)] hover:bg-[color:var(--bg-subtle)] text-[color:var(--text-secondary)] transition-colors focus-ring"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] py-4 px-6 flex flex-col gap-4 animate-fade-in shadow-xl">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleScrollTo(link.href)}
              className="text-left py-2.5 text-sm font-semibold text-[color:var(--text-secondary)] hover:text-primary-500 transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="h-px bg-[color:var(--border-subtle)] my-2" />
          <div className="flex flex-col gap-2.5">
            <Button variant="secondary" size="md" onClick={() => { setIsMobileMenuOpen(false); navigate(Routes.LOGIN); }}>
              Sign In
            </Button>
            <Button variant="primary" size="md" onClick={() => { setIsMobileMenuOpen(false); navigate(Routes.REGISTER); }}>
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
