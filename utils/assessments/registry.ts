import { AssessmentType, IndividualAssessmentType, DyadicAssessmentType, AssessmentConfig } from '@/types';
import { ecrRConfig } from './configs/ecr-r';
import { dutchConfig } from './configs/dutch';
import { sseitConfig } from './configs/sseit';
import { dsirConfig } from './configs/dsi-r';
import { ipipConfig } from './configs/ipip-neo-120';
import { valuesConfig } from './configs/values';
import { rdasConfig } from './configs/rdas';
import { dciConfig } from './configs/dci';
import { csi16Config } from './configs/csi-16';
import { relationalFieldConfig } from './configs/relational-field';
import { coupleFieldConfig } from './configs/couple-field';

const ASSESSMENT_REGISTRY: Record<string, AssessmentConfig> = {
  // Individual assessments
  'ecr-r': ecrRConfig,
  'dutch': dutchConfig,
  'sseit': sseitConfig,
  'dsi-r': dsirConfig,
  'ipip-neo-120': ipipConfig,
  'values': valuesConfig,
  // Dyadic assessments
  'rdas': rdasConfig,
  'dci': dciConfig,
  'csi-16': csi16Config,
  // Couple instruments (V2)
  'relational-field': relationalFieldConfig,
  'couple-field': coupleFieldConfig,
};

export function getAssessmentConfig(type: AssessmentType): AssessmentConfig {
  const config = ASSESSMENT_REGISTRY[type];
  if (!config) throw new Error(`Unknown assessment type: ${type}`);
  return config;
}

export function getAllAssessments(): AssessmentConfig[] {
  return ASSESSMENT_ORDER.map((type) => ASSESSMENT_REGISTRY[type]).filter(Boolean);
}

/** Returns only the 6 individual assessments. */
export function getIndividualAssessments(): AssessmentConfig[] {
  return INDIVIDUAL_ASSESSMENT_ORDER.map((type) => ASSESSMENT_REGISTRY[type]).filter(Boolean);
}

/** Returns only the 3 dyadic (relationship) assessments. */
export function getDyadicAssessments(): AssessmentConfig[] {
  return DYADIC_ASSESSMENT_ORDER.map((type) => ASSESSMENT_REGISTRY[type]).filter(Boolean);
}

/** Check if an assessment type is dyadic (relationship-level). */
export function isDyadicAssessment(type: AssessmentType): boolean {
  return DYADIC_ASSESSMENT_ORDER.includes(type as DyadicAssessmentType);
}

// ─── Order Constants ──────────────────────────────────

export const INDIVIDUAL_ASSESSMENT_ORDER: IndividualAssessmentType[] = [
  'ecr-r',
  'dutch',
  'sseit',
  'dsi-r',
  'ipip-neo-120',
  'values',
];

export const DYADIC_ASSESSMENT_ORDER: DyadicAssessmentType[] = [
  'rdas',
  'dci',
  'csi-16',
  'relational-field',
  'couple-field',
];

/** All assessments in recommended order (individual first, then dyadic). */
export const ASSESSMENT_ORDER: AssessmentType[] = [
  ...INDIVIDUAL_ASSESSMENT_ORDER,
  ...DYADIC_ASSESSMENT_ORDER,
];
