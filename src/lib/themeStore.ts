/**
 * Theme Store
 *
 * Manages light/dark theme state with localStorage persistence and
 * automatic system preference detection.
 */

import { writable } from 'svelte/store';

const THEME_KEY = 'theme';

/**
 * Gets the initial theme from localStorage or system preference
 * Falls back to 'light' for SSR environments
 * @returns The initial theme ('light' or 'dark')
 */
function getInitialTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined') {
    const storedTheme = localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null;
    if (storedTheme) {
      return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light'; // Default for SSR
}

/** Writable store containing the current theme */
export const theme = writable<'light' | 'dark'>(getInitialTheme());

// Subscribe to theme changes and update localStorage + body class
theme.subscribe((value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(THEME_KEY, value);
    if (value === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
});

/**
 * Toggles between light and dark themes
 */
export function toggleTheme() {
  theme.update((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
}
