/**
 * Chat context — manages active session, messages, and AI communication.
 */

import React, { createContext, useContext, useState, useCallback, useRef, useEffect, useMemo } from 'react';
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
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

    try {
      // Get auth token — refreshSession FIRST for a guaranteed-fresh JWT,
      // then fall back to getSession (cached) if refresh fails.
      let token: string | undefined;

      // Try refreshSession first — this gives us a guaranteed-fresh JWT
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      token = refreshData.session?.access_token;

      if (__DEV__) console.log('[Chat] refreshSession result:', !!refreshData.session, refreshError?.message || 'no error');

      // Fallback: if refresh fails, use getSession which returns the cached token
      if (!token) {
        if (__DEV__) console.log('[Chat] No token from refresh, trying cached session...');
        const { data: authData, error: sessionError } = await supabase.auth.getSession();
        token = authData.session?.access_token;
        if (__DEV__) console.log('[Chat] getSession fallback:', !!authData.session, sessionError?.message || 'no error');
      }

      // If still no token after refresh, the user isn't authenticated
      if (!token) {
        throw new Error('Your session has expired. Please sign in again to chat with Nuance.');
      }

      if (__DEV__) {
        console.log('[Chat] Sending message to edge function...');
        console.log('[Chat] URL:', CHAT_FUNCTION_URL);
        console.log('[Chat] Session ID:', session.id);
        console.log('[Chat] Has auth token:', !!token, 'Token length:', token?.length);
      }

      // Detect streaming support — only request SSE if ReadableStream is available
      const supportsStreaming = typeof ReadableStream !== 'undefined' && typeof TextDecoder !== 'undefined';

      // Call edge function
      const response = await fetch(CHAT_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'apikey': SUPABASE_ANON_KEY,
          ...(supportsStreaming ? { 'Accept': 'text/event-stream' } : {}),
        },
        body: JSON.stringify({
          sessionId: session.id,
          message: text,
          userId: user!.id,
          ...(supportsStreaming ? { stream: true } : {}),
          ...(coupleModeRef.current && coupleIdRef.current ? {
            coupleMode: true,
            coupleId: coupleIdRef.current,
          } : {}),
        }),
      });

      if (__DEV__) console.log('[Chat] Response status:', response.status);

      if (!response.ok) {
        let errorMessage = `Server error (${response.status})`;
        let rawError = '';
        try {
          rawError = await response.text();
          const errorData = JSON.parse(rawError);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          if (rawError) errorMessage += `: ${rawError.substring(0, 100)}`;
        }
        console.error('[Chat] Response error:', response.status, rawError.substring(0, 200));
        // Give user-friendly messages for common errors
        if (response.status === 401) {
          errorMessage = 'Your session has expired. Please sign out and sign back in.';
        }
        throw new Error(errorMessage);
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
        const data = await response.json();
        if (__DEV__) console.log('[Chat] Got reply (non-stream), length:', data.reply?.length);

        const assistantMsg: ChatMessage = {
          id: `reply-${Date.now()}`,
          sessionId: session.id,
          role: 'assistant',
          content: data.reply,
          metadata: data.metadata,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMsg]);

        if (data.sessionTitle) {
          const updatedSession = { ...session, title: data.sessionTitle };
          setActiveSession(updatedSession);
          activeSessionRef.current = updatedSession;
        }
      }
    } catch (e: any) {
      console.error('[Chat] Send message error:', e);
      // Add error message
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        sessionId: session.id,
        role: 'assistant',
        content: `I wasn't able to connect just now. ${e.message || 'Please try again in a moment.'}`,
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
    safetyAlert,
    sendMessage,
    startNewSession,
    loadSession,
    loadSessions,
    dismissSafetyAlert,
  }), [activeSession, sessions, messages, loading, sending, error, safetyAlert, sendMessage, startNewSession, loadSession, loadSessions, dismissSafetyAlert]);

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
