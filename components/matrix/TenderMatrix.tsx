/**
 * TenderMatrix — Individual "Your Matrix" main container.
 *
 * The overview layer: all assessment results organized into a meaningful
 * relational architecture, not as separate test scores but as an integrated
 * story of who you are in love.
 *
 * Data sources (Addendum 1 — reconciled with real pipeline):
 *   - Raw assessment scores from allScores
 *   - Composite scores from portrait.compositeScores
 *   - No WEARE in individual mode (couple-only per Addendum 1)
 *
 * Confidence layer (Addendum 2):
 *   - high: 3+ source instruments converge
 *   - emerging: 2 sources
 *   - low: 1 source or derived only
 */

import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import TenderText from '@/components/ui/TenderText';
import MatrixDomain, { type MatrixDomainData } from './MatrixDomain';
import MatrixInvitation from './MatrixInvitation';
import { generateFoundationNarrative } from './narratives/foundation';
import { generateInstrumentNarrative } from './narratives/instrument';
import { generateNavigationNarrative } from './narratives/navigation';
import { generateStanceNarrative } from './narratives/stance';
import { generateConflictNarrative } from './narratives/conflict';
import { generateCompassNarrative } from './narratives/compass';
import { generateFieldNarrative } from './narratives/field';
import { generateOneInvitation } from './narratives/invitation';
import * as Labels from './constants/matrix-labels';
import type { ConfidenceLevel } from './constants/matrix-colors';
import { Colors, Spacing } from '@/constants/theme';
import type { IndividualPortrait } from '@/types/portrait';

// ─── Props ──────────────────────────────────────────

interface TenderMatrixProps {
  allScores: Record<string, { id: string; scores: any }>;
  portrait: IndividualPortrait;
}

// ─── Helpers ────────────────────────────────────────

function has(key: string, allScores: Record<string, any>): boolean {
  return !!allScores[key]?.scores;
}

function getConfidence(instruments: string[], allScores: Record<string, any>): ConfidenceLevel {
  const map: Record<string, string> = {
    'ECR-R': 'ecr-r',
    'IPIP Big Five': 'ipip-neo-120',
    'SSEIT': 'sseit',
    'DSI-R': 'dsi-r',
    'DUTCH': 'dutch',
    'Values': 'values',
    'RFAS': 'relational-field',
  };
  let count = 0;
  for (const inst of instruments) {
    const key = map[inst];
    if (key && has(key, allScores)) count++;
  }
  // Composites always available if portrait exists
  if (instruments.includes('Window of Tolerance')) count++;
  if (count >= 3) return 'high';
  if (count >= 2) return 'emerging';
  return 'low';
}

// ─── Component ──────────────────────────────────────

export default function TenderMatrix({ allScores, portrait }: TenderMatrixProps) {
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);

  const handleToggle = useCallback((id: string) => {
    setExpandedDomain(prev => prev === id ? null : id);
  }, []);

  // ── Extract raw scores ──
  const ecrr = allScores['ecr-r']?.scores;
  const ipip = allScores['ipip-neo-120']?.scores;
  const sseit = allScores['sseit']?.scores;
  const dsir = allScores['dsi-r']?.scores;
  const dutch = allScores['dutch']?.scores;
  const values = allScores['values']?.scores;
  const rfas = allScores['relational-field']?.scores;
  const cs = portrait.compositeScores;

  // ── Build domains ──
  const domains = useMemo<MatrixDomainData[]>(() => {
    const result: MatrixDomainData[] = [];

    // DOMAIN 1: THE FOUNDATION — "How you seek closeness"
    if (ecrr) {
      const narrative = generateFoundationNarrative({
        anxietyScore: ecrr.anxietyScore,
        avoidanceScore: ecrr.avoidanceScore,
        attachmentStyle: ecrr.attachmentStyle,
        windowWidth: cs.windowWidth,
      });
      result.push({
        id: 'foundation',
        title: 'How you seek closeness',
        subtitle: 'The Foundation',
        cells: [
          { label: 'Attachment', score: Labels.getAttachmentLabel(ecrr.attachmentStyle), descriptor: '', color: 'foundation' },
          { label: 'Anxiety', score: ecrr.anxietyScore.toFixed(1), descriptor: Labels.getAnxietyLabel(ecrr.anxietyScore), color: 'foundation' },
          { label: 'Avoidance', score: ecrr.avoidanceScore.toFixed(1), descriptor: Labels.getAvoidanceLabel(ecrr.avoidanceScore), color: 'foundation' },
          { label: 'Window', score: Math.round(cs.windowWidth), descriptor: Labels.getWindowLabel(cs.windowWidth), color: 'foundation' },
        ],
        narrative,
        color: 'foundation',
        confidence: getConfidence(narrative.instruments, allScores),
      });
    }

    // DOMAIN 2: THE INSTRUMENT — "Who you are in love"
    if (ipip) {
      const dp = ipip.domainPercentiles || {};
      const narrative = generateInstrumentNarrative({
        N: dp.N ?? dp.neuroticism ?? 50,
        E: dp.E ?? dp.extraversion ?? 50,
        O: dp.O ?? dp.openness ?? 50,
        A: dp.A ?? dp.agreeableness ?? 50,
        C: dp.C ?? dp.conscientiousness ?? 50,
        anxietyScore: ecrr?.anxietyScore ?? 3,
        avoidanceScore: ecrr?.avoidanceScore ?? 3,
        fusionNormalized: dsir?.subscaleScores?.fusionWithOthers?.normalized,
      });
      result.push({
        id: 'instrument',
        title: 'Who you are in love',
        subtitle: 'The Instrument',
        cells: [
          { label: 'Sensitivity', score: Math.round(dp.N ?? dp.neuroticism ?? 50), descriptor: Labels.getNeurotLabel(dp.N ?? dp.neuroticism ?? 50), color: 'instrument' },
          { label: 'Social energy', score: Math.round(dp.E ?? dp.extraversion ?? 50), descriptor: Labels.getExtraLabel(dp.E ?? dp.extraversion ?? 50), color: 'instrument' },
          { label: 'Openness', score: Math.round(dp.O ?? dp.openness ?? 50), descriptor: Labels.getOpenLabel(dp.O ?? dp.openness ?? 50), color: 'instrument' },
          { label: 'Warmth', score: Math.round(dp.A ?? dp.agreeableness ?? 50), descriptor: Labels.getAgreeLabel(dp.A ?? dp.agreeableness ?? 50), color: 'instrument' },
        ],
        narrative,
        color: 'instrument',
        confidence: getConfidence(narrative.instruments, allScores),
      });
    }

    // DOMAIN 3: THE NAVIGATION — "How you read the room"
    if (sseit) {
      const sn = sseit.subscaleNormalized || {};
      const dsirSub = dsir?.subscaleScores || {};
      const narrative = generateNavigationNarrative({
        perception: sn.perception ?? 50,
        managingOwn: sn.managingOwn ?? 50,
        managingOthers: sn.managingOthers ?? 50,
        utilization: sn.utilization ?? 50,
        fusionNormalized: dsirSub.fusionWithOthers?.normalized ?? 50,
        iPosition: dsirSub.iPosition?.normalized ?? 50,
        avoidingMean: dutch?.subscaleScores?.avoiding?.mean,
      });
      result.push({
        id: 'navigation',
        title: 'How you read the room',
        subtitle: 'The Navigation',
        cells: [
          { label: 'Perception', score: Math.round(sn.perception ?? 50), descriptor: Labels.getEQLabel(sn.perception ?? 50), color: 'navigation' },
          { label: 'Self-regulation', score: Math.round(sn.managingOwn ?? 50), descriptor: Labels.getEQLabel(sn.managingOwn ?? 50), color: 'navigation' },
          { label: 'Other-support', score: Math.round(sn.managingOthers ?? 50), descriptor: Labels.getEQLabel(sn.managingOthers ?? 50), color: 'navigation' },
          { label: 'Emotional use', score: Math.round(sn.utilization ?? 50), descriptor: Labels.getEQLabel(sn.utilization ?? 50), color: 'navigation' },
        ],
        narrative,
        color: 'navigation',
        confidence: getConfidence(narrative.instruments, allScores),
      });
    }

    // DOMAIN 4: THE STANCE — "How you hold your ground"
    if (dsir) {
      const sub = dsir.subscaleScores || {};
      const honestyGap = values?.domainScores?.honesty?.gap;
      const narrative = generateStanceNarrative({
        totalNormalized: dsir.totalNormalized ?? 50,
        emotionalReactivity: sub.emotionalReactivity?.normalized ?? 50,
        iPosition: sub.iPosition?.normalized ?? 50,
        emotionalCutoff: sub.emotionalCutoff?.normalized ?? 50,
        fusionWithOthers: sub.fusionWithOthers?.normalized ?? 50,
        anxietyScore: ecrr?.anxietyScore ?? 3,
        avoidanceScore: ecrr?.avoidanceScore ?? 3,
        honestyGap,
      });
      result.push({
        id: 'stance',
        title: 'How you hold your ground',
        subtitle: 'The Stance',
        cells: [
          { label: 'Differentiation', score: Math.round(dsir.totalNormalized ?? 50), descriptor: Labels.getDiffLabel(dsir.totalNormalized ?? 50), color: 'stance' },
          { label: 'Reactivity', score: Math.round(sub.emotionalReactivity?.normalized ?? 50), descriptor: Labels.getReactivityLabel(sub.emotionalReactivity?.normalized ?? 50), color: 'stance' },
          { label: 'I-position', score: Math.round(sub.iPosition?.normalized ?? 50), descriptor: Labels.getIPosLabel(sub.iPosition?.normalized ?? 50), color: 'stance' },
          { label: 'Fusion', score: Math.round(sub.fusionWithOthers?.normalized ?? 50), descriptor: Labels.getFusionLabel(sub.fusionWithOthers?.normalized ?? 50), color: 'stance' },
        ],
        narrative,
        color: 'stance',
        confidence: getConfidence(narrative.instruments, allScores),
      });
    }

    // DOMAIN 5: THE CONFLICT — "How you navigate conflict"
    if (dutch) {
      const sub = dutch.subscaleScores || {};
      const dp = ipip?.domainPercentiles || {};
      const narrative = generateConflictNarrative({
        primaryStyle: dutch.primaryStyle,
        secondaryStyle: dutch.secondaryStyle,
        yieldingMean: sub.yielding?.mean ?? 2.5,
        avoidingMean: sub.avoiding?.mean ?? 2.5,
        forcingMean: sub.forcing?.mean ?? 2.5,
        problemSolvingMean: sub.problemSolving?.mean ?? 2.5,
        compromisingMean: sub.compromising?.mean ?? 2.5,
        anxietyScore: ecrr?.anxietyScore ?? 3,
        avoidanceScore: ecrr?.avoidanceScore ?? 3,
        N: dp.N ?? dp.neuroticism,
        honestyImportance: values?.domainScores?.honesty?.importance,
      });
      result.push({
        id: 'conflict',
        title: 'How you navigate conflict',
        subtitle: 'The Conflict',
        cells: [
          { label: 'Primary style', score: Labels.getConflictStyleLabel(dutch.primaryStyle), descriptor: '', color: 'conflict' },
          { label: 'Secondary', score: Labels.getConflictStyleLabel(dutch.secondaryStyle), descriptor: '', color: 'conflict' },
          { label: 'Yielding', score: (sub.yielding?.mean ?? 0).toFixed(1), descriptor: Labels.getConflictMeanLabel(sub.yielding?.mean ?? 0), color: 'conflict' },
          { label: 'Avoiding', score: (sub.avoiding?.mean ?? 0).toFixed(1), descriptor: Labels.getConflictMeanLabel(sub.avoiding?.mean ?? 0), color: 'conflict' },
        ],
        narrative,
        color: 'conflict',
        confidence: getConfidence(narrative.instruments, allScores),
      });
    }

    // DOMAIN 6: THE COMPASS — "What matters most"
    if (values) {
      const ds = values.domainScores || {};
      // Find largest gap
      let largestGapDomain = '';
      let largestGap = 0;
      for (const [domain, scores] of Object.entries(ds)) {
        const s = scores as { gap: number };
        if (s.gap > largestGap) { largestGap = s.gap; largestGapDomain = domain; }
      }
      // Calculate overall alignment
      const gaps = Object.values(ds).map((s: any) => s.gap);
      const avgAlignment = gaps.length > 0
        ? ((gaps.reduce((a: number, g: number) => a + (10 - g), 0) / gaps.length) / 10) * 100
        : 50;

      const narrative = generateCompassNarrative({
        top5Values: values.top5Values || [],
        domainScores: ds,
        avoidanceTendency: values.avoidanceTendency ?? 0,
        balancedTendency: values.balancedTendency ?? 0,
        totalScenarios: (values.actionResponses?.length ?? 0) || 5,
        avoidingMean: dutch?.subscaleScores?.avoiding?.mean,
      });
      result.push({
        id: 'compass',
        title: 'What matters most',
        subtitle: 'The Compass',
        cells: [
          { label: 'Top value', score: (values.top5Values?.[0] || '\u2014'), descriptor: '', color: 'compass' },
          { label: 'Biggest gap', score: largestGapDomain || '\u2014', descriptor: largestGap > 0 ? `${largestGap.toFixed(1)} pts` : '', color: 'compass' },
          { label: 'Alignment', score: Math.round(avgAlignment), descriptor: Labels.getValuesAlignmentLabel(avgAlignment), color: 'compass' },
          { label: 'Action score', score: Labels.getActionLabel(values.avoidanceTendency ?? 0, (values.actionResponses?.length ?? 0) || 5), descriptor: '', color: 'compass' },
        ],
        narrative,
        color: 'compass',
        confidence: getConfidence(narrative.instruments, allScores),
      });
    }

    // DOMAIN 7: THE FIELD — Individual mode (RFAS only, no WEARE per Addendum 1)
    if (rfas) {
      const narrative = generateFieldNarrative({
        rfasTotalMean: rfas.totalMean,
        fieldRecognition: rfas.fieldRecognition,
        creativeTension: rfas.creativeTension,
        presenceAttunement: rfas.presenceAttunement,
        emergentOrientation: rfas.emergentOrientation,
      });
      result.push({
        id: 'field',
        title: 'The space between',
        subtitle: 'The Field',
        cells: [
          { label: 'Field awareness', score: (rfas.totalMean ?? 0).toFixed(1), descriptor: Labels.getEQLabel((rfas.totalMean ?? 0) / 7 * 100), color: 'field' },
          { label: 'Recognition', score: (rfas.fieldRecognition ?? 0).toFixed(1), descriptor: '', color: 'field' },
          { label: 'Presence', score: (rfas.presenceAttunement ?? 0).toFixed(1), descriptor: '', color: 'field' },
          { label: 'Emergence', score: (rfas.emergentOrientation ?? 0).toFixed(1), descriptor: '', color: 'field' },
        ],
        narrative,
        color: 'field',
        confidence: narrative.instruments.length > 0 ? 'emerging' : 'low',
      });
    }

    return result;
  }, [ecrr, ipip, sseit, dsir, dutch, values, rfas, cs, allScores]);

  // ── Invitation ──
  const invitation = useMemo(() => {
    if (!ecrr) return null;
    const dp = ipip?.domainPercentiles || {};
    const sn = sseit?.subscaleNormalized || {};
    const dsirSub = dsir?.subscaleScores || {};
    const dutchSub = dutch?.subscaleScores || {};

    return generateOneInvitation({
      attachmentStyle: ecrr.attachmentStyle,
      anxietyScore: ecrr.anxietyScore,
      avoidanceScore: ecrr.avoidanceScore,
      N: dp.N ?? dp.neuroticism ?? 50,
      O: dp.O ?? dp.openness ?? 50,
      perception: sn.perception ?? 50,
      differentiation: dsir?.totalNormalized ?? 50,
      iPosition: dsirSub.iPosition?.normalized ?? 50,
      fusionWithOthers: dsirSub.fusionWithOthers?.normalized ?? 50,
      primaryConflict: dutch?.primaryStyle ?? 'avoiding',
      yieldingMean: dutchSub.yielding?.mean ?? 2.5,
      avoidingMean: dutchSub.avoiding?.mean ?? 2.5,
      forcingMean: dutchSub.forcing?.mean ?? 2.5,
      problemSolvingMean: dutchSub.problemSolving?.mean ?? 2.5,
      windowWidth: cs.windowWidth,
      valuesCongruence: cs.valuesCongruence,
    });
  }, [ecrr, ipip, sseit, dsir, dutch, cs]);

  // ── Check minimum data ──
  const completedCount = Object.keys(allScores).length;
  if (completedCount < 1 || domains.length === 0) {
    return (
      <View style={styles.emptyState}>
        <TenderText variant="headingS" color={Colors.text} align="center">
          Your Matrix
        </TenderText>
        <TenderText variant="body" color={Colors.textSecondary} align="center" style={{ marginTop: Spacing.sm }}>
          Complete at least one assessment to see your relational matrix.
        </TenderText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TenderText variant="caption" style={styles.headerLabel}>
          TENDER INTEGRATED MAP
        </TenderText>
        <TenderText variant="bodySmall" color={Colors.textSecondary} align="center" style={styles.headerSubtitle}>
          Tap any domain to reveal the cross-instrument insight underneath
        </TenderText>
      </View>

      {/* Domain rows */}
      <View style={styles.domainList}>
        {domains.map((domain) => (
          <MatrixDomain
            key={domain.id}
            domain={domain}
            isExpanded={expandedDomain === domain.id}
            onToggle={handleToggle}
          />
        ))}
      </View>

      {/* The Invitation */}
      {invitation && (
        <MatrixInvitation text={invitation} />
      )}

      {/* Incomplete assessments hint */}
      {completedCount < 6 && (
        <View style={styles.hintBox}>
          <TenderText variant="caption" color={Colors.textSecondary} align="center">
            {6 - completedCount} more assessment{6 - completedCount > 1 ? 's' : ''} will deepen your matrix
          </TenderText>
        </View>
      )}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
  },
  headerLabel: {
    fontSize: 10,
    letterSpacing: 2.5,
    color: Colors.textMuted,
    fontFamily: 'Jost_500Medium',
  },
  headerSubtitle: {
    lineHeight: 20,
  },
  domainList: {
    gap: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
  },
  emptyState: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  hintBox: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
  },
});
