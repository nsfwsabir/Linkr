import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { mockUser } from '../../utils/mockData';

type Session = { user: typeof mockUser } | null;

type AuthContextValue = {
  session: Session;
  /** Mock sign-in for UI-first phase; replaced by Supabase in Phase 6. */
  signIn: () => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue>({
  session: null,
  signIn: () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(null);
  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      signIn: () => setSession({ user: mockUser }),
      signOut: () => setSession(null),
    }),
    [session],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
