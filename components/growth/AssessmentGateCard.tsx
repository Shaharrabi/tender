/**
 * AssessmentGateCard — Blocks step completion until required assessments
 * are finished. Shown in the Complete tab (Tab 4) at gated steps.
 *
 * Unlike AssessmentNudgeCard (warm invitation), this is a firm but
 * compassionate gate — it prevents completion but explains why.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
  Typography,
} from '@/constants/theme';
import { LockIcon, CheckmarkIcon } from '@/assets/graphics/icons';
import TenderButton from '@/components/ui/TenderButton';
import type { StepAssessmentGate } from '@/utils/steps/twelve-steps';
import { ASSESSMENT_DISPLAY_NAMES } from '@/utils/unlockLogic';

// ─── Component ──────────────────────────────────────────

interface AssessmentGateCardProps {
  gate: StepAssessmentGate;
  /** Assessment IDs already completed by the user */
  completedAssessmentIds: string[];
  /** Phase accent color */
  phaseColor: string;
}

function AssessmentGateCard({
  gate,
  completedAssessmentIds,
  phaseColor,
}: AssessmentGateCardProps) {
  const router = useRouter();
  const completed = gate.assessmentIds.filter((id) =>
    completedAssessmentIds.includes(id),
  );
  const remaining = gate.assessmentIds.filter(
    (id) => !completedAssessmentIds.includes(id),
  );
  const total = gate.assessmentIds.length;

  const handlePress = () => {
    // Navigate to the first incomplete assessment
    if (remaining.length > 0) {
      // Check if it's a couple assessment — navigate to couple portal
      const coupleAssessments = ['rdas', 'dci', 'csi-16'];
      const isCoupleAssessment = coupleAssessments.includes(remaining[0]);
      if (isCoupleAssessment) {
        router.push('/(app)/partner' as any);
      } else {
        router.push({
          pathname: '/(app)/tender-assessment',
        } as any);
      }
    }
  };

  return (
    <View style={[styles.card, { borderLeftColor: phaseColor }]}>
      <View style={styles.header}>
        <View style={[styles.lockBadge, { backgroundColor: phaseColor + '20' }]}>
          <LockIcon size={16} color={phaseColor} />
        </View>
        <Text style={[styles.eyebrow, { color: phaseColor }]}>
          COMPLETE ASSESSMENTS TO CONTINUE
        </Text>
      </View>

      <Text style={styles.gateText}>{gate.gateText}</Text>

      {/* Progress dots */}
      <View style={styles.progressSection}>
        <Text style={styles.progressLabel}>
          {completed.length} of {total} completed
        </Text>
        <View style={styles.dotRow}>
          {gate.assessmentIds.map((id) => {
            const isDone = completedAssessmentIds.includes(id);
            return (
              <View
                key={id}
                style={[
                  styles.dot,
                  isDone
                    ? { backgroundColor: phaseColor }
                    : { backgroundColor: Colors.border },
                ]}
              >
                {isDone && <CheckmarkIcon size={8} color={Colors.white} />}
              </View>
            );
          })}
        </View>
      </View>

      {/* Remaining assessments list */}
      {remaining.length > 0 && (
        <View style={styles.remainingSection}>
          {remaining.map((id) => (
            <View key={id} style={styles.remainingItem}>
              <View style={[styles.smallDot, { backgroundColor: Colors.border }]} />
              <Text style={styles.remainingText}>
                {ASSESSMENT_DISPLAY_NAMES[id] || id}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.ctaRow}>
        <TenderButton
          title={gate.ctaLabel}
          onPress={handlePress}
          variant="primary"
          size="sm"
        />
      </View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 4,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.subtle,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  lockBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyebrow: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    letterSpacing: 1,
    flex: 1,
  },
  gateText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  progressSection: {
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  progressLabel: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  dotRow: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  remainingSection: {
    gap: 4,
    marginTop: Spacing.xs,
  },
  remainingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  smallDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  remainingText: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
  },
  ctaRow: {
    marginTop: Spacing.sm,
    alignItems: 'flex-start',
  },
});

export default React.memo(AssessmentGateCard);
