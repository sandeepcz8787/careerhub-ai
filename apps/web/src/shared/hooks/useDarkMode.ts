import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

type Theme = 'light' | 'dark' | 'system';

/**
 * Manage dark mode with system preference support.
 * Persists choice to localStorage and syncs with document class.
 */
export function useDarkMode() {
  const [theme, setTheme] = useLocalStorage<Theme>('careerhub-theme', 'system');

  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Listen to system preference changes
  useEffect(() => {
    if (theme !== 'system') { return; }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (): void => {
      document.documentElement.classList.toggle('dark', mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  return {
    theme,
    setTheme,
    isDark,
    toggleTheme: () => setTheme(isDark ? 'light' : 'dark'),
  };
}
