/**
 * Couple Narrative Block — Full narrative display with section headers
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { ChevronUpIcon, ChevronDownIcon } from '@/assets/graphics/icons';
import type { CoupleNarrative } from '@/types/couples';

interface CoupleNarrativeBlockProps {
  narrative: CoupleNarrative;
  partnerAName: string;
  partnerBName: string;
  /** When false, the opening section is omitted (used in Insights to avoid duplicating the Overview). */
  showOpening?: boolean;
}

interface NarrativeSectionProps {
  title: string;
  text: string;
  accentColor?: string;
  isFirst?: boolean;
}

function NarrativeSection({ title, text, accentColor = Colors.textMuted, isFirst }: NarrativeSectionProps) {
  const [expanded, setExpanded] = useState(!!isFirst);

  return (
    <TouchableOpacity
      style={styles.section}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${expanded ? 'Collapse' : 'Expand'}`}
      accessibilityState={{ expanded }}
    >
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionDot, { backgroundColor: accentColor }]} />
        <Text style={[styles.sectionTitle, { color: accentColor }]}>{title}</Text>
        {expanded
          ? <ChevronUpIcon size={14} color={accentColor} />
          : <ChevronDownIcon size={14} color={accentColor} />
        }
      </View>
      {expanded && (
        <Text style={styles.sectionText}>{text}</Text>
      )}
    </TouchableOpacity>
  );
}

export default function CoupleNarrativeBlock({
  narrative,
  partnerAName,
  partnerBName,
  showOpening = true,
}: CoupleNarrativeBlockProps) {
  return (
    <View style={styles.container}>
      {/* Opening — only shown when showOpening is true (skipped in Insights tab) */}
      {showOpening && (
        <View style={styles.openingSection}>
          <Text style={styles.openingText}>{narrative.opening}</Text>
        </View>
      )}

      <NarrativeSection
        title="The Field Between You"
        text={narrative.theField}
        accentColor={Colors.depth}
        isFirst
      />
      <NarrativeSection
        title="Your Dance"
        text={narrative.theDance}
        accentColor={Colors.primary}
      />
      <NarrativeSection
        title="What You Bring"
        text={narrative.whatYouBring}
        accentColor={Colors.accentGold}
      />
      <NarrativeSection
        title="Where You Meet"
        text={narrative.whereYouMeet}
        accentColor={Colors.success}
      />
      <NarrativeSection
        title="Where You Diverge"
        text={narrative.whereYouDiverge}
        accentColor={Colors.warning}
      />
      <NarrativeSection
        title="The Growth Edge"
        text={narrative.theEdge}
        accentColor={Colors.secondary}
      />

      {/* Closing — always fully visible */}
      <View style={styles.closingSection}>
        <Text style={styles.closingText}>{narrative.closing}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  openingSection: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  openingText: {
    ...Typography.body,
    color: Colors.text,
    lineHeight: 24,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    ...Typography.headingS,
    flex: 1,
  },
  sectionText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginTop: Spacing.sm,
    paddingLeft: Spacing.md + Spacing.sm,
  },
  closingSection: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  closingText: {
    ...Typography.bodySmall,
    color: Colors.text,
    fontStyle: 'italic' as const,
    lineHeight: 22,
  },
});
