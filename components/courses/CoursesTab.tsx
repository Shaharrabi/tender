/**
 * CoursesTab — The courses grid + game overlay for the Couple Portal.
 *
 * Shows 4 course cards in a grid with live badges.
 * Tapping a card opens the full game panel as a modal overlay.
 * Uses useCourseSession for Supabase Realtime sync.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Platform,
  Animated,
  useWindowDimensions,
} from 'react-native';
import TenderText from '@/components/ui/TenderText';
import { Colors, Spacing, BorderRadius, FontFamilies } from '@/constants/theme';
import { COURSES, type CourseDefinition } from '@/constants/course-data';
import { useCourseSession, type CourseScores } from '@/hooks/useCourseSession';
import CourseCard from './CourseCard';
import GamePanel from './GamePanel';

interface CoursesTabProps {
  coupleId: string;
  userId: string;
}

export default function CoursesTab({ coupleId, userId }: CoursesTabProps) {
  const [completedCourses, setCompletedCourses] = useState<string[]>([]);
  const [activeCourse, setActiveCourse] = useState<CourseDefinition | null>(null);
  const { width } = useWindowDimensions();
  const isWide = width >= 640;

  const session = useCourseSession(
    coupleId,
    userId,
    activeCourse?.id ?? null,
  );

  // Load completed courses on mount
  useEffect(() => {
    session.getCompletedCourses().then(setCompletedCourses);
  }, [coupleId]);

  // ── Open course ──
  const handleOpenCourse = useCallback(async (course: CourseDefinition) => {
    setActiveCourse(course);
  }, []);

  // Start session when course is opened
  useEffect(() => {
    if (activeCourse && session.status === 'idle') {
      session.startSession();
    }
  }, [activeCourse]);

  // ── Close course ──
  const handleCloseCourse = useCallback(() => {
    session.resetSession();
    setActiveCourse(null);
    // Refresh completed list
    session.getCompletedCourses().then(setCompletedCourses);
  }, [session]);

  // ── Game callbacks ──
  const handleSelectChoice = useCallback((roundIndex: number, choiceIndex: number) => {
    session.submitResponse(roundIndex, 'choice', choiceIndex);
  }, [session]);

  const handleSliderSubmit = useCallback((roundIndex: number, value: number) => {
    session.submitResponse(roundIndex, 'slider', undefined, value);
  }, [session]);

  const handleAdvance = useCallback(() => {
    session.advanceRound();
  }, [session]);

  const handleComplete = useCallback(async () => {
    await session.completeCourse();
    if (activeCourse) {
      await session.earnBadge(activeCourse.badge.name);
    }
  }, [session, activeCourse]);

  return (
    <View style={styles.container}>
      {/* Section header */}
      <TenderText variant="caption" style={styles.sectionLabel}>
        Tender · Couple Portal
      </TenderText>
      <TenderText variant="headingS" style={styles.sectionTitle}>
        four courses to walk together
      </TenderText>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <TenderText variant="caption" style={styles.dividerSym}>✦</TenderText>
        <View style={styles.dividerLine} />
      </View>

      {/* Live badge */}
      <View style={styles.liveBadgeRow}>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
          <TenderText variant="caption" style={styles.liveBadgeText}>
            {session.isPartnerOnline ? 'both partners connected' : 'waiting for partner'}
          </TenderText>
        </View>
      </View>

      {/* Section subheader */}
      <View style={styles.subheaderRow}>
        <TenderText variant="caption" style={styles.subheaderText}>
          Live Courses · tap to begin together
        </TenderText>
      </View>

      {/* Course grid */}
      <View style={[styles.grid, isWide && styles.gridWide]}>
        {COURSES.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            isCompleted={completedCourses.includes(course.id)}
            onPress={() => handleOpenCourse(course)}
          />
        ))}
      </View>

      {/* Earned badges section */}
      {completedCourses.length > 0 && (
        <View style={styles.badgesSection}>
          <TenderText variant="caption" style={styles.badgesLabel}>
            earned badges
          </TenderText>
          <View style={styles.badgesRow}>
            {COURSES.filter(c => completedCourses.includes(c.id)).map(course => (
              <View key={course.id} style={styles.earnedBadge}>
                <TenderText variant="caption" style={styles.earnedBadgeText}>
                  {course.badge.name}
                </TenderText>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Game panel modal */}
      <Modal
        visible={!!activeCourse}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseCourse}
      >
        {activeCourse && (
          <GamePanel
            course={activeCourse}
            currentRound={session.currentRound}
            scores={session.scores}
            onSelectChoice={handleSelectChoice}
            onSliderSubmit={handleSliderSubmit}
            onAdvance={handleAdvance}
            onComplete={handleComplete}
            onClose={handleCloseCourse}
            isPartnerOnline={session.isPartnerOnline}
          />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.md,
  },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 4,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    textAlign: 'center',
    paddingBottom: 4,
  },
  sectionTitle: {
    fontFamily: FontFamilies.accent,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    marginHorizontal: 40,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerSym: {
    fontSize: 8,
    color: Colors.textMuted,
    marginHorizontal: 12,
    letterSpacing: 2,
    fontFamily: FontFamilies.accent,
  },
  liveBadgeRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 14,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7A9E8E',
  },
  liveBadgeText: {
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#2A5040',
  },
  subheaderRow: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    marginHorizontal: 20,
    marginBottom: 14,
    paddingBottom: 8,
    alignItems: 'center',
  },
  subheaderText: {
    fontSize: 9,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  grid: {
    gap: 16,
    paddingHorizontal: Spacing.md,
  },
  gridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
  },
  badgesSection: {
    marginTop: 24,
    alignItems: 'center',
  },
  badgesLabel: {
    fontSize: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Colors.textMuted,
    marginBottom: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  earnedBadge: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: '#D4A843',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  earnedBadgeText: {
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#D4A843',
  },
});
