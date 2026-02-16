import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/services/supabase';
import {
  checkRateLimit,
  recordAttempt,
  clearRateLimit,
  isValidEmail,
  sanitizeTextInput,
} from '@/utils/security/validation';

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
        // Race against a timeout so the app never stays stuck on a spinner.
        // Safari can hang on Supabase auth init — keep timeout aggressive.
        const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
        const sessionPromise = supabase.auth.getSession()
          .then((r) => r?.data?.session ?? null)
          .catch(() => null);

        const sess = await Promise.race([sessionPromise, timeout]);
        setSession(sess);
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
    // Validate email format
    const cleanEmail = sanitizeTextInput(email).toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      return { error: 'Please enter a valid email address.' };
    }

    // Rate limit sign-up attempts by email
    const rl = checkRateLimit(`signup:${cleanEmail}`);
    if (!rl.allowed) {
      const mins = Math.ceil((rl.lockedUntilMs ?? 0) / 60000);
      return { error: `Too many attempts. Please try again in ${mins} minute${mins > 1 ? 's' : ''}.` };
    }
    recordAttempt(`signup:${cleanEmail}`);

    const { data, error } = await supabase.auth.signUp({ email: cleanEmail, password });
    if (error) return { error: error.message };
    // Explicitly set session if returned (when email confirm is OFF)
    if (data.session) {
      setSession(data.session);
      clearRateLimit(`signup:${cleanEmail}`);
    }
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    // Validate email format
    const cleanEmail = sanitizeTextInput(email).toLowerCase();
    if (!isValidEmail(cleanEmail)) {
      return { error: 'Please enter a valid email address.' };
    }

    // Rate limit sign-in attempts by email
    const rl = checkRateLimit(`signin:${cleanEmail}`);
    if (!rl.allowed) {
      const mins = Math.ceil((rl.lockedUntilMs ?? 0) / 60000);
      return { error: `Too many login attempts. Please try again in ${mins} minute${mins > 1 ? 's' : ''}.` };
    }
    recordAttempt(`signin:${cleanEmail}`);

    const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
    if (error) return { error: error.message };
    // Explicitly set session + clear rate limit on success
    if (data.session) {
      setSession(data.session);
      clearRateLimit(`signin:${cleanEmail}`);
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
