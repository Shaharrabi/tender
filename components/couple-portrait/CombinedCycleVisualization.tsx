/**
 * Combined Cycle Visualization
 *
 * Shows the couple's combined negative cycle as a step-by-step cascade
 * with Partner A on the left, Partner B on the right, and field state
 * in the center.
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import {
  LightningIcon,
  ArrowRightIcon,
  FireIcon,
  SnowflakeIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@/assets/graphics/icons';
import type { CombinedCycle, CombinedTriggerStep } from '@/types/couples';

interface CombinedCycleVisualizationProps {
  cycle: CombinedCycle;
  partnerAName: string;
  partnerBName: string;
}

const STAGE_LABELS: Record<string, string> = {
  trigger: 'The Trigger',
  first_moves: 'First Moves',
  escalation: 'Escalation',
  aftermath: 'Aftermath',
};

const STAGE_ICON_COMPONENTS: Record<string, { icon: React.FC<{ size?: number; color?: string }>; color: string }> = {
  trigger: { icon: LightningIcon, color: Colors.warning },
  first_moves: { icon: ArrowRightIcon, color: Colors.textMuted },
  escalation: { icon: FireIcon, color: Colors.error },
  aftermath: { icon: SnowflakeIcon, color: Colors.calm },
};

function CascadeStep({
  step,
  partnerAName,
  partnerBName,
  isExpanded,
  onToggle,
}: {
  step: CombinedTriggerStep;
  partnerAName: string;
  partnerBName: string;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.stepCard}
      onPress={onToggle}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${STAGE_LABELS[step.stage] || step.stage}. ${isExpanded ? 'Collapse' : 'Expand'} details`}
      accessibilityState={{ expanded: isExpanded }}
    >
      {/* Stage header */}
      <View style={styles.stepHeader}>
        {(() => {
          const cfg = STAGE_ICON_COMPONENTS[step.stage];
          if (cfg) {
            const IconComp = cfg.icon;
            return <IconComp size={18} color={cfg.color} />;
          }
          return null;
        })()}
        <Text style={styles.stepTitle}>{STAGE_LABELS[step.stage] || step.stage}</Text>
        {isExpanded
          ? <ChevronUpIcon size={14} color={Colors.textMuted} />
          : <ChevronDownIcon size={14} color={Colors.textMuted} />
        }
      </View>

      {/* Field state — always visible */}
      <Text style={styles.fieldState}>{step.fieldState}</Text>

      {isExpanded && (
        <View style={styles.partnerRow}>
          {/* Partner A */}
          <View style={[styles.partnerColumn, styles.partnerAColumn]}>
            <Text style={[styles.partnerName, { color: Colors.primary }]}>{partnerAName}</Text>
            <Text style={styles.actionText}>{step.partnerA.action}</Text>
            <Text style={styles.internalText}>{step.partnerA.internal}</Text>
            <Text style={styles.sourceText}>{step.partnerA.dataSource}</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Partner B */}
          <View style={[styles.partnerColumn, styles.partnerBColumn]}>
            <Text style={[styles.partnerName, { color: Colors.secondary }]}>{partnerBName}</Text>
            <Text style={styles.actionText}>{step.partnerB.action}</Text>
            <Text style={styles.internalText}>{step.partnerB.internal}</Text>
            <Text style={styles.sourceText}>{step.partnerB.dataSource}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function CombinedCycleVisualization({
  cycle,
  partnerAName,
  partnerBName,
}: CombinedCycleVisualizationProps) {
  const [expandedStage, setExpandedStage] = useState<string | null>('trigger');

  const dynamicTitle = cycle.dynamic.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <View style={styles.container}>
      {/* Dynamic header */}
      <View style={styles.header}>
        <Text style={styles.dynamicLabel}>Your Dance</Text>
        <Text style={styles.dynamicType}>{dynamicTitle}</Text>
      </View>

      {/* Interlock description */}
      <Text style={styles.interlockText}>{cycle.interlockDescription}</Text>

      {/* Trigger cascade */}
      <View style={styles.cascadeContainer}>
        {cycle.triggerCascade.map((step) => (
          <CascadeStep
            key={step.stage}
            step={step}
            partnerAName={partnerAName}
            partnerBName={partnerBName}
            isExpanded={expandedStage === step.stage}
            onToggle={() => setExpandedStage(
              expandedStage === step.stage ? null : step.stage
            )}
          />
        ))}
      </View>

      {/* Strength in this dynamic */}
      <View style={styles.strengthCard}>
        <Text style={styles.strengthTitle}>The Gift in This Pattern</Text>
        <Text style={styles.strengthText}>{cycle.strengthInThisDynamic}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  dynamicLabel: {
    ...Typography.label,
    color: Colors.textMuted,
  },
  dynamicType: {
    ...Typography.headingL,
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  interlockText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  cascadeContainer: {
    gap: Spacing.sm,
  },
  stepCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadows.card,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  stepTitle: {
    ...Typography.headingS,
    color: Colors.text,
    flex: 1,
  },
  fieldState: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },
  partnerRow: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  partnerColumn: {
    flex: 1,
  },
  partnerAColumn: {
    borderLeftWidth: 2,
    borderLeftColor: Colors.primary,
    paddingLeft: Spacing.sm,
  },
  partnerBColumn: {
    borderLeftWidth: 2,
    borderLeftColor: Colors.secondary,
    paddingLeft: Spacing.sm,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.borderLight,
  },
  partnerName: {
    ...Typography.label,
    marginBottom: Spacing.xs,
  },
  actionText: {
    ...Typography.bodySmall,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  internalText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: Spacing.xs,
  },
  sourceText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
  },
  strengthCard: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.success,
  },
  strengthTitle: {
    ...Typography.label,
    color: Colors.success,
    marginBottom: Spacing.xs,
  },
  strengthText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
