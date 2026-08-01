import { useState, useEffect } from 'react';

/**
 * Persist and retrieve a value from localStorage with TypeScript generics.
 * Handles JSON serialization/deserialization and SSR safety.
 *
 * Usage:
 *   const [theme, setTheme] = useLocalStorage('theme', 'light');
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.warn(`Failed to persist "${key}" to localStorage`);
    }
  }, [key, value]);

  const removeValue = (): void => {
    setValue(defaultValue);
    window.localStorage.removeItem(key);
  };

  return [value, setValue, removeValue] as const;
}
