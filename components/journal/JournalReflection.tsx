/**
 * JournalReflection — Daily reflection section for the journal.
 *
 * Features three parts:
 *   1. Quick-tap mood/day tags (quick summary)
 *   2. Three WEARE-inspired reflection prompts
 *   3. Free-form journal text area
 *
 * Auto-saves as the user types (debounced).
 * Wes Anderson aesthetic: lobby blue accents, warm parchment, straight fonts.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import {
  PenIcon,
  SparkleIcon,
  CheckmarkIcon,
  HeartIcon,
  LinkIcon,
  DoveIcon,
  SeedlingIcon,
  MoonIcon,
  LightningIcon,
  WhiteHeartIcon,
  MirrorIcon,
  LeafIcon,
} from '@/assets/graphics/icons';
import type { IconProps } from '@/assets/graphics/icons';
import type { DailyReflection, QuestionResponse } from '@/services/journal';
import { SoundHaptics } from '@/services/SoundHapticsService';
import { useWritingTimer } from '@/utils/hooks/useWritingTimer';
import WritingMilestoneBanner from './WritingMilestoneBanner';

// ─── Constants ───────────────────────────────────────────

const JOURNAL_BLUE = Colors.secondary; // #7294D4

/** Quick-tap day summary tags — uses hand-drawn SVG icons */
const DAY_TAGS: { label: string; Icon: React.ComponentType<IconProps> }[] = [
  { label: 'Grateful', Icon: HeartIcon },
  { label: 'Connected', Icon: LinkIcon },
  { label: 'Peaceful', Icon: DoveIcon },
  { label: 'Hopeful', Icon: SeedlingIcon },
  { label: 'Tired', Icon: MoonIcon },
  { label: 'Stressed', Icon: LightningIcon },
  { label: 'Tender', Icon: WhiteHeartIcon },
  { label: 'Playful', Icon: SparkleIcon },
  { label: 'Reflective', Icon: MirrorIcon },
  { label: 'Growing', Icon: LeafIcon },
];

// ─── Props ───────────────────────────────────────────────

interface JournalReflectionProps {
  date: string; // YYYY-MM-DD
  questions: string[];
  reflection: DailyReflection | null;
  onSave: (reflection: Partial<DailyReflection>) => void;
  saving?: boolean;
  isToday: boolean;
}

// ─── Component ───────────────────────────────────────────

export default function JournalReflection({
  date,
  questions,
  reflection,
  onSave,
  saving = false,
  isToday,
}: JournalReflectionProps) {
  // Writing timer — tracks active writing time for milestone celebrations
  const {
    milestone,
    onFieldFocus,
    onFieldBlur,
    onTextChange,
    clearMilestone,
  } = useWritingTimer();

  // Local state
  const [selectedTags, setSelectedTags] = useState<string[]>(
    reflection?.dayTags || []
  );
  const [answers, setAnswers] = useState<string[]>(
    questions.map((q, i) => {
      const existing = reflection?.questionResponses?.find(
        (r) => r.question === q
      );
      return existing?.answer || '';
    })
  );
  const [freeText, setFreeText] = useState(reflection?.freeText || '');
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset state when date or reflection changes
  useEffect(() => {
    setSelectedTags(reflection?.dayTags || []);
    setFreeText(reflection?.freeText || '');
    setAnswers(
      questions.map((q) => {
        const existing = reflection?.questionResponses?.find(
          (r) => r.question === q
        );
        return existing?.answer || '';
      })
    );
  }, [date, reflection?.id]);

  // Debounced auto-save
  const triggerSave = useCallback(
    (overrides?: {
      tags?: string[];
      questionAnswers?: string[];
      text?: string;
    }) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

      saveTimerRef.current = setTimeout(() => {
        const tags = overrides?.tags ?? selectedTags;
        const qAnswers = overrides?.questionAnswers ?? answers;
        const text = overrides?.text ?? freeText;

        const questionResponses: QuestionResponse[] = questions
          .map((q, i) => ({
            question: q,
            answer: qAnswers[i] || '',
          }))
          .filter((r) => r.answer.trim().length > 0);

        onSave({
          reflectionDate: date,
          dayTags: tags,
          questionResponses,
          freeText: text,
        });
      }, 1200);
    },
    [selectedTags, answers, freeText, date, questions, onSave]
  );

  // Clean up timer
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  // ─── Tag toggle ──────────────────────────────────────

  const handleTagToggle = (tagLabel: string) => {
    SoundHaptics.tapSoft();
    const newTags = selectedTags.includes(tagLabel)
      ? selectedTags.filter((t) => t !== tagLabel)
      : [...selectedTags, tagLabel];
    setSelectedTags(newTags);
    triggerSave({ tags: newTags });
  };

  // ─── Question answer change ──────────────────────────

  const handleAnswerChange = (index: number, text: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = text;
    setAnswers(newAnswers);
    triggerSave({ questionAnswers: newAnswers });
    onTextChange(); // Track writing time
  };

  // ─── Free text change ────────────────────────────────

  const handleFreeTextChange = (text: string) => {
    setFreeText(text);
    triggerSave({ text });
    onTextChange(); // Track writing time
  };

  // ─── Read-only for past dates ────────────────────────

  const hasContent =
    selectedTags.length > 0 ||
    answers.some((a) => a.trim()) ||
    freeText.trim();

  if (!isToday && !hasContent) return null;

  // ─── Render ──────────────────────────────────────────

  return (
    <View style={styles.container}>
      {/* Writing Milestone Banner */}
      {milestone && isToday && (
        <WritingMilestoneBanner
          milestone={milestone}
          onDismiss={clearMilestone}
        />
      )}

      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBadge}>
            <PenIcon size={14} color={JOURNAL_BLUE} />
          </View>
          <Text style={styles.sectionHeader}>
            {isToday ? 'Reflect on Today' : 'Reflection'}
          </Text>
        </View>
        {saving && (
          <View style={styles.savingBadge}>
            <ActivityIndicator size="small" color={JOURNAL_BLUE} />
            <Text style={styles.savingText}>Saving...</Text>
          </View>
        )}
        {!saving && hasContent && (
          <View style={styles.savedBadge}>
            <CheckmarkIcon size={10} color={Colors.success} />
            <Text style={styles.savedText}>Saved</Text>
          </View>
        )}
      </View>

      {/* 1. Quick-tap mood tags */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>How was your day?</Text>
        <View style={styles.tagsWrap}>
          {DAY_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag.label);
            const TagIcon = tag.Icon;
            return (
              <TouchableOpacity
                key={tag.label}
                style={[styles.tag, isSelected && styles.tagSelected]}
                onPress={() => handleTagToggle(tag.label)}
                activeOpacity={0.7}
                disabled={!isToday}
              >
                <TagIcon
                  size={14}
                  color={isSelected ? JOURNAL_BLUE : Colors.textSecondary}
                />
                <Text
                  style={[
                    styles.tagLabel,
                    isSelected && styles.tagLabelSelected,
                  ]}
                >
                  {tag.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* 2. WEARE reflection questions */}
      <View style={styles.section}>
        <View style={styles.questionsHeader}>
          <SparkleIcon size={12} color={JOURNAL_BLUE} />
          <Text style={styles.sectionLabel}>Daily Reflection</Text>
        </View>
        {questions.map((question, index) => (
          <View key={index} style={styles.questionBlock}>
            <Text style={styles.questionText}>{question}</Text>
            <TextInput
              style={styles.answerInput}
              value={answers[index]}
              onChangeText={(text) => handleAnswerChange(index, text)}
              onFocus={onFieldFocus}
              onBlur={onFieldBlur}
              placeholder={isToday ? 'Tap to write...' : ''}
              placeholderTextColor={Colors.textMuted}
              multiline
              textAlignVertical="top"
              editable={isToday}
            />
          </View>
        ))}
      </View>

      {/* 3. Free-form journal */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Open Journal</Text>
        <TextInput
          style={styles.freeTextInput}
          value={freeText}
          onChangeText={handleFreeTextChange}
          onFocus={onFieldFocus}
          onBlur={onFieldBlur}
          placeholder={
            isToday
              ? 'Write anything on your mind — this is your space...'
              : ''
          }
          placeholderTextColor={Colors.textMuted}
          multiline
          textAlignVertical="top"
          editable={isToday}
        />
      </View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${JOURNAL_BLUE}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    fontFamily: 'Jost_500Medium',
    fontSize: FontSizes.headingM,
    color: Colors.text,
    letterSpacing: 0.5,
  },
  savingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  savingText: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.caption,
    color: JOURNAL_BLUE,
  },
  savedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    backgroundColor: `${Colors.success}12`,
    borderRadius: BorderRadius.pill,
  },
  savedText: {
    fontFamily: 'JosefinSans_500Medium',
    fontSize: 11,
    color: Colors.success,
    letterSpacing: 0.3,
  },

  // Sections
  section: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: JOURNAL_BLUE,
    ...Shadows.subtle,
  },
  sectionLabel: {
    fontFamily: 'Jost_500Medium',
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    letterSpacing: 0.3,
  },

  // Tags
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tagSelected: {
    backgroundColor: `${JOURNAL_BLUE}18`,
    borderColor: JOURNAL_BLUE,
  },
  tagLabel: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
  },
  tagLabelSelected: {
    color: JOURNAL_BLUE,
    fontFamily: 'JosefinSans_500Medium',
  },

  // Questions
  questionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  questionBlock: {
    gap: Spacing.xs,
  },
  questionText: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  answerInput: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.body,
    color: Colors.text,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    minHeight: 48,
    lineHeight: 22,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },

  // Free-form
  freeTextInput: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: FontSizes.body,
    color: Colors.text,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    minHeight: 100,
    lineHeight: 22,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
});
