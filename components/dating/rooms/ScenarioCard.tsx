/**
 * ScenarioCard — Interactive date scenario for The Ballroom
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';

interface ScenarioCardProps {
  scenario: {
    title: string;
    setup: string;
    options: Array<{
      label: string;
      result: 'growth' | 'notice';
      feedback: string;
    }>;
  };
  index: number;
}

export default function ScenarioCard({ scenario, index }: ScenarioCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSelect = (optIndex: number) => {
    setSelected(optIndex);
    setShowFeedback(true);
  };

  const handleReset = () => {
    setSelected(null);
    setShowFeedback(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.topBar} />

      <Text style={styles.scenarioLabel}>Scenario {index + 1}</Text>
      <Text style={styles.title}>{scenario.title}</Text>
      <Text style={styles.setup}>{scenario.setup}</Text>

      <View style={styles.options}>
        {scenario.options.map((opt, i) => {
          const isSelected = selected === i;
          const isGrowth = opt.result === 'growth';

          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.optionButton,
                isSelected && {
                  borderWidth: 2,
                  borderColor: isGrowth ? Colors.success : Colors.accentGold,
                  backgroundColor: isGrowth ? `${Colors.success}11` : `${Colors.accentGold}11`,
                },
                showFeedback && !isSelected && styles.optionFaded,
              ]}
              onPress={() => handleSelect(i)}
              disabled={showFeedback}
              accessibilityRole="button"
              accessibilityLabel={`Option: ${opt.label}`}
              accessibilityState={{ disabled: showFeedback, selected: isSelected }}
            >
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {showFeedback && selected !== null && (
        <Animated.View entering={FadeIn.duration(400)}>
          <View
            style={[
              styles.feedbackBox,
              {
                backgroundColor:
                  scenario.options[selected].result === 'growth'
                    ? `${Colors.success}11`
                    : Colors.backgroundAlt,
                borderLeftColor:
                  scenario.options[selected].result === 'growth'
                    ? Colors.success
                    : Colors.accentGold,
              },
            ]}
          >
            <Text style={styles.feedbackText}>
              {scenario.options[selected].feedback}
            </Text>
            <TouchableOpacity onPress={handleReset} accessibilityRole="button" accessibilityLabel="Try again">
              <Text style={styles.tryAgain}>Try Again ↻</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.accentCream,
  },
  scenarioLabel: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 12,
    color: Colors.textMuted,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontWeight: '700',
    fontSize: 20,
    color: Colors.text,
    marginBottom: 12,
  },
  setup: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: Spacing.md,
  },
  options: {
    gap: 10,
  },
  optionButton: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceElevated,
  },
  optionFaded: {
    opacity: 0.5,
  },
  optionText: {
    ...Typography.body,
    color: Colors.text,
    lineHeight: 21,
  },
  optionTextSelected: {
    fontWeight: '600',
  },
  feedbackBox: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderLeftWidth: 3,
  },
  feedbackText: {
    ...Typography.body,
    color: Colors.text,
    lineHeight: 24,
  },
  tryAgain: {
    marginTop: 12,
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 13,
    color: Colors.primary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
