import { AttachmentStyle } from '@/types';

export interface ECRRInterpretation {
  label: string;
  warmLabel: string;
  interpretation: string;
  fieldInsight: string;
  growthEdge: string;
  growthTip: string;
  bodyPrompt: string;
}

const INTERPRETATIONS: Record<AttachmentStyle, ECRRInterpretation> = {
  secure: {
    label: 'Secure',
    warmLabel: 'Grounded Connection',
    interpretation:
      'You learned early that reaching out works — that people come when you call, and closeness is safe. That pattern lives in your body now as a kind of relational groundedness. You can move toward your partner without losing yourself, and you can give space without it feeling like abandonment. This is not something you achieved. It is something your nervous system learned, and it is a genuine gift to the people you love.',
    fieldInsight:
      'The space between you and your partner tends to feel warm and alive. You have the capacity to sense shifts in the field without being destabilized by them.',
    growthEdge:
      'Deepening — moving from comfortable connection into the kind of vulnerability that surprises even you. Security is not a destination. It is a living practice.',
    growthTip:
      'Share something with your partner this week that you have never said out loud — a fear, a dream, a doubt. Not because you need to, but because the space between you can hold more than you think.',
    bodyPrompt:
      'When you feel close to your partner, where does that warmth live in your body? Notice it. That is your secure base.',
  },
  'anxious-preoccupied': {
    label: 'Anxious-Preoccupied',
    warmLabel: 'The Reach',
    interpretation:
      'You learned to protect yourself by staying close — by watching, monitoring, reaching for reassurance. Your nervous system was trained to detect disconnection early, because early in your life, connection was not reliable. This is not you being "too much." This is a survival strategy that once made perfect sense.\n\nYour sensitivity to the space between you and your partner is a genuine relational instrument. You pick up on shifts — a change in tone, a moment of distance, a missed bid — before most people would notice anything at all. The challenge is what happens next: your system does not just detect the shift, it interprets it. "Something changed" becomes "something is wrong" becomes "they are leaving." And before you can check whether any of that is true, the protective pattern is already running.',
    fieldInsight:
      'You sense what is alive in the relational field with remarkable accuracy. The work is not to feel less — it is to feel with more discernment, so you can use that sensitivity as wisdom instead of alarm.',
    growthEdge:
      'Learning to trust the rhythm of closeness and distance — that your partner leaving the room is not the same as your partner leaving you.',
    growthTip:
      'When you notice the urge to seek reassurance, pause. Put your hand on your chest. Ask yourself: "Am I responding to what is happening right now, or to what I am afraid might happen?" That pause changes everything.',
    bodyPrompt:
      'When you feel disconnected from your partner, where does the alarm show up in your body first? Chest? Stomach? Throat? Notice it — that is your early warning system talking.',
  },
  'dismissive-avoidant': {
    label: 'Dismissive-Avoidant',
    warmLabel: 'The Retreat',
    interpretation:
      'You learned to protect yourself by becoming self-sufficient — by handling things on your own, by not needing too much from anyone. Your nervous system was trained to equate emotional needs with danger, because early in your life, reaching out did not get you what you needed. This is not coldness. This is a wall that once kept you safe.\n\nYour independence is real and valuable. You bring stability, calm under pressure, and a groundedness that your partner likely relies on more than you know. The pattern to notice is when that independence activates: do you pull away because you genuinely need space, or because closeness triggered an old alarm?',
    fieldInsight:
      'The space between you and your partner can sometimes go cold — not because you do not care, but because your protective system prefers distance over vulnerability. The invitation is not to demolish the wall. It is to build a window.',
    growthEdge:
      'Building small, structured moments of openness that do not overwhelm your system — a window, not a demolished wall.',
    growthTip:
      'Share one small, personal thought with your partner this week — something you would normally keep to yourself. Not a confession. Just a window. Notice what happens in the space between you when you let them in, even a little.',
    bodyPrompt:
      'When your partner moves toward you emotionally, what happens in your body? Do you feel a pull to withdraw? A tightening? That is your protective system — it is not you. You can notice it without obeying it.',
  },
  'fearful-avoidant': {
    label: 'Fearful-Avoidant',
    warmLabel: 'The Push-Pull',
    interpretation:
      'You carry two patterns at once — the reach and the retreat. Part of you longs for closeness, and part of you is afraid of what closeness costs. This is not indecision or confusion. This is a nervous system that learned two contradictory things at the same time: "I need people" and "people are not safe."\n\nThis push-pull is one of the most challenging relational patterns to live with, and your awareness of it is itself a profound strength. Most people with this pattern feel it without being able to name it. The fact that you can sense the conflict means you have the capacity to work with it, not just be run by it.',
    fieldInsight:
      'The space between you and your partner oscillates — sometimes warm and open, sometimes contracted and guarded. Both states are real. Both deserve attention. The work is learning to stay present through the oscillation instead of being swept away by it.',
    growthEdge:
      'Developing the capacity to hold both truths — "I want closeness" and "closeness feels risky" — without letting either one win completely.',
    growthTip:
      'When you notice the push-pull activating, name it out loud: "Part of me wants to be close right now, and part of me wants to pull away." Naming it takes away its power to run you. Let your partner witness both parts.',
    bodyPrompt:
      'When the push-pull starts, notice both sides in your body. Where does the reaching live? Where does the retreating live? Can you hold both at the same time?',
  },
};

export function getECRRInterpretation(style: AttachmentStyle): ECRRInterpretation {
  return INTERPRETATIONS[style];
}
