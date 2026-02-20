/**
 * MC6 Progress Header — shows 5 lesson icons for "What Matters Most Together".
 * Completed = success color, Current = deep gold accent, Future = muted outline.
 * Includes an exit (x) button to leave the course.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies } from '@/constants/theme';
import { MC6_PALETTE } from '@/constants/mc6Theme';
import {
  HeartDoubleIcon,
  ScaleIcon,
  CompassIcon,
  CalendarIcon,
  StarIcon,
} from '@/assets/graphics/icons';

const LESSON_ICONS = [HeartDoubleIcon, ScaleIcon, CompassIcon, CalendarIcon, StarIcon];
const LESSON_LABELS = [
  'Values',
  'Tensions',
  'Compass',
  'Planner',
  'Check-In',
];

interface MC6ProgressHeaderProps {
  currentLesson: number; // 1-indexed
  totalLessons: number;
  onExit?: () => void;
  onPreviousLesson?: () => void;
}

export function MC6ProgressHeader({ currentLesson, totalLessons, onExit, onPreviousLesson }: MC6ProgressHeaderProps) {
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

            return (
              <React.Fragment key={i}>
                {i > 0 && (
                  <View
                    style={[
                      styles.connector,
                      isComplete && styles.connectorComplete,
                      isCurrent && styles.connectorCurrent,
                    ]}
                  />
                )}
                <View
                  style={[
                    styles.node,
                    isComplete && styles.nodeComplete,
                    isCurrent && styles.nodeCurrent,
                    !isComplete && !isCurrent && styles.nodeFuture,
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

        {/* Previous lesson button or spacer to balance exit button */}
        {onPreviousLesson ? (
          <TouchableOpacity
            style={styles.exitButton}
            onPress={onPreviousLesson}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.exitText}>{'\u2039'}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.exitSpacer} />
        )}
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
    backgroundColor: MC6_PALETTE.deepGold + '60',
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
    backgroundColor: MC6_PALETTE.deepGold,
    borderColor: MC6_PALETTE.deepGold,
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
