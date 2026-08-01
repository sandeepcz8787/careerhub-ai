import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // ── Color Palette ────────────────────────────────────────────────────
      colors: {
        // Primary — Indigo/Violet gradient palette
        primary: {
          50: 'hsl(239, 100%, 97%)',
          100: 'hsl(239, 91%, 93%)',
          200: 'hsl(239, 89%, 85%)',
          300: 'hsl(239, 87%, 75%)',
          400: 'hsl(239, 83%, 65%)',
          500: 'hsl(239, 84%, 58%)',   // Base — indigo-500
          600: 'hsl(243, 75%, 52%)',
          700: 'hsl(243, 68%, 44%)',
          800: 'hsl(243, 60%, 36%)',
          900: 'hsl(243, 55%, 28%)',
          950: 'hsl(243, 55%, 15%)',
        },
        // Accent — Violet
        accent: {
          50: 'hsl(270, 100%, 97%)',
          100: 'hsl(270, 95%, 93%)',
          200: 'hsl(270, 92%, 85%)',
          300: 'hsl(270, 89%, 75%)',
          400: 'hsl(270, 85%, 65%)',
          500: 'hsl(270, 76%, 58%)',   // Base — violet-500
          600: 'hsl(271, 68%, 50%)',
          700: 'hsl(271, 62%, 42%)',
          800: 'hsl(271, 56%, 34%)',
          900: 'hsl(271, 52%, 26%)',
          950: 'hsl(271, 52%, 14%)',
        },
        // Surface (background layers)
        surface: {
          0: 'hsl(0, 0%, 100%)',      // White
          50: 'hsl(220, 20%, 98%)',   // Near-white
          100: 'hsl(220, 14%, 96%)',
          200: 'hsl(220, 13%, 91%)',
          800: 'hsl(222, 14%, 14%)',  // Dark
          900: 'hsl(222, 18%, 10%)',
          950: 'hsl(222, 22%, 7%)',   // Darkest
        },
        // Semantic colors
        success: {
          50: 'hsl(142, 76%, 95%)',
          500: 'hsl(142, 71%, 45%)',
          700: 'hsl(142, 64%, 30%)',
        },
        warning: {
          50: 'hsl(38, 92%, 95%)',
          500: 'hsl(38, 92%, 50%)',
          700: 'hsl(32, 85%, 35%)',
        },
        error: {
          50: 'hsl(0, 86%, 97%)',
          500: 'hsl(0, 72%, 51%)',
          700: 'hsl(0, 64%, 36%)',
        },
      },

      // ── Typography ───────────────────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.16' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.05' }],
      },

      // ── Spacing — 8px grid ───────────────────────────────────────────────
      spacing: {
        '4.5': '1.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
      },

      // ── Border Radius ────────────────────────────────────────────────────
      borderRadius: {
        none: '0',
        xs: '4px',
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
        full: '9999px',
      },

      // ── Shadows ──────────────────────────────────────────────────────────
      boxShadow: {
        xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
        sm: '0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        md: '0 8px 16px -2px rgba(0, 0, 0, 0.08), 0 4px 8px -4px rgba(0, 0, 0, 0.06)',
        lg: '0 16px 32px -4px rgba(0, 0, 0, 0.1), 0 8px 16px -8px rgba(0, 0, 0, 0.08)',
        xl: '0 24px 48px -8px rgba(0, 0, 0, 0.12), 0 12px 24px -12px rgba(0, 0, 0, 0.1)',
        '2xl': '0 40px 80px -12px rgba(0, 0, 0, 0.15)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        glow: '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-lg': '0 0 40px rgba(99, 102, 241, 0.25)',
        none: 'none',
      },

      // ── Animations ───────────────────────────────────────────────────────
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-up': 'fadeUp 0.4s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        shimmer: 'shimmer 1.5s infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },

      // ── Backdrop Blur ────────────────────────────────────────────────────
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },

      // ── Z-Index Scale ────────────────────────────────────────────────────
      zIndex: {
        hide: '-1',
        auto: 'auto',
        base: '0',
        raised: '1',
        dropdown: '1000',
        sticky: '1100',
        overlay: '1200',
        modal: '1300',
        popover: '1400',
        toast: '1500',
        tooltip: '1600',
      },

      // ── Screens ──────────────────────────────────────────────────────────
      screens: {
        xs: '480px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
};

export default config;
