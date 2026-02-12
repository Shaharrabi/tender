/**
 * Hold Me Tight Conversation
 *
 * Based on Sue Johnson's EFT "Hold Me Tight" framework — the
 * culminating conversation in EFT where partners express their
 * deepest attachment needs directly and vulnerably. This is the
 * conversation that transforms insecure bonds into secure ones.
 */

import type { Intervention } from '@/types/intervention';

export const holdMeTight: Intervention = {
  id: 'hold-me-tight',
  title: 'Hold Me Tight Conversation',
  description:
    'Share your deepest attachment needs with your partner in a structured, safe conversation. This advanced EFT exercise helps couples move from self-protection to genuine vulnerability, building the secure bond that both partners long for.',
  category: 'attachment',
  duration: 45,
  difficulty: 'advanced',
  mode: 'together',
  forStates: ['IN_WINDOW'],
  forPatterns: [
    'insecure_attachment',
    'trust_erosion',
    'emotional_disconnection',
  ],
  steps: [
    {
      type: 'instruction',
      title: 'Creating Safety First',
      content:
        'This conversation asks for deep vulnerability, so safety comes first. Agree to these ground rules together:\n\n1. No interrupting while your partner is sharing.\n2. No problem-solving or advice — just presence.\n3. If either partner feels overwhelmed, you pause. No one pushes through distress.\n4. Everything shared here is received with care, not used as ammunition later.\n\nTake a few breaths together. Make eye contact. Remember: you are on the same team.',
    },
    {
      type: 'prompt',
      title: 'Share Your Deepest Need',
      content:
        'One partner goes first. Look at your partner and share what you most need from them in this relationship. Go beneath the everyday requests to the attachment need:\n\n"What I really need from you is..."\n"When I feel disconnected from you, what I long for is..."\n"The thing that would help me feel truly safe with you is..."\n\nSpeak slowly. This is not a speech — it is an offering.',
      promptPlaceholder: 'What I really need from you is...',
    },
    {
      type: 'prompt',
      title: 'Reflect Back What You Heard',
      content:
        'Listening partner: reflect back what you heard, using your own words. Do not evaluate or fix — just show that you received it.\n\n"What I hear you saying is that you need..."\n"It sounds like what matters most to you is..."\n\nThen ask: "Did I get that right? Is there more?"\n\nWrite down what it felt like to have your need reflected back to you.',
      promptPlaceholder: 'Hearing my need reflected back, I felt...',
    },
    {
      type: 'prompt',
      title: 'Switch Roles',
      content:
        'Now the other partner shares their deepest attachment need. Take your time. The first partner listens and reflects back.\n\nRemember: both of you have needs. This is not a competition for who hurts more — it is two people reaching for each other.',
      promptPlaceholder: 'My partner\'s deepest need is... and hearing it, I felt...',
    },
    {
      type: 'prompt',
      title: 'Make a New Commitment',
      content:
        'Based on what you each shared, make a specific commitment to being more accessible and responsive. Use the A.R.E. framework:\n\n- Accessible: "I will be more available to you by..."\n- Responsive: "When you reach for me, I will try to..."\n- Engaged: "I will show you that you matter by..."\n\nThese are not promises of perfection — they are intentions of direction.',
      promptPlaceholder: 'My commitment to you is...',
    },
    {
      type: 'timer',
      title: 'Physical Connection Moment',
      content:
        'Words lay the foundation, but physical connection seals it. Hold each other — hands, a hug, whatever feels right — in silence for two minutes. No talking, no phones, no agenda. Just two nervous systems calming in each other\'s presence. Let the conversation settle into your bodies.',
      duration: 120,
    },
    {
      type: 'reflection',
      title: 'Closing Reflection',
      content:
        'How do you feel right now compared to when you started? What was the hardest part? What surprised you? What do you want to remember from this conversation?',
      promptPlaceholder: 'Right now I feel...',
    },
  ],
};
