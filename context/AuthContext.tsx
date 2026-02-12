import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session — wrapped safely for null-client during SSR
    const initSession = async () => {
      try {
        const result = await supabase.auth.getSession();
        setSession(result?.data?.session ?? null);
      } catch {
        // Null client during build / SSR — safe to ignore
      } finally {
        setLoading(false);
      }
    };
    initSession();

    // Listen for auth changes — guard against null-client
    let unsubscribe: (() => void) | undefined;
    try {
      const authResult = supabase.auth.onAuthStateChange(
        (_event: any, sess: any) => {
          setSession(sess);
        }
      );
      // Real client returns { data: { subscription } }
      // Null-client proxy returns a Promise — handle both
      if (authResult && typeof authResult === 'object' && 'data' in authResult) {
        unsubscribe = (authResult as any).data?.subscription?.unsubscribe;
      }
    } catch {
      // Null client — safe to ignore
    }

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    // Explicitly set session if returned (when email confirm is OFF)
    if (data.session) {
      setSession(data.session);
    }
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    // Explicitly set session
    if (data.session) {
      setSession(data.session);
    }
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
