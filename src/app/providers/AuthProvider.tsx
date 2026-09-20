import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase/client';
import { mockUser } from '../../utils/mockData';

type AuthContextValue = {
  /** Supabase session when backend is configured; mock session in UI-only mode. */
  session: Session | { user: typeof mockUser } | null;
  user: User | typeof mockUser | null;
  loading: boolean;
  /** True when Supabase is configured (real backend), false in mock UI mode. */
  isConfigured: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  /** Mock bypass used before backend is configured. */
  signInMock: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  loading: true,
  isConfigured: false,
  signInWithEmail: async () => ({ error: 'Supabase is not configured.' }),
  signUpWithEmail: async () => ({ error: 'Supabase is not configured.' }),
  signInWithGoogle: async () => ({ error: 'Supabase is not configured.' }),
  signInMock: () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const isConfigured = supabase !== null;
  const [session, setSession] = useState<Session | { user: typeof mockUser } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: (session as Session)?.user ?? (session as { user: typeof mockUser })?.user ?? null,
      loading,
      isConfigured,
      signInWithEmail: async (email, password) => {
        if (!supabase) return { error: 'Supabase is not configured.' };
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        return { error: error?.message ?? null };
      },
      signUpWithEmail: async (name, email, password) => {
        if (!supabase) return { error: 'Supabase is not configured.' };
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { display_name: name.trim() } },
        });
        return { error: error?.message ?? null };
      },
      signInWithGoogle: async () => {
        if (!supabase) return { error: 'Supabase is not configured.' };
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: { skipBrowserRedirect: true },
        });
        // Native redirect completes via deep link; surface any immediate error.
        return { error: error?.message ?? null };
      },
      signInMock: () => setSession({ user: mockUser }),
      signOut: async () => {
        if (!supabase) {
          setSession(null);
          return;
        }
        await supabase.auth.signOut();
      },
    }),
    [session, loading, isConfigured],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
