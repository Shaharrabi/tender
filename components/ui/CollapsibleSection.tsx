/**
 * CollapsibleSection — Shared accordion header for expandable sections.
 *
 * Used by step-detail.tsx, DailyRhythmSection, and any future
 * collapsible UI. Tap to toggle, smooth LayoutAnimation.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import {
  Colors,
  Spacing,
  Typography,
} from '@/constants/theme';
import { ChevronUpIcon, ChevronDownIcon } from '@/assets/graphics/icons';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  isExpanded: boolean;
  onToggle: () => void;
  accentColor?: string;
  children: React.ReactNode;
}

/** Reusable collapsible header + content wrapper */
export default function CollapsibleSection({
  title,
  subtitle,
  isExpanded,
  onToggle,
  accentColor = Colors.primary,
  children,
}: CollapsibleSectionProps) {
  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle();
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.header}
        onPress={handleToggle}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        accessibilityLabel={`${title}, ${isExpanded ? 'expanded' : 'collapsed'}`}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>{title}</Text>
          {subtitle && !isExpanded && (
            <Text style={styles.headerSubtitle}>{subtitle}</Text>
          )}
        </View>
        {isExpanded ? (
          <ChevronUpIcon size={18} color={accentColor} />
        ) : (
          <ChevronDownIcon size={18} color={accentColor} />
        )}
      </TouchableOpacity>
      {isExpanded && children}
    </View>
  );
}

/**
 * Standalone header component (for step-detail.tsx backward compatibility).
 * Does NOT wrap children — the caller controls visibility.
 */
export function CollapsibleHeader({
  title,
  subtitle,
  isExpanded,
  onToggle,
  phaseColor,
}: {
  title: string;
  subtitle?: string;
  isExpanded: boolean;
  onToggle: () => void;
  phaseColor: string;
}) {
  return (
    <TouchableOpacity
      style={styles.header}
      onPress={onToggle}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ expanded: isExpanded }}
      accessibilityLabel={`${title}, ${isExpanded ? 'expanded' : 'collapsed'}`}
    >
      <View style={styles.headerLeft}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle && !isExpanded && (
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        )}
      </View>
      {isExpanded ? (
        <ChevronUpIcon size={18} color={phaseColor} />
      ) : (
        <ChevronDownIcon size={18} color={phaseColor} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    paddingHorizontal: 2,
  },
  headerLeft: {
    flex: 1,
    gap: 2,
  },
  headerTitle: {
    ...Typography.headingS,
    color: Colors.text,
    fontSize: 15,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});
