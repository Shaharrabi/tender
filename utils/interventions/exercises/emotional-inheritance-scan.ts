/**
 * The Emotional Inheritance Scan (Bowen-Inspired)
 *
 * A reflective practice to identify which relationship habits
 * belong to you, and which ones you "inherited" from your family
 * of origin. Bowen Theory suggests that we unknowingly reenact
 * the anxiety patterns of our parents — multigenerational
 * transmission. When you can name where a reaction came from,
 * you gain freedom to choose a different response.
 *
 * Interactive step types used:
 *   - scenario_choice (x2) — true/false quiz + origin identification
 *   - sentence_transform (x1) — rewrite the inherited script
 *   - instruction, prompt, reflection — standard types
 */

import type { Intervention } from '@/types/intervention';

export const emotionalInheritanceScan: Intervention = {
  id: 'emotional-inheritance-scan',
  title: 'The Emotional Inheritance Scan',
  description:
    'Identify which relationship habits belong to you, and which ones you inherited from your family of origin. Awareness of multigenerational patterns is the first step to choosing differently.',
  fieldInsight:
    'The patterns you inherited are not your destiny — they are your starting point.',
  category: 'differentiation',
  duration: 10,
  difficulty: 'intermediate',
  mode: 'solo',
  forStates: ['IN_WINDOW', 'MIXED'],
  forPatterns: [
    'family_of_origin',
    'reactive_patterns',
    'undifferentiated',
    'automatic_responses',
  ],
  steps: [
    // ─── Step 1: Psychoeducation ────────────────────────
    {
      type: 'instruction',
      title: 'Multigenerational Transmission',
      content:
        'Bowen Theory suggests that we unknowingly reenact the anxiety patterns of our parents. When you lose your temper in the same way your father did, or go silent just like your mother — that is multigenerational transmission.\n\nThe good news: once you can name where a reaction comes from, you gain the freedom to choose a different response.\n\nThis exercise helps you trace your patterns to their origin.',
    },

    // ─── Step 2: True/False Quiz (scenario_choice) ──────
    {
      type: 'scenario_choice',
      title: 'True or False',
      content:
        'Let\'s start by examining a common belief about family patterns.',
      interactiveConfig: {
        kind: 'scenario_choice',
        scenario:
          '"Reacting exactly like my parents during stress is inevitable — it\'s just how I\'m wired."',
        choices: [
          {
            id: 'true',
            text: 'True — It feels automatic',
            feedback:
              'It does feel automatic — but that\'s learned behavior, not destiny. Awareness is the wedge between stimulus and response. The fact that you\'re here doing this exercise already proves you can choose differently.',
            isRecommended: false,
          },
          {
            id: 'false',
            text: 'False — Awareness creates choice',
            feedback:
              'Exactly. While the patterns feel deeply wired, research shows that awareness interrupts automatic transmission. You are not condemned to repeat what you inherited.',
            isRecommended: true,
          },
        ],
        revealAll: true,
      },
    },

    // ─── Step 3: Name a recent reaction (prompt) ────────
    {
      type: 'prompt',
      title: 'Name a Recent Reaction',
      content:
        'Think of the last conflict or moment of tension with your partner. Identify one specific reaction you had — shutting down, raising your voice, withdrawing, criticizing, people-pleasing, over-explaining.\n\nDescribe what you did, not what your partner did.',
      promptPlaceholder: 'During our last tension, I reacted by...',
    },

    // ─── Step 4: Origin identification (scenario_choice) ─
    {
      type: 'scenario_choice',
      title: 'Where Did You Learn This?',
      content:
        'When you did that — shutting down, criticizing, withdrawing — who do you sound the most like?',
      interactiveConfig: {
        kind: 'scenario_choice',
        scenario: 'The reaction I just described most resembles:',
        choices: [
          {
            id: 'mother',
            text: 'My mother / maternal figure',
            feedback:
              'Many of our relational patterns — especially around emotional expression, caretaking, and conflict avoidance — are learned from our primary caregiver. This isn\'t blame; it\'s simply tracing the thread.',
          },
          {
            id: 'father',
            text: 'My father / paternal figure',
            feedback:
              'Patterns of anger management, emotional distance, or over-functioning are often transmitted from father figures — modeled silently across years of watching.',
          },
          {
            id: 'self',
            text: 'Myself — this feels uniquely mine',
            feedback:
              'That\'s valuable self-knowledge. Even patterns that feel "yours" often have roots in how you learned to cope in your family system. The important thing is you\'re aware of it.',
          },
          {
            id: 'other',
            text: 'Someone else (sibling, grandparent, ex)',
            feedback:
              'Patterns can be inherited from anyone who played a significant role in your emotional development. The transmission doesn\'t require a parent — just consistent modeling.',
          },
        ],
        revealAll: false,
      },
    },

    // ─── Step 5: Rewrite the script (sentence_transform) ─
    {
      type: 'sentence_transform',
      title: 'Rewrite the Script',
      content:
        'Now let\'s transform this inherited pattern into a conscious choice. Complete each stage of the transformation:',
      interactiveConfig: {
        kind: 'sentence_transform',
        stages: [
          {
            prefix: 'When I',
            placeholder: 'describe the inherited reaction...',
            explanation: 'Name the automatic behavior you identified',
          },
          {
            prefix: 'I am copying',
            placeholder: 'name who you learned it from...',
            explanation: 'Trace it to its origin — no judgment, just honesty',
          },
          {
            prefix: 'Today, I choose to handle it like ME by',
            placeholder: 'describe your new chosen response...',
            explanation: 'Claim your own way forward',
          },
        ],
      },
    },

    // ─── Step 6: Reflection ─────────────────────────────
    {
      type: 'reflection',
      title: 'What Shifts?',
      content:
        'What was it like to name where your reaction came from? Does anything feel different now that you\'ve separated "their pattern" from "my choice"?\n\nYou are not your parents. Recognizing the script allows you to rewrite it.',
      promptPlaceholder: 'Naming the inheritance felt...',
    },
  ],
};
