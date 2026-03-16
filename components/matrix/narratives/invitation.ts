/**
 * Invitation Generator — "Your one invitation"
 *
 * Full integration across all instruments. One sentence.
 * Unique per person. The most distilled relational intelligence.
 */

interface InvitationInput {
  attachmentStyle: string;
  anxietyScore: number;       // ECR-R 1-7
  avoidanceScore: number;     // ECR-R 1-7
  N: number;                  // IPIP Neuroticism percentile
  O: number;                  // IPIP Openness percentile
  perception: number;         // SSEIT perception 0-100
  differentiation: number;    // DSI-R total normalized 0-100
  iPosition: number;          // DSI-R iPosition 0-100
  fusionWithOthers: number;   // DSI-R fusionWithOthers 0-100
  primaryConflict: string;    // DUTCH primary style
  yieldingMean: number;       // DUTCH 1-5
  avoidingMean: number;       // DUTCH 1-5
  forcingMean: number;        // DUTCH 1-5
  problemSolvingMean: number; // DUTCH 1-5
  windowWidth: number;        // Composite 0-100
  valuesCongruence: number;   // Composite 0-100
}

export function generateOneInvitation(input: InvitationInput): string {
  const {
    attachmentStyle, anxietyScore, avoidanceScore,
    N, O, perception, differentiation, iPosition,
    fusionWithOthers, primaryConflict, yieldingMean,
    avoidingMean, forcingMean, problemSolvingMean,
    windowWidth, valuesCongruence,
  } = input;

  const isAnxious = anxietyScore >= 4.0;
  const isAvoidant = avoidanceScore >= 4.0;
  const isSecure = !isAnxious && !isAvoidant;
  const highPerception = perception >= 70;
  const lowPerception = perception < 40;
  const highDiff = differentiation >= 70;
  const lowDiff = differentiation < 40;
  const highN = N >= 70;
  const lowO = O < 30;

  // Full integration patterns — most specific first

  if (isAnxious && highPerception && yieldingMean >= 3.5 && lowDiff) {
    return 'Let what you feel become information, not instruction.';
  }

  if (isAvoidant && lowPerception && avoidingMean >= 3.5 && highDiff) {
    return 'Risk being known. The wall keeps you safe and alone.';
  }

  if (isSecure && highPerception && problemSolvingMean >= 3.5 && highDiff) {
    return 'Go from good to profound. You have the foundation \u2014 now go deeper.';
  }

  if (isAnxious && highN && forcingMean >= 3.5 && lowO) {
    return 'Soften the approach without softening the truth.';
  }

  if (isAvoidant && O >= 70 && primaryConflict === 'compromising') {
    return 'The door is already open. Walk through it.';
  }

  // Secondary patterns

  if (isAnxious && windowWidth < 35) {
    return 'Widen the window before you reach. Clarity comes after calm.';
  }

  if (isAvoidant && valuesCongruence < 50) {
    return 'Your values know the way. Your fear is the only thing between here and there.';
  }

  if (isAnxious && isAvoidant) {
    return 'You want closeness and you fear it. Start with one: trust yourself to stay.';
  }

  if (highPerception && lowDiff) {
    return 'You see everything. Now learn to hold what you see without becoming it.';
  }

  if (highDiff && lowPerception) {
    return 'Your ground is solid. Now look up and see what your partner is showing you.';
  }

  if (yieldingMean >= 3.5 && valuesCongruence < 50) {
    return 'Stop giving yourself away in the name of love. Real love needs the real you.';
  }

  if (forcingMean >= 3.5 && isAnxious) {
    return 'The urgency is the wound talking. The truth can wait for the right moment.';
  }

  if (avoidingMean >= 3.5 && perception >= 60) {
    return 'You see what needs to be said. Say it. Not perfectly \u2014 just honestly.';
  }

  // Secure baseline
  if (isSecure && highDiff) {
    return 'You have the foundation most people spend a lifetime building. Now use it to reach.';
  }

  if (isSecure) {
    return 'Security is your gift. Depth is your invitation.';
  }

  // Fallback — still unique based on primary pattern
  if (isAnxious) {
    return 'The reaching is love. Learning when to rest your arms is wisdom.';
  }

  if (isAvoidant) {
    return 'One step closer. Just one. That\u2019s enough for today.';
  }

  return 'The relationship you want is on the other side of the conversation you\u2019re avoiding.';
}
