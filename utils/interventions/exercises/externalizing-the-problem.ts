/**
 * Externalizing the Problem (Narrative Therapy)
 *
 * Based on Michael White's Narrative Therapy technique of
 * externalizing — separating the person from the problem.
 * "The person is not the problem; the problem is the problem."
 */

import type { Intervention } from '@/types/intervention';

export const externalizingTheProblem: Intervention = {
  id: 'externalizing-the-problem',
  title: 'Externalizing the Problem',
  description:
    'Separate the problem from the person using Narrative Therapy\'s most powerful technique. When "you are critical" becomes "the Criticism Monster visits us," everything shifts — you can fight the pattern together instead of each other.',
  fieldInsight:
    'The person is not the problem. The problem is the problem.',
  category: 'communication',
  duration: 8,
  difficulty: 'beginner',
  mode: 'together',
  forStates: ['IN_WINDOW', 'MIXED'],
  forPatterns: [
    'blame_cycles',
    'criticism',
    'character_attacks',
    'shame',
    'defensive_patterns',
  ],
  steps: [
    // ─── Step 1: Psychoeducation ────────────────────────
    {
      type: 'instruction',
      title: 'The Problem Is the Problem',
      content:
        'Narrative Therapy\'s most powerful move: externalize the problem. Instead of "You are so critical," say "The Criticism Monster visits our conversations." Instead of "You\'re shutting down again," say "The Shutdown has arrived."\n\nThis is not minimizing. It\'s strategic: when the problem is external to both of you, you can team up against it instead of against each other.',
    },

    // ─── Step 2: Spot the externalization (scenario_choice)
    {
      type: 'scenario_choice',
      title: 'Which One Externalizes?',
      content: 'Two ways to name the same pattern — which separates person from problem?',
      interactiveConfig: {
        kind: 'scenario_choice',
        scenario: 'Your partner has been distant and cold after an argument.',
        choices: [
          {
            id: 'internal',
            text: '"You are being cold and punishing me."',
            feedback:
              'This internalizes — it makes your partner THE problem. They have to defend their character, not address the pattern.',
          },
          {
            id: 'external',
            text: '"I think The Cold Shoulder has shown up between us."',
            feedback:
              'This externalizes. The pattern becomes something that visits, not something your partner IS. Now you can both look at it together.',
            isRecommended: true,
          },
        ],
        revealAll: true,
      },
    },

    // ─── Step 3: Name your problem-visitor (prompt) ─────
    {
      type: 'prompt',
      title: 'Name Your Problem-Visitor',
      content:
        'Think of a recurring issue in your relationship. Give it a name — as if it were a character that visits you both. Make it specific and slightly vivid.\n\nExamples: "The Scorekeeper," "The Silent Treatment Ghost," "The Anxiety Tornado," "The Control Freak Committee"',
      promptPlaceholder: 'Our problem-visitor is called...',
    },

    // ─── Step 4: Externalize it (sentence_transform) ────
    {
      type: 'sentence_transform',
      title: 'Rewrite the Story',
      content: 'Transform an internalized blame statement into an externalized observation:',
      interactiveConfig: {
        kind: 'sentence_transform',
        stages: [
          {
            prefix: 'The old story (blame):',
            placeholder: '"You always..." or "You never..." or "You are so..."',
            explanation: 'How this problem usually gets talked about — as a character flaw',
          },
          {
            prefix: 'The new story (externalized):',
            placeholder: '"When [Problem Name] shows up, it makes us..."',
            explanation: 'The same issue, but now it\'s something that happens TO you both',
          },
          {
            prefix: 'Together we can fight it by:',
            placeholder: 'what you\'d do as a team against the problem...',
            explanation: 'Now you\'re allies, not adversaries',
          },
        ],
      },
    },

    // ─── Step 5: Reflection ─────────────────────────────
    {
      type: 'reflection',
      title: 'How Does This Shift Things?',
      content:
        'What changes when the problem has its own name instead of being attached to a person? Could you imagine saying "I think [Problem Name] is visiting" during your next tense moment?',
      promptPlaceholder: 'When the problem is external, I notice...',
    },
  ],
};
