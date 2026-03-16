/**
 * Matrix Label Functions — Score-to-descriptor mapping
 *
 * Every number needs a human word beside it. No raw numbers without context.
 * "Your sensitivity is in the 72nd percentile" not "N = 72".
 */

// ─── Attachment ──────────────────────────────────────

export function getAttachmentLabel(style: string): string {
  switch (style) {
    case 'secure': return 'Grounded';
    case 'anxious-preoccupied': return 'The Reach';
    case 'dismissive-avoidant': return 'The Retreat';
    case 'fearful-avoidant': return 'The Push-Pull';
    default: return style;
  }
}

export function getAnxietyLabel(score: number): string {
  if (score >= 5.0) return 'High sensitivity';
  if (score >= 3.5) return 'Moderate';
  if (score >= 2.0) return 'Low';
  return 'Very low';
}

export function getAvoidanceLabel(score: number): string {
  if (score >= 5.0) return 'High distance';
  if (score >= 3.5) return 'Moderate';
  if (score >= 2.0) return 'Low';
  return 'Very low';
}

// ─── Window of Tolerance ─────────────────────────────

export function getWindowLabel(score: number): string {
  if (score >= 70) return 'Wide range';
  if (score >= 50) return 'Moderate';
  if (score >= 30) return 'Narrow';
  return 'Very narrow';
}

// ─── Personality (IPIP percentiles) ──────────────────

export function getPercentileLabel(score: number): string {
  if (score >= 85) return 'Very high';
  if (score >= 70) return 'High';
  if (score >= 40) return 'Moderate';
  if (score >= 15) return 'Low';
  return 'Very low';
}

export function getNeurotLabel(score: number): string {
  if (score >= 70) return 'Deeply sensitive';
  if (score >= 40) return 'Moderate sensitivity';
  return 'Emotionally steady';
}

export function getExtraLabel(score: number): string {
  if (score >= 70) return 'Energized by others';
  if (score >= 40) return 'Flexible';
  return 'Quiet depth';
}

export function getOpenLabel(score: number): string {
  if (score >= 70) return 'Curious explorer';
  if (score >= 40) return 'Balanced';
  return 'Values stability';
}

export function getAgreeLabel(score: number): string {
  if (score >= 70) return 'Deep warmth';
  if (score >= 40) return 'Balanced';
  return 'Direct & honest';
}

// ─── Emotional Intelligence (SSEIT 0-100) ────────────

export function getEQLabel(score: number): string {
  if (score >= 75) return 'Strong';
  if (score >= 50) return 'Developing';
  if (score >= 25) return 'Growth area';
  return 'Building';
}

// ─── Differentiation (DSI-R 0-100) ───────────────────

export function getDiffLabel(score: number): string {
  if (score >= 70) return 'Well-defined';
  if (score >= 50) return 'Developing';
  if (score >= 30) return 'Growth area';
  return 'Early stage';
}

export function getReactivityLabel(score: number): string {
  // High = more differentiated (less reactive) due to double-reverse
  if (score >= 70) return 'Calm under pressure';
  if (score >= 50) return 'Sometimes reactive';
  if (score >= 30) return 'Often reactive';
  return 'Highly reactive';
}

export function getIPosLabel(score: number): string {
  if (score >= 70) return 'Clear voice';
  if (score >= 50) return 'Finding voice';
  if (score >= 30) return 'Developing';
  return 'Growth area';
}

export function getFusionLabel(score: number): string {
  // High = more differentiated (less fused) due to double-reverse
  if (score >= 70) return 'Clear boundaries';
  if (score >= 50) return 'Some merging';
  if (score >= 30) return 'Often merges';
  return 'High fusion';
}

// ─── Conflict (DUTCH 1-5 mean) ───────────────────────

export function getConflictStyleLabel(style: string): string {
  switch (style) {
    case 'yielding': return 'The Yielder';
    case 'compromising': return 'The Negotiator';
    case 'forcing': return 'The Driver';
    case 'problemSolving': return 'The Problem-Solver';
    case 'avoiding': return 'The Avoider';
    default: return style;
  }
}

export function getConflictMeanLabel(score: number): string {
  if (score >= 4.0) return 'Strong tendency';
  if (score >= 3.0) return 'Moderate';
  if (score >= 2.0) return 'Mild';
  return 'Rarely';
}

// ─── Values ──────────────────────────────────────────

export function getValuesAlignmentLabel(score: number): string {
  if (score >= 80) return 'Living your values';
  if (score >= 60) return 'Mostly aligned';
  if (score >= 40) return 'Some gaps';
  return 'Significant gaps';
}

export function getActionLabel(avoidanceTendency: number, total: number): string {
  const ratio = total > 0 ? avoidanceTendency / total : 0;
  if (ratio <= 0.2) return 'Values-aligned';
  if (ratio <= 0.4) return 'Mostly engaged';
  if (ratio <= 0.6) return 'Mixed';
  return 'Avoidance pattern';
}

// ─── Field / WEARE ───────────────────────────────────

export function getResonanceLabel(score: number): string {
  if (score >= 70) return 'Deeply alive';
  if (score >= 50) return 'Growing';
  if (score >= 30) return 'Finding its way';
  return 'Needs tending';
}

export function getDirectionLabel(score: number): string {
  if (score > 3) return 'Strong momentum';
  if (score > 0) return 'Moving forward';
  if (score > -3) return 'Holding steady';
  return 'Some resistance';
}

export function getBottleneckLabel(bottleneck: string | null): string {
  if (!bottleneck) return 'None identified';
  return bottleneck;
}

// ─── Confidence Helpers ──────────────────────────────

export function getSourceCount(instruments: string[]): number {
  return instruments.length;
}
