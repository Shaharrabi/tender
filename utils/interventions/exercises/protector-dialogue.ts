/**
 * Dialogue with a Protector — IFS
 */
import type { Intervention } from '@/types/intervention';

export const protectorDialogue: Intervention = {
  id: 'protector-dialogue',
  title: 'Dialogue with a Protector',
  description:
    'Use Internal Family Systems to gently engage with the protective parts that show up in your relationship. Understand their fears and appreciate their service.',
  fieldInsight: 'Your protector parts developed for good reasons \u2014 they just cost too much now.',
  category: 'differentiation',
  duration: 10,
  difficulty: 'intermediate',
  mode: 'solo',
  forStates: ['IN_WINDOW'],
  forPatterns: ['protective_patterns', 'emotional_walls', 'avoidance', 'control'],
  steps: [
    {
      type: 'instruction',
      title: 'Meeting Your Protectors',
      content:
        'In IFS, the parts of us that show up strongest in relationships — the critic, the withdrawer, the controller, the people-pleaser — are protectors. They developed for good reasons, usually to keep you safe from pain. This exercise invites you to talk to one of these parts with curiosity rather than judgment.',
    },
    {
      type: 'sentence_transform',
      title: 'Dialogue with Your Protector',
      content: 'Have a conversation with the protective part. Complete each line as if speaking to it:',
      interactiveConfig: {
        kind: 'sentence_transform',
        stages: [
          {
            prefix: 'The protector I notice is the part that',
            placeholder: 'describe what it does (walls off, gets angry, fixes...)',
            explanation: 'Name the behavior without judging it',
          },
          {
            prefix: 'It\'s protecting me from',
            placeholder: 'what it\'s shielding you from...',
            explanation: 'Every protector has a reason \u2014 what\'s it afraid of?',
          },
          {
            prefix: 'What it fears most is',
            placeholder: 'the worst case it imagines...',
            explanation: 'The deep fear that keeps this part working overtime',
          },
          {
            prefix: 'I want to say to this part:',
            placeholder: '"Thank you for\u2026" or "I see you\u2026"',
            explanation: 'Offer appreciation for its service, even if the method needs updating',
          },
        ],
      },
    },
    {
      type: 'timer',
      title: 'Sit with Compassion',
      content: 'Spend 90 seconds just sitting with this part. Breathe. Offer it warmth. You don\'t need to change it — just be with it.',
      duration: 90,
    },
    {
      type: 'reflection',
      title: 'Closing Reflection',
      content: 'What did you learn about this protector? Did anything shift in how you relate to it?',
      promptPlaceholder: 'What I learned is...',
    },
  ],
};
