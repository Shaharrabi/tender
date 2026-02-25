/**
 * attachment-personality-interactions.ts
 *
 * Generates interaction insights for key attachment style × Big Five combinations.
 * These are NOT just additive — they model how attachment and personality
 * amplify, buffer, or create unique dynamics together.
 */

import type { ECRRScores, IPIPScores } from '@/types';

// ─── Types ────────────────────────────────────────────

export interface InteractionInsight {
  id: string;
  combination: string;
  dynamicLabel: string;
  insight: string;
  uniqueRisk: string;
  uniqueStrength: string;
  practiceImplication: string;
}

// ─── Detection Logic ──────────────────────────────────

/**
 * Detect applicable attachment × personality interactions.
 * Returns 0-3 insights (only the ones that actually apply).
 */
export function detectInteractionEffects(
  ecrr: ECRRScores,
  ipip: IPIPScores
): InteractionInsight[] {
  const results: InteractionInsight[] = [];
  const anxiety = ecrr.anxietyScore;
  const avoidance = ecrr.avoidanceScore;
  const style = ecrr.attachmentStyle;
  const neuro = ipip.domainPercentiles.neuroticism;
  const agree = ipip.domainPercentiles.agreeableness;
  const open = ipip.domainPercentiles.openness;
  const consc = ipip.domainPercentiles.conscientiousness;
  const extra = ipip.domainPercentiles.extraversion;

  // ── Anxious + High Neuroticism = "The Amplified Reach" ──
  if (anxiety > 4.0 && neuro > 65) {
    results.push({
      id: 'anxious_high_neuroticism',
      combination: 'Anxious attachment + High Emotional Sensitivity',
      dynamicLabel: 'The Amplified Reach',
      insight:
        'Your nervous system is doubly attuned to relational threat. Attachment anxiety makes you scan for distance, and high emotional sensitivity means you feel every signal intensely. This creates a pattern where small moments of disconnection feel enormous — not because you\'re overreacting, but because your system is genuinely processing more signal.',
      uniqueRisk: 'Emotional flooding during perceived rejection',
      uniqueStrength: 'Extraordinary attunement to relational dynamics',
      practiceImplication: 'Regulation work must come BEFORE communication work',
    });
  }

  // ── Anxious + High Agreeableness = "The Accommodating Pursuer" ──
  if (anxiety > 4.0 && agree > 65) {
    results.push({
      id: 'anxious_high_agreeableness',
      combination: 'Anxious attachment + High Relational Warmth',
      dynamicLabel: 'The Accommodating Pursuer',
      insight:
        'You pursue connection but do so by accommodating — giving, yielding, reading the room and adjusting. This means your pursuit is often invisible. You\'re working incredibly hard to maintain connection, but your partner may not see it as pursuit because it doesn\'t look like demanding. It looks like losing yourself.',
      uniqueRisk: 'Self-abandonment disguised as generosity',
      uniqueStrength: 'Natural empathy and relational generosity',
      practiceImplication: 'I-position work is the priority over conflict skills',
    });
  }

  // ── Avoidant + Low Openness = "The Structured Protector" ──
  if (avoidance > 3.5 && open < 35) {
    results.push({
      id: 'avoidant_low_openness',
      combination: 'Avoidant attachment + Grounded Personality',
      dynamicLabel: 'The Structured Protector',
      insight:
        'Your avoidant pattern is reinforced by a preference for stability and predictability. You don\'t just distance from emotional intensity — you create structured routines that prevent it from arising. This can look like having everything under control, but it also means emotional novelty feels threatening rather than exciting.',
      uniqueRisk: 'Calcified defenses that resist therapeutic change',
      uniqueStrength: 'Reliability and consistency in relationships',
      practiceImplication: 'Very small, structured exposure to emotional content — never push',
    });
  }

  // ── Avoidant + High Conscientiousness = "The Dutiful Distancer" ──
  if (avoidance > 3.5 && consc > 65) {
    results.push({
      id: 'avoidant_high_conscientiousness',
      combination: 'Avoidant attachment + High Reliability',
      dynamicLabel: 'The Dutiful Distancer',
      insight:
        'You show up reliably — but often through doing rather than feeling. You may express love through acts of service, maintaining structure, and being dependable, while struggling with the softer emotional exchanges your partner craves. Your reliability IS love, but it may not feel like enough to a partner who needs emotional presence.',
      uniqueRisk: 'Substituting action for emotional connection',
      uniqueStrength: 'Deep reliability and practical love',
      practiceImplication: 'Bridge from doing to feeling — start with naming emotions during tasks',
    });
  }

  // ── Fearful + High Neuroticism = "The Oscillating Storm" ──
  if (style === 'fearful-avoidant' && neuro > 65) {
    results.push({
      id: 'fearful_high_neuroticism',
      combination: 'Fearful attachment + High Emotional Sensitivity',
      dynamicLabel: 'The Oscillating Storm',
      insight:
        'This is one of the most activating combinations. You simultaneously crave and fear closeness, and your nervous system amplifies both the craving and the fear. You may oscillate between intense pursuit and sudden withdrawal, sometimes within the same conversation. This is NOT instability — it\'s your system trying to solve an impossible equation: "I need you AND I can\'t trust that you won\'t hurt me."',
      uniqueRisk: 'Rapid cycling between approach and withdrawal, partner confusion',
      uniqueStrength: 'Deep capacity for both independence and connection once safe',
      practiceImplication: 'Window of tolerance expansion is the prerequisite for everything else',
    });
  }

  // ── Secure + High Openness = "The Relational Explorer" ──
  if (anxiety < 3.0 && avoidance < 3.0 && open > 65) {
    results.push({
      id: 'secure_high_openness',
      combination: 'Secure attachment + High Curiosity',
      dynamicLabel: 'The Relational Explorer',
      insight:
        'Your secure base allows your natural curiosity to flourish relationally. You can hold emotional complexity without feeling threatened, which means you\'re able to explore difficult topics with your partner. This combination creates a natural capacity for growth-oriented relationships.',
      uniqueRisk: 'Partner may feel pushed to grow faster than they\'re ready',
      uniqueStrength: 'Creates a growth-oriented, adventurous relational space',
      practiceImplication: 'Ensure exploration is mutual — check your partner\'s pace',
    });
  }

  // ── Anxious + Low Extraversion = "The Silent Pursuer" ──
  if (anxiety > 4.0 && extra < 35) {
    results.push({
      id: 'anxious_low_extraversion',
      combination: 'Anxious attachment + Reflective Energy',
      dynamicLabel: 'The Silent Pursuer',
      insight:
        'You pursue connection internally — overthinking, analyzing, running scenarios — rather than externally reaching out. Your partner may not see the pursuit, but inside, you\'re in constant relational motion. This can create a painful gap between your intense internal experience and your quiet external presentation.',
      uniqueRisk: 'Rumination spirals without external reality-checking',
      uniqueStrength: 'Deep reflective capacity and emotional processing',
      practiceImplication: 'Structured externalization practices — journaling, then sharing selectively',
    });
  }

  // Limit to top 3 most relevant
  return results.slice(0, 3);
}
