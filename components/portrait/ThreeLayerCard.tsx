/**
 * ThreeLayerCard — Reusable progressive disclosure card.
 *
 * Layer 1 (always visible): Icon + one-sentence insight + 2-3 key data points + "Go Deeper"
 * Layer 2 (tap to expand): Multi-paragraph narrative + optional embedded viz + confidence badge
 * Layer 3 (optional): Reflection prompts + clinical detail + "Export for Therapist"
 *
 * Uses Shadows.card for collapsed, Shadows.elevated for expanded.
 * Animated expand/collapse with LayoutAnimation.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import {
  Colors,
  Typography,
  Spacing,
  Shadows,
  BorderRadius,
  FontFamilies,
} from '@/constants/theme';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Icons
import ArrowRightIcon from '@/assets/graphics/icons/ArrowRightIcon';

// ─── Types ────────────────────────────────────────────

interface MetaItem {
  label: string;
  value: string;
}

interface ClinicalRow {
  label: string;
  value: string;
}

interface ThreeLayerCardProps {
  // Layer 1
  icon: React.ReactNode;
  iconColor?: string;
  title: string;
  essence: string; // one-sentence insight (italic quote)
  meta: MetaItem[]; // 2-3 key data points

  // Layer 2
  narrativeParagraphs?: string[];
  visualization?: React.ReactNode; // embedded chart component
  confidenceLabel?: string; // e.g. "Strong — confirmed by 4 assessments"
  confidenceLevel?: 'strong' | 'moderate' | 'emerging';

  // Layer 3
  reflectionQuestions?: string[];
  clinicalRows?: ClinicalRow[];
  onExportForTherapist?: () => void;
}

// ─── Confidence Badge ─────────────────────────────────

function ConfidenceBadge({
  label,
  level,
}: {
  label: string;
  level: 'strong' | 'moderate' | 'emerging';
}) {
  const colorMap = {
    strong: Colors.success,
    moderate: Colors.accentGold,
    emerging: Colors.secondary,
  };
  const color = colorMap[level];

  return (
    <View style={[styles.confidenceBadge, { borderColor: color + '30' }]}>
      <View style={[styles.confidenceDot, { backgroundColor: color }]} />
      <Text style={[styles.confidenceText, { color }]}>{label}</Text>
    </View>
  );
}

// ─── Component ────────────────────────────────────────

export default function ThreeLayerCard({
  icon,
  iconColor = Colors.primary,
  title,
  essence,
  meta,
  narrativeParagraphs,
  visualization,
  confidenceLabel,
  confidenceLevel = 'moderate',
  reflectionQuestions,
  clinicalRows,
  onExportForTherapist,
}: ThreeLayerCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [deepExpanded, setDeepExpanded] = useState(false);
  const hasLayer2 = !!(narrativeParagraphs?.length || visualization);
  const hasLayer3 = !!(reflectionQuestions?.length || clinicalRows?.length);

  const toggleExpanded = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => {
      if (prev) setDeepExpanded(false); // collapse layer 3 too
      return !prev;
    });
  }, []);

  const toggleDeep = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setDeepExpanded((prev) => !prev);
  }, []);

  return (
    <View style={[styles.card, expanded ? Shadows.elevated : Shadows.card]}>
      {/* === LAYER 1 (always visible) === */}
      <TouchableOpacity
        onPress={hasLayer2 ? toggleExpanded : undefined}
        activeOpacity={hasLayer2 ? 0.7 : 1}
        style={styles.layer1}
      >
        {/* Icon + Title row */}
        <View style={styles.headerRow}>
          <View style={[styles.iconCircle, { backgroundColor: iconColor + '15' }]}>
            {icon}
          </View>
          <Text style={styles.title}>{title}</Text>
        </View>

        {/* Essence quote */}
        <Text style={styles.essence}>{`"${essence}"`}</Text>

        {/* Meta items */}
        <View style={styles.metaRow}>
          {meta.map((item) => (
            <View key={item.label} style={styles.metaItem}>
              <Text style={styles.metaLabel}>{item.label}</Text>
              <Text style={styles.metaValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Go deeper CTA */}
        {hasLayer2 && (
          <View style={styles.goDeeper}>
            <Text style={styles.goDeeperText}>
              {expanded ? 'Show less' : 'Go deeper'}
            </Text>
            <ArrowRightIcon
              size={12}
              color={Colors.primary}
            />
          </View>
        )}
      </TouchableOpacity>

      {/* === LAYER 2 (expanded) === */}
      {expanded && hasLayer2 && (
        <View style={styles.layer2}>
          <View style={styles.layer2Divider} />

          {/* Narrative paragraphs */}
          {narrativeParagraphs?.map((p, i) => (
            <Text key={i} style={styles.narrativeParagraph}>
              {p}
            </Text>
          ))}

          {/* Embedded visualization */}
          {visualization && (
            <View style={styles.vizContainer}>{visualization}</View>
          )}

          {/* Confidence badge */}
          {confidenceLabel && (
            <ConfidenceBadge label={confidenceLabel} level={confidenceLevel} />
          )}

          {/* Go even deeper */}
          {hasLayer3 && (
            <TouchableOpacity
              onPress={toggleDeep}
              style={styles.goEvenDeeper}
              activeOpacity={0.7}
            >
              <Text style={styles.goEvenDeeperText}>
                {deepExpanded
                  ? 'Hide reflection & clinical detail'
                  : 'Go even deeper — reflection + clinical detail'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* === LAYER 3 (deep expanded) === */}
      {expanded && deepExpanded && hasLayer3 && (
        <View style={styles.layer3}>
          <View style={styles.layer3Divider} />

          {/* Reflection questions */}
          {reflectionQuestions && reflectionQuestions.length > 0 && (
            <>
              <Text style={styles.layer3Heading}>Reflection Questions</Text>
              {reflectionQuestions.map((q, i) => (
                <View key={i} style={styles.reflectionItem}>
                  <Text style={styles.reflectionNumber}>{i + 1}</Text>
                  <Text style={styles.reflectionQuestion}>{q}</Text>
                </View>
              ))}
            </>
          )}

          {/* Clinical detail */}
          {clinicalRows && clinicalRows.length > 0 && (
            <View style={styles.clinicalContainer}>
              <Text style={styles.clinicalLabel}>
                Clinical Detail (for your therapist)
              </Text>
              {clinicalRows.map((row, i) => (
                <View key={i} style={styles.clinicalRow}>
                  <Text style={styles.clinicalRowLabel}>{row.label}</Text>
                  <Text style={styles.clinicalRowValue}>{row.value}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Export button */}
          {onExportForTherapist && (
            <TouchableOpacity
              onPress={onExportForTherapist}
              style={styles.exportButton}
              activeOpacity={0.7}
            >
              <Text style={styles.exportButtonText}>Export for Therapist</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },

  // Layer 1
  layer1: {
    padding: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.headingS,
    color: Colors.text,
    flex: 1,
  },
  essence: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: Spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  metaItem: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  metaLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 1,
  },
  metaValue: {
    fontFamily: FontFamilies.body,
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text,
  },
  goDeeper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.xs,
  },
  goDeeperText: {
    fontFamily: FontFamilies.body,
    fontSize: 13,
    color: Colors.primary,
    letterSpacing: 0.3,
  },

  // Layer 2
  layer2: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  layer2Divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: Spacing.md,
  },
  narrativeParagraph: {
    ...Typography.body,
    color: Colors.text,
    marginBottom: Spacing.md,
    lineHeight: 24,
  },
  vizContainer: {
    marginVertical: Spacing.md,
  },
  confidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    marginTop: Spacing.xs,
  },
  confidenceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  confidenceText: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    fontWeight: '500',
  },
  goEvenDeeper: {
    marginTop: Spacing.md,
    alignSelf: 'flex-start',
  },
  goEvenDeeperText: {
    fontFamily: FontFamilies.body,
    fontSize: 13,
    color: Colors.primary,
    letterSpacing: 0.3,
  },

  // Layer 3
  layer3: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  layer3Divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: Spacing.md,
  },
  layer3Heading: {
    ...Typography.headingS,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  reflectionItem: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    paddingLeft: Spacing.xs,
  },
  reflectionNumber: {
    fontFamily: FontFamilies.accent,
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    width: 18,
  },
  reflectionQuestion: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
    lineHeight: 22,
    fontStyle: 'italic',
  },

  // Clinical detail
  clinicalContainer: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  clinicalLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  clinicalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  clinicalRowLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  clinicalRowValue: {
    fontFamily: FontFamilies.accent,
    fontSize: 12,
    color: Colors.text,
    fontWeight: '600',
  },

  // Export button
  exportButton: {
    marginTop: Spacing.md,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  exportButtonText: {
    ...Typography.buttonSmall,
    color: Colors.text,
  },
});
