import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { gas, isAuthError } from '@/lib/gas';
import type { AuthUser, MetaResponse } from '@/types/api';

const TOKEN_KEY = 'kp-auth-token';

interface AuthContextValue {
  booting: boolean;
  token: string | null;
  user: AuthUser | null;
  meta: MetaResponse | null;
  setMeta: (meta: MetaResponse | null) => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  handleAuthFailure: (error: unknown) => boolean;
  withToken: <T extends Record<string, unknown>>(payload?: T) => T & { token: string | null };
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function writeStoredToken(token: string | null) {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [booting, setBooting] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [meta, setMeta] = useState<MetaResponse | null>(null);

  const clearSession = useCallback(() => {
    setToken(null);
    setUser(null);
    setMeta(null);
    writeStoredToken(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = readStoredToken();
      if (!stored) {
        if (!cancelled) setBooting(false);
        return;
      }
      try {
        const session = await gas.getSession({ token: stored });
        if (cancelled) return;
        if (!session?.authenticated) {
          clearSession();
        } else {
          setToken(stored);
          setUser({
            username: session.username || '',
            displayName: session.displayName || session.username || '',
          });
        }
      } catch {
        if (!cancelled) clearSession();
      } finally {
        if (!cancelled) setBooting(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [clearSession]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    gas
      .getMeta({ token })
      .then((next) => {
        if (!cancelled) setMeta(next);
      })
      .catch((error) => {
        if (isAuthError(error)) clearSession();
      });
    return () => {
      cancelled = true;
    };
  }, [token, clearSession]);

  const login = useCallback(async (username: string, password: string) => {
    const result = await gas.login({ username, password });
    setToken(result.token);
    setUser({ username: result.username, displayName: result.displayName });
    writeStoredToken(result.token);
  }, []);

  const logout = useCallback(async () => {
    const current = token;
    try {
      await gas.logout({ token: current });
    } catch {
      /* still clear locally */
    }
    clearSession();
  }, [token, clearSession]);

  const handleAuthFailure = useCallback(
    (error: unknown) => {
      if (isAuthError(error)) {
        clearSession();
        return true;
      }
      return false;
    },
    [clearSession],
  );

  const withToken = useCallback(
    <T extends Record<string, unknown>>(payload?: T) => ({
      ...(payload || ({} as T)),
      token,
    }),
    [token],
  );

  const value = useMemo(
    () => ({
      booting,
      token,
      user,
      meta,
      setMeta,
      login,
      logout,
      handleAuthFailure,
      withToken,
    }),
    [booting, token, user, meta, login, logout, handleAuthFailure, withToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
