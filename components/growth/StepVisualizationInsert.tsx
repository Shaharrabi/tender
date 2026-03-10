/**
 * StepVisualizationInsert — Maps each step to its most relevant
 * portrait/couple visualization chart, embedding existing SVG
 * components inline in the step's READ tab.
 *
 * All data is pulled from existing databases/portraits — nothing new.
 * Gracefully returns null when required data is unavailable.
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
  Typography,
} from '@/constants/theme';

// Individual visualizations
import { AttachmentMatrix } from '@/components/visualizations/AttachmentMatrix';
import WindowOfTolerance from '@/components/visualizations/WindowOfTolerance';
import ConflictRose from '@/components/visualizations/ConflictRose';
import EQHeatmap from '@/components/visualizations/EQHeatmap';
import BigFiveBars from '@/components/visualizations/BigFiveBars';
import ValuesAlignment from '@/components/visualizations/ValuesAlignment';
import DifferentiationSpectrum from '@/components/visualizations/DifferentiationSpectrum';
import RadarChart from '@/components/visualizations/RadarChart';
import WaterfallChart from '@/components/visualizations/WaterfallChart';

// Couple visualizations
import DualRadarChart from '@/components/couple-portrait/DualRadarChart';
import AttachmentMatrixPlot from '@/components/couple-portrait/AttachmentMatrixPlot';
import CombinedCycleVisualization from '@/components/couple-portrait/CombinedCycleVisualization';

import type { IndividualPortrait } from '@/types/portrait';
import type {
  AttachmentStyle,
  ECRRScores,
  DUTCHScores,
  SSEITScores,
  DSIRScores,
  IPIPScores,
  ValuesScores,
} from '@/types/index';
import type {
  DeepCouplePortrait,
} from '@/types/couples';

// ─── Props ───────────────────────────────────────────────

type RawScoresMap = Record<string, { id: string; scores: any }> | null;

interface StepVisualizationInsertProps {
  stepNumber: number;
  portrait: IndividualPortrait | null;
  rawScores: RawScoresMap;
  couplePortrait: DeepCouplePortrait | null;
  isCoupled: boolean;
  phaseColor: string;
}

// ─── Score Extractors ────────────────────────────────────

function extractECRR(raw: RawScoresMap): ECRRScores | null {
  const s = raw?.['ecr-r']?.scores;
  if (!s || typeof s.anxietyScore !== 'number') return null;
  return s as ECRRScores;
}

function extractIPIP(raw: RawScoresMap): IPIPScores | null {
  const s = raw?.['ipip-neo-120']?.scores;
  if (!s?.domainScores) return null;
  return s as IPIPScores;
}

function extractDUTCH(raw: RawScoresMap): DUTCHScores | null {
  const s = raw?.['dutch']?.scores;
  if (!s?.subscaleScores) return null;
  return s as DUTCHScores;
}

function extractSSEIT(raw: RawScoresMap): SSEITScores | null {
  const s = raw?.['sseit']?.scores;
  if (!s?.totalScore) return null;
  return s as SSEITScores;
}

function extractDSIR(raw: RawScoresMap): DSIRScores | null {
  const s = raw?.['dsi-r']?.scores;
  if (!s?.subscaleScores) return null;
  return s as DSIRScores;
}

function extractValues(raw: RawScoresMap): ValuesScores | null {
  const s = raw?.['values']?.scores;
  if (!s?.domainScores) return null;
  return s as ValuesScores;
}

// ─── Step Label Map ──────────────────────────────────────

const STEP_VIZ_LABELS: Record<number, string> = {
  1: 'YOUR ATTACHMENT MAP',
  2: 'YOUR DIFFERENTIATION SPECTRUM',
  3: 'YOUR WINDOW OF TOLERANCE',
  4: 'YOUR EMOTIONAL LANDSCAPE',
  5: 'YOUR RELATIONAL RADAR',
  6: 'YOUR CONFLICT PATTERN',
  7: 'YOUR REGULATION ZONE',
  8: 'YOUR VALUES LANDSCAPE',
  9: 'YOUR DIMENSIONS',
  10: 'YOUR FULL RADAR',
  11: 'YOUR GROWTH RADAR',
  12: 'YOUR PERSONALITY SNAPSHOT',
};

// ─── Component ───────────────────────────────────────────

export default function StepVisualizationInsert({
  stepNumber,
  portrait,
  rawScores,
  couplePortrait,
  isCoupled,
  phaseColor,
}: StepVisualizationInsertProps) {
  // Build individual chart
  const individualChart = useMemo(() => {
    try {
      return renderIndividualChart(stepNumber, portrait, rawScores);
    } catch {
      return null;
    }
  }, [stepNumber, portrait, rawScores]);

  // Build couple chart
  const coupleChart = useMemo(() => {
    if (!isCoupled || !couplePortrait) return null;
    try {
      return renderCoupleChart(stepNumber, couplePortrait);
    } catch {
      return null;
    }
  }, [stepNumber, isCoupled, couplePortrait]);

  // Don't render if nothing to show
  if (!individualChart && !coupleChart) return null;

  const label = STEP_VIZ_LABELS[stepNumber] ?? 'YOUR PORTRAIT';

  return (
    <View style={[styles.card, { borderLeftColor: phaseColor }]}>
      <Text style={[styles.eyebrow, { color: phaseColor }]}>
        {label}
      </Text>
      {individualChart && (
        <View style={styles.chartContainer}>{individualChart}</View>
      )}
      {coupleChart && (
        <View style={styles.chartContainer}>
          <Text style={[styles.coupleLabel, { color: phaseColor }]}>
            TOGETHER
          </Text>
          {coupleChart}
        </View>
      )}
    </View>
  );
}

// ─── Chart Renderers ─────────────────────────────────────

function renderIndividualChart(
  step: number,
  portrait: IndividualPortrait | null,
  rawScores: RawScoresMap,
): React.ReactElement | null {
  switch (step) {
    // Step 1: Attachment — 2D matrix plot
    case 1: {
      const ecrr = extractECRR(rawScores);
      if (ecrr) {
        return (
          <AttachmentMatrix
            anxietyScore={ecrr.anxietyScore}
            avoidanceScore={ecrr.avoidanceScore}
            attachmentStyle={ecrr.attachmentStyle}
          />
        );
      }
      // Fallback: use composite scores if raw ECR-R not available
      if (portrait) {
        const anxiety = portrait.compositeScores.anxietyNorm ?? 50;
        const avoidance = portrait.compositeScores.avoidanceNorm ?? 50;
        // Derive attachment style from anxiety/avoidance thresholds
        const style: AttachmentStyle = anxiety > 50 && avoidance > 50 ? 'fearful-avoidant'
          : anxiety > 50 ? 'anxious-preoccupied'
          : avoidance > 50 ? 'dismissive-avoidant'
          : 'secure';
        return (
          <AttachmentMatrix
            anxietyScore={anxiety}
            avoidanceScore={avoidance}
            attachmentStyle={style}
          />
        );
      }
      return null;
    }

    // Step 2: Differentiation — fusion↔cutoff spectrum
    case 2: {
      const dsir = extractDSIR(rawScores);
      if (dsir && portrait) {
        return (
          <DifferentiationSpectrum
            dsirScores={dsir}
            compositeScores={portrait.compositeScores}
          />
        );
      }
      return null;
    }

    // Step 3: Window of Tolerance — 3-zone vertical
    case 3: {
      if (!portrait) return null;
      return <WindowOfTolerance compositeScores={portrait.compositeScores} />;
    }

    // Step 4: EQ + Regulation — EQ Heatmap
    case 4: {
      const sseit = extractSSEIT(rawScores);
      if (sseit) {
        return <EQHeatmap sseitScores={sseit} />;
      }
      return null;
    }

    // Step 5: See Together — individual radar as baseline
    case 5: {
      if (!portrait) return null;
      return <RadarChart scores={portrait.compositeScores} />;
    }

    // Step 6: Conflict — rose chart
    case 6: {
      const dutch = extractDUTCH(rawScores);
      if (dutch) {
        return <ConflictRose dutchScores={dutch} />;
      }
      return null;
    }

    // Step 7: Regulation — window reuse
    case 7: {
      if (!portrait) return null;
      return <WindowOfTolerance compositeScores={portrait.compositeScores} />;
    }

    // Step 8: Values — alignment bars
    case 8: {
      const values = extractValues(rawScores);
      if (values) {
        return <ValuesAlignment valuesScores={values} />;
      }
      return null;
    }

    // Step 9: Repair — waterfall of all dimensions
    case 9: {
      if (!portrait) return null;
      return <WaterfallChart compositeScores={portrait.compositeScores} />;
    }

    // Step 10: Build Rituals — full radar overview
    case 10: {
      if (!portrait) return null;
      return <RadarChart scores={portrait.compositeScores} />;
    }

    // Step 11: Growth Arc — radar (or delta if we had previous scores)
    case 11: {
      if (!portrait) return null;
      return <RadarChart scores={portrait.compositeScores} />;
    }

    // Step 12: Full Portrait — Big Five personality bars
    case 12: {
      const ipip = extractIPIP(rawScores);
      if (ipip) {
        return <BigFiveBars ipipScores={ipip} />;
      }
      // Fallback: full radar
      if (portrait) {
        return <RadarChart scores={portrait.compositeScores} />;
      }
      return null;
    }

    default:
      return null;
  }
}

function renderCoupleChart(
  step: number,
  cp: DeepCouplePortrait,
): React.ReactElement | null {
  const nameA = cp.partnerAName ?? 'Partner A';
  const nameB = cp.partnerBName ?? 'Partner B';

  switch (step) {
    // Step 1: Both partners on attachment grid
    case 1: {
      if (!cp.patternInterlock?.attachmentDynamic) return null;
      return (
        <AttachmentMatrixPlot
          attachmentDynamic={cp.patternInterlock.attachmentDynamic}
          partnerAName={nameA}
          partnerBName={nameB}
        />
      );
    }

    // Step 5: Dual radar overlay — see together
    case 5: {
      if (!cp.convergenceDivergence?.radarOverlap) return null;
      return (
        <DualRadarChart
          radarOverlap={cp.convergenceDivergence.radarOverlap}
          partnerAName={nameA}
          partnerBName={nameB}
        />
      );
    }

    // Step 6: Combined negative cycle
    case 6: {
      if (!cp.patternInterlock?.combinedCycle) return null;
      return (
        <CombinedCycleVisualization
          cycle={cp.patternInterlock.combinedCycle}
          partnerAName={nameA}
          partnerBName={nameB}
        />
      );
    }

    // Step 10: Couple radar overlay — building rituals together
    case 10: {
      if (!cp.convergenceDivergence?.radarOverlap) return null;
      return (
        <DualRadarChart
          radarOverlap={cp.convergenceDivergence.radarOverlap}
          partnerAName={nameA}
          partnerBName={nameB}
        />
      );
    }

    // Step 12: Couple radar — full portrait together
    case 12: {
      if (!cp.convergenceDivergence?.radarOverlap) return null;
      return (
        <DualRadarChart
          radarOverlap={cp.convergenceDivergence.radarOverlap}
          partnerAName={nameA}
          partnerBName={nameB}
        />
      );
    }

    default:
      return null;
  }
}

// ─── Styles ──────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 4,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadows.subtle,
  },
  eyebrow: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    letterSpacing: 1,
  },
  chartContainer: {
    alignItems: 'center',
    overflow: 'hidden',
  },
  coupleLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    letterSpacing: 1,
    marginBottom: Spacing.xs,
    alignSelf: 'flex-start',
  },
});
