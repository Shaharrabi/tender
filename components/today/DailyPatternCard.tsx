/**
 * DailyPatternCard — Personalized daily insight card for the home screen.
 *
 * Shows one card per day based on the user's lowest portrait dimensions.
 * Includes a therapeutic insight, a micro-action, and an "I did this" button
 * that awards XP via the gamification system.
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Colors,
  Spacing,
  FontFamilies,
  FontSizes,
  BorderRadius,
  Shadows,
  Typography,
} from '@/constants/theme';
import {
  LightbulbIcon,
  CheckmarkIcon,
  SparkleIcon,
  ShieldIcon,
  WaveIcon,
  SeedlingIcon,
  CompassIcon,
  HandshakeIcon,
  EyeIcon,
} from '@/assets/graphics/icons';
import type { IconProps } from '@/assets/graphics/icons';
import type { IndividualPortrait } from '@/types/portrait';
import { selectDailyCard, type DailyCardResult } from '@/utils/daily/patternCardSelection';

/** Map dimension icon names to SVG components */
const DIMENSION_ICONS: Record<string, React.FC<IconProps>> = {
  shield: ShieldIcon,
  wave: WaveIcon,
  seedling: SeedlingIcon,
  lightbulb: LightbulbIcon,
  compass: CompassIcon,
  handshake: HandshakeIcon,
  eye: EyeIcon,
};

interface DailyPatternCardProps {
  portrait: IndividualPortrait | null;
  onAwardXP?: (source: any, sourceId?: string, description?: string, options?: { silent?: boolean }) => Promise<any>;
}

const COMPLETION_KEY_PREFIX = 'daily_pattern_done_';

function getCompletionKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${COMPLETION_KEY_PREFIX}${y}-${m}-${d}`;
}

function DailyPatternCard({
  portrait,
  onAwardXP,
}: DailyPatternCardProps) {
  const [didComplete, setDidComplete] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [checkedStorage, setCheckedStorage] = useState(false);

  const today = useMemo(() => new Date(), []);
  const result = useMemo(() => selectDailyCard(portrait, today), [portrait, today]);

  // Check if already completed today
  React.useEffect(() => {
    (async () => {
      try {
        const key = getCompletionKey(today);
        const done = await AsyncStorage.getItem(key);
        if (done === 'true') setDidComplete(true);
      } catch {}
      setCheckedStorage(true);
    })();
  }, [today]);

  const handleComplete = useCallback(async () => {
    if (didComplete || !result) return;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setDidComplete(true);

    // Persist completion
    try {
      const key = getCompletionKey(today);
      await AsyncStorage.setItem(key, 'true');
    } catch {}

    // Award XP via gamification
    if (onAwardXP) {
      try {
        await onAwardXP(
          'daily_checkin',
          result.card.id,
          `Daily pattern card: ${result.card.dimension}`
        );
      } catch {}
    }
  }, [didComplete, result, today, onAwardXP]);

  const handleToggleExpand = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded((prev) => !prev);
  }, []);

  // Don't render until we've checked storage and have a result
  if (!checkedStorage || !result) return null;

  const { card, dimensionLabel, dimensionIcon } = result;
  const DimensionIcon = DIMENSION_ICONS[dimensionIcon] ?? LightbulbIcon;

  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        onPress={handleToggleExpand}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Today's pattern insight for ${dimensionLabel}`}
        accessibilityState={{ expanded: isExpanded }}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconCircle}>
              <DimensionIcon size={16} color={Colors.accent} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.sectionLabel}>TODAY'S INSIGHT</Text>
              <Text style={styles.dimensionLabel}>{dimensionLabel}</Text>
            </View>
          </View>
          {didComplete && (
            <View style={styles.doneBadge}>
              <CheckmarkIcon size={12} color={Colors.success} />
              <Text style={styles.doneText}>Done</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* Insight — always visible */}
      <Text style={styles.insight}>{card.insight}</Text>

      {/* Expanded: micro-action + button */}
      {isExpanded && (
        <Animated.View entering={FadeInDown.duration(300)} style={styles.expandedContent}>
          {/* Divider */}
          <View style={styles.divider} />

          {/* Micro-action */}
          <View style={styles.actionRow}>
            <SparkleIcon size={14} color={Colors.accentGold} />
            <Text style={styles.actionLabel}>TRY TODAY</Text>
          </View>
          <Text style={styles.actionText}>{card.microAction}</Text>

          {/* "I did this" button */}
          {!didComplete ? (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleComplete}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Mark today's pattern card as done"
            >
              <CheckmarkIcon size={14} color={Colors.surfaceElevated} />
              <Text style={styles.completeButtonText}>I did this</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.completedRow}>
              <CheckmarkIcon size={14} color={Colors.success} />
              <Text style={styles.completedText}>
                Nice work — small steps change everything.
              </Text>
            </View>
          )}
        </Animated.View>
      )}

      {/* Tap hint when collapsed */}
      {!isExpanded && (
        <TouchableOpacity onPress={handleToggleExpand} activeOpacity={0.7}>
          <Text style={styles.tapHint}>Tap for today's micro-action →</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.card,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accent + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    gap: 1,
  },
  sectionLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  dimensionLabel: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: Colors.text,
  },
  doneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.success + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  doneText: {
    fontFamily: FontFamilies.body,
    fontSize: 11,
    color: Colors.success,
    fontWeight: '600',
  },
  insight: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  expandedContent: {
    gap: Spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 10,
    color: Colors.accentGold,
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  actionText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xs,
    alignSelf: 'flex-start',
  },
  completeButtonText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: Colors.surfaceElevated,
    fontWeight: '600',
  },
  completedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.xs,
  },
  completedText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.success,
    fontStyle: 'italic',
  },
  tapHint: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.accent,
    marginTop: 2,
  },
});

export default React.memo(DailyPatternCard);
