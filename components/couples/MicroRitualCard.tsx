/**
 * MicroRitualCard — Daily couple micro-ritual card.
 *
 * Shows today's ritual: title, 30-second instruction, and a
 * "We did this" button that awards XP and marks completion for the day.
 *
 * Uses AsyncStorage for daily completion persistence (resets each day).
 * Styled in the Wes Anderson palette — warm, inviting, couple-centric.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import {
  Colors,
  Spacing,
  FontFamilies,
  FontSizes,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import {
  CoupleIcon,
  CheckmarkIcon,
  HeartDoubleIcon,
} from '@/assets/graphics/icons';
import type { CycleDynamic } from '@/types/couples';
import {
  selectDailyRitual,
  type DailyRitualResult,
} from '@/utils/couples/microRituals';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface MicroRitualCardProps {
  cycleDynamic: CycleDynamic | null;
  onAwardXP?: (source: any, sourceId?: string, description?: string) => void;
}

const STORAGE_KEY_PREFIX = 'micro_ritual_done_';

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export default function MicroRitualCard({
  cycleDynamic,
  onAwardXP,
}: MicroRitualCardProps) {
  const [result, setResult] = useState<DailyRitualResult | null>(null);
  const [isDone, setIsDone] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const ritual = selectDailyRitual(cycleDynamic);
    setResult(ritual);

    // Check if already completed today
    if (ritual) {
      const key = STORAGE_KEY_PREFIX + getTodayKey();
      AsyncStorage.getItem(key).then((val) => {
        if (val === ritual.ritual.id) setIsDone(true);
      });
    }
  }, [cycleDynamic]);

  const handleToggle = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded((prev) => !prev);
  }, []);

  const handleWeDidThis = useCallback(async () => {
    if (!result || isDone) return;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsDone(true);

    // Persist completion
    const key = STORAGE_KEY_PREFIX + getTodayKey();
    await AsyncStorage.setItem(key, result.ritual.id);

    // Award XP
    onAwardXP?.('daily_checkin', result.ritual.id, `Couple ritual: ${result.ritual.title}`);
  }, [result, isDone, onAwardXP]);

  if (!result) return null;

  const { ritual, isUniversal } = result;

  return (
    <Animated.View entering={FadeIn.duration(500)}>
      <TouchableOpacity
        style={styles.card}
        onPress={handleToggle}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`Couple ritual: ${ritual.title}`}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconCircle}>
              <HeartDoubleIcon size={16} color={Colors.secondary} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.sectionLabel}>TODAY\u2019S RITUAL</Text>
              <Text style={styles.title}>{ritual.title}</Text>
            </View>
          </View>
          <View style={styles.chevron}>
            <Text style={styles.chevronText}>{isExpanded ? '\u2303' : '\u2304'}</Text>
          </View>
        </View>

        {/* Expanded content */}
        {isExpanded && (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.expandedContent}>
            {/* Tag showing cycle-specific or universal */}
            <View style={styles.tagRow}>
              <View style={[styles.tag, isUniversal ? styles.universalTag : styles.specificTag]}>
                <CoupleIcon size={10} color={isUniversal ? Colors.textMuted : Colors.secondary} />
                <Text style={[styles.tagText, isUniversal ? styles.universalTagText : styles.specificTagText]}>
                  {isUniversal ? 'Every couple' : 'For your dance'}
                </Text>
              </View>
              <Text style={styles.durationTag}>30 seconds</Text>
            </View>

            {/* Instruction */}
            <Text style={styles.instruction}>{ritual.instruction}</Text>

            {/* "We did this" button */}
            <TouchableOpacity
              style={[styles.doneButton, isDone && styles.doneButtonCompleted]}
              onPress={handleWeDidThis}
              disabled={isDone}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={isDone ? 'Completed' : 'Mark as done'}
            >
              {isDone ? (
                <>
                  <CheckmarkIcon size={14} color={Colors.white} />
                  <Text style={styles.doneButtonTextCompleted}>We did this</Text>
                </>
              ) : (
                <>
                  <HeartDoubleIcon size={14} color={Colors.secondary} />
                  <Text style={styles.doneButtonText}>We did this</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.card,
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
    flex: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  sectionLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 1.2,
  },
  title: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.text,
  },
  chevron: {
    paddingLeft: Spacing.sm,
  },
  chevronText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  expandedContent: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  universalTag: {
    backgroundColor: Colors.background,
  },
  specificTag: {
    backgroundColor: Colors.secondary + '12',
  },
  tagText: {
    fontFamily: FontFamilies.body,
    fontSize: 11,
  },
  universalTagText: {
    color: Colors.textMuted,
  },
  specificTagText: {
    color: Colors.secondary,
  },
  durationTag: {
    fontFamily: FontFamilies.body,
    fontSize: 11,
    color: Colors.textMuted,
  },
  instruction: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.secondary + '40',
    backgroundColor: Colors.secondary + '08',
    marginTop: Spacing.xs,
  },
  doneButtonCompleted: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  doneButtonText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.secondary,
  },
  doneButtonTextCompleted: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.white,
  },
});
