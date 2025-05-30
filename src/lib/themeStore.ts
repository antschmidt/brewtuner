import { writable } from 'svelte/store';

const THEME_KEY = 'theme';

// Function to get the initial theme from localStorage or system preference
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

export const theme = writable<'light' | 'dark'>(getInitialTheme());

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

export function toggleTheme() {
  theme.update((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
}
