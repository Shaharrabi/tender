/**
 * GamePanel — Full-screen game experience for a couple course.
 *
 * Shows round prompts, choice cards, slider inputs, reveal cards,
 * turn indicators, progress pips, live scores, and completion.
 * Designed for two partners playing side-by-side (or remotely via Realtime).
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
  useWindowDimensions,
} from 'react-native';
import TenderText from '@/components/ui/TenderText';
import { Colors, Spacing, BorderRadius, FontFamilies, Shadows } from '@/constants/theme';
import { PersonIcon, ArrowRightIcon, CheckmarkIcon } from '@/assets/graphics/icons';
import { getCourseIcon } from './course-icons';
import {
  COURSE_NUMBER_LABELS,
  type CourseDefinition,
  type CourseRound,
} from '@/constants/course-data';
import type { CourseScores } from '@/hooks/useCourseSession';

interface GamePanelProps {
  course: CourseDefinition;
  currentRound: number;
  scores: CourseScores;
  onSelectChoice: (roundIndex: number, choiceIndex: number) => void;
  onSliderSubmit: (roundIndex: number, value: number) => void;
  onAdvance: () => void;
  onComplete: () => void;
  onClose: () => void;
  isPartnerOnline?: boolean;
}

export default function GamePanel({
  course,
  currentRound,
  scores,
  onSelectChoice,
  onSliderSubmit,
  onAdvance,
  onComplete,
  onClose,
  isPartnerOnline = false,
}: GamePanelProps) {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [sliderValue, setSliderValue] = useState(5);
  const [showReveal, setShowReveal] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();

  const round = course.rounds[currentRound];
  const totalRounds = course.rounds.length;
  const isLastRound = currentRound >= totalRounds - 1;
  const numberLabel = COURSE_NUMBER_LABELS[course.number - 1] ?? 'i';

  // Reset state when round changes
  useEffect(() => {
    setSelectedChoice(null);
    setSliderValue(5);
    setShowReveal(false);
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [currentRound]);

  const handleChoiceSelect = useCallback((index: number) => {
    setSelectedChoice(index);
    setShowReveal(true);
    onSelectChoice(currentRound, index);
  }, [currentRound, onSelectChoice]);

  const handleSliderComplete = useCallback((value: number) => {
    setSliderValue(Math.round(value));
    setShowReveal(true);
    onSliderSubmit(currentRound, Math.round(value));
  }, [currentRound, onSliderSubmit]);

  const handleNext = useCallback(() => {
    if (isLastRound) {
      setIsComplete(true);
      onComplete();
    } else {
      onAdvance();
    }
  }, [isLastRound, onAdvance, onComplete]);

  if (!round && !isComplete) return null;

  // ── Completion screen ──
  if (isComplete) {
    return (
      <ScrollView style={styles.panel} contentContainerStyle={styles.panelContent}>
        <CloseButton onClose={onClose} />

        <View style={styles.completeContainer}>
          <View style={styles.completeIcon}>
            {getCourseIcon(course.badge.icon, 44, Colors.accent)}
          </View>
          <TenderText variant="label" style={styles.completeTitle}>
            Course Complete
          </TenderText>
          <TenderText variant="headingS" style={styles.completeSub}>
            {course.subtitle}
          </TenderText>
          <TenderText variant="body" style={styles.completeWalked}>
            You walked this one together.
          </TenderText>

          {/* Badge */}
          <View style={styles.badge}>
            {getCourseIcon(course.badge.icon, 16, '#D4A843')}
            <TenderText variant="caption" style={styles.badgeName}>
              {course.badge.name}
            </TenderText>
          </View>
          <TenderText variant="caption" style={styles.badgeDesc}>
            {course.badge.description}
          </TenderText>

          {/* Final scores */}
          <ScoreBar scores={scores} />

          {/* Nuance integration note */}
          <View style={styles.nuanceNote}>
            <TenderText variant="bodySmall" style={styles.nuanceNoteText}>
              This course feeds into your couple portrait and the space between you. The patterns you named here are visible only to your relationship — and to Nuance, your AI coach, who will weave them into your ongoing journey.
            </TenderText>
          </View>

          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnGreen]} onPress={onClose} activeOpacity={0.7}>
            <TenderText variant="label" style={styles.actionBtnText}>return to courses</TenderText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ── Active round ──
  const turnIsA = round.turn === 'a' || round.turn === 'both';
  const turnIsB = round.turn === 'b' || round.turn === 'both';

  return (
    <ScrollView ref={scrollRef} style={styles.panel} contentContainerStyle={styles.panelContent}>
      <CloseButton onClose={onClose} />

      {/* Header */}
      <View style={styles.header}>
        <TenderText variant="caption" style={styles.headerLabel}>
          course {numberLabel}
        </TenderText>
        <TenderText variant="label" style={styles.headerTitle}>
          {course.title}
        </TenderText>
        <TenderText variant="bodySmall" style={styles.headerSub}>
          {course.subtitle}
        </TenderText>
      </View>

      {/* Turn Indicator */}
      <View style={styles.turnRow}>
        <View style={[styles.turnAvatar, styles.turnAvatarA, turnIsA && styles.turnAvatarActive]}>
          <PersonIcon size={16} color="#F2EDE4" />
        </View>
        {round.turn === 'both' ? (
          <TenderText variant="caption" style={styles.turnLabel}>together</TenderText>
        ) : (
          <View style={styles.turnArrow}>
            <ArrowRightIcon size={14} color={Colors.accent} />
          </View>
        )}
        <View style={[styles.turnAvatar, styles.turnAvatarB, turnIsB && styles.turnAvatarActive]}>
          <PersonIcon size={16} color="#F2EDE4" />
        </View>
      </View>

      {/* Progress Pips */}
      <View style={styles.pipsRow}>
        {Array.from({ length: totalRounds }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.pip,
              i < currentRound && styles.pipDone,
              i === currentRound && styles.pipCurrent,
            ]}
          />
        ))}
      </View>

      {/* Live Scores */}
      <ScoreBar scores={scores} />

      {/* Round Content */}
      <Animated.View style={[styles.roundContent, { opacity: fadeAnim }]}>
        <TenderText variant="caption" style={styles.roundLabel}>
          {round.label}
        </TenderText>
        <TenderText variant="headingS" style={styles.roundPrompt}>
          {round.prompt}
        </TenderText>

        {/* Choice cards */}
        {round.type === 'choice' && round.choices && (
          <View style={styles.choicesContainer}>
            {round.choices.map((choice, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.choiceCard, selectedChoice === i && styles.choiceCardSelected]}
                onPress={() => handleChoiceSelect(i)}
                activeOpacity={0.7}
                disabled={selectedChoice !== null}
              >
                <View style={styles.choiceIconWrap}>
                  {getCourseIcon(choice.icon, 22, selectedChoice === i ? Colors.accent : Colors.textSecondary)}
                </View>
                <TenderText variant="body" style={styles.choiceText}>
                  {choice.text}
                </TenderText>
                {selectedChoice === i && (
                  <View style={styles.choiceCheck}>
                    <CheckmarkIcon size={14} color={Colors.accent} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Slider input — tap numbered buttons 1-10 */}
        {round.type === 'slider' && round.sliderConfig && (
          <View style={styles.sliderContainer}>
            <View style={styles.sliderEnds}>
              <TenderText variant="caption" style={styles.sliderEndText}>{round.sliderConfig.min}</TenderText>
              <TenderText variant="caption" style={styles.sliderEndText}>{round.sliderConfig.max}</TenderText>
            </View>
            <View style={styles.sliderDots}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.sliderDot,
                    val <= sliderValue && styles.sliderDotActive,
                    val === sliderValue && styles.sliderDotCurrent,
                  ]}
                  onPress={() => {
                    setSliderValue(val);
                    handleSliderComplete(val);
                  }}
                  activeOpacity={0.7}
                >
                  <TenderText variant="caption" style={[
                    styles.sliderDotText,
                    val <= sliderValue && styles.sliderDotTextActive,
                  ]}>
                    {val}
                  </TenderText>
                </TouchableOpacity>
              ))}
            </View>
            <TenderText variant="headingXL" style={styles.sliderValue}>
              {sliderValue}
            </TenderText>
          </View>
        )}

        {/* Reveal card */}
        {showReveal && round.reveal && (
          <View style={styles.revealCard}>
            <View style={styles.revealIcon}>
              {getCourseIcon(round.reveal.icon, 28, Colors.textSecondary)}
            </View>
            <TenderText variant="label" style={styles.revealTitle}>
              {round.reveal.title}
            </TenderText>
            <TenderText variant="body" style={styles.revealText}>
              {round.reveal.text}
            </TenderText>
          </View>
        )}

        {/* Action button */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.actionBtn,
              round.turn === 'b' ? styles.actionBtnBlue :
              round.turn === 'both' ? styles.actionBtnGreen :
              styles.actionBtnPrimary,
            ]}
            onPress={handleNext}
            disabled={!showReveal && selectedChoice === null}
            activeOpacity={0.7}
          >
            <TenderText variant="label" style={styles.actionBtnText}>
              {isLastRound ? 'complete course' : 'continue'}
            </TenderText>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

// ── Sub-components ──

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <TouchableOpacity style={styles.closeBtn} onPress={onClose} accessibilityLabel="Close course">
      <TenderText variant="body" style={styles.closeBtnText}>✕</TenderText>
    </TouchableOpacity>
  );
}

function ScoreBar({ scores }: { scores: CourseScores }) {
  return (
    <View style={styles.scoresRow}>
      <View style={styles.scoreItem}>
        <TenderText variant="headingS" style={styles.scoreNum}>{scores.connection}</TenderText>
        <TenderText variant="caption" style={styles.scoreLbl}>connection</TenderText>
      </View>
      <View style={styles.scoreItem}>
        <TenderText variant="headingS" style={styles.scoreNum}>{scores.insight}</TenderText>
        <TenderText variant="caption" style={styles.scoreLbl}>insight</TenderText>
      </View>
      <View style={styles.scoreItem}>
        <TenderText variant="headingS" style={styles.scoreNum}>{scores.bids}</TenderText>
        <TenderText variant="caption" style={styles.scoreLbl}>bids met</TenderText>
      </View>
    </View>
  );
}

// ── Styles ──

const styles = StyleSheet.create({
  panel: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  panelContent: {
    paddingBottom: 60,
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 14,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeBtnText: {
    fontSize: 14,
    color: Colors.textMuted,
  },

  // Header
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerLabel: {
    fontSize: 8,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  headerTitle: {
    fontSize: 9,
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: Colors.text,
    marginTop: 6,
  },
  headerSub: {
    fontFamily: FontFamilies.accent,
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },

  // Turn indicator
  turnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.md,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  turnAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  turnAvatarA: {
    backgroundColor: '#D4909A',
  },
  turnAvatarB: {
    backgroundColor: '#8BA4B8',
  },
  turnAvatarActive: {
    transform: [{ scale: 1.12 }],
    shadowColor: Colors.accent,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  turnLabel: {
    fontSize: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  turnArrow: {
    width: 14,
    height: 14,
  },

  // Progress pips
  pipsRow: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    paddingTop: 14,
    paddingBottom: 6,
  },
  pip: {
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#E0D3CE',
  },
  pipDone: {
    backgroundColor: '#7A9E8E',
  },
  pipCurrent: {
    backgroundColor: Colors.accent,
  },

  // Scores
  scoresRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginTop: 8,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreNum: {
    fontFamily: FontFamilies.accent,
    fontSize: 20,
    color: Colors.accent,
  },
  scoreLbl: {
    fontSize: 7,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.textMuted,
    marginTop: 1,
  },

  // Round content
  roundContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  roundLabel: {
    fontSize: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 6,
  },
  roundPrompt: {
    fontFamily: FontFamilies.accent,
    fontSize: 15,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 14,
    paddingHorizontal: 6,
  },

  // Choices
  choicesContainer: {
    gap: 8,
    marginBottom: 14,
  },
  choiceCard: {
    backgroundColor: Colors.surface,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  choiceCardSelected: {
    borderColor: Colors.accent,
    backgroundColor: '#FFF0ED',
  },
  choiceIconWrap: {
    width: 22,
    height: 22,
    marginTop: 1,
  },
  choiceText: {
    flex: 1,
    fontFamily: FontFamilies.accent,
    fontSize: 12,
    color: Colors.text,
    lineHeight: 18,
  },
  choiceCheck: {
    width: 14,
    height: 14,
    marginLeft: 'auto',
    marginTop: 2,
  },

  // Slider
  sliderContainer: {
    alignItems: 'center',
    marginVertical: 8,
    marginBottom: 14,
  },
  sliderEnds: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 2,
    marginBottom: 4,
  },
  sliderEndText: {
    fontSize: 9,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  sliderDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
    paddingHorizontal: 4,
    marginVertical: 8,
  },
  sliderDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.backgroundAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderDotActive: {
    backgroundColor: '#E8D8D4',
    borderColor: '#D4909A',
  },
  sliderDotCurrent: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  sliderDotText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  sliderDotTextActive: {
    color: Colors.text,
  },
  sliderValue: {
    fontFamily: FontFamilies.accent,
    fontSize: 32,
    color: Colors.accent,
    marginTop: 8,
  },

  // Reveal card
  revealCard: {
    backgroundColor: Colors.backgroundAlt,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: 14,
    marginVertical: 10,
    alignItems: 'center',
  },
  revealIcon: {
    marginBottom: 6,
  },
  revealTitle: {
    fontSize: 8,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Colors.text,
  },
  revealText: {
    fontFamily: FontFamilies.accent,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: 6,
    textAlign: 'center',
  },

  // Action button
  actionRow: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  actionBtn: {
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: BorderRadius.md,
    minWidth: 160,
    alignItems: 'center',
  },
  actionBtnPrimary: {
    backgroundColor: '#C4616E',
  },
  actionBtnBlue: {
    backgroundColor: '#8BA4B8',
  },
  actionBtnGreen: {
    backgroundColor: '#7A9E8E',
  },
  actionBtnText: {
    fontSize: 9,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    color: '#fff',
    fontFamily: FontFamilies.body,
  },

  // Completion
  completeContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  completeIcon: {
    marginBottom: 10,
  },
  completeTitle: {
    fontSize: 9,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: Colors.text,
    marginBottom: 6,
  },
  completeSub: {
    fontFamily: FontFamilies.accent,
    color: Colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  completeWalked: {
    fontFamily: FontFamilies.accent,
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
    marginBottom: 14,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: '#D4A843',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  badgeName: {
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#D4A843',
  },
  badgeDesc: {
    marginTop: 6,
    fontSize: 10,
    color: Colors.textMuted,
  },
  nuanceNote: {
    backgroundColor: Colors.backgroundAlt,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: 14,
    marginTop: 16,
    marginBottom: 16,
  },
  nuanceNoteText: {
    fontFamily: FontFamilies.accent,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
});
