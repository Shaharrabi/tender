/**
 * Intervention selector — chooses appropriate intervention
 * based on detected state and patterns.
 */

import type { NervousSystemState, ConversationMode } from '@/types/chat';
import type { RecognizedPattern } from './pattern-recognition';

export interface InterventionSuggestion {
  type: 'regulation' | 'pattern_awareness' | 'growth_edge' | 'skill' | 'exploration';
  exerciseId?: string;
  promptAddendum: string;
}

/**
 * Select the most appropriate intervention based on current context.
 *
 * Priority order:
 * 1. ACTIVATED → regulation intervention
 * 2. SHUTDOWN → gentle engagement
 * 3. Pattern detected → pattern awareness
 * 4. Growth edge moment → growth support
 * 5. Default → mode-appropriate exploration
 */
export function selectIntervention(
  state: NervousSystemState,
  mode: ConversationMode,
  patterns: RecognizedPattern[]
): InterventionSuggestion {
  // Priority 1: Regulation for activated states
  if (state === 'ACTIVATED') {
    return {
      type: 'regulation',
      exerciseId: 'grounding-5-4-3-2-1',
      promptAddendum: `The user appears activated. Your priority is to help them regulate before exploring content. Consider:
- Acknowledge the intensity of what they're feeling
- Offer their anchor point for activation
- If appropriate, gently suggest a grounding exercise (5-4-3-2-1 senses)
- Use short, calm sentences
- Do NOT push for insight or understanding right now`,
    };
  }

  // Priority 2: Gentle engagement for shutdown
  if (state === 'SHUTDOWN') {
    return {
      type: 'regulation',
      exerciseId: 'self-compassion-break',
      promptAddendum: `The user appears to be in shutdown. Be extra gentle:
- Acknowledge that pulling back makes sense
- Offer their shutdown anchor point
- Ask ONE gentle, open question — don't overwhelm
- Let silence be okay
- A self-compassion practice might be appropriate if they're being hard on themselves`,
    };
  }

  // Priority 3: Pattern awareness
  const highConfidencePattern = patterns.find((p) => p.confidence === 'high');
  if (highConfidencePattern) {
    const isHorseman = highConfidencePattern.id.startsWith('horseman_');
    const isCycle = highConfidencePattern.id.startsWith('cycle_');

    if (isHorseman) {
      return {
        type: 'pattern_awareness',
        exerciseId: 'soft-startup',
        promptAddendum: `A Four Horseman pattern was detected (${highConfidencePattern.name}). Gently:
- Name what you're noticing without shame
- Normalize that these patterns are common under stress
- If criticism: suggest the antidote is a gentle startup
- If contempt: acknowledge the pain underneath and suggest building appreciation
- If defensiveness: model taking responsibility
- If stonewalling: acknowledge flooding and suggest a timeout practice`,
      };
    }

    if (isCycle) {
      return {
        type: 'pattern_awareness',
        exerciseId: 'emotional-bid',
        promptAddendum: `The user's negative cycle appears to be activating (${highConfidencePattern.name}).
- Name the cycle gently: "I notice something that might connect to your pattern..."
- Help them see what's underneath the pursuing/withdrawing
- Offer their pattern interrupt anchor
- Don't blame — the cycle is the enemy, not either partner`,
      };
    }
  }

  // Priority 4: Growth edge moment
  const growthEdgePattern = patterns.find((p) => p.id.startsWith('growth_edge_'));
  if (growthEdgePattern) {
    return {
      type: 'growth_edge',
      promptAddendum: `The user may be touching on one of their growth edges: ${growthEdgePattern.description}
- Acknowledge the growth edge with curiosity
- Reference their specific practices if relevant
- Celebrate the awareness itself as growth
- Suggest a related exercise if they seem open to it`,
    };
  }

  // Priority 5: Trigger activation
  const triggerPattern = patterns.find((p) => p.id === 'trigger_activation');
  if (triggerPattern) {
    return {
      type: 'pattern_awareness',
      exerciseId: 'parts-check-in',
      promptAddendum: `An attachment trigger may be activating: ${triggerPattern.description}
- Help them notice the trigger with compassion
- Connect to their protective strategy
- A parts check-in might help them notice which part is responding`,
    };
  }

  // Default: Mode-appropriate exploration
  return {
    type: 'exploration',
    promptAddendum: getDefaultPrompt(mode),
  };
}

function getDefaultPrompt(mode: ConversationMode): string {
  switch (mode) {
    case 'SKILL_BUILDING':
      return 'Focus on teaching and practicing. Be structured. Reference growth edge practices.';
    case 'CHECK_IN':
      return 'Brief and warm. Ask about recent practice, experiences, and mood. Don\'t go too deep.';
    case 'PROCESSING':
      return 'Help them make meaning of their experience. Go deeper. Connect to patterns.';
    case 'IN_THE_MOMENT':
      return 'They\'re in the middle of something. Focus on the immediate experience. Validate first.';
    case 'CRISIS_SUPPORT':
      return 'Safety first. Provide resources. Hold space with warmth. Don\'t process deeply.';
    case 'EXPLORATION':
    default:
      return 'Follow their lead. Be curious and reflective. This is open-ended conversation.';
  }
}
