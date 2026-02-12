/**
 * Chat & Agent types for Tender.
 * Defines conversation sessions, messages, and agent state tracking.
 */

// ─── Nervous System State ────────────────────────────────

export type NervousSystemState = 'IN_WINDOW' | 'ACTIVATED' | 'SHUTDOWN' | 'MIXED';

export type StateConfidence = 'high' | 'medium' | 'low';

export interface StateDetectionResult {
  state: NervousSystemState;
  confidence: StateConfidence;
  activationScore: number;   // 0-1
  shutdownScore: number;     // 0-1
  windowScore: number;       // 0-1
}

// ─── Conversation Modes ──────────────────────────────────

export type ConversationMode =
  | 'CRISIS_SUPPORT'
  | 'IN_THE_MOMENT'
  | 'PROCESSING'
  | 'SKILL_BUILDING'
  | 'CHECK_IN'
  | 'EXPLORATION';

// ─── Messages ────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  metadata?: MessageMetadata;
  createdAt: string;
}

export interface MessageMetadata {
  detectedState?: NervousSystemState;
  stateConfidence?: StateConfidence;
  detectedMode?: ConversationMode;
  patternsRecognized?: string[];
  interventionUsed?: string;
  safetyTriggered?: boolean;
  safetyCategory?: string;
}

// ─── Sessions ────────────────────────────────────────────

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  status: 'active' | 'closed';
  currentMode: ConversationMode;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Safety ──────────────────────────────────────────────

export interface SafetyCheckResult {
  safe: boolean;
  category?: 'self_harm' | 'harm_to_others' | 'ipv' | 'substance_abuse';
  severity?: 'low' | 'medium' | 'high';
  resources: CrisisResource[];
}

export interface CrisisResource {
  name: string;
  contact: string;
  description: string;
}

// ─── Agent Context ───────────────────────────────────────

export interface AgentContext {
  portrait: import('./portrait').IndividualPortrait;
  recentMessages: ChatMessage[];
  currentState: NervousSystemState;
  currentMode: ConversationMode;
  sessionId: string;
}

// ─── Edge Function Request / Response ────────────────────

export interface ChatRequest {
  sessionId: string;
  message: string;
  userId: string;
}

export interface ChatResponse {
  reply: string;
  metadata: MessageMetadata;
  sessionTitle?: string;
}
