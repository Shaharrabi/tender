/**
 * The Assumption Audit (CBT/DBT-Informed)
 *
 * A cognitive check to stop "mind-reading" and separate facts
 * from fears during a dysregulation spike. Our brains are
 * meaning-making machines — this exercise teaches users to
 * check the facts before reacting to the story they invented.
 *
 * Interactive step types used:
 *   - scenario_choice (x2) — spot the interpretation + gut check
 *   - sentence_transform (x1) — fact vs story separation
 *   - instruction, prompt, reflection — standard types
 */

import type { Intervention } from '@/types/intervention';

export const assumptionAudit: Intervention = {
  id: 'assumption-audit',
  title: 'The Assumption Audit',
  description:
    'Stop mind-reading and separate facts from fears. When your nervous system is activated, your brain fills gaps with worst-case stories. This exercise teaches you to check the facts before reacting.',
  fieldInsight:
    'The story you told yourself is not the story that happened.',
  category: 'regulation',
  duration: 8,
  difficulty: 'beginner',
  mode: 'either',
  forStates: ['ACTIVATED', 'IN_WINDOW', 'MIXED'],
  forPatterns: [
    'mind_reading',
    'catastrophizing',
    'emotional_reactivity',
    'assumption_driven_conflict',
  ],
  steps: [
    // ─── Step 1: Psychoeducation ────────────────────────
    {
      type: 'instruction',
      title: 'Facts vs. Stories',
      content:
        'Our brains are meaning-making machines. If a partner sighs, we might instantly think, "They are disappointed in me." That is an interpretation, not a fact.\n\nThe fact is: your partner sighed.\nThe story is: they are disappointed in me.\n\nRegulation comes from checking the facts before you react to the story you invented. This exercise walks you through that process.',
    },

    // ─── Step 2: Spot the interpretation (scenario_choice)
    {
      type: 'scenario_choice',
      title: 'Spot the Interpretation',
      content:
        'Quick check — which is this: a fact or an interpretation?',
      interactiveConfig: {
        kind: 'scenario_choice',
        scenario: '"My partner is ignoring me."',
        choices: [
          {
            id: 'fact',
            text: 'This is a fact',
            feedback:
              'Actually, this is an interpretation. The fact might be: "My partner is looking at their phone." The word "ignoring" is meaning your brain added — it\'s a story about intent, not an observation. This distinction matters enormously.',
            isRecommended: false,
          },
          {
            id: 'interpretation',
            text: 'This is an interpretation',
            feedback:
              'Exactly right. The fact might be: "My partner is looking at their phone." The word "ignoring" is a story your brain added about their intent. Separating observable facts from added meaning is the first step to calmer responses.',
            isRecommended: true,
          },
        ],
        revealAll: true,
      },
    },

    // ─── Step 3: Recall a trigger (prompt) ──────────────
    {
      type: 'prompt',
      title: 'A Recent Trigger',
      content:
        'Think of a recent moment you felt triggered by your partner. Describe it briefly — just the situation and how you felt.',
      promptPlaceholder: 'Recently, I was triggered when...',
    },

    // ─── Step 4: Fact vs story (sentence_transform) ─────
    {
      type: 'sentence_transform',
      title: 'Separate Fact from Story',
      content:
        'Now let\'s audit that moment. Separate what actually happened from the meaning your mind added:',
      interactiveConfig: {
        kind: 'sentence_transform',
        stages: [
          {
            prefix: 'THE FACT (what a camera would record):',
            placeholder: 'Describe only observable behavior...',
            explanation:
              'Strip away all interpretation. What would a neutral witness see?',
          },
          {
            prefix: 'THE STORY (what I feared it meant):',
            placeholder: 'What meaning did your mind add?',
            explanation:
              'Name the narrative your brain created — the "they don\'t care" or "I\'m not enough"',
          },
          {
            prefix: 'THE CHECK (what I could ask):',
            placeholder:
              '"When you [fact], I told myself [story]. Was that accurate?"',
            explanation:
              'Turn it into a verification question you could actually ask your partner',
          },
        ],
      },
    },

    // ─── Step 5: Gut check (scenario_choice) ────────────
    {
      type: 'scenario_choice',
      title: 'Gut Check',
      content: 'One more belief to examine:',
      interactiveConfig: {
        kind: 'scenario_choice',
        scenario:
          '"My gut feeling about my partner\'s intentions is always accurate."',
        choices: [
          {
            id: 'true',
            text: 'True — I trust my gut',
            feedback:
              'Gut feelings carry wisdom, but they can also be shaped by past trauma, hunger, tiredness, or old relationship wounds. Your gut is data, not verdict. It\'s worth listening to — and always worth verifying.',
          },
          {
            id: 'false',
            text: 'False — Gut feelings can be influenced',
            feedback:
              'Right. Gut feelings are influenced by past trauma, tiredness, hunger, stress, and old relationship patterns. They\'re worth listening to — but always worth checking before acting on.',
            isRecommended: true,
          },
        ],
        revealAll: true,
      },
    },

    // ─── Step 6: Reflection ─────────────────────────────
    {
      type: 'reflection',
      title: 'Grounding Your Thoughts in Reality',
      content:
        'What was it like to separate the fact from the story? Do you notice how much of your reaction was to the story rather than to what actually happened?\n\nRegulate your emotion by grounding your thoughts in reality, not assumption.',
      promptPlaceholder:
        'I realize that the story I was reacting to was...',
    },
  ],
};
