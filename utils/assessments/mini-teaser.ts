/**
 * Mini-Teaser Generator
 *
 * After a user completes an assessment section, this generates a short,
 * motivating snapshot of their results — just enough to spark curiosity
 * and encourage them to keep going.
 *
 * Each teaser returns an icon name (from the app icon system), a warm
 * label, and a concrete one-line result summary.
 */

import { getECRRInterpretation } from '@/utils/assessments/interpretations/ecr-r';
import { getDUTCHInterpretation } from '@/utils/assessments/interpretations/dutch';
import { getIPIPDomainInterpretation } from '@/utils/assessments/interpretations/ipip-neo-120';
import { getSSEITLevel } from '@/utils/assessments/interpretations/sseit';
import { getDSIRLevel } from '@/utils/assessments/interpretations/dsi-r';

/** Icon names matching exported components from @/assets/graphics/icons */
export type TeaserIconName = 'heart' | 'masks' | 'sparkle' | 'anchor' | 'shield' | 'compass';

export interface MiniTeaser {
  iconName: TeaserIconName;
  label: string;
  detail: string;
}

/**
 * Generate a concrete mini-result snapshot from raw assessment scores.
 * Returns null for unknown assessment types or if scores are missing.
 */
export function generateMiniTeaser(
  assessmentType: string,
  scores: any,
): MiniTeaser | null {
  try {
    switch (assessmentType) {
      case 'ecr-r': {
        const style = scores?.attachmentStyle;
        if (!style) return null;
        const interp = getECRRInterpretation(style);
        return {
          iconName: 'heart',
          label: interp.warmLabel,
          detail: `Your attachment pattern is ${interp.warmLabel} — ${style === 'secure'
            ? 'you tend to feel safe reaching for closeness.'
            : style === 'anxious-preoccupied'
            ? 'you reach for connection strongly and need reassurance.'
            : style === 'dismissive-avoidant'
            ? 'you tend to create space and rely on yourself.'
            : 'you move between reaching and withdrawing.'}`,
        };
      }

      case 'ipip-neo-120': {
        const percs = scores?.domainPercentiles;
        if (!percs) return null;
        // Find top 2 most prominent traits (furthest from 50th percentile)
        const sorted = Object.entries(percs as Record<string, number>)
          .sort(([, a], [, b]) => Math.abs((b as number) - 50) - Math.abs((a as number) - 50));
        const [topDomain, topPerc] = sorted[0] as [string, number];
        const [secDomain] = sorted[1] as [string, number];
        const interp = getIPIPDomainInterpretation(topDomain, topPerc);
        const DOMAIN_LABELS: Record<string, string> = {
          neuroticism: 'Emotional Sensitivity',
          extraversion: 'Extraversion',
          openness: 'Openness',
          agreeableness: 'Agreeableness',
          conscientiousness: 'Conscientiousness',
        };
        return {
          iconName: 'masks',
          label: interp.warmLabel,
          detail: `Your strongest signature is ${DOMAIN_LABELS[topDomain] || topDomain} (${topPerc}th percentile), followed by ${DOMAIN_LABELS[secDomain] || secDomain}.`,
        };
      }

      case 'sseit': {
        const normalized = scores?.totalNormalized;
        if (normalized == null) return null;
        const level = getSSEITLevel(normalized);
        const subNorm = scores?.subscaleNormalized as Record<string, number> | undefined;
        let strongest = '';
        if (subNorm) {
          const top = Object.entries(subNorm).sort(([, a], [, b]) => b - a)[0];
          const SUB_LABELS: Record<string, string> = {
            perception: 'reading emotions',
            managingOwn: 'managing your own feelings',
            managingOthers: 'supporting others emotionally',
            utilization: 'using emotion as insight',
          };
          strongest = top ? ` — strongest in ${SUB_LABELS[top[0]] || top[0]}` : '';
        }
        return {
          iconName: 'sparkle',
          label: level.warmLabel,
          detail: `Emotional intelligence at ${normalized}%${strongest}. This shapes how you navigate closeness.`,
        };
      }

      case 'dsi-r': {
        const normalized = scores?.totalNormalized;
        if (normalized == null) return null;
        const level = getDSIRLevel(normalized);
        const subs = scores?.subscaleScores as Record<string, { normalized: number }> | undefined;
        let insight = '';
        if (subs) {
          const sorted = Object.entries(subs).sort(([, a], [, b]) => b.normalized - a.normalized);
          const SUB_LABELS: Record<string, string> = {
            emotionalReactivity: 'emotional steadiness',
            iPosition: 'knowing your own mind',
            emotionalCutoff: 'staying connected under stress',
            fusionWithOthers: 'maintaining boundaries',
          };
          insight = sorted[0] ? ` — strongest in ${SUB_LABELS[sorted[0][0]] || sorted[0][0]}` : '';
        }
        return {
          iconName: 'anchor',
          label: level.warmLabel,
          detail: `Self-differentiation at ${normalized}%${insight}.`,
        };
      }

      case 'dutch': {
        const primary = scores?.primaryStyle;
        const secondary = scores?.secondaryStyle;
        if (!primary) return null;
        const interp = getDUTCHInterpretation(primary);
        const SEC_LABELS: Record<string, string> = {
          yielding: 'peacekeeping',
          compromising: 'balancing',
          forcing: 'protecting',
          problemSolving: 'building solutions',
          avoiding: 'keeping calm',
        };
        return {
          iconName: 'shield',
          label: interp.warmLabel,
          detail: `In conflict you lead with ${interp.warmLabel.toLowerCase()}${secondary ? `, backed by ${SEC_LABELS[secondary] || secondary}` : ''}. Your portrait will show how this plays out.`,
        };
      }

      case 'values': {
        const top5 = scores?.top5Values;
        if (!top5 || top5.length === 0) return null;
        const topThree = top5.slice(0, 3).join(', ');
        return {
          iconName: 'compass',
          label: 'Your Core Values',
          detail: `What matters most: ${topThree}. These guide your choices in relationships.`,
        };
      }

      default:
        return null;
    }
  } catch {
    return null;
  }
}
