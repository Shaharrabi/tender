/**
 * Couple Narrative Block — Full narrative display with section headers
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import type { CoupleNarrative } from '@/types/couples';

interface CoupleNarrativeBlockProps {
  narrative: CoupleNarrative;
  partnerAName: string;
  partnerBName: string;
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
    >
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionDot, { backgroundColor: accentColor }]} />
        <Text style={[styles.sectionTitle, { color: accentColor }]}>{title}</Text>
        <Text style={styles.expandIcon}>{expanded ? '\u25B2' : '\u25BC'}</Text>
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
}: CoupleNarrativeBlockProps) {
  return (
    <View style={styles.container}>
      {/* Opening — always fully visible */}
      <View style={styles.openingSection}>
        <Text style={styles.openingText}>{narrative.opening}</Text>
      </View>

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
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 15,
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
  expandIcon: {
    fontSize: 12,
    color: Colors.textMuted,
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
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 15,
    color: Colors.text,
    lineHeight: 24,
  },
});
