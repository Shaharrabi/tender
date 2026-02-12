/**
 * Conversation modes — mode-specific response guidelines
 * appended to the system prompt.
 */

import type { ConversationMode } from '@/types/chat';

export interface ModeConfig {
  name: string;
  description: string;
  guidelines: string;
  maxResponseLength: 'short' | 'medium' | 'long';
  suggestExercises: boolean;
}

export const MODE_CONFIGS: Record<ConversationMode, ModeConfig> = {
  CRISIS_SUPPORT: {
    name: 'Crisis Support',
    description: 'Safety is the absolute priority.',
    guidelines: `You are in CRISIS SUPPORT mode. Follow these guidelines strictly:
- Acknowledge the severity of what the person is sharing
- Provide relevant crisis resources (988 Lifeline, DV Hotline, etc.)
- Do NOT attempt to process, analyze, or provide therapeutic intervention
- Hold space with warmth and presence
- Encourage reaching out to professional support
- If IPV is detected, NEVER suggest couples work or communication exercises
- Stay present and caring — you don't need to fix anything`,
    maxResponseLength: 'medium',
    suggestExercises: false,
  },

  IN_THE_MOMENT: {
    name: 'In the Moment',
    description: 'Something is happening right now.',
    guidelines: `The user is dealing with something happening RIGHT NOW. Follow this sequence:
1. VALIDATE — acknowledge what they're feeling without judgment
2. REGULATE — if they're activated, help them ground. If shutdown, be gentle
3. UNDERSTAND — only after regulation, help them make sense of the experience
- Keep responses focused on the immediate situation
- Don't reference patterns or growth edges unless directly relevant
- Practical support over theoretical insight`,
    maxResponseLength: 'medium',
    suggestExercises: false,
  },

  PROCESSING: {
    name: 'Processing',
    description: 'Making meaning of past experiences.',
    guidelines: `The user is processing something that happened. This is a space for deeper work:
- Help them connect the experience to their patterns and attachment style
- Use reflective language: "I wonder if..." "What was happening underneath..."
- It's okay to gently reference their portrait data when relevant
- Help them see the protective function of their responses
- Name the emotions beneath the surface (primary emotions under secondary)
- Connect to growth edges when natural
- This is where the most meaningful growth happens — go deep but with care`,
    maxResponseLength: 'long',
    suggestExercises: true,
  },

  SKILL_BUILDING: {
    name: 'Skill Building',
    description: 'Teaching and practicing specific relational skills.',
    guidelines: `Focus on teaching and practicing. Be more structured than usual:
- Reference specific growth edge practices
- Break skills into small, concrete steps
- Use examples and role-play when helpful
- After teaching, invite them to practice or reflect
- Connect skills to their specific patterns and attachment style
- Celebrate effort and practice, not just results
- Suggest relevant exercises from the library`,
    maxResponseLength: 'long',
    suggestExercises: true,
  },

  CHECK_IN: {
    name: 'Check-In',
    description: 'Brief warm check-in.',
    guidelines: `This is a brief check-in. Keep it warm and concise:
- Ask how they're doing
- Ask about recent growth edge practice
- Note any patterns in their recent mood
- Keep responses short (1-2 paragraphs)
- Only go deeper if they indicate they want to
- Acknowledge progress and celebrate wins, however small`,
    maxResponseLength: 'short',
    suggestExercises: false,
  },

  EXPLORATION: {
    name: 'Exploration',
    description: 'Open-ended relational exploration.',
    guidelines: `This is open-ended exploration — the default mode. Follow the user's lead:
- Be curious and reflective
- Let the conversation go where it goes
- Reference portrait data when naturally relevant
- If they ask about their patterns, help them understand
- If they share an experience, help them process
- Watch for moments to naturally suggest exercises or growth edge work
- This is the widest mode — anything goes as long as it's relational`,
    maxResponseLength: 'medium',
    suggestExercises: true,
  },
};

/**
 * Get the mode-specific prompt addendum.
 */
export function getModePrompt(mode: ConversationMode): string {
  const config = MODE_CONFIGS[mode];
  return `\n## Current Mode: ${config.name}\n${config.guidelines}`;
}

/**
 * Auto-detect the appropriate mode from message content.
 */
export function detectMode(
  message: string,
  currentMode: ConversationMode,
  safetyTriggered: boolean
): ConversationMode {
  // Safety always overrides
  if (safetyTriggered) return 'CRISIS_SUPPORT';

  // In-the-moment markers
  const inTheMoment = /\b(right\s+now|just\s+happened|happening|in\s+the\s+middle\s+of)\b/i;
  if (inTheMoment.test(message)) return 'IN_THE_MOMENT';

  // Processing markers
  const processing = /\b(thinking\s+about|looking\s+back|yesterday|last\s+night|earlier\s+today)\b/i;
  if (processing.test(message)) return 'PROCESSING';

  // Check-in markers
  const checkIn = /\b(check\s+in|how\s+am\s+I\s+doing|update|checking\s+in)\b/i;
  if (checkIn.test(message)) return 'CHECK_IN';

  // Skill building markers
  const skillBuilding = /\b(how\s+do\s+I|teach\s+me|practice|exercise|learn|skill|technique)\b/i;
  if (skillBuilding.test(message)) return 'SKILL_BUILDING';

  // Default: stay in current mode or exploration
  return currentMode || 'EXPLORATION';
}
