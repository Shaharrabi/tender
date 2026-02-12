/**
 * Parts Check-In (IFS-Informed)
 *
 * An Internal Family Systems inspired exercise to build
 * awareness of protective parts and access Self energy.
 */

import type { Intervention } from '@/types/intervention';

export const partsCheckIn: Intervention = {
  id: 'parts-check-in',
  title: 'Parts Check-In',
  description:
    'An IFS-inspired practice to notice which part of you is most active right now, understand what it is protecting, and reconnect with your calm, curious Self.',
  category: 'differentiation',
  duration: 5,
  difficulty: 'beginner',
  mode: 'solo',
  forStates: ['IN_WINDOW', 'ACTIVATED', 'MIXED'],
  forPatterns: [
    'inner_critic',
    'people_pleasing',
    'emotional_reactivity',
    'self_blame',
    'protective_withdrawal',
  ],
  steps: [
    {
      type: 'instruction',
      title: 'About Parts',
      content:
        'We all have different "parts" — inner voices, feelings, or impulses that show up in different situations. There is the part that gets anxious, the part that wants to fix everything, the part that shuts down. None of them are bad; they are all trying to protect you. This exercise helps you notice which part is active right now and relate to it with curiosity instead of judgment.',
    },
    {
      type: 'prompt',
      title: 'Notice What Part Is Active',
      content:
        'Turn your attention inward. What part of you feels most present right now? It might show up as an emotion, a body sensation, or an inner voice. Give it a name or description — for example, "the worried planner" or "the one who wants to shut down."',
      promptPlaceholder: 'The part that is most active right now is...',
    },
    {
      type: 'prompt',
      title: 'Ask What It Is Protecting',
      content:
        'With curiosity rather than judgment, ask this part: "What are you trying to protect me from?" Listen for what comes up. Parts usually have a good reason for what they do, even when the behavior no longer serves us.',
      promptPlaceholder: 'This part is trying to protect me from...',
    },
    {
      type: 'instruction',
      title: 'Thank This Part',
      content:
        'Silently or aloud, thank this part for trying to take care of you. You might say something like: "Thank you for working so hard to keep me safe. I see you." This is not about agreeing with the part — it is about acknowledging its intention.',
    },
    {
      type: 'prompt',
      title: 'Check In with Self',
      content:
        'Now see if you can access a bit of calm, curious, compassionate awareness — what IFS calls "Self." From this place, how do you feel toward the part you just noticed? Can you hold it with a little more spaciousness?',
      promptPlaceholder: 'From my calm center, I feel...',
    },
    {
      type: 'reflection',
      title: 'Reflection',
      content:
        'What did you learn about yourself in this check-in? Was it easy or difficult to access curiosity toward your part? Is there anything you want to remember from this experience?',
      promptPlaceholder: 'What I want to remember is...',
    },
  ],
};
