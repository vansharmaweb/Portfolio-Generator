import { useState, useEffect } from 'react';

/**
 * A drop-in replacement for useState that persists to localStorage.
 * On first load, reads from localStorage; falls back to initialValue.
 * On every change, writes to localStorage automatically.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // Silently ignore storage errors (e.g. private browsing quota)
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
