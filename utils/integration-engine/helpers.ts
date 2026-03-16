/**
 * Integration Engine Helpers
 * ────────────────────────────────────────────
 * Score lookup, gap calculators, and label generators
 * for building cross-domain integration narratives.
 */

import type { IntegrationScores, DomainId } from './types';
import { DOMAIN_SCORE_KEY } from './types';

// ─── Score Extractors ────────────────────────────────

export function getAnxiety(s: IntegrationScores): number {
  return s.ecrr?.anxietyScore ?? 0;
}

export function getAvoidance(s: IntegrationScores): number {
  return s.ecrr?.avoidanceScore ?? 0;
}

export function getAttachmentStyle(s: IntegrationScores): string {
  return s.ecrr?.attachmentStyle ?? 'unknown';
}

export function isAnxious(s: IntegrationScores): boolean {
  return getAnxiety(s) >= 3.5;
}

export function isAvoidant(s: IntegrationScores): boolean {
  return getAvoidance(s) >= 3.5;
}

export function isSecure(s: IntegrationScores): boolean {
  return getAnxiety(s) < 3.5 && getAvoidance(s) < 3.5;
}

// ─── IPIP (Big Five percentiles 0-100) ───────────────

export function getN(s: IntegrationScores): number {
  return s.ipip?.domainPercentiles?.N ?? 50;
}
export function getE(s: IntegrationScores): number {
  return s.ipip?.domainPercentiles?.E ?? 50;
}
export function getO(s: IntegrationScores): number {
  return s.ipip?.domainPercentiles?.O ?? 50;
}
export function getA(s: IntegrationScores): number {
  return s.ipip?.domainPercentiles?.A ?? 50;
}
export function getC(s: IntegrationScores): number {
  return s.ipip?.domainPercentiles?.C ?? 50;
}

// ─── SSEIT (EQ 0-100) ───────────────────────────────

export function getEQTotal(s: IntegrationScores): number {
  return s.sseit?.totalNormalized ?? 50;
}

export function getEQSub(s: IntegrationScores, key: string): number {
  return s.sseit?.subscaleNormalized?.[key] ?? 50;
}

/** Perception of Emotion */
export function getEQPerception(s: IntegrationScores): number {
  return getEQSub(s, 'perception') || getEQSub(s, 'Perception of Emotion');
}

/** Managing Own Emotions */
export function getEQManagingSelf(s: IntegrationScores): number {
  return getEQSub(s, 'managingOwn') || getEQSub(s, 'Managing Own Emotions');
}

/** Managing Others' Emotions */
export function getEQManagingOthers(s: IntegrationScores): number {
  return getEQSub(s, 'managingOthers') || getEQSub(s, "Managing Others' Emotions");
}

/** Utilization of Emotion */
export function getEQUtilization(s: IntegrationScores): number {
  return getEQSub(s, 'utilization') || getEQSub(s, 'Utilization of Emotion');
}

// ─── DSI-R (Differentiation 0-100) ──────────────────

export function getDSITotal(s: IntegrationScores): number {
  return s.dsir?.totalNormalized ?? 50;
}

export function getDSISub(s: IntegrationScores, key: string): number {
  return s.dsir?.subscaleScores?.[key]?.normalized ?? 50;
}

export function getReactivity(s: IntegrationScores): number {
  return getDSISub(s, 'emotionalReactivity');
}

export function getIPosition(s: IntegrationScores): number {
  return getDSISub(s, 'iPosition');
}

export function getFusion(s: IntegrationScores): number {
  return getDSISub(s, 'fusionWithOthers');
}

export function getCutoff(s: IntegrationScores): number {
  return getDSISub(s, 'emotionalCutoff');
}

// ─── DUTCH (Conflict 1-5 mean) ──────────────────────

export function getConflictStyle(s: IntegrationScores): string {
  return s.dutch?.primaryStyle ?? 'unknown';
}

export function getSecondaryStyle(s: IntegrationScores): string {
  return s.dutch?.secondaryStyle ?? 'unknown';
}

export function getDutchMean(s: IntegrationScores, key: string): number {
  return s.dutch?.subscaleScores?.[key]?.mean ?? 3;
}

export function getYielding(s: IntegrationScores): number {
  return getDutchMean(s, 'yielding');
}

export function getAvoiding(s: IntegrationScores): number {
  return getDutchMean(s, 'avoiding');
}

export function getForcing(s: IntegrationScores): number {
  return getDutchMean(s, 'forcing');
}

export function getProblemSolving(s: IntegrationScores): number {
  return getDutchMean(s, 'problemSolving');
}

export function getCompromising(s: IntegrationScores): number {
  return getDutchMean(s, 'compromising');
}

// ─── Values ─────────────────────────────────────────

export function getTopValues(s: IntegrationScores): string[] {
  return s.values?.top5Values ?? [];
}

export function getValueGap(s: IntegrationScores, value: string): number {
  return s.values?.domainScores?.[value]?.gap ?? 0;
}

export function getAvgValueGap(s: IntegrationScores): number {
  const domains = s.values?.domainScores;
  if (!domains) return 0;
  const gaps = Object.values(domains).map(d => d.gap);
  return gaps.length > 0 ? gaps.reduce((a, b) => a + b, 0) / gaps.length : 0;
}

export function getBiggestGapValue(s: IntegrationScores): { value: string; gap: number } | null {
  const domains = s.values?.domainScores;
  if (!domains) return null;
  let biggest = { value: '', gap: 0 };
  for (const [key, val] of Object.entries(domains)) {
    if (val.gap > biggest.gap) biggest = { value: key, gap: val.gap };
  }
  return biggest.gap > 0 ? biggest : null;
}

// ─── Availability Checks ────────────────────────────

/** Check if a domain has data available */
export function hasDomain(scores: IntegrationScores, domain: DomainId): boolean {
  const key = DOMAIN_SCORE_KEY[domain];
  return scores[key] != null;
}

/** Check if all selected domains have data */
export function allDomainsAvailable(scores: IntegrationScores, domains: DomainId[]): boolean {
  return domains.every(d => hasDomain(scores, d));
}

// ─── Thresholds & Labels ────────────────────────────

export function highLow(score: number, threshold: number): 'high' | 'low' {
  return score >= threshold ? 'high' : 'low';
}

export function anxietyLevel(s: IntegrationScores): 'high' | 'moderate' | 'low' {
  const a = getAnxiety(s);
  if (a >= 5) return 'high';
  if (a >= 3.5) return 'moderate';
  return 'low';
}

export function avoidanceLevel(s: IntegrationScores): 'high' | 'moderate' | 'low' {
  const a = getAvoidance(s);
  if (a >= 5) return 'high';
  if (a >= 3.5) return 'moderate';
  return 'low';
}
