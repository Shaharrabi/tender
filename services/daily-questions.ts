/**
 * Daily Questions Service
 * Picks a bottleneck-targeted question per couple per day.
 * Both partners answer → both see each other's response.
 */

import { supabase } from './supabase';

export interface DailyQuestion {
  id: string;
  questionText: string;
  category: string;
  depthLevel: number;
  requiresBoth: boolean;
}

export interface DailyQuestionResponse {
  id: string;
  coupleId: string;
  questionId: string;
  userId: string;
  responseText: string;
  respondedAt: string;
  partnerSeen: boolean;
  partnerSeenAt: string | null;
}

// ─── Get Today's Question ───────────────────────────────

export async function getTodaysQuestion(
  coupleId: string,
): Promise<DailyQuestion | null> {
  // 1. Get couple's current WEARE bottleneck
  const { data: weare } = await supabase
    .from('weare_scores')
    .select('bottleneck')
    .eq('couple_id', coupleId)
    .order('calculated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const bottleneck = weare?.bottleneck || 'general';

  // 2. Deterministic question selection: couple_id + date as seed
  const today = localDateString();
  const seed = hashString(`${coupleId}-${today}`);

  // 3. Fetch questions matching bottleneck + general fallback
  const { data: questions } = await supabase
    .from('daily_questions')
    .select('*')
    .in('category', [bottleneck, 'general'])
    .eq('active', true);

  if (!questions?.length) return null;

  // 4. Pick deterministically
  const index = seed % questions.length;
  return mapQuestion(questions[index]);
}

// ─── Submit Response ────────────────────────────────────

export async function submitDailyResponse(
  coupleId: string,
  questionId: string,
  userId: string,
  responseText: string,
): Promise<DailyQuestionResponse | null> {
  // Check if already answered today
  const { data: existing } = await supabase
    .from('daily_question_responses')
    .select('id')
    .eq('couple_id', coupleId)
    .eq('question_id', questionId)
    .eq('user_id', userId)
    .maybeSingle();

  if (existing) return null; // already answered

  const { data, error } = await supabase
    .from('daily_question_responses')
    .insert({
      couple_id: coupleId,
      question_id: questionId,
      user_id: userId,
      response_text: responseText,
    })
    .select()
    .single();

  if (error) {
    console.warn('[DailyQuestions] submit error:', error.message);
    return null;
  }
  return mapResponse(data);
}

// ─── Get My Response Today ──────────────────────────────

export async function getMyResponseToday(
  coupleId: string,
  questionId: string,
  userId: string,
): Promise<DailyQuestionResponse | null> {
  const { data } = await supabase
    .from('daily_question_responses')
    .select('*')
    .eq('couple_id', coupleId)
    .eq('question_id', questionId)
    .eq('user_id', userId)
    .maybeSingle();

  return data ? mapResponse(data) : null;
}

// ─── Get Partner's Response ─────────────────────────────

export async function getPartnerResponse(
  coupleId: string,
  questionId: string,
  userId: string,
): Promise<{ data: DailyQuestionResponse | null; mustAnswerFirst: boolean }> {
  // Only return partner's response if current user has also responded
  const { data: myResponse } = await supabase
    .from('daily_question_responses')
    .select('id')
    .eq('couple_id', coupleId)
    .eq('question_id', questionId)
    .eq('user_id', userId)
    .maybeSingle();

  if (!myResponse) return { data: null, mustAnswerFirst: true };

  const { data: partnerResponse } = await supabase
    .from('daily_question_responses')
    .select('*')
    .eq('couple_id', coupleId)
    .eq('question_id', questionId)
    .neq('user_id', userId)
    .maybeSingle();

  return { data: partnerResponse ? mapResponse(partnerResponse) : null, mustAnswerFirst: false };
}

// ─── Helpers ────────────────────────────────────────────

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function localDateString(d: Date = new Date()): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// ─── Mappers ────────────────────────────────────────────

function mapQuestion(row: any): DailyQuestion {
  return {
    id: row.id,
    questionText: row.question_text,
    category: row.category,
    depthLevel: row.depth_level,
    requiresBoth: row.requires_both,
  };
}

function mapResponse(row: any): DailyQuestionResponse {
  return {
    id: row.id,
    coupleId: row.couple_id,
    questionId: row.question_id,
    userId: row.user_id,
    responseText: row.response_text,
    respondedAt: row.responded_at,
    partnerSeen: row.partner_seen,
    partnerSeenAt: row.partner_seen_at,
  };
}
