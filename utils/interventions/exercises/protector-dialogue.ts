/**
 * Dialogue with a Protector — IFS
 */
import type { Intervention } from '@/types/intervention';

export const protectorDialogue: Intervention = {
  id: 'protector-dialogue',
  title: 'Dialogue with a Protector',
  description:
    'Use Internal Family Systems to gently engage with the protective parts that show up in your relationship. Understand their fears and appreciate their service.',
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
      type: 'prompt',
      title: 'Identify a Protector',
      content: 'Think about how you act in your relationship when things get hard. What part shows up? The one who walls off? Gets angry? Tries to fix everything? Goes silent?',
      promptPlaceholder: 'A protector I notice is the part that...',
    },
    {
      type: 'prompt',
      title: 'What Is It Protecting You From?',
      content: 'Ask this part: what are you protecting me from? What would happen if you stepped back? Listen for the answer without judging.',
      promptPlaceholder: 'It\'s protecting me from...',
    },
    {
      type: 'prompt',
      title: 'What Does It Fear?',
      content: 'What does this part fear would happen if it let its guard down? Rejection? Being overwhelmed? Being hurt again?',
      promptPlaceholder: 'It fears that...',
    },
    {
      type: 'prompt',
      title: 'Thank Your Protector',
      content: 'This part has been working hard for you, probably for a long time. What would you like to say to it? Can you offer appreciation?',
      promptPlaceholder: 'I want to say to this part...',
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
