/**
 * ChecklistStep — Tappable checkbox list.
 *
 * Renders a list of items with tap-to-check interaction.
 * Supports optional minimum selection before allowing "Next".
 * Each item can have optional subtext for additional context.
 *
 * Response captured as JSON: { checked: ["id1", "id3"] }
 *
 * Usage inside ExerciseFlow's StepRenderer:
 *   case 'checklist':
 *     return (
 *       <>
 *         {previousResponses.length > 0 && <PreviousResponses ... />}
 *         <ChecklistStep step={step} value={value} onChangeText={onChangeText} />
 *       </>
 *     );
 */

import React, { useState, useEffect, useCallback } from 'react';
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
import type { ExerciseStep } from '@/types/intervention';
import type { ChecklistConfig } from '@/types/interactive-step-types';
import { CheckmarkIcon } from '@/assets/graphics/icons';

// ─── Haptics ────────────────────────────────────────────
let triggerHaptic: (style?: string) => void = () => {};
try {
  const Haptics = require('expo-haptics');
  triggerHaptic = (style = 'Light') => {
    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle[style] ?? Haptics.ImpactFeedbackStyle.Light
    );
  };
} catch {}

interface ChecklistStepProps {
  step: ExerciseStep;
  value?: string;
  onChangeText?: (text: string) => void;
}

export default function ChecklistStep({
  step,
  value,
  onChangeText,
}: ChecklistStepProps) {
  const config = step.interactiveConfig as ChecklistConfig | undefined;
  const items = config?.items ?? [];
  const minRequired = config?.minRequired ?? 0;

  const [checked, setChecked] = useState<Set<string>>(new Set());

  // Restore from saved value
  useEffect(() => {
    if (value && checked.size === 0) {
      try {
        const parsed = JSON.parse(value);
        if (parsed.checked && Array.isArray(parsed.checked)) {
          setChecked(new Set(parsed.checked));
        }
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const serialize = useCallback(
    (ids: Set<string>) => {
      const checkedItems = items
        .filter((item) => ids.has(item.id))
        .map((item) => item.text);
      return JSON.stringify({
        checked: Array.from(ids),
        checkedLabels: checkedItems,
        count: ids.size,
      });
    },
    [items]
  );

  const handleToggle = (id: string) => {
    triggerHaptic('Light');
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      onChangeText?.(serialize(next));
      return next;
    });
  };

  if (!config || items.length === 0) {
    return (
      <View>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.content}>{step.content}</Text>
      </View>
    );
  }

  const metMinimum = checked.size >= minRequired;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>☐</Text>
        </View>
        <Text style={styles.title}>{step.title}</Text>
      </View>

      {step.content ? (
        <Text style={styles.content}>{step.content}</Text>
      ) : null}

      {/* Progress indicator */}
      {minRequired > 0 && (
        <Text style={[styles.progress, metMinimum && styles.progressMet]}>
          {checked.size} of {minRequired} minimum selected
          {metMinimum ? ' ✓' : ''}
        </Text>
      )}

      {/* Items */}
      <View style={styles.itemsContainer}>
        {items.map((item) => {
          const isChecked = checked.has(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.itemCard,
                isChecked && styles.itemCardChecked,
              ]}
              onPress={() => handleToggle(item.id)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`${item.text}${item.subtext ? '. ' + item.subtext : ''}`}
              accessibilityState={{ selected: isChecked }}
            >
              {/* Checkbox */}
              <View
                style={[
                  styles.checkbox,
                  isChecked && styles.checkboxChecked,
                ]}
              >
                {isChecked && (
                  <CheckmarkIcon size={14} color={Colors.textOnPrimary} />
                )}
              </View>

              {/* Text */}
              <View style={styles.itemTextContainer}>
                <Text
                  style={[
                    styles.itemText,
                    isChecked && styles.itemTextChecked,
                  ]}
                >
                  {item.text}
                </Text>
                {item.subtext && (
                  <Text style={styles.itemSubtext}>{item.subtext}</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Count summary */}
      {checked.size > 0 && (
        <Text style={styles.summary}>
          {checked.size} item{checked.size !== 1 ? 's' : ''} selected
        </Text>
      )}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 2,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E3EFE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
    color: '#4A6F50',
  },
  title: {
    fontSize: FontSizes.headingM,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  content: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 26,
    marginBottom: Spacing.xs,
  },

  // Progress
  progress: {
    fontSize: 12,
    fontFamily: 'Jost_500Medium',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  progressMet: {
    color: '#4A6F50',
  },

  // Items
  itemsContainer: {
    gap: Spacing.sm,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    gap: Spacing.md,
    ...Shadows.subtle,
  },
  itemCardChecked: {
    borderColor: '#4A6F50' + '60',
    backgroundColor: '#E3EFE5' + '40',
  },

  // Checkbox
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: '#4A6F50',
    borderColor: '#4A6F50',
  },

  // Text
  itemTextContainer: {
    flex: 1,
    gap: 2,
  },
  itemText: {
    fontSize: FontSizes.body,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.text,
    lineHeight: 22,
  },
  itemTextChecked: {
    fontFamily: 'JosefinSans_500Medium',
  },
  itemSubtext: {
    fontSize: FontSizes.caption,
    fontFamily: 'JosefinSans_300Light',
    color: Colors.textMuted,
    lineHeight: 18,
  },

  // Summary
  summary: {
    fontSize: 13,
    fontFamily: 'Jost_500Medium',
    color: '#4A6F50',
    textAlign: 'center',
    marginTop: Spacing.xs,
    letterSpacing: 0.5,
  },
});
