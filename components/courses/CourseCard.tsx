/**
 * CourseCard — Grid card for a single course in the Courses tab.
 *
 * Shows course title, subtitle, description, tags, and completion state.
 * Tapping opens the game panel.
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import TenderText from '@/components/ui/TenderText';
import { Colors, Spacing, BorderRadius, Shadows, FontFamilies } from '@/constants/theme';
import { COURSE_TAG_COLORS, COURSE_NUMBER_LABELS, type CourseDefinition } from '@/constants/course-data';
import { getCourseIcon } from './course-icons';

interface CourseCardProps {
  course: CourseDefinition;
  isCompleted: boolean;
  onPress: () => void;
}

export default function CourseCard({ course, isCompleted, onPress }: CourseCardProps) {
  const numberLabel = COURSE_NUMBER_LABELS[course.number - 1] ?? 'i';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${course.title}. ${isCompleted ? 'Completed.' : 'Tap to begin.'}`}
    >
      {/* Course illustration area */}
      <View style={styles.illustrationArea}>
        <View style={styles.iconContainer}>
          {getCourseIcon(course.badge.icon, 40, Colors.textSecondary)}
        </View>
        <TenderText variant="caption" style={styles.courseSubtext}>
          {course.subtitle}
        </TenderText>
      </View>

      {/* Card footer */}
      <View style={styles.footer}>
        <TenderText variant="caption" style={styles.courseLabel}>
          course {numberLabel} · {course.tags.map(t => t.label).join(' + ')}
        </TenderText>
        <TenderText variant="headingS" style={styles.courseTitle}>
          {course.title}
        </TenderText>
        <TenderText variant="bodySmall" style={styles.courseDescription} numberOfLines={3}>
          {course.description}
        </TenderText>

        {/* Tags */}
        <View style={styles.tagRow}>
          {course.tags.map((tag, i) => {
            const colors = COURSE_TAG_COLORS[tag.colorKey];
            return (
              <View key={i} style={[styles.tag, { backgroundColor: colors.bg }]}>
                <TenderText variant="caption" style={[styles.tagText, { color: colors.text }]}>
                  {tag.label}
                </TenderText>
              </View>
            );
          })}
          {isCompleted ? (
            <View style={[styles.tag, styles.completedTag]}>
              <TenderText variant="caption" style={styles.completedTagText}>
                completed
              </TenderText>
            </View>
          ) : (
            <View style={[styles.tag, styles.liveTag]}>
              <TenderText variant="caption" style={styles.liveTagText}>
                live
              </TenderText>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.lg,
    borderWidth: 0.5,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.subtle,
  },
  illustrationArea: {
    height: 120,
    backgroundColor: Colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.md,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },
  courseSubtext: {
    marginTop: Spacing.xs,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    fontSize: 11,
  },
  footer: {
    padding: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
  },
  courseLabel: {
    fontSize: 7,
    letterSpacing: 2,
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  courseTitle: {
    fontSize: 14,
    color: Colors.text,
    fontStyle: 'italic',
    marginTop: 3,
    lineHeight: 20,
    fontFamily: FontFamilies.accent,
  },
  courseDescription: {
    fontSize: 10,
    color: Colors.textMuted,
    lineHeight: 15,
    marginTop: 4,
    fontFamily: FontFamilies.body,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
    marginTop: 6,
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 7,
    letterSpacing: 0.7,
  },
  liveTag: {
    backgroundColor: '#7A9E8E',
  },
  liveTagText: {
    fontSize: 7,
    letterSpacing: 0.7,
    color: '#fff',
  },
  completedTag: {
    backgroundColor: Colors.successLight,
  },
  completedTagText: {
    fontSize: 7,
    letterSpacing: 0.7,
    color: Colors.successDark,
  },
});
