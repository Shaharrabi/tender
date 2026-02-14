/**
 * Chat context — manages active session, messages, and AI communication.
 */

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { getPortrait } from '@/services/portrait';
import { supabase } from '@/services/supabase';
import { sanitizeTextInput, isWithinLimit } from '@/utils/security/validation';
import {
  createSession,
  getUserSessions,
  getMessages,
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
// Use a fallback to the known project URL in case Expo's Babel transform
// fails to inline the env var (observed in some static-export builds).
const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  'https://qwqclhzezyzeflxrtfjy.supabase.co';
const CHAT_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/chat`;

export function ChatProvider({ children }: { children: React.ReactNode }) {
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

  const loadSessions = useCallback(async () => {
    if (!user) {
      console.warn('[Chat] loadSessions: No user — skipping');
      return;
    }
    try {
      const list = await getUserSessions(user.id);
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
      const session = await createSession(user.id);
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
      const msgs = await getMessages(sessionId);
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
    if (sending) return;

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
        const newSession = await createSession(user.id);
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
      // Get auth token — try getSession first, then refreshSession as fallback
      let token: string | undefined;
      const { data: authData } = await supabase.auth.getSession();
      token = authData.session?.access_token;

      // If no token, attempt a session refresh (handles expired JWTs)
      if (!token) {
        if (__DEV__) console.log('[Chat] No token from getSession, attempting refresh...');
        const { data: refreshData } = await supabase.auth.refreshSession();
        token = refreshData.session?.access_token;
      }

      // If still no token after refresh, the user isn't authenticated
      if (!token) {
        throw new Error('Your session has expired. Please sign in again to chat with Nuance.');
      }

      if (__DEV__) console.log('[Chat] Sending message to edge function...');
      if (__DEV__) console.log('[Chat] URL:', CHAT_FUNCTION_URL);
      if (__DEV__) console.log('[Chat] Session ID:', session.id);
      if (__DEV__) console.log('[Chat] Has auth token:', !!token);

      // Call edge function
      const response = await fetch(CHAT_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId: session.id,
          message: text,
          userId: user!.id,
        }),
      });

      if (__DEV__) console.log('[Chat] Response status:', response.status);

      if (!response.ok) {
        let errorMessage = `Server error (${response.status})`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {}
        // Give user-friendly messages for common errors
        if (response.status === 401) {
          errorMessage = 'Your session has expired. Please sign out and sign back in.';
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (__DEV__) console.log('[Chat] Got reply, length:', data.reply?.length);

      // Add assistant response
      const assistantMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        sessionId: session.id,
        role: 'assistant',
        content: data.reply,
        metadata: data.metadata,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // Update session title if provided
      if (data.sessionTitle) {
        const updatedSession = { ...session, title: data.sessionTitle };
        setActiveSession(updatedSession);
        activeSessionRef.current = updatedSession;
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
    }
  };

  const dismissSafetyAlert = useCallback(() => {
    setSafetyAlert(null);
  }, []);

  return (
    <ChatContext.Provider
      value={{
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
      }}
    >
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
