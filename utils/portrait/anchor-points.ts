import type {
  ECRRScores,
  AttachmentStyle,
  CompositeScores,
  AnchorPoints,
} from '@/types';

/**
 * Generate 5 anchor phrases — short reminders for difficult moments.
 * Personalized to attachment style and regulation capacity.
 */
export function generateAnchorPoints(
  ecrr: ECRRScores,
  composite: CompositeScores
): AnchorPoints {
  const { attachmentStyle } = ecrr;

  return {
    whenActivated: ACTIVATED[attachmentStyle],
    whenShutdown: getShutdownAnchor(composite.regulationScore),
    patternInterrupt:
      'I notice I am in my pattern. Can we pause and try differently?',
    repair:
      "I got activated and could not stay present. I am sorry. Can we try again?",
    selfCompassion:
      'This pattern developed for a reason. I am learning. Progress, not perfection.',
  };
}

// ─── Templates ───────────────────────────────────────────

const ACTIVATED: Record<AttachmentStyle, string> = {
  secure:
    'Notice the activation. Slow down. I can respond instead of react.',
  'anxious-preoccupied':
    'This feeling is familiar, not factual. Breathe. My partner is not leaving.',
  'dismissive-avoidant':
    "I can stay present even when it is uncomfortable. This matters.",
  'fearful-avoidant':
    'I want to run, and I want to stay. Both are true. Breathe through it.',
};

function getShutdownAnchor(regulationScore: number): string {
  if (regulationScore < 40) {
    return (
      "I am flooded, not broken. I need a break, not forever. I will come back."
    );
  }
  return 'This is temporary. I can find my way back to myself and to us.';
}
