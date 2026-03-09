/**
 * CollapsibleNarrative — Progressive disclosure for long narrative text.
 *
 * Shows the first ~120 characters + "Read more" link. Tapping expands
 * to full text with smooth animation. All content preserved — just
 * revealed progressively.
 *
 * Use this to wrap: lens narratives, synthesis patterns, growth edge
 * descriptions, partner guide sections — anywhere text exceeds ~3 lines.
 *
 * Verified: LayoutAnimation (same pattern as CollapsibleSection.tsx)
 *   Colors.textSecondary='#6B5B5E', Colors.primary='#6B7B9B'
 */

import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, LayoutAnimation, StyleSheet, Platform, UIManager } from 'react-native';
import TenderText from '@/components/ui/TenderText';
import { Colors, Spacing } from '@/constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CollapsibleNarrativeProps {
  /** Full text to display */
  text: string;
  /** Number of characters to show before collapsing (default: 140) */
  previewLength?: number;
  /** Text color (default: Colors.textSecondary) */
  color?: string;
  /** TenderText variant for the body (default: 'body') */
  variant?: 'body' | 'bodySmall' | 'bodyLarge';
  /** Link color for "Read more" (default: Colors.primary) */
  linkColor?: string;
  /** Start expanded */
  defaultExpanded?: boolean;
  /** Line height override */
  lineHeight?: number;
}

export default function CollapsibleNarrative({
  text,
  previewLength = 140,
  color = Colors.textSecondary,
  variant = 'body',
  linkColor = Colors.primary,
  defaultExpanded = false,
  lineHeight = 26,
}: CollapsibleNarrativeProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const needsCollapse = text.length > previewLength;

  const toggle = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  }, []);

  if (!needsCollapse) {
    return (
      <TenderText variant={variant} color={color} style={{ lineHeight }}>
        {text}
      </TenderText>
    );
  }

  const preview = text.slice(0, previewLength).replace(/\s+\S*$/, '') + '\u2026';

  return (
    <View>
      <TenderText variant={variant} color={color} style={{ lineHeight }}>
        {expanded ? text : preview}
      </TenderText>
      <TouchableOpacity
        onPress={toggle}
        activeOpacity={0.7}
        style={styles.linkContainer}
        accessibilityRole="button"
        accessibilityLabel={expanded ? 'Show less' : 'Read more'}
      >
        <TenderText variant="caption" color={linkColor} style={styles.link}>
          {expanded ? 'Show less \u25B4' : 'Read more \u25BE'}
        </TenderText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  linkContainer: {
    marginTop: Spacing.xs,
  },
  link: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
