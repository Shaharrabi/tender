/**
 * Mini-Teaser Generator
 *
 * After a user completes an assessment section, this generates a short,
 * motivating teaser of their results — just enough to spark curiosity
 * and encourage them to keep going.
 *
 * Each teaser returns an icon, a warm label, and a one-line detail.
 */

import { getECRRInterpretation } from '@/utils/assessments/interpretations/ecr-r';
import { getDUTCHInterpretation } from '@/utils/assessments/interpretations/dutch';
import { getIPIPDomainInterpretation } from '@/utils/assessments/interpretations/ipip-neo-120';
import { getSSEITLevel } from '@/utils/assessments/interpretations/sseit';
import { getDSIRLevel } from '@/utils/assessments/interpretations/dsi-r';

export interface MiniTeaser {
  icon: string;
  label: string;
  detail: string;
}

/**
 * Generate a motivating mini-result teaser from raw assessment scores.
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
          icon: '🔗',
          label: interp.warmLabel,
          detail: `Your connection style: ${interp.warmLabel}. Your full portrait will reveal much more.`,
        };
      }

      case 'ipip-neo-120': {
        const percs = scores?.domainPercentiles;
        if (!percs) return null;
        // Find the most prominent trait
        const sorted = Object.entries(percs as Record<string, number>)
          .sort(([, a], [, b]) => Math.abs((b as number) - 50) - Math.abs((a as number) - 50));
        const [topDomain, topPerc] = sorted[0] as [string, number];
        const interp = getIPIPDomainInterpretation(topDomain, topPerc);
        return {
          icon: '🎭',
          label: interp.warmLabel,
          detail: `Your strongest personality signature: ${interp.warmLabel}. There's more to discover.`,
        };
      }

      case 'sseit': {
        const normalized = scores?.totalNormalized;
        if (normalized == null) return null;
        const level = getSSEITLevel(normalized);
        return {
          icon: '💫',
          label: level.warmLabel,
          detail: `Your emotional awareness: ${level.warmLabel}. Your portrait will show how this shapes your relationships.`,
        };
      }

      case 'dsi-r': {
        const normalized = scores?.totalNormalized;
        if (normalized == null) return null;
        const level = getDSIRLevel(normalized);
        return {
          icon: '⚓',
          label: level.warmLabel,
          detail: `How you hold your ground: ${level.warmLabel}. More insights are coming together.`,
        };
      }

      case 'dutch': {
        const primary = scores?.primaryStyle;
        if (!primary) return null;
        const interp = getDUTCHInterpretation(primary);
        return {
          icon: '🛡️',
          label: interp.warmLabel,
          detail: `Your conflict style: ${interp.warmLabel}. Your portrait is almost complete.`,
        };
      }

      case 'values': {
        const top5 = scores?.top5Values;
        if (!top5 || top5.length === 0) return null;
        // Show top 2 values
        const topTwo = top5.slice(0, 2).join(' & ');
        return {
          icon: '🧭',
          label: 'Your Compass',
          detail: `What matters most to you: ${topTwo}. One more section to go.`,
        };
      }

      default:
        return null;
    }
  } catch {
    return null;
  }
}
