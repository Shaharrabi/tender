/**
 * QuestionRenderer — shared question input component.
 *
 * Renders likert, text, choice, and ranking inputs based on question.inputType.
 * Used by both the standalone assessment screen and the Tender Assessment orchestrator.
 */

import React from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Colors, Spacing, FontSizes } from '@/constants/theme';
import AnimatedPressable from '@/components/ui/AnimatedPressable';
import type { GenericQuestion, LikertOption } from '@/types';

interface QuestionRendererProps {
  question: GenericQuestion;
  currentAnswer: any;
  onSelect: (value: any) => void;
  defaultLikertScale?: LikertOption[];
  /** Called after a likert/choice selection — lets the parent auto-advance */
  onAutoAdvance?: () => void;
}

export default function QuestionRenderer({
  question,
  currentAnswer,
  onSelect,
  defaultLikertScale,
  onAutoAdvance,
}: QuestionRendererProps) {
  return (
    <View>
      {/* Likert */}
      {question.inputType === 'likert' && (question.likertScale || defaultLikertScale) && (() => {
        const scale = question.likertScale || defaultLikertScale!;
        const showScrollHint = Platform.OS === 'web' && scale.length >= 5 && currentAnswer == null;
        return (
        <View style={styles.likertSection} accessibilityRole="radiogroup" accessibilityLabel={question.text || 'Likert scale question'}>
          {showScrollHint && (
            <Text style={styles.scrollHint}>Scroll down to see all {scale.length} options</Text>
          )}
          {scale.map((item) => (
            <AnimatedPressable
              key={item.value}
              style={[
                styles.likertOption,
                currentAnswer === item.value && styles.likertOptionSelected,
              ]}
              onPress={() => { onSelect(item.value); onAutoAdvance?.(); }}
              accessibilityRole="radio"
              accessibilityLabel={`${item.label}, option ${item.value} of ${scale.length}`}
              accessibilityState={{ selected: currentAnswer === item.value }}
            >
              <View
                style={[
                  styles.radio,
                  currentAnswer === item.value && styles.radioSelected,
                ]}
              >
                {currentAnswer === item.value && <View style={styles.radioInner} />}
              </View>
              <Text
                style={[
                  styles.likertLabel,
                  currentAnswer === item.value && styles.likertLabelSelected,
                ]}
              >
                {item.value} — {item.label}
              </Text>
            </AnimatedPressable>
          ))}
        </View>
        );
      })()}

      {/* Text */}
      {question.inputType === 'text' && (
        <View style={styles.textInputSection}>
          <RNTextInput
            style={styles.textInput}
            placeholder={question.placeholder || 'Type your response...'}
            placeholderTextColor={Colors.textSecondary}
            value={currentAnswer || ''}
            onChangeText={onSelect}
            multiline
            maxLength={question.charLimit || 500}
            textAlignVertical="top"
            accessibilityRole="text"
            accessibilityLabel={question.placeholder || 'Type your response'}
          />
          <Text
            style={styles.charCount}
            accessibilityLabel={`${(currentAnswer || '').length} of ${question.charLimit || 500} characters used`}
            accessibilityRole="text"
          >
            {(currentAnswer || '').length}/{question.charLimit || 500}
          </Text>

          {/* Suggested quality chips */}
          {question.suggestedChips && question.suggestedChips.length > 0 && (
            <View style={styles.chipsSection}>
              <Text style={styles.chipsHint}>
                No pressure to write — you can also tap qualities below to add them:
              </Text>
              <View style={styles.chipsWrap}>
                {question.suggestedChips.map((chip) => {
                  const current: string = currentAnswer || '';
                  // Check if chip is already in the text (case-insensitive)
                  const isAdded = current.toLowerCase().includes(chip.toLowerCase());
                  return (
                    <TouchableOpacity
                      key={chip}
                      style={[styles.chip, isAdded && styles.chipSelected]}
                      activeOpacity={0.7}
                      onPress={() => {
                        if (isAdded) return; // Already added
                        const separator = current.length > 0
                          ? (current.endsWith(' ') || current.endsWith(', ') ? '' : ', ')
                          : '';
                        const newVal = current + separator + chip;
                        if (newVal.length <= (question.charLimit || 500)) {
                          onSelect(newVal);
                        }
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`Add "${chip}"${isAdded ? ' (already added)' : ''}`}
                      accessibilityState={{ selected: isAdded }}
                    >
                      <Text style={[styles.chipText, isAdded && styles.chipTextSelected]}>
                        {chip}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </View>
      )}

      {/* Choice */}
      {question.inputType === 'choice' && question.choices && (
        <View style={styles.choiceSection} accessibilityRole="radiogroup" accessibilityLabel={question.text || 'Multiple choice question'}>
          {question.choices.map((choice, choiceIndex) => (
            <AnimatedPressable
              key={choice.key}
              style={[
                styles.choiceOption,
                currentAnswer === choice.key && styles.choiceOptionSelected,
              ]}
              onPress={() => { onSelect(choice.key); onAutoAdvance?.(); }}
              accessibilityRole="radio"
              accessibilityLabel={`${choice.text}, option ${choiceIndex + 1} of ${question.choices!.length}`}
              accessibilityState={{ selected: currentAnswer === choice.key }}
            >
              <View style={[
                styles.choiceKeyBadge,
                currentAnswer === choice.key && styles.choiceKeyBadgeSelected,
              ]}>
                <Text
                  style={[
                    styles.choiceKey,
                    currentAnswer === choice.key && styles.choiceKeySelected,
                  ]}
                >
                  {choice.key}
                </Text>
              </View>
              <Text
                style={[
                  styles.choiceText,
                  currentAnswer === choice.key && styles.choiceTextSelected,
                ]}
              >
                {choice.text}
              </Text>
            </AnimatedPressable>
          ))}
        </View>
      )}

      {/* Ranking */}
      {question.inputType === 'ranking' && question.rankingItems && (
        <View style={styles.rankingSection} accessibilityLabel={`${question.text || 'Ranking question'}. Tap items in order of importance. Tap again to remove.`}>
          <Text style={styles.rankingHint} accessibilityRole="text">
            Tap items in order of importance (1st, 2nd, 3rd...). Tap again to remove.
          </Text>
          {question.rankingItems.map((item) => {
            const ranked = (currentAnswer as string[]) || [];
            const position = ranked.indexOf(item.id);
            const isSelected = position !== -1;
            const isFull = ranked.length >= (question.rankCount || 5);
            return (
              <AnimatedPressable
                key={item.id}
                style={[
                  styles.rankingItem,
                  isSelected && styles.rankingItemSelected,
                  !isSelected && isFull && styles.rankingItemDisabled,
                ]}
                disabled={!isSelected && isFull}
                onPress={() => {
                  if (isSelected) {
                    onSelect(ranked.filter((id: string) => id !== item.id));
                  } else {
                    onSelect([...ranked, item.id]);
                  }
                }}
                accessibilityRole="button"
                accessibilityLabel={`${item.label}${isSelected ? `, ranked ${position + 1} of ${question.rankCount || 5}` : ', not ranked'}${!isSelected && isFull ? ', maximum rankings reached' : ''}`}
                accessibilityState={{ selected: isSelected, disabled: !isSelected && isFull }}
              >
                <View
                  style={[
                    styles.rankBadge,
                    isSelected && styles.rankBadgeSelected,
                  ]}
                >
                  <Text style={[styles.rankNumber, isSelected && styles.rankNumberSelected]}>
                    {isSelected ? position + 1 : '\u2014'}
                  </Text>
                </View>
                <View style={styles.rankingItemContent}>
                  <Text style={styles.rankingItemLabel}>{item.label}</Text>
                  {item.description ? (
                    <Text style={styles.rankingItemDesc}>{item.description}</Text>
                  ) : null}
                </View>
              </AnimatedPressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Likert
  likertSection: { gap: Spacing.sm },
  likertOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
    minHeight: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  likertOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryFaded,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  radioSelected: { borderColor: Colors.primary },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  likertLabel: { fontSize: FontSizes.bodySmall, color: Colors.text },
  likertLabelSelected: { color: Colors.primary, fontWeight: '600' },
  scrollHint: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    textAlign: 'center' as const,
    paddingTop: Spacing.xs,
    fontStyle: 'italic' as const,
  },

  // Text input
  textInputSection: { gap: Spacing.xs },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: Spacing.md,
    fontSize: FontSizes.body,
    color: Colors.text,
    minHeight: 120,
    backgroundColor: Colors.white,
  },
  charCount: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  chipsSection: {
    marginTop: Spacing.sm,
  },
  chipsHint: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginBottom: Spacing.xs,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F0EB',
    borderWidth: 1,
    borderColor: '#E8E0D8',
  },
  chipSelected: {
    backgroundColor: Colors.primaryFaded,
    borderColor: Colors.primary,
    opacity: 0.6,
  },
  chipText: {
    fontSize: 12,
    color: '#6A5B4A',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: Colors.primary,
  },

  // Choice
  choiceSection: { gap: Spacing.sm },
  choiceOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  choiceOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryFaded,
  },
  choiceKeyBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceKeyBadgeSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  choiceKey: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  choiceKeySelected: { color: Colors.white },
  choiceText: {
    flex: 1,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 20,
  },
  choiceTextSelected: { color: Colors.primary },

  // Ranking
  rankingSection: { gap: Spacing.sm },
  rankingHint: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  rankingItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryFaded,
  },
  rankingItemDisabled: { opacity: 0.4 },
  rankBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankBadgeSelected: { backgroundColor: Colors.primary },
  rankNumber: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  rankNumberSelected: { color: Colors.white },
  rankingItemContent: { flex: 1 },
  rankingItemLabel: {
    fontSize: FontSizes.body,
    color: Colors.text,
    fontWeight: '500',
  },
  rankingItemDesc: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
