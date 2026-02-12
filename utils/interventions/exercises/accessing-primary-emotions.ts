/**
 * Accessing Primary Emotions (EFT Stage 2)
 *
 * A core Emotionally Focused Therapy exercise that helps
 * individuals move beneath reactive, secondary emotions
 * to access the softer, primary feelings underneath —
 * the ones that drive attachment needs and longings.
 */

import type { Intervention } from '@/types/intervention';

export const accessingPrimaryEmotions: Intervention = {
  id: 'accessing-primary-emotions',
  title: 'Accessing Primary Emotions',
  description:
    'Beneath the emotions we show the world, there are often softer, more vulnerable feelings hiding underneath. This EFT-informed exercise guides you beneath your surface reactions to the primary emotions that hold the key to what you truly need.',
  category: 'attachment',
  duration: 10,
  difficulty: 'intermediate',
  mode: 'solo',
  forStates: ['ACTIVATED', 'IN_WINDOW'],
  forPatterns: [
    'emotional_suppression',
    'pursue_withdraw',
    'anxious_attachment',
  ],
  steps: [
    {
      type: 'instruction',
      title: 'Primary vs. Secondary Emotions',
      content:
        'In Emotionally Focused Therapy, we distinguish between two layers of emotion:\n\nSecondary emotions are the ones we show on the surface — anger, frustration, irritation, numbness. They are often reactive and self-protective.\n\nPrimary emotions are what lives underneath — fear, sadness, loneliness, longing, hurt. These are the feelings closest to our attachment needs.\n\nWhen we only express secondary emotions, our partners hear criticism or withdrawal. When we can access and share primary emotions, something shifts — we become reachable, and our partners can respond to the real need.\n\nThis exercise is a gentle invitation to look beneath the surface.',
    },
    {
      type: 'prompt',
      title: 'What Are You Feeling on the Surface?',
      content:
        'Think about a recent moment of tension or disconnection with your partner. What emotions showed up first? These might be things like frustration, annoyance, numbness, wanting to shut down, or the urge to criticize.\n\nName what is on the surface without judging it.',
      promptPlaceholder: 'On the surface, I feel...',
    },
    {
      type: 'prompt',
      title: 'What Is Underneath?',
      content:
        'Now slow down and go deeper. Beneath the frustration — is there hurt? Beneath the numbness — is there fear? Beneath the anger — is there loneliness or a sense of not mattering?\n\nTry completing this sentence: "Underneath the [surface emotion], what I really feel is..."\n\nTake your time. This part asks for courage.',
      promptPlaceholder: 'Underneath, what I really feel is...',
    },
    {
      type: 'prompt',
      title: 'What Does That Part Need?',
      content:
        'Imagine the younger, softer part of you that carries this primary emotion. What does it need? Not what it needs your partner to do — but what it needs to feel. Safety? Reassurance? To know it matters? To be held?\n\nSpeak to that part of yourself with tenderness.',
      promptPlaceholder: 'What that part of me needs is...',
    },
    {
      type: 'timer',
      title: 'Sitting with the Feeling',
      content:
        'For the next 60 seconds, simply sit with whatever primary emotion came up. Do not try to fix it, explain it, or push it away. Just let it be here. Place your hand on your heart if that feels grounding.\n\nThis is what it means to be present with yourself.',
      duration: 60,
    },
    {
      type: 'reflection',
      title: 'Reflection',
      content:
        'What was it like to move beneath your surface emotions? Was there anything surprising about what you found underneath? How might it change things if you could share this primary emotion with your partner?',
      promptPlaceholder: 'What I discovered is...',
    },
  ],
};
