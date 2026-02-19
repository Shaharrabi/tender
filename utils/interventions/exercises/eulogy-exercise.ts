/**
 * The Eulogy Exercise (Existential / ACT)
 *
 * Partners imagine their 50th anniversary speech or eulogy to
 * gain perspective on what truly matters. Existential therapy
 * uses death awareness and future projection to clarify values
 * and cut through trivial conflict.
 */

import type { Intervention } from '@/types/intervention';

export const eulogyExercise: Intervention = {
  id: 'eulogy-exercise',
  title: 'The Eulogy Exercise',
  description:
    'Imagine your 50th anniversary speech — or what you\'d want said about your relationship at the end. When you zoom out to what truly matters, today\'s arguments shrink to their real size.',
  fieldInsight:
    'When you know the legacy you want to leave, today\'s argument finds its proper size.',
  category: 'values',
  duration: 12,
  difficulty: 'advanced',
  mode: 'together',
  forStates: ['IN_WINDOW'],
  forPatterns: [
    'gridlocked_conflict',
    'values_alignment',
    'perspective_taking',
    'meaning_making',
    'future_orientation',
  ],
  steps: [
    // ─── Step 1: Context ────────────────────────────────
    {
      type: 'instruction',
      title: 'The Long View',
      content:
        'Existential therapy uses a powerful technique: imagining the end to clarify what matters now. When couples zoom out to the story of their whole relationship, trivial conflicts shrink and core values emerge.\n\nThis exercise asks you to imagine your 50th anniversary — or the story of your relationship told by someone who loves you. It can feel intense. That\'s the point: intensity reveals what matters.',
    },

    // ─── Step 2: Perspective check (scenario_choice) ────
    {
      type: 'scenario_choice',
      title: 'What Will You Remember?',
      content: 'When you look back on your relationship decades from now:',
      interactiveConfig: {
        kind: 'scenario_choice',
        scenario: 'At 80 years old, looking back, you\'ll most remember:',
        choices: [
          {
            id: 'arguments',
            text: 'Who won which arguments',
            feedback:
              'Almost no one remembers the content of old arguments. What lasts is the feeling — "we fought fair" or "we fought dirty." The HOW matters more than the WHAT.',
          },
          {
            id: 'moments',
            text: 'How you showed up for each other in hard moments',
            feedback:
              'Yes. Research on elderly couples shows they remember moments of care during crisis — not who was right. The quality of presence is what remains.',
            isRecommended: true,
          },
          {
            id: 'achievements',
            text: 'What you built together (house, career, family)',
            feedback:
              'Achievements matter, but they\'re not what couples talk about at 50th anniversaries. They talk about how they got through the hard parts — together.',
          },
        ],
        revealAll: true,
      },
    },

    // ─── Step 3: The 50th anniversary speech (prompt) ───
    {
      type: 'prompt',
      title: 'Your 50th Anniversary Speech',
      content:
        'Imagine you\'re standing up at your 50th anniversary party. Your children, grandchildren, and closest friends are there. You have two minutes to tell the room about the person sitting next to you — your partner.\n\nWhat do you say? Not what you wish were true. What you actually want to be able to say. Write it as if you\'re speaking it.',
      promptPlaceholder: 'I want to stand up and say...',
    },

    // ─── Step 4: Legacy alignment (sentence_transform) ──
    {
      type: 'sentence_transform',
      title: 'Alignment Check',
      content: 'Now check whether your current behavior matches that future speech:',
      interactiveConfig: {
        kind: 'sentence_transform',
        stages: [
          {
            prefix: 'In my speech, I described a partner who',
            placeholder: 'the quality you praised (loyal, brave, kind, funny...)',
            explanation: 'The aspiration — who you want them to know you as',
          },
          {
            prefix: 'But this week, I actually',
            placeholder: 'an honest behavior that contradicts the speech...',
            explanation: 'The gap between aspiration and current reality',
          },
          {
            prefix: 'To live my speech today, I need to',
            placeholder: 'one specific, doable change...',
            explanation: 'Close the gap with one concrete action',
          },
        ],
      },
    },

    // ─── Step 5: Share and witness (timer) ──────────────
    {
      type: 'timer',
      title: 'Share Your Speech',
      content:
        'Take turns reading your 50th anniversary speeches to each other. The listener\'s only job is to receive it — no commentary, no "that was nice." Just listen and let it land.\n\nThis is your partner telling you who they want to be for you.',
      duration: 180,
    },

    // ─── Step 6: Reflection ─────────────────────────────
    {
      type: 'reflection',
      title: 'What This Changes',
      content:
        'After hearing your partner\'s speech about you — and writing your own — does anything shift about how you see this week\'s conflicts? What would it mean to live your anniversary speech starting today?',
      promptPlaceholder: 'Hearing my partner\'s speech made me realize...',
    },
  ],
};
