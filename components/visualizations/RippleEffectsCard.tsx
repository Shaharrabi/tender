/**
 * RippleEffectsCard — Shows predicted shifts when a dimension changes.
 *
 * Displays a list of downstream effects with:
 * - Arrow icon (up/down)
 * - Dimension name + assessment source
 * - Strength indicator dots
 * - Insight text (expandable)
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { ASSESSMENT_COLORS } from '@/constants/connectionMatrix';
import type { RippleEffect } from '@/utils/visualizations/rippleEffects';

interface RippleEffectsCardProps {
  effects: RippleEffect[];
  sourceDimension: string;
  changeDirection: 'increase' | 'decrease';
}

export function RippleEffectsCard({
  effects,
  sourceDimension,
  changeDirection,
}: RippleEffectsCardProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (effects.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ripple Effects</Text>
        <Text style={styles.headerSubtitle}>
          When {sourceDimension} {changeDirection === 'increase' ? 'increases' : 'decreases'}:
        </Text>
      </View>

      {effects.map((effect, i) => (
        <RippleRow
          key={`${effect.targetAssessment}-${effect.targetDimension}-${i}`}
          effect={effect}
          index={i}
          isExpanded={expandedIndex === i}
          onToggle={() => setExpandedIndex(expandedIndex === i ? null : i)}
          totalCount={effects.length}
        />
      ))}
    </View>
  );
}

// ─── Individual ripple row ─────────────────────────────

interface RippleRowProps {
  effect: RippleEffect;
  index: number;
  totalCount: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function RippleRow({ effect, index, totalCount, isExpanded, onToggle }: RippleRowProps) {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Staggered entrance
  useEffect(() => {
    const delay = index * 100;
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 1,
          friction: 8,
          tension: 60,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
  }, []);

  const color = ASSESSMENT_COLORS[effect.targetAssessment] || Colors.textMuted;
  const isUp = effect.predictedDirection === 'increase';

  return (
    <Animated.View
      style={[
        styles.row,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.rowContent}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        {/* Arrow */}
        <View style={[styles.arrowCircle, { backgroundColor: color + '20' }]}>
          <Text style={[styles.arrowText, { color }]}>
            {isUp ? '\u2191' : '\u2193'}
          </Text>
        </View>

        {/* Dimension info */}
        <View style={styles.rowInfo}>
          <Text style={styles.dimensionLabel}>{effect.targetDimensionLabel}</Text>
          <Text style={styles.assessmentLabel}>{effect.targetAssessmentLabel}</Text>
        </View>

        {/* Strength dots */}
        <View style={styles.strengthDots}>
          {[1, 2, 3].map((dot) => (
            <View
              key={dot}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    dot <= (effect.strength === 'strong' ? 3 : effect.strength === 'moderate' ? 2 : 1)
                      ? color
                      : Colors.progressTrack,
                },
              ]}
            />
          ))}
        </View>
      </TouchableOpacity>

      {/* Expandable insight */}
      {isExpanded && (
        <View style={[styles.insightExpanded, { borderLeftColor: color }]}>
          <Text style={styles.insightExpandedText}>{effect.insight}</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.subtle,
  },
  header: {
    gap: 2,
    marginBottom: Spacing.xs,
  },
  headerTitle: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.text,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  row: {
    gap: Spacing.xs,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 14,
    fontWeight: '700',
  },
  rowInfo: {
    flex: 1,
    gap: 1,
  },
  dimensionLabel: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    fontWeight: '500',
    color: Colors.text,
  },
  assessmentLabel: {
    fontSize: 10,
    fontFamily: FontFamilies.body,
    color: Colors.textMuted,
  },
  strengthDots: {
    flexDirection: 'row',
    gap: 3,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  insightExpanded: {
    marginLeft: 40,
    paddingLeft: Spacing.sm,
    borderLeftWidth: 2,
    paddingVertical: Spacing.xs,
  },
  insightExpandedText: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
