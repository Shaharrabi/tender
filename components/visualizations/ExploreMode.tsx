/**
 * ExploreMode — Toggle + ephemeral state wrapper for "what if" exploration.
 *
 * Manages explored anxiety/avoidance values that never persist to DB.
 * Shows a safety banner, explore/reset controls, and dynamic insight text.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Switch,
} from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import {
  getExploreInsight,
  getStyleFromScores,
  getQuadrant,
} from '@/constants/connectionMatrix';
import { EyeIcon, RefreshIcon } from '@/assets/graphics/icons';
import { DimensionSlider } from './DimensionSlider';
import type { AttachmentStyle } from '@/types';

interface ExploreModeProps {
  anxietyScore: number;
  avoidanceScore: number;
  attachmentStyle: AttachmentStyle;
  exploredAnxiety: number | null;
  exploredAvoidance: number | null;
  isExploring: boolean;
  onToggleExplore: (exploring: boolean) => void;
  onExploreAnxiety: (value: number) => void;
  onExploreAvoidance: (value: number) => void;
  onReset: () => void;
}

export function ExploreMode({
  anxietyScore,
  avoidanceScore,
  attachmentStyle,
  exploredAnxiety,
  exploredAvoidance,
  isExploring,
  onToggleExplore,
  onExploreAnxiety,
  onExploreAvoidance,
  onReset,
}: ExploreModeProps) {
  // Insight text animation
  const insightOpacity = useRef(new Animated.Value(0)).current;
  const [insightText, setInsightText] = useState('');

  // Calculate explored style
  const exploredStyle =
    exploredAnxiety != null && exploredAvoidance != null
      ? getStyleFromScores(exploredAnxiety, exploredAvoidance)
      : attachmentStyle;

  // Update insight when quadrant changes
  useEffect(() => {
    if (!isExploring) {
      setInsightText('');
      insightOpacity.setValue(0);
      return;
    }

    const insight = getExploreInsight(attachmentStyle, exploredStyle);
    if (insight && insight !== insightText) {
      // Fade out, swap text, fade in
      Animated.timing(insightOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setInsightText(insight);
        Animated.timing(insightOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else if (!insight) {
      Animated.timing(insightOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setInsightText(''));
    }
  }, [isExploring, exploredStyle, attachmentStyle]);

  const displayAnxiety = exploredAnxiety ?? anxietyScore;
  const displayAvoidance = exploredAvoidance ?? avoidanceScore;

  const hasChanged =
    isExploring &&
    (Math.abs(displayAnxiety - anxietyScore) > 0.1 ||
      Math.abs(displayAvoidance - avoidanceScore) > 0.1);

  return (
    <View style={styles.container}>
      {/* Toggle bar */}
      <View style={styles.toggleBar}>
        <View style={styles.toggleLeft}>
          <EyeIcon size={18} color={isExploring ? Colors.primary : Colors.textMuted} />
          <Text style={[styles.toggleLabel, isExploring && styles.toggleLabelActive]}>
            Explore Mode
          </Text>
        </View>
        <Switch
          value={isExploring}
          onValueChange={onToggleExplore}
          trackColor={{ false: Colors.progressTrack, true: Colors.primary + '40' }}
          thumbColor={isExploring ? Colors.primary : Colors.border}
        />
      </View>

      {/* Safety banner */}
      {isExploring && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Exploring — your real scores are safe and unchanged
          </Text>
        </View>
      )}

      {/* Interactive sliders */}
      <View style={styles.sliders}>
        <DimensionSlider
          label="Attachment Anxiety"
          value={displayAnxiety}
          color={Colors.attachmentAnxious}
          interactive={isExploring}
          onValueChange={onExploreAnxiety}
        />
        <DimensionSlider
          label="Attachment Avoidance"
          value={displayAvoidance}
          color={Colors.attachmentAvoidant}
          interactive={isExploring}
          onValueChange={onExploreAvoidance}
        />
      </View>

      {/* Reset button */}
      {hasChanged && (
        <TouchableOpacity style={styles.resetButton} onPress={onReset} activeOpacity={0.7}>
          <RefreshIcon size={14} color={Colors.textSecondary} />
          <Text style={styles.resetText}>Reset to actual scores</Text>
        </TouchableOpacity>
      )}

      {/* Dynamic insight text */}
      {insightText ? (
        <Animated.View style={[styles.insightCard, { opacity: insightOpacity }]}>
          <Text style={styles.insightText}>{insightText}</Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  toggleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  toggleLabel: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.heading,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  toggleLabelActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  banner: {
    backgroundColor: Colors.accentCream + '30',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.accentCream + '50',
  },
  bannerText: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    color: Colors.warning,
    fontWeight: '500',
    textAlign: 'center',
  },
  sliders: {
    gap: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  resetText: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
  },
  insightCard: {
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  insightText: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
