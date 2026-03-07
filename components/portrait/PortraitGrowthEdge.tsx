import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import TenderText from '@/components/ui/TenderText';
import type { GrowthEdge } from '@/types';

interface Props {
  edge: GrowthEdge;
  index: number;
}

export default function PortraitGrowthEdge({ edge, index }: Props) {
  return (
    <View style={styles.container}>
      <TenderText variant="label" color={Colors.primary}>
        GROWTH EDGE {index}
      </TenderText>
      <TenderText variant="headingM">{edge.title}</TenderText>
      <TenderText variant="bodySmall" style={{ lineHeight: 22 }}>
        {edge.description}
      </TenderText>
      <TenderText
        variant="bodySmall"
        color={Colors.textSecondary}
        style={{ lineHeight: 20 }}
      >
        {edge.rationale}
      </TenderText>

      {edge.practices.length > 0 && (
        <View style={styles.practicesBlock}>
          <TenderText variant="bodyMedium">
            Practices
          </TenderText>
          {edge.practices.map((p, i) => (
            <TenderText
              key={i}
              variant="bodySmall"
              style={{ lineHeight: 22, paddingLeft: Spacing.sm }}
            >
              {i + 1}. {p}
            </TenderText>
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
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  practicesBlock: {
    marginTop: Spacing.sm,
    gap: 4,
  },
});
