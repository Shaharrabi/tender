import type {
  ECRRScores,
  AttachmentStyle,
  CompositeScores,
  PartnerGuide,
} from '@/types';

/**
 * Generate a shareable partner guide — what your partner needs to know.
 */
export function generatePartnerGuide(
  ecrr: ECRRScores,
  composite: CompositeScores
): PartnerGuide {
  const style = ecrr.attachmentStyle;

  return {
    whatToKnow: WHAT_TO_KNOW[style],
    whenStrugglingINeed: NEEDS[style],
    whatHelps: HELPS[style],
    whatDoesntHelp: DOESNT_HELP[style],
  };
}

// ─── Templates ───────────────────────────────────────────

const WHAT_TO_KNOW: Record<AttachmentStyle, string> = {
  secure:
    'I generally feel secure in our relationship, but I still have moments ' +
    "where I need reassurance or space. I will try to name what I need clearly.",

  'anxious-preoccupied':
    'I sometimes worry about us even when things are fine. My anxiety is not ' +
    "about you failing — it is about how much you matter to me. When I seek " +
    'reassurance, I am not doubting you; I am trying to regulate my nervous system.',

  'dismissive-avoidant':
    "I need space to process, and it does not mean I do not care. When I go " +
    'quiet, I am not punishing you — I am trying to manage overwhelm. ' +
    'My independence is not rejection; it is how I stay regulated.',

  'fearful-avoidant':
    'I sometimes send mixed signals because I feel torn between wanting ' +
    "closeness and needing safety. It is confusing for me too. When I pull " +
    'away after getting close, it is not about you — it is my nervous system ' +
    'hitting its limit.',
};

const NEEDS: Record<AttachmentStyle, string[]> = {
  secure: [
    'To talk through what is happening',
    'Your presence, not necessarily solutions',
    'To be reminded we can figure this out together',
  ],
  'anxious-preoccupied': [
    'Reassurance that we are okay, even briefly',
    "To know when you will be available if you are busy",
    'Physical closeness or a kind word',
  ],
  'dismissive-avoidant': [
    'Time to process before talking',
    'Space without it meaning we are broken',
    'Gentleness, not pressure',
  ],
  'fearful-avoidant': [
    'Patience with my contradictions',
    'Permission to go slow',
    'Safety to say "I need a break" without you leaving',
  ],
};

const HELPS: Record<AttachmentStyle, string[]> = {
  secure: [
    'Direct communication about what you need',
    'Working through things together',
    'Assuming good intent',
  ],
  'anxious-preoccupied': [
    'Proactive check-ins when you will be unavailable',
    'Reminders that you are choosing me',
    'Staying engaged even when I am anxious',
  ],
  'dismissive-avoidant': [
    'Giving me time before expecting a response',
    'Asking questions, not demanding answers',
    'Trusting that I will come back',
  ],
  'fearful-avoidant': [
    'Not taking my withdrawal personally',
    'Staying steady when I am not',
    'Gentle invitations, not demands',
  ],
};

const DOESNT_HELP: Record<AttachmentStyle, string[]> = {
  secure: [
    "Assuming I do not have needs because I do not always voice them",
    'Taking my stability for granted',
  ],
  'anxious-preoccupied': [
    'Dismissing my feelings as "overreacting"',
    'Going silent when I am worried',
    'Making me feel needy for wanting connection',
  ],
  'dismissive-avoidant': [
    'Pursuing me when I have asked for space',
    'Labeling my withdrawal as "stonewalling"',
    'Interpreting my need for space as not caring',
  ],
  'fearful-avoidant': [
    'Asking me to "pick a side" — close or distant',
    'Getting frustrated with my inconsistency',
    'Rushing me to decide how I feel',
  ],
};
