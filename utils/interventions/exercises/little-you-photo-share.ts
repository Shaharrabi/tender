/**
 * Little You Photo Share (EFT / Attachment)
 *
 * Partners share childhood photos and tell each other what
 * their younger self needed to hear. Based on EFT's approach
 * to accessing the vulnerable child self that drives adult
 * attachment behavior.
 */

import type { Intervention } from '@/types/intervention';

export const littleYouPhotoShare: Intervention = {
  id: 'little-you-photo-share',
  title: 'Little You Photo Share',
  description:
    'Share a childhood photo with your partner and tell them what your younger self needed to hear. When your partner offers those words to "little you," something deep shifts — the adult relationship touches the child wound.',
  fieldInsight:
    'When your partner speaks to the child in you, the adult attachment softens.',
  category: 'attachment',
  duration: 15,
  difficulty: 'intermediate',
  mode: 'together',
  forStates: ['IN_WINDOW'],
  forPatterns: [
    'attachment_injury',
    'childhood_wounds',
    'emotional_distance',
    'defensive_patterns',
  ],
  steps: [
    // ─── Step 1: Context ────────────────────────────────
    {
      type: 'instruction',
      title: 'Why This Matters',
      content:
        'Much of what drives our adult attachment behavior — the clinging, the distancing, the fear of abandonment, the walls — has roots in childhood. EFT recognizes that when partners can access their vulnerable younger self, and when their partner can respond to that vulnerability, deep healing happens.\n\nFor this exercise, you\'ll each need a childhood photo — printed or on your phone. Choose a photo where you were under 10 years old. It doesn\'t have to be a sad photo; any photo of young you works.',
    },

    // ─── Step 2: Defense awareness (scenario_choice) ────
    {
      type: 'scenario_choice',
      title: 'Where Does Defensive Anger Come From?',
      content: 'When you snap at your partner, the intensity often has deeper roots:',
      interactiveConfig: {
        kind: 'scenario_choice',
        scenario:
          'When your partner does something that triggers an outsized reaction in you, it\'s often because:',
        choices: [
          {
            id: 'present',
            text: 'They genuinely did something terrible right now',
            feedback:
              'Sometimes, yes. But if the intensity of your reaction feels bigger than the event deserves, the extra charge is likely coming from an older wound.',
          },
          {
            id: 'past',
            text: 'It echoes something painful from my childhood',
            feedback:
              'This is usually the deeper truth. The present event activates an old emotional memory. Your nervous system doesn\'t distinguish between then and now — it just feels the threat.',
            isRecommended: true,
          },
        ],
        revealAll: true,
      },
    },

    // ─── Step 3: Share the photo (prompt) ───────────────
    {
      type: 'prompt',
      title: 'Show Your Photo',
      content:
        'Show your partner the childhood photo you chose. Tell them briefly about this version of you — how old you were, what was going on in your life, what you remember about being this child.\n\nThen share: what did this child need to hear that they didn\'t get enough of?',
      promptPlaceholder: 'What little me needed to hear was...',
    },

    // ─── Step 4: Partner offers the words (timer) ───────
    {
      type: 'timer',
      title: 'Partner: Offer the Words',
      content:
        'Listening partner: look at the photo of your partner as a child. Now, speaking directly to that child — not the adult — offer them the words they said they needed.\n\nYou might say: "You are enough." "You are safe with me." "You don\'t have to be perfect." "I see you." "You are loved."\n\nSay it slowly. Say it like you mean it. Let the words land.',
      duration: 120,
    },

    // ─── Step 5: Switch roles (instruction) ─────────────
    {
      type: 'instruction',
      title: 'Switch Roles',
      content:
        'Now switch. The other partner shares their childhood photo, tells the story of that child, and names what they needed to hear. The listening partner offers those words to the child in the photo.\n\nTake your time. This is not a race.',
    },

    // ─── Step 6: Reflection ─────────────────────────────
    {
      type: 'reflection',
      title: 'What Moved?',
      content:
        'What was it like to hear your partner speak to your younger self? What shifted inside you? Did anything feel different about how you see your partner after they offered those words to "little you"?',
      promptPlaceholder: 'When my partner spoke to little me, I felt...',
    },
  ],
};
