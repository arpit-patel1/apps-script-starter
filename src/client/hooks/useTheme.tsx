import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';

const THEME_ORDER: ThemePreference[] = ['light', 'dark', 'system'];
export const THEME_LABELS: Record<ThemePreference, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'Auto',
};

interface ThemeContextValue {
  theme: ThemePreference;
  cycleTheme: () => void;
  setTheme: (pref: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): ThemePreference {
  try {
    const stored = localStorage.getItem('kp-theme');
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  } catch {
    /* ignore */
  }
  return 'system';
}

function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyDomTheme(pref: ThemePreference) {
  const dark = pref === 'dark' || (pref === 'system' && systemPrefersDark());
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  try {
    localStorage.setItem('kp-theme', pref);
  } catch {
    /* ignore */
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>(() => readStoredTheme());

  useEffect(() => {
    applyDomTheme(theme);
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (theme === 'system') applyDomTheme('system');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [theme]);

  const setTheme = useCallback((pref: ThemePreference) => {
    setThemeState(pref);
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeState((current) => {
      const idx = THEME_ORDER.indexOf(current);
      return THEME_ORDER[(idx + 1) % THEME_ORDER.length];
    });
  }, []);

  const value = useMemo(() => ({ theme, cycleTheme, setTheme }), [theme, cycleTheme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
