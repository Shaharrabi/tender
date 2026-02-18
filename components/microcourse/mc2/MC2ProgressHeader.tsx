/**
 * MC2 Progress Header — shows 5 lesson icons for "Your Nervous System in Love".
 * Completed = success color, Current = sage accent, Future = muted outline.
 * Includes an exit (x) button to leave the course.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies } from '@/constants/theme';
import { MC2_PALETTE } from '@/constants/mc2Theme';
import {
  CompassIcon,
  HeartPulseIcon,
  WindIcon,
  SunIcon,
  CoupleIcon,
} from '@/assets/graphics/icons';

const LESSON_ICONS = [CompassIcon, HeartPulseIcon, WindIcon, SunIcon, CoupleIcon];
const LESSON_LABELS = [
  'Window',
  'Signals',
  'Grounding',
  'Waking Up',
  'Together',
];

interface MC2ProgressHeaderProps {
  currentLesson: number; // 1-indexed
  totalLessons: number;
  onExit?: () => void;
}

export function MC2ProgressHeader({ currentLesson, totalLessons, onExit }: MC2ProgressHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {onExit ? (
          <TouchableOpacity
            style={styles.exitButton}
            onPress={onExit}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.exitText}>{'\u2715'}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.exitSpacer} />
        )}

        <View style={styles.row}>
          {LESSON_ICONS.slice(0, totalLessons).map((Icon, i) => {
            const lessonNum = i + 1;
            const isComplete = lessonNum < currentLesson;
            const isCurrent = lessonNum === currentLesson;
            const isFuture = lessonNum > currentLesson;

            return (
              <React.Fragment key={i}>
                {/* Connector line */}
                {i > 0 && (
                  <View
                    style={[
                      styles.connector,
                      isComplete && styles.connectorComplete,
                      isCurrent && styles.connectorCurrent,
                    ]}
                  />
                )}
                {/* Node */}
                <View
                  style={[
                    styles.node,
                    isComplete && styles.nodeComplete,
                    isCurrent && styles.nodeCurrent,
                    isFuture && styles.nodeFuture,
                  ]}
                >
                  <Icon
                    size={16}
                    color={
                      isComplete
                        ? Colors.textOnPrimary
                        : isCurrent
                          ? '#FFFFFF'
                          : Colors.textMuted
                    }
                  />
                </View>
              </React.Fragment>
            );
          })}
        </View>

        {/* Spacer to balance the exit button */}
        <View style={styles.exitSpacer} />
      </View>

      <Text style={styles.label}>
        Lesson {currentLesson} of {totalLessons}
        {'  \u2022  '}
        {LESSON_LABELS[currentLesson - 1] ?? ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exitButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  exitText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  exitSpacer: {
    width: 32,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connector: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.borderLight,
    maxWidth: 40,
  },
  connectorComplete: {
    backgroundColor: Colors.success,
  },
  connectorCurrent: {
    backgroundColor: MC2_PALETTE.sage + '60',
  },
  node: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
  },
  nodeComplete: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  nodeCurrent: {
    backgroundColor: MC2_PALETTE.sage,
    borderColor: MC2_PALETTE.sage,
  },
  nodeFuture: {
    backgroundColor: 'transparent',
    borderColor: Colors.border,
  },
  label: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
