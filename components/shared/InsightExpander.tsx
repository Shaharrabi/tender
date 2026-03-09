/**
 * InsightExpander — Reusable "What this means" progressive disclosure.
 *
 * Verified imports:
 *   Colors.backgroundAlt = '#FAF0E6' (Linen)
 *   Colors.calm = '#6BA3A0' (Soft teal)
 *   Colors.textSecondary = '#6B5B5E'
 *   Spacing.xs = 4, Spacing.sm = 8, Spacing.md = 16
 *   BorderRadius.sm = 8
 *   TenderText variant="caption" → JosefinSans_300Light 13px
 *   TenderText variant="bodySmall" → JosefinSans_300Light 14px
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  LayoutAnimation,
  StyleSheet,
  Platform,
  UIManager,
} from 'react-native';
import TenderText from '@/components/ui/TenderText';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface InsightExpanderProps {
  text: string;
  accentColor?: string;
  label?: string;
  defaultExpanded?: boolean;
}

export default function InsightExpander({
  text,
  accentColor = Colors.calm,
  label = 'What this means',
  defaultExpanded = false,
}: InsightExpanderProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggle = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={toggle}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
      >
        <TenderText variant="caption" color={accentColor} style={styles.triggerText}>
          {expanded ? '\u25BE' : '\u25B8'} {label}
        </TenderText>
      </TouchableOpacity>

      {expanded && (
        <View style={[styles.content, { borderLeftColor: accentColor }]}>
          <TenderText variant="bodySmall" color={Colors.textSecondary} style={styles.contentText}>
            {text}
          </TenderText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.xs,
  },
  triggerText: {
    letterSpacing: 0.3,
  },
  content: {
    marginTop: Spacing.sm,
    paddingLeft: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingRight: Spacing.sm,
    backgroundColor: Colors.backgroundAlt,
    borderLeftWidth: 3,
    borderRadius: BorderRadius.sm,
  },
  contentText: {
    lineHeight: 22,
  },
});
