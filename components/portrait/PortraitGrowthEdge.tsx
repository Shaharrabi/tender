import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes } from '@/constants/theme';
import type { GrowthEdge } from '@/types';

interface Props {
  edge: GrowthEdge;
  index: number;
}

export default function PortraitGrowthEdge({ edge, index }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>GROWTH EDGE {index}</Text>
      <Text style={styles.title}>{edge.title}</Text>
      <Text style={styles.description}>{edge.description}</Text>
      <Text style={styles.rationale}>{edge.rationale}</Text>

      {edge.practices.length > 0 && (
        <View style={styles.practicesBlock}>
          <Text style={styles.practicesLabel}>Practices</Text>
          {edge.practices.map((p, i) => (
            <Text key={i} style={styles.practice}>
              {i + 1}. {p}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  label: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1,
  },
  title: {
    fontSize: FontSizes.headingM,
    fontWeight: '600',
    color: Colors.text,
  },
  description: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
  },
  rationale: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  practicesBlock: {
    marginTop: Spacing.sm,
    gap: 4,
  },
  practicesLabel: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.text,
  },
  practice: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
    paddingLeft: Spacing.sm,
  },
});
