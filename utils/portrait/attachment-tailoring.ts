/**
 * Attachment Tailoring Utility — Phase 3
 *
 * Central utility that adapts portrait language based on attachment style.
 * Used by all lens generators, synthesis, and portrait narratives.
 *
 * Tailoring rules (from V2 docs):
 * - Anxious: Lead with validation. Growth = "feel with more discernment, not feel less."
 * - Avoidant: Lead with autonomy respect. Growth = "build a window, not demolish the wall."
 * - Fearful-avoidant: Acknowledge push-pull. Both approaches validated.
 * - Secure: Affirm foundation. Growth = "deepening existing capacities."
 */

import type { AttachmentStyle } from '@/types';

// ─── Tailoring Context ────────────────────────────────────

export interface TailoringContext {
  style: AttachmentStyle;
  anxiety: number;     // ECR-R anxiety score (1-7)
  avoidance: number;   // ECR-R avoidance score (1-7)
}

export function buildTailoringContext(
  style: AttachmentStyle,
  anxiety: number,
  avoidance: number
): TailoringContext {
  return { style, anxiety, avoidance };
}

// ─── Validation Openers ───────────────────────────────────

/**
 * Returns an attachment-appropriate opening line for narratives.
 * Anxious users get validation; avoidant users get autonomy respect.
 */
export function getValidationOpener(ctx: TailoringContext): string {
  switch (ctx.style) {
    case 'anxious-preoccupied':
      return 'Your sensitivity to the relational world is a genuine strength — you notice what many people miss.';
    case 'dismissive-avoidant':
      return 'Your independence and self-reliance are genuine strengths, not walls to be torn down.';
    case 'fearful-avoidant':
      return 'The push and pull you feel — wanting closeness but also needing safety — makes complete sense given your history.';
    case 'secure':
      return 'Your relational foundation is solid — you have a natural capacity for connection that not everyone has.';
  }
}

// ─── Section Intros ───────────────────────────────────────

/**
 * Returns an attachment-tailored intro for a portrait section.
 */
export function getSectionIntro(
  section: 'regulation' | 'parts' | 'values' | 'field' | 'growth',
  ctx: TailoringContext
): string {
  if (ctx.style === 'anxious-preoccupied') {
    switch (section) {
      case 'regulation':
        return 'Your nervous system is finely tuned — it picks up on relational shifts quickly. Understanding your regulation patterns helps you use that sensitivity as information rather than alarm.';
      case 'parts':
        return 'The protective parts inside you developed for good reasons. Seeing them clearly is not about eliminating them — it is about giving them less responsibility.';
      case 'values':
        return 'What matters to you in relationships runs deep. Your values are the compass — even when anxiety pulls you off course.';
      case 'field':
        return 'You already sense the relational field between you and your partner. The invitation is to trust what you sense without being flooded by it.';
      case 'growth':
        return 'Growth for you is not about feeling less — it is about feeling with more discernment. Your sensitivity stays; what changes is what you do with it.';
    }
  }

  if (ctx.style === 'dismissive-avoidant') {
    switch (section) {
      case 'regulation':
        return 'Your regulation capacity may look strong from the outside — you stay calm when others flood. Understanding what happens underneath that calm reveals a fuller picture.';
      case 'parts':
        return 'Your internal system has developed skilled protectors. They have kept you safe. The question is whether they are still needed in the way they once were.';
      case 'values':
        return 'Your values reflect what genuinely matters to you. Exploring them is not a threat to your autonomy — it is an expression of it.';
      case 'field':
        return 'The relational field may not be strongly on your radar — and that is not a flaw. Building awareness of it happens at your pace, on your terms.';
      case 'growth':
        return 'Growth for you is not about tearing down walls. It is about building a window — a structured, predictable way to let your partner in that does not overwhelm your system.';
    }
  }

  if (ctx.style === 'fearful-avoidant') {
    switch (section) {
      case 'regulation':
        return 'Your nervous system navigates competing signals — the desire for closeness and the need for safety. Understanding your regulation gives you more choice in how you respond.';
      case 'parts':
        return 'You carry parts that reach toward connection and parts that pull back from it. Both are doing their best to protect you.';
      case 'values':
        return 'What you value in relationships may feel complicated — because your heart wants things your protective system is cautious about.';
      case 'field':
        return 'You may sense the relational field intensely at times and lose track of it at others. Both the reach and the retreat are asking for the same thing — safety with connection.';
      case 'growth':
        return 'Growth for you honors both sides — the part that wants to be close and the part that needs to feel safe. Neither is wrong.';
    }
  }

  // Secure
  switch (section) {
    case 'regulation':
      return 'Your regulation capacity is a resource — both for you and for your partner. Understanding its nuances helps you use it even more skillfully.';
    case 'parts':
      return 'Even with a secure foundation, you carry protective parts that activate under enough stress. Knowing them deepens your already solid self-awareness.';
    case 'values':
      return 'Your values alignment reflects an integrated sense of who you want to be. The invitation is to continue deepening that alignment.';
    case 'field':
      return 'You have a natural capacity for sensing the relational field. The growth edge may be less about learning new skills and more about helping your partner develop theirs.';
    case 'growth':
      return 'Your growth edges are about deepening what is already working — and holding space for a partner who may not be in the same place yet.';
  }
}

// ─── Narrative Tailoring ──────────────────────────────────

/**
 * Wraps an existing narrative with attachment-appropriate framing.
 * Adds a tailored opening and adjusts closing emphasis.
 *
 * @param neutral The base narrative text
 * @param ctx Attachment tailoring context
 * @param domain Which section this narrative belongs to
 */
export function tailorNarrative(
  neutral: string,
  ctx: TailoringContext,
  domain: 'regulation' | 'parts' | 'values' | 'attachment' | 'general'
): string {
  // For attachment lens, the narrative is already tailored — don't double-tailor
  if (domain === 'attachment') return neutral;

  // Add a soft attachment-aware opening transition
  const opener = getAttachmentTransition(ctx, domain);
  if (!opener) return neutral;

  return `${opener} ${neutral}`;
}

function getAttachmentTransition(
  ctx: TailoringContext,
  domain: string
): string | null {
  if (ctx.style === 'anxious-preoccupied' && ctx.anxiety > 4.5) {
    if (domain === 'regulation') {
      return 'Because you feel relationship shifts so intensely,';
    }
    if (domain === 'parts') {
      return 'Your protective parts work overtime because connection matters so deeply to you.';
    }
    if (domain === 'values') {
      return 'The values you hold closest to your heart are often the ones that feel most at risk.';
    }
  }

  if (ctx.style === 'dismissive-avoidant' && ctx.avoidance > 4.5) {
    if (domain === 'regulation') {
      return 'Your system has learned to regulate through space and independence, which is a real capacity.';
    }
    if (domain === 'parts') {
      return 'Your protectors are skilled at maintaining emotional equilibrium — sometimes at a cost you may not fully see.';
    }
    if (domain === 'values') {
      return 'Your values of autonomy and self-reliance are genuine, not defenses.';
    }
  }

  return null;
}

// ─── Growth Edge Tailoring ────────────────────────────────

/**
 * Wraps a growth edge description with attachment-appropriate language.
 */
export function tailorGrowthEdge(
  edge: string,
  ctx: TailoringContext
): string {
  switch (ctx.style) {
    case 'anxious-preoccupied':
      // Frame growth as building on sensitivity, not eliminating it
      return edge.replace(
        /the challenge is/gi,
        'the invitation — at your own pace — is'
      ).replace(
        /you need to/gi,
        'when you are ready, you can begin to'
      );

    case 'dismissive-avoidant':
      // Frame growth as expansion of choice, not loss of protection
      return edge.replace(
        /opening up/gi,
        'building a small window'
      ).replace(
        /letting your guard down/gi,
        'choosing when and how to let someone closer'
      );

    case 'fearful-avoidant':
      // Acknowledge both sides
      if (!edge.includes('both')) {
        return `${edge} Both your desire for closeness and your need for safety are honored in this work.`;
      }
      return edge;

    case 'secure':
      return edge;
  }
}
