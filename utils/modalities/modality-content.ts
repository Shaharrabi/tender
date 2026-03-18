/**
 * Modality Content Database — V2.1
 *
 * Each entry maps a detected pattern to a therapeutic modality at a severity level.
 * The routing engine selects 3-4 entries per pattern based on the user's profile.
 */

// ─── Types ────────────────────────────────────────────────

export type Severity = 'low' | 'medium' | 'high';

export interface ModalityContentEntry {
  /** Pattern ID from pattern-detection.ts (e.g., 'empathic_enmeshment') */
  patternId: string;
  /** Modality ID from modality-registry.ts (e.g., 'ifs') */
  modalityId: string;
  /** Severity level — determines which entry to use based on score intensity */
  severity: Severity;
  content: {
    /** 2-3 sentences — what's happening through this modality's lens */
    insight: string;
    /** 1 sentence — somatic/body prompt */
    bodyCheck: string;
    /** 1 concrete practice for this week */
    practice: string;
    /** Optional quote from a leader in this modality */
    quote?: string;
    /** Attribution for the quote */
    quoteAttribution?: string;
  };
}

// ─── Content Database ─────────────────────────────────────

export const MODALITY_CONTENT: ModalityContentEntry[] = [];

// ─── Lookup Helpers ───────────────────────────────────────

/** Get all content entries for a pattern, optionally filtered by severity */
export function getContentForPattern(
  patternId: string,
  severity?: Severity,
): ModalityContentEntry[] {
  return MODALITY_CONTENT.filter(
    (e) => e.patternId === patternId && (!severity || e.severity === severity),
  );
}

/** Get a specific entry by pattern + modality + severity */
export function getContentEntry(
  patternId: string,
  modalityId: string,
  severity: Severity,
): ModalityContentEntry | undefined {
  return MODALITY_CONTENT.find(
    (e) => e.patternId === patternId && e.modalityId === modalityId && e.severity === severity,
  );
}

/** Get all unique pattern IDs that have content */
export function getPatternsWithContent(): string[] {
  return [...new Set(MODALITY_CONTENT.map((e) => e.patternId))];
}
