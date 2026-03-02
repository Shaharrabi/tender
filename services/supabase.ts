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

  // On web, bypass all locking — single-tab app doesn't need coordination.
  // This prevents Safari hangs from navigator.locks or stalled promise chains.
  // The previous Map-based lock could hang if a prior Supabase internal
  // operation stalled, causing `await existing` to wait forever.
  return async (_name: string, _acquireTimeout: number, fn: () => Promise<any>) => {
    return await fn();
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
  // Native → SecureStore (iOS Keychain / Android Keystore)
  // Falls back to AsyncStorage if SecureStore is unavailable or value too large.
  // On first launch after this migration, existing sessions stored in AsyncStorage
  // are transparently read and migrated to SecureStore on next write.
  let SecureStore: typeof import('expo-secure-store') | null = null;
  let AsyncStorageFallback: any = null;
  try { SecureStore = require('expo-secure-store'); } catch {}
  try { AsyncStorageFallback = require('@react-native-async-storage/async-storage').default; } catch {}

  if (SecureStore) {
    return {
      getItem: async (key: string): Promise<string | null> => {
        try {
          const value = await SecureStore!.getItemAsync(key);
          if (value !== null) return value;
          // Not in SecureStore — check AsyncStorage (migration from old installs)
          return await AsyncStorageFallback?.getItem(key) ?? null;
        } catch {
          return await AsyncStorageFallback?.getItem(key) ?? null;
        }
      },
      setItem: async (key: string, value: string): Promise<void> => {
        try {
          await SecureStore!.setItemAsync(key, value);
          // Clean up old AsyncStorage entry if it existed (one-time migration)
          AsyncStorageFallback?.removeItem(key).catch(() => {});
        } catch {
          // Value too large for SecureStore — fall back to AsyncStorage
          await AsyncStorageFallback?.setItem(key, value);
        }
      },
      removeItem: async (key: string): Promise<void> => {
        // Remove from both stores to ensure clean logout
        try { await SecureStore!.deleteItemAsync(key); } catch {}
        try { await AsyncStorageFallback?.removeItem(key); } catch {}
      },
    };
  }

  // SecureStore unavailable (e.g., Expo Go limitations) — AsyncStorage fallback
  return AsyncStorageFallback;
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
