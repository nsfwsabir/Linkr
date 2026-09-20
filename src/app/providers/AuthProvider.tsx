import React, { createContext, useContext, useState, ReactNode } from 'react';

type AuthState = {
  session: null;
  signOut: () => void;
};

const AuthContext = createContext<AuthState>({ session: null, signOut: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session] = useState<null>(null);
  return (
    <AuthContext.Provider value={{ session, signOut: () => {} }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
