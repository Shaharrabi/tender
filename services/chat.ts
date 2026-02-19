/**
 * Chat service — Supabase CRUD for sessions and messages.
 */

import { supabase } from './supabase';
import type {
  ChatSession,
  ChatMessage,
  ConversationMode,
  MessageRole,
  MessageMetadata,
} from '@/types/chat';

// ─── Sessions ────────────────────────────────────────────

export async function createSession(
  userId: string,
  title = 'New Conversation'
): Promise<ChatSession> {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({
      user_id: userId,
      title,
      status: 'active',
      current_mode: 'EXPLORATION',
      message_count: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return mapSession(data);
}

export async function getSession(
  sessionId: string
): Promise<ChatSession | null> {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return mapSession(data);
}

export async function getUserSessions(
  userId: string
): Promise<ChatSession[]> {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapSession);
}

export async function updateSessionMode(
  sessionId: string,
  mode: ConversationMode
): Promise<void> {
  const { error } = await supabase
    .from('chat_sessions')
    .update({ current_mode: mode, updated_at: new Date().toISOString() })
    .eq('id', sessionId);

  if (error) throw error;
}

export async function updateSessionTitle(
  sessionId: string,
  title: string
): Promise<void> {
  const { error } = await supabase
    .from('chat_sessions')
    .update({ title, updated_at: new Date().toISOString() })
    .eq('id', sessionId);

  if (error) throw error;
}

export async function closeSession(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from('chat_sessions')
    .update({ status: 'closed', updated_at: new Date().toISOString() })
    .eq('id', sessionId);

  if (error) throw error;
}

// ─── Messages ────────────────────────────────────────────

export async function addMessage(
  sessionId: string,
  role: MessageRole,
  content: string,
  metadata?: MessageMetadata
): Promise<ChatMessage> {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      session_id: sessionId,
      role,
      content,
      metadata: metadata ?? null,
    })
    .select()
    .single();

  if (error) throw error;

  // Update session timestamp (message count tracked via query)
  await supabase
    .from('chat_sessions')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', sessionId);

  return mapMessage(data);
}

export async function getMessages(
  sessionId: string,
  limit = 50
): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map(mapMessage);
}

export async function getRecentMessages(
  sessionId: string,
  count = 20
): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false })
    .limit(count);

  if (error) throw error;
  // Reverse to get chronological order
  return (data ?? []).map(mapMessage).reverse();
}

// ─── Couple Sessions ────────────────────────────────────

export async function createCoupleSession(
  coupleId: string,
  createdBy: string,
  title = 'Couple Conversation'
): Promise<ChatSession> {
  const { data, error } = await supabase
    .from('couple_chat_sessions')
    .insert({
      couple_id: coupleId,
      created_by: createdBy,
      title,
      status: 'active',
      current_mode: 'EXPLORATION',
      message_count: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return mapSession(data);
}

export async function getCoupleSessionsForCouple(
  coupleId: string
): Promise<ChatSession[]> {
  const { data, error } = await supabase
    .from('couple_chat_sessions')
    .select('*')
    .eq('couple_id', coupleId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapSession);
}

export async function getCoupleMessages(
  sessionId: string,
  limit = 50
): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('couple_chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return (data ?? []).map(mapMessage);
}

// ─── Helpers ─────────────────────────────────────────────

function mapSession(row: any): ChatSession {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    status: row.status,
    currentMode: row.current_mode,
    messageCount: row.message_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapMessage(row: any): ChatMessage {
  return {
    id: row.id,
    sessionId: row.session_id,
    role: row.role,
    content: row.content,
    metadata: row.metadata ?? undefined,
    createdAt: row.created_at,
  };
}
