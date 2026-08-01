import { useState, useEffect } from 'react';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints: Record<Breakpoint, string> = {
  xs: '(min-width: 480px)',
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
};

/**
 * Reactive media query hook.
 * Returns true if the media query matches.
 *
 * Usage:
 *   const isDesktop = useMediaQuery('(min-width: 1024px)');
 *   const isMobile = useMediaQuery('md', false);  // below md breakpoint
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') { return false; }
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') { return; }
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent): void => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * Check if screen is above a named breakpoint.
 */
export function useBreakpoint(breakpoint: Breakpoint): boolean {
  return useMediaQuery(breakpoints[breakpoint]);
}

/**
 * Convenience hooks for common breakpoints.
 */
export const useIsMobile = (): boolean => !useBreakpoint('md');
export const useIsTablet = (): boolean => useBreakpoint('md') && !useBreakpoint('lg');
export const useIsDesktop = (): boolean => useBreakpoint('lg');
