/**
 * Couple Challenges Service
 * Weekly assessment-informed challenges personalized to the couple's patterns.
 */

import { supabase } from './supabase';

export interface CoupleChallenge {
  id: string;
  coupleId: string;
  challengeText: string;
  partner1Task: string;
  partner2Task: string;
  basedOn: Record<string, any>;
  weekOf: string;
  partner1Completed: boolean;
  partner1CompletedAt: string | null;
  partner1Reflection: string | null;
  partner2Completed: boolean;
  partner2CompletedAt: string | null;
  partner2Reflection: string | null;
  createdAt: string;
}

interface ChallengeTemplate {
  text: string;
  partner1Task: string;
  partner2Task: string;
  basedOn: Record<string, any>;
}

// ─── Get This Week's Challenge ──────────────────────────

export async function getThisWeeksChallenge(
  coupleId: string,
): Promise<CoupleChallenge | null> {
  const weekOf = getStartOfWeek();

  const { data, error } = await supabase
    .from('couple_challenges')
    .select('*')
    .eq('couple_id', coupleId)
    .eq('week_of', weekOf)
    .maybeSingle();

  if (error) {
    console.warn('[Challenges] get error:', error.message);
    return null;
  }
  return data ? mapChallenge(data) : null;
}

// ─── Generate Weekly Challenge ──────────────────────────

export async function generateWeeklyChallenge(
  coupleId: string,
  partner1Id: string,
  partner2Id: string,
): Promise<CoupleChallenge | null> {
  const weekOf = getStartOfWeek();

  // Don't generate if one already exists this week
  const existing = await getThisWeeksChallenge(coupleId);
  if (existing) return existing;

  // Get couple assessment data for personalization
  const scores = await getCoupleScoreContext(coupleId, partner1Id, partner2Id);
  const challenge = selectChallenge(scores);

  const { data, error } = await supabase
    .from('couple_challenges')
    .insert({
      couple_id: coupleId,
      challenge_text: challenge.text,
      partner1_task: challenge.partner1Task,
      partner2_task: challenge.partner2Task,
      based_on: challenge.basedOn,
      week_of: weekOf,
    })
    .select()
    .single();

  if (error) {
    console.warn('[Challenges] generate error:', error.message);
    return null;
  }
  return mapChallenge(data);
}

// ─── Complete Challenge ─────────────────────────────────

export async function completeChallenge(
  challengeId: string,
  partnerNumber: 1 | 2,
  reflection?: string,
): Promise<void> {
  const updates: Record<string, any> = partnerNumber === 1
    ? { partner1_completed: true, partner1_completed_at: new Date().toISOString(), partner1_reflection: reflection ?? null }
    : { partner2_completed: true, partner2_completed_at: new Date().toISOString(), partner2_reflection: reflection ?? null };

  await supabase
    .from('couple_challenges')
    .update(updates)
    .eq('id', challengeId);
}

// ─── Get Challenge History ──────────────────────────────

export async function getChallengeHistory(
  coupleId: string,
  limit = 8,
): Promise<CoupleChallenge[]> {
  const { data, error } = await supabase
    .from('couple_challenges')
    .select('*')
    .eq('couple_id', coupleId)
    .order('week_of', { ascending: false })
    .limit(limit);

  if (error) {
    console.warn('[Challenges] history error:', error.message);
    return [];
  }
  return (data ?? []).map(mapChallenge);
}

// ─── Score Context ──────────────────────────────────────

interface ScoreContext {
  bottleneck: string | null;
  p1Attachment: string | null;
  p2Attachment: string | null;
  p1Conflict: string | null;
  p2Conflict: string | null;
  p1EQ: number | null;
  p2EQ: number | null;
}

async function getCoupleScoreContext(
  coupleId: string,
  partner1Id: string,
  partner2Id: string,
): Promise<ScoreContext> {
  // WEARE bottleneck
  const { data: weare } = await supabase
    .from('weare_scores')
    .select('bottleneck')
    .eq('couple_id', coupleId)
    .order('calculated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  // Individual assessment scores
  const getScores = async (userId: string) => {
    const { data } = await supabase
      .from('assessment_results')
      .select('assessment_type, scores')
      .eq('user_id', userId)
      .in('assessment_type', ['ecr-r', 'dutch', 'sseit']);
    return data ?? [];
  };

  const [p1Results, p2Results] = await Promise.all([
    getScores(partner1Id),
    getScores(partner2Id),
  ]);

  const p1ECR = p1Results.find(r => r.assessment_type === 'ecr-r')?.scores;
  const p2ECR = p2Results.find(r => r.assessment_type === 'ecr-r')?.scores;
  const p1DUTCH = p1Results.find(r => r.assessment_type === 'dutch')?.scores;
  const p2DUTCH = p2Results.find(r => r.assessment_type === 'dutch')?.scores;
  const p1SSEIT = p1Results.find(r => r.assessment_type === 'sseit')?.scores;
  const p2SSEIT = p2Results.find(r => r.assessment_type === 'sseit')?.scores;

  return {
    bottleneck: weare?.bottleneck ?? null,
    p1Attachment: p1ECR?.attachmentStyle ?? null,
    p2Attachment: p2ECR?.attachmentStyle ?? null,
    p1Conflict: p1DUTCH?.primaryStyle ?? null,
    p2Conflict: p2DUTCH?.primaryStyle ?? null,
    p1EQ: p1SSEIT?.totalNormalized ?? null,
    p2EQ: p2SSEIT?.totalNormalized ?? null,
  };
}

// ─── Challenge Selection ────────────────────────────────

function selectChallenge(ctx: ScoreContext): ChallengeTemplate {
  // Bottleneck-based challenges (highest priority)
  if (ctx.bottleneck === 'attunement') {
    return {
      text: "This week is about sensing each other without words.",
      partner1Task: "Once this week, notice what your partner is feeling without them telling you. Write it down. Check with them at the end of the week.",
      partner2Task: "Once this week, notice what your partner is feeling without them telling you. Write it down. Check with them at the end of the week.",
      basedOn: { bottleneck: 'attunement' },
    };
  }

  if (ctx.bottleneck === 'transmission') {
    return {
      text: "This week is about turning insight into action.",
      partner1Task: "Pick one thing you've learned about your pattern in Tender. Do it differently once this week. Just once.",
      partner2Task: "Pick one thing you've learned about your pattern in Tender. Do it differently once this week. Just once.",
      basedOn: { bottleneck: 'transmission' },
    };
  }

  if (ctx.bottleneck === 'space') {
    return {
      text: "This week is about finding where you end and your partner begins.",
      partner1Task: "Say 'no' to one small thing your partner asks for this week — lovingly, but clearly. Notice how it feels.",
      partner2Task: "Say 'no' to one small thing your partner asks for this week — lovingly, but clearly. Notice how it feels.",
      basedOn: { bottleneck: 'space' },
    };
  }

  if (ctx.bottleneck === 'co_creation') {
    return {
      text: "This week is about building something new together.",
      partner1Task: "Propose one small thing you could try together that neither of you has done before. It doesn't have to be big.",
      partner2Task: "Say yes to something your partner suggests this week, even if it's not your first choice. Notice what happens.",
      basedOn: { bottleneck: 'co_creation' },
    };
  }

  if (ctx.bottleneck === 'resistance') {
    return {
      text: "This week is about softening where you're rigid.",
      partner1Task: "Notice one moment where you feel resistance to your partner. Instead of acting on it, just name it silently: 'I'm resisting.'",
      partner2Task: "Notice one moment where you feel resistance to your partner. Instead of acting on it, just name it silently: 'I'm resisting.'",
      basedOn: { bottleneck: 'resistance' },
    };
  }

  // Attachment-pairing challenges
  if (ctx.p1Attachment === 'anxious' && ctx.p2Attachment === 'avoidant') {
    return {
      text: "Your dance this week: the pursuer practices stillness, the withdrawer practices one step forward.",
      partner1Task: "When you feel the urge to reach for your partner, sit with it for 30 seconds first. Just notice the urge. You don't have to act on it.",
      partner2Task: "Once this week, initiate a moment of connection that you would normally wait for your partner to start. One sentence of vulnerability.",
      basedOn: { attachment_pairing: 'anxious-avoidant' },
    };
  }

  if (ctx.p1Attachment === 'avoidant' && ctx.p2Attachment === 'anxious') {
    return {
      text: "Your dance this week: the withdrawer practices one step forward, the pursuer practices stillness.",
      partner1Task: "Once this week, initiate a moment of connection that you would normally wait for your partner to start. One sentence of vulnerability.",
      partner2Task: "When you feel the urge to reach for your partner, sit with it for 30 seconds first. Just notice the urge. You don't have to act on it.",
      basedOn: { attachment_pairing: 'avoidant-anxious' },
    };
  }

  if (ctx.p1Attachment === 'anxious' && ctx.p2Attachment === 'anxious') {
    return {
      text: "Two hearts that reach with the same urgency. This week: take turns being the steady one.",
      partner1Task: "Monday through Wednesday, you are the anchor. When your partner is activated, your job is to stay calm — not to fix, just to be present.",
      partner2Task: "Thursday through Saturday, you are the anchor. Same practice. Sunday, talk about what it felt like.",
      basedOn: { attachment_pairing: 'anxious-anxious' },
    };
  }

  // Conflict style challenges
  if (ctx.p1Conflict === 'forcing' && ctx.p2Conflict === 'avoiding') {
    return {
      text: "Your conflict styles pull in opposite directions. This week: meet in the middle.",
      partner1Task: "In your next disagreement, practice asking a question before making your point. 'What do you need here?' before 'Here's what I think.'",
      partner2Task: "In your next disagreement, practice staying in the room for 60 seconds longer than feels comfortable. You don't have to talk — just stay present.",
      basedOn: { conflict_pairing: 'forcing-avoiding' },
    };
  }

  if (ctx.p1Conflict === 'avoiding' && ctx.p2Conflict === 'avoiding') {
    return {
      text: "You both sidestep. This week: one conversation you've been putting off.",
      partner1Task: "Name one thing that's been unsaid between you. Say it this week. Start with: 'There's something I've been sitting on...'",
      partner2Task: "Name one thing that's been unsaid between you. Say it this week. Start with: 'There's something I've been sitting on...'",
      basedOn: { conflict_pairing: 'avoiding-avoiding' },
    };
  }

  // High EQ shared strength
  if (ctx.p1EQ && ctx.p2EQ && ctx.p1EQ > 70 && ctx.p2EQ > 70) {
    return {
      text: "Your shared superpower is emotional perception. This week: use it intentionally.",
      partner1Task: "Silently observe one moment where your partner is feeling something they haven't named yet. Don't say anything. At the end of the week, share what you saw.",
      partner2Task: "Silently observe one moment where your partner is feeling something they haven't named yet. Don't say anything. At the end of the week, share what you saw.",
      basedOn: { shared_strength: 'emotional_intelligence' },
    };
  }

  // Default
  return {
    text: "This week is about noticing the space between you.",
    partner1Task: "Once a day, pause and notice: what's the emotional temperature between us right now? Just notice. Don't fix.",
    partner2Task: "Once a day, pause and notice: what's the emotional temperature between us right now? Just notice. Don't fix.",
    basedOn: { type: 'general' },
  };
}

// ─── Helpers ────────────────────────────────────────────

function getStartOfWeek(d: Date = new Date()): string {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  return localDateString(date);
}

function localDateString(d: Date = new Date()): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// ─── Mapper ─────────────────────────────────────────────

function mapChallenge(row: any): CoupleChallenge {
  return {
    id: row.id,
    coupleId: row.couple_id,
    challengeText: row.challenge_text,
    partner1Task: row.partner1_task,
    partner2Task: row.partner2_task,
    basedOn: row.based_on ?? {},
    weekOf: row.week_of,
    partner1Completed: row.partner1_completed,
    partner1CompletedAt: row.partner1_completed_at,
    partner1Reflection: row.partner1_reflection,
    partner2Completed: row.partner2_completed,
    partner2CompletedAt: row.partner2_completed_at,
    partner2Reflection: row.partner2_reflection,
    createdAt: row.created_at,
  };
}
