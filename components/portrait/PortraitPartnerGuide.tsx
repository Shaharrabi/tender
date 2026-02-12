import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes } from '@/constants/theme';
import type { PartnerGuide } from '@/types';

interface Props {
  guide: PartnerGuide;
}

export default function PortraitPartnerGuide({ guide }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Partner Guide</Text>
      <Text style={styles.sectionSubtitle}>
        What your partner needs to know to support you
      </Text>

      <Text style={styles.narrative}>{guide.whatToKnow}</Text>

      <ListBlock
        label="When I am struggling, I need..."
        items={guide.whenStrugglingINeed}
      />
      <ListBlock label="What helps" items={guide.whatHelps} />
      <ListBlock label="What does not help" items={guide.whatDoesntHelp} />
    </View>
  );
}

function ListBlock({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <View style={styles.listBlock}>
      <Text style={styles.listLabel}>{label}</Text>
      {items.map((item, i) => (
        <Text key={i} style={styles.bullet}>
          {'\u2022'} {item}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.headingL,
    fontWeight: '600',
    color: Colors.text,
  },
  sectionSubtitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
  },
  narrative: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 24,
  },
  listBlock: {
    gap: 4,
  },
  listLabel: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.text,
  },
  bullet: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
    paddingLeft: Spacing.sm,
  },
});
