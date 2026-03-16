/**
 * Chat context — manages active session, messages, and AI communication.
 */

import React, { createContext, useContext, useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Platform } from 'react-native';
import { useAuth } from './AuthContext';
import { getPortrait } from '@/services/portrait';
import { supabase } from '@/services/supabase';
import { sanitizeTextInput, isWithinLimit } from '@/utils/security/validation';
import {
  createSession,
  createCoupleSession,
  getUserSessions,
  getCoupleSessionsForCouple,
  getMessages,
  getCoupleMessages,
  addMessage,
  closeSession as closeSessionService,
} from '@/services/chat';
import { detectState } from '@/utils/agent/state-detection';
import { checkSafety } from '@/utils/agent/safety-check';
import type { ChatSession, ChatMessage, SafetyCheckResult } from '@/types/chat';

interface ChatContextType {
  activeSession: ChatSession | null;
  sessions: ChatSession[];
  messages: ChatMessage[];
  loading: boolean;
  sending: boolean;
  error: string | null;
  sessionExpired: boolean;
  safetyAlert: SafetyCheckResult | null;
  sendMessage: (text: string) => Promise<void>;
  startNewSession: () => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  loadSessions: () => Promise<void>;
  dismissSafetyAlert: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Edge function URL — derived from the same env var used by supabase.ts.
// These MUST be set via environment variables (.env.local or Netlify dashboard).
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing required environment variables: EXPO_PUBLIC_SUPABASE_URL and/or EXPO_PUBLIC_SUPABASE_ANON_KEY. ' +
    'Set them in .env.local (for local dev) or in the Netlify dashboard (for production).'
  );
}

const CHAT_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/chat`;

interface ChatProviderProps {
  children: React.ReactNode;
  coupleMode?: boolean;
  coupleId?: string;
}

export function ChatProvider({ children, coupleMode, coupleId }: ChatProviderProps) {
  const { user, signOut } = useAuth();
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [safetyAlert, setSafetyAlert] = useState<SafetyCheckResult | null>(null);

  // Use a ref to track the active session for sendMessage so it doesn't
  // get stale in the closure
  const activeSessionRef = useRef<ChatSession | null>(null);

  // Track couple mode in refs to avoid stale closures
  const coupleModeRef = useRef(coupleMode ?? false);
  const coupleIdRef = useRef(coupleId ?? '');
  // Streaming lock — prevents double-sends during streaming (separate from `sending` UI state)
  const streamingLockRef = useRef(false);

  useEffect(() => {
    coupleModeRef.current = coupleMode ?? false;
    coupleIdRef.current = coupleId ?? '';
  }, [coupleMode, coupleId]);

  const loadSessions = useCallback(async () => {
    if (!user) {
      console.warn('[Chat] loadSessions: No user — skipping');
      return;
    }
    try {
      let list: ChatSession[];
      if (coupleModeRef.current && coupleIdRef.current) {
        list = await getCoupleSessionsForCouple(coupleIdRef.current);
      } else {
        list = await getUserSessions(user.id);
      }
      setSessions(list);
    } catch (e: any) {
      console.error('Failed to load sessions:', e);
      setError(`Failed to load conversations: ${e.message || 'Unknown error'}`);
    }
  }, [user]);

  const startNewSession = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      if (__DEV__) console.log('[Chat] Creating new session for user:', user.id);
      let session: ChatSession;
      if (coupleModeRef.current && coupleIdRef.current) {
        session = await createCoupleSession(coupleIdRef.current, user.id);
      } else {
        session = await createSession(user.id);
      }
      if (__DEV__) console.log('[Chat] Session created:', session.id);
      setActiveSession(session);
      activeSessionRef.current = session;
      setMessages([]);
      await loadSessions();
    } catch (e: any) {
      console.error('Failed to create session:', e);
      setError(`Failed to start conversation: ${e.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [user, loadSessions]);

  const loadSession = useCallback(async (sessionId: string) => {
    setLoading(true);
    try {
      let msgs: ChatMessage[];
      if (coupleModeRef.current && coupleIdRef.current) {
        msgs = await getCoupleMessages(sessionId);
      } else {
        msgs = await getMessages(sessionId);
      }
      setMessages(msgs);

      // Find session from list
      const session = sessions.find((s) => s.id === sessionId);
      if (session) {
        setActiveSession(session);
        activeSessionRef.current = session;
      }
    } catch (e) {
      console.error('Failed to load session:', e);
    } finally {
      setLoading(false);
    }
  }, [sessions]);

  const sendMessage = useCallback(async (text: string) => {
    const session = activeSessionRef.current;
    if (!user) {
      console.warn('[Chat] sendMessage: No user — cannot send');
      setError('Please sign in to use the chat.');
      return;
    }
    if (sending || streamingLockRef.current) return;

    // Sanitize and validate input
    const sanitized = sanitizeTextInput(text);
    if (!sanitized) return;
    if (!isWithinLimit(sanitized, 'chatMessage')) {
      setError('Message is too long (max 2000 characters).');
      return;
    }
    // Use sanitized text from here on
    text = sanitized;

    // If no active session, create one first
    if (!session) {
      if (__DEV__) console.log('[Chat] No active session, creating one before sending...');
      setLoading(true);
      try {
        let newSession: ChatSession;
        if (coupleModeRef.current && coupleIdRef.current) {
          newSession = await createCoupleSession(coupleIdRef.current, user.id);
        } else {
          newSession = await createSession(user.id);
        }
        if (__DEV__) console.log('[Chat] Auto-created session:', newSession.id);
        setActiveSession(newSession);
        activeSessionRef.current = newSession;
        // Now continue with this session
        await sendMessageWithSession(text, newSession);
      } catch (e: any) {
        console.error('[Chat] Failed to auto-create session:', e);
        setError(`Failed to start conversation: ${e.message}`);
      } finally {
        setLoading(false);
      }
      return;
    }

    await sendMessageWithSession(text, session);
  }, [user, sending]);

  const sendMessageWithSession = async (text: string, session: ChatSession) => {
    // Client-side safety check
    const safety = checkSafety(text);
    if (!safety.safe) {
      setSafetyAlert(safety);
      // Still send the message — the agent will handle it appropriately
    }

    // Client-side state detection
    const stateResult = detectState(text);

    // Generate idempotency key to prevent duplicate messages on retry
    const idempotencyKey = `${session.id}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    // Optimistically add user message to UI
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      sessionId: session.id,
      role: 'user',
      content: text,
      metadata: {
        detectedState: stateResult.state,
        safetyTriggered: !safety.safe,
      },
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setSending(true);
    setError(null);
    setSessionExpired(false);

    try {
      // Get auth token — validate first, then fall back to cache + refresh.
      let token: string | undefined;

      // Step 1: Try getUser() — this validates the token server-side and
      // triggers auto-refresh if the access token is expired but the
      // refresh token is still valid. This is more reliable than getSession()
      // which only returns the cached (potentially expired) token.
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (!userError && userData.user) {
          // getUser succeeded — the session is valid, grab the (possibly refreshed) token
          const { data: sessionData } = await supabase.auth.getSession();
          token = sessionData.session?.access_token;
          if (__DEV__) console.log('[Chat] getUser+getSession succeeded, token length:', token?.length);
        } else {
          if (__DEV__) console.log('[Chat] getUser failed:', userError?.message);
        }
      } catch (e: any) {
        if (__DEV__) console.log('[Chat] getUser threw:', e.message);
      }

      // Step 2: If getUser path didn't yield a token, try explicit refresh
      if (!token) {
        if (__DEV__) console.log('[Chat] No token from getUser path, trying refreshSession...');
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        token = refreshData.session?.access_token;
        if (__DEV__) console.log('[Chat] refreshSession result:', !!refreshData.session, refreshError?.message || 'no error');

        // If the refresh token itself is dead (deleted/rotated/expired), auto-sign-out.
        // This is unrecoverable — the user MUST re-authenticate.
        if (refreshError && /refresh token|not found|invalid/i.test(refreshError.message)) {
          console.warn('[Chat] Refresh token is dead — signing out automatically');
          setSessionExpired(true);
          try { await signOut(); } catch {}
          throw new Error('__SESSION_EXPIRED__:Your session expired. Signing you out — please sign back in.');
        }
      }

      // If still no token, the user truly isn't authenticated
      if (!token) {
        setSessionExpired(true);
        // Auto-sign-out so the user doesn't get stuck in a limbo state
        try { await signOut(); } catch {}
        throw new Error('__SESSION_EXPIRED__:Your session has expired. Please sign back in.');
      }

      if (__DEV__) {
        console.log('[Chat] Sending message to edge function...');
        console.log('[Chat] URL:', CHAT_FUNCTION_URL);
        console.log('[Chat] Session ID:', session.id);
        console.log('[Chat] Has auth token:', !!token, 'Token length:', token?.length);
      }

      // Detect streaming support — only request SSE on web where ReadableStream
      // bodies actually work.  React Native's fetch polyfill may expose
      // ReadableStream as a global but response.body is always null, which
      // causes us to fall through to the JSON path on an SSE response body.
      const supportsStreaming =
        Platform.OS === 'web' &&
        typeof ReadableStream !== 'undefined' &&
        typeof TextDecoder !== 'undefined';

      // Abort controller with timeout — prevents indefinite hangs
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90_000); // 90s timeout

      // Call edge function
      let response: Response;
      try {
        response = await fetch(CHAT_FUNCTION_URL, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'apikey': SUPABASE_ANON_KEY!,
            ...(supportsStreaming ? { 'Accept': 'text/event-stream' } : {}),
          },
          body: JSON.stringify({
            sessionId: session.id,
            message: text,
            userId: user!.id,
            idempotencyKey,
            ...(supportsStreaming ? { stream: true } : {}),
            ...(coupleModeRef.current && coupleIdRef.current ? {
              coupleMode: true,
              coupleId: coupleIdRef.current,
            } : {}),
          }),
        });
      } catch (fetchErr: any) {
        clearTimeout(timeoutId);
        // Distinguish timeout from network error
        if (fetchErr.name === 'AbortError') {
          throw new Error('The request timed out. Nuance may be busy — please try again in a moment.');
        }
        throw new Error('Could not reach Nuance. Please check your internet connection and try again.');
      }
      clearTimeout(timeoutId);

      if (__DEV__) console.log('[Chat] Response status:', response.status);

      if (!response.ok) {
        // ── 401: try one session refresh + retry before giving up ──
        if (response.status === 401) {
          if (__DEV__) console.log('[Chat] Got 401 — attempting session refresh and retry...');
          const { data: retryRefresh, error: retryRefreshError } = await supabase.auth.refreshSession();
          const retryToken = retryRefresh?.session?.access_token;

          if (retryToken) {
            if (__DEV__) console.log('[Chat] Retry token obtained, re-sending request...');
            const retryController = new AbortController();
            const retryTimeoutId = setTimeout(() => retryController.abort(), 90_000);
            let retryResponse: Response;
            try {
              retryResponse = await fetch(CHAT_FUNCTION_URL, {
                method: 'POST',
                signal: retryController.signal,
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${retryToken}`,
                  'apikey': SUPABASE_ANON_KEY!,
                  ...(supportsStreaming ? { 'Accept': 'text/event-stream' } : {}),
                },
                body: JSON.stringify({
                  sessionId: session.id,
                  message: text,
                  userId: user!.id,
                  idempotencyKey,
                  ...(supportsStreaming ? { stream: true } : {}),
                  ...(coupleModeRef.current && coupleIdRef.current ? {
                    coupleMode: true,
                    coupleId: coupleIdRef.current,
                  } : {}),
                }),
              });
            } catch (retryFetchErr: any) {
              clearTimeout(retryTimeoutId);
              if (retryFetchErr.name === 'AbortError') {
                throw new Error('The request timed out. Nuance may be busy — please try again in a moment.');
              }
              throw new Error('Could not reach Nuance. Please check your internet connection and try again.');
            }
            clearTimeout(retryTimeoutId);

            if (retryResponse.ok) {
              // Retry succeeded — replace `response` and continue normal processing
              response = retryResponse;
            } else if (retryResponse.status === 401) {
              // Still 401 after refresh — session is truly expired, auto-sign-out
              if (__DEV__) console.log('[Chat] Retry still 401 — session truly expired, signing out');
              setSessionExpired(true);
              try { await signOut(); } catch {}
              throw new Error('__SESSION_EXPIRED__:Your session expired. Signing you out — please sign back in.');
            } else {
              // Some other error on retry
              response = retryResponse;
            }
          } else {
            if (__DEV__) console.log('[Chat] Could not refresh session token:', retryRefreshError?.message);
            setSessionExpired(true);
            try { await signOut(); } catch {}
            throw new Error('__SESSION_EXPIRED__:Your session expired. Signing you out — please sign back in.');
          }
        }

        if (!response.ok) {
          let errorMessage = `Server error (${response.status})`;
          let rawError = '';
          try {
            rawError = await response.text();
            const errorData = JSON.parse(rawError);
            errorMessage = errorData.error || errorData.message || errorMessage;
            // Log debug info from edge function in dev mode
            if (__DEV__ && errorData.debug) {
              console.error('[Chat] Edge function debug:', JSON.stringify(errorData.debug, null, 2));
            }
          } catch {
            if (rawError) errorMessage += `: ${rawError.substring(0, 100)}`;
          }
          console.error('[Chat] Response error:', response.status, rawError.substring(0, 200));
          throw new Error(errorMessage);
        }
      }

      // ─── Handle SSE streaming response ─────────────────
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/event-stream') && response.body) {
        // Create a placeholder assistant message for streaming
        const streamMsgId = `stream-${Date.now()}`;
        const streamMsg: ChatMessage = {
          id: streamMsgId,
          sessionId: session.id,
          role: 'assistant',
          content: '',
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, streamMsg]);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullContent = '';
        let firstChunkReceived = false;
        streamingLockRef.current = true;

        try {
          while (true) {
            const { done, value } = reader.read
              ? await reader.read()
              : { done: true, value: undefined };
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (!line.startsWith('data: ')) continue;
              const data = line.slice(6).trim();
              if (!data) continue;

              try {
                const event = JSON.parse(data);

                if (event.type === 'text') {
                  fullContent += event.text;
                  // Hide typing indicator on first text chunk
                  if (!firstChunkReceived) {
                    firstChunkReceived = true;
                    setSending(false);
                  }
                  // Update the streaming message progressively
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === streamMsgId
                        ? { ...msg, content: fullContent }
                        : msg
                    )
                  );
                } else if (event.type === 'metadata') {
                  // Update session title if provided
                  if (event.sessionTitle) {
                    const updatedSession = { ...session, title: event.sessionTitle };
                    setActiveSession(updatedSession);
                    activeSessionRef.current = updatedSession;
                  }
                  // Store metadata on the message
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === streamMsgId
                        ? {
                            ...msg,
                            metadata: {
                              detectedState: event.detectedState,
                              safetyTriggered: event.safetyTriggered,
                            },
                          }
                        : msg
                    )
                  );
                } else if (event.type === 'error') {
                  throw new Error(event.error || 'Stream interrupted');
                }
                // 'done' type — stream complete, nothing to do
              } catch (parseErr: any) {
                if (parseErr.message?.includes('Stream interrupted')) throw parseErr;
                // Skip unparseable SSE lines
              }
            }
          }
        } catch (streamErr: any) {
          // If we got some content, keep it; otherwise show error
          if (!fullContent) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === streamMsgId
                  ? { ...msg, content: `I wasn't able to connect just now. ${streamErr.message || 'Please try again.'}` }
                  : msg
              )
            );
          }
        }

        if (__DEV__) console.log('[Chat] Stream complete, length:', fullContent.length);
      } else {
        // ─── Fallback: non-streaming JSON response ─────────
        const rawText = await response.text();
        let data: any = null;
        let replyText = '';

        try {
          data = JSON.parse(rawText);
          replyText = data.reply ?? '';
        } catch {
          // Some edge responses return plain text even on 200.
          // Use raw text as the assistant reply instead of crashing.
          replyText = rawText || '';
        }

        if (__DEV__) console.log('[Chat] Got reply (non-stream), length:', replyText?.length);

        const assistantMsg: ChatMessage = {
          id: `reply-${Date.now()}`,
          sessionId: session.id,
          role: 'assistant',
          content: replyText || 'I was not able to parse the response. Please try again.',
          metadata: data?.metadata,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMsg]);

        if (data?.sessionTitle) {
          const updatedSession = { ...session, title: data.sessionTitle };
          setActiveSession(updatedSession);
          activeSessionRef.current = updatedSession;
        }
      }
    } catch (e: any) {
      console.error('[Chat] Send message error:', e);
      // Add error message — strip internal prefix if present
      const rawMsg: string = e.message || 'Please try again in a moment.';
      const isExpired = rawMsg.startsWith('__SESSION_EXPIRED__:');
      const displayMsg = isExpired
        ? rawMsg.replace('__SESSION_EXPIRED__:', '')
        : rawMsg;
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        sessionId: session.id,
        role: 'assistant',
        content: isExpired
          ? displayMsg
          : `I wasn't able to connect just now. ${displayMsg}`,
        metadata: isExpired ? { safetyTriggered: false } : undefined,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setSending(false);
      streamingLockRef.current = false;
    }
  };

  const dismissSafetyAlert = useCallback(() => {
    setSafetyAlert(null);
  }, []);

  const contextValue = useMemo(() => ({
    activeSession,
    sessions,
    messages,
    loading,
    sending,
    error,
    sessionExpired,
    safetyAlert,
    sendMessage,
    startNewSession,
    loadSession,
    loadSessions,
    dismissSafetyAlert,
  }), [activeSession, sessions, messages, loading, sending, error, sessionExpired, safetyAlert, sendMessage, startNewSession, loadSession, loadSessions, dismissSafetyAlert]);

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
