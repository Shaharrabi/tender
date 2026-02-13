import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Safely read env vars — Expo injects EXPO_PUBLIC_* at bundle time.
// During Netlify build / SSR these may be undefined; we guard below.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

// ─── Lock adapter (Safari fix) ────────────────────────
// Supabase auth uses navigator.locks (Web Locks API) which can hang
// indefinitely on Safari, causing the app to show a spinner forever.
// We provide a simple in-memory mutex that works reliably everywhere.
const createLock = () => {
  if (Platform.OS !== 'web') return undefined; // Native uses default

  const locks = new Map<string, Promise<any>>();
  return async (name: string, acquireTimeout: number, fn: () => Promise<any>) => {
    // Wait for any existing lock on this name
    const existing = locks.get(name);
    if (existing) {
      try { await existing; } catch { /* ignore */ }
    }

    // Run the callback and track it
    const promise = fn();
    locks.set(name, promise);

    try {
      return await promise;
    } finally {
      // Only delete if this is still the current lock
      if (locks.get(name) === promise) locks.delete(name);
    }
  };
};

// ─── Storage adapter ───────────────────────────────────
const createStorage = () => {
  // SSR (Node — no window) → in-memory
  if (Platform.OS === 'web' && typeof window === 'undefined') {
    const mem: Record<string, string> = {};
    return {
      getItem: (k: string) => Promise.resolve(mem[k] ?? null),
      setItem: (k: string, v: string) => { mem[k] = v; return Promise.resolve(); },
      removeItem: (k: string) => { delete mem[k]; return Promise.resolve(); },
    };
  }
  // Web client → localStorage (with Safari private-mode fallback)
  if (Platform.OS === 'web') {
    // Safari private browsing throws on localStorage access — fall back to in-memory
    let canUseLocalStorage = false;
    try {
      const testKey = '__supabase_storage_test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      canUseLocalStorage = true;
    } catch {
      canUseLocalStorage = false;
    }

    if (canUseLocalStorage) {
      return {
        getItem: (k: string) => {
          try { return Promise.resolve(localStorage.getItem(k)); }
          catch { return Promise.resolve(null); }
        },
        setItem: (k: string, v: string) => {
          try { localStorage.setItem(k, v); } catch { /* quota or private mode */ }
          return Promise.resolve();
        },
        removeItem: (k: string) => {
          try { localStorage.removeItem(k); } catch { /* ignore */ }
          return Promise.resolve();
        },
      };
    }

    // Fallback: in-memory storage (session won't persist across refreshes)
    const mem: Record<string, string> = {};
    return {
      getItem: (k: string) => Promise.resolve(mem[k] ?? null),
      setItem: (k: string, v: string) => { mem[k] = v; return Promise.resolve(); },
      removeItem: (k: string) => { delete mem[k]; return Promise.resolve(); },
    };
  }
  // Native → AsyncStorage
  return require('@react-native-async-storage/async-storage').default;
};

// ─── Null-object client for build/SSR when env vars are missing ────
// Every method returns an empty result so no page crashes during static export.
const NULL_CLIENT = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    // .auth returns an object whose methods also return safely
    if (prop === 'auth') {
      return new Proxy({}, {
        get() {
          return (..._args: any[]) =>
            Promise.resolve({ data: { user: null, session: null }, error: null });
        },
      });
    }
    // .from('table') returns a chainable builder that resolves to empty
    if (prop === 'from') {
      const emptyBuilder: any = new Proxy({}, {
        get() {
          return (..._args: any[]) => emptyBuilder;
        },
      });
      // Make it thenable so await works
      emptyBuilder.then = (resolve: any) => resolve({ data: null, error: null });
      return (_table: string) => emptyBuilder;
    }
    // .functions, .storage, .rpc, etc. — return a no-op proxy
    if (prop === 'functions') {
      return { invoke: () => Promise.resolve({ data: null, error: null }) };
    }
    // Default — return identity fn so chaining never crashes
    if (typeof prop === 'string') {
      return (..._args: any[]) =>
        Promise.resolve({ data: null, error: null });
    }
    return undefined;
  },
});

// ─── Create the real client (or null-client if env vars missing) ───
function createSupabaseClient(): SupabaseClient {
  // Guard: check env vars exist and look valid
  // Expo may replace missing env vars with the literal string "undefined"
  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl === 'undefined' ||
    supabaseAnonKey === 'undefined' ||
    !supabaseUrl.startsWith('http')
  ) {
    console.warn(
      '[Supabase] Env vars missing or invalid — using null client. ' +
      'This is expected during static export / SSR build.'
    );
    return NULL_CLIENT;
  }

  // Wrap in try/catch as final safety net — createClient validates URL
  try {
    const lock = createLock();
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: createStorage(),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        ...(lock ? { lock } : {}),
      },
    });
  } catch (err) {
    console.warn('[Supabase] createClient threw — using null client:', err);
    return NULL_CLIENT;
  }
}

export const supabase = createSupabaseClient();
