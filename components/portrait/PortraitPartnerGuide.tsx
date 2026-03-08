import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import TenderText from '@/components/ui/TenderText';
import type { PartnerGuide } from '@/types';

interface Props {
  guide: PartnerGuide;
}

export default function PortraitPartnerGuide({ guide }: Props) {
  return (
    <View style={styles.container}>
      <TenderText variant="headingM">Partner Guide</TenderText>
      <TenderText variant="body" color={Colors.textSecondary}>
        What your partner needs to know to support you
      </TenderText>

      <TenderText variant="body" style={{ lineHeight: 24 }}>
        {guide.whatToKnow}
      </TenderText>

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
      <TenderText variant="headingS">
        {label}
      </TenderText>
      {items.map((item, i) => (
        <TenderText
          key={i}
          variant="body"
          style={{ lineHeight: 22, paddingLeft: Spacing.sm }}
        >
          {'\u2022'} {item}
        </TenderText>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  listBlock: {
    gap: 4,
  },
});
