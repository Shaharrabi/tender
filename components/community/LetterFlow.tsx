/**
 * LetterFlow — Compose flow for writing anonymous letters.
 *
 * Steps:
 * 1. Write — text input with alias, char counter (500 max), safety check
 * 2. Celebration — letter sent confirmation with XP
 *
 * The prompt is shown in LetterDesk before this flow opens.
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  ButtonSizes,
} from '@/constants/theme';
import { CommunityColors, LETTER_PROMPTS } from '@/constants/community';
import { MailboxIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import { checkSafety } from '@/utils/agent/safety-check';
import { sanitizeTextInput } from '@/utils/security/validation';
import type { CommunityAlias, WeeklyPrompt } from '@/types/community';

type LetterStep = 'write' | 'celebrate';

interface LetterFlowProps {
  visible: boolean;
  alias: CommunityAlias;
  weeklyPrompt: WeeklyPrompt | null;
  onDismiss: () => void;
  onSubmit: (content: string, promptId: string | null) => Promise<void>;
  submitting: boolean;
}

export function LetterFlow({
  visible,
  alias,
  weeklyPrompt,
  onDismiss,
  onSubmit,
  submitting,
}: LetterFlowProps) {
  const haptics = useSoundHaptics();

  const [step, setStep] = useState<LetterStep>('write');
  const [letterText, setLetterText] = useState('');
  const celebrateFade = useRef(new Animated.Value(0)).current;

  // Fallback prompt if no weekly prompt from DB
  const fallbackPrompt = LETTER_PROMPTS[Math.floor(Math.random() * LETTER_PROMPTS.length)];
  const promptText = weeklyPrompt?.promptText ?? fallbackPrompt;

  // Reset state when closed
  useEffect(() => {
    if (!visible) {
      setStep('write');
      setLetterText('');
      celebrateFade.setValue(0);
    }
  }, [visible]);

  // Celebration animation
  useEffect(() => {
    if (step === 'celebrate') {
      haptics.playReflectionDing();
      Animated.timing(celebrateFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      // Auto-dismiss after 3s
      const timer = setTimeout(() => {
        onDismiss();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleSubmit = useCallback(async () => {
    const sanitized = sanitizeTextInput(letterText);
    if (!sanitized || sanitized.length < 10) {
      Alert.alert('Too Short', 'Please write a bit more \u2014 at least a sentence or two.');
      return;
    }
    if (sanitized.length > 500) {
      Alert.alert('Too Long', 'Please keep your letter under 500 characters.');
      return;
    }

    // Safety pre-screen — block all unsafe categories
    const safety = checkSafety(sanitized);
    if (!safety.safe) {
      const resourceLines = (safety.resources ?? [])
        .map((r) => `${r.name}: ${r.contact}`)
        .join('\n');
      const title =
        safety.category === 'self_harm' ? 'We Care About You'
        : safety.category === 'ipv' ? 'You Deserve Safety'
        : safety.category === 'harm_to_others' ? 'A Moment to Pause'
        : 'Support is Available';
      Alert.alert(
        title,
        `Your letter was not sent, but help is available.\n\n${resourceLines}`,
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      await onSubmit(sanitized, weeklyPrompt?.id ?? null);
      setStep('celebrate');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to send your letter. Please try again.');
    }
  }, [letterText, weeklyPrompt, onSubmit]);

  // ─── Step 1: Write ──────────────────────────

  const renderWriteStep = () => (
    <View style={st.stepContainer}>
      {/* Alias display */}
      <View style={st.aliasRow}>
        <View style={[st.aliasDot, { backgroundColor: alias.color }]} />
        <Text style={st.aliasLabel}>Writing as {alias.name}</Text>
      </View>

      {/* Prompt reminder */}
      <View style={st.promptReminder}>
        <Text style={st.promptReminderText}>{`"${promptText}"`}</Text>
      </View>

      {/* Text input */}
      <TextInput
        style={st.letterInput}
        placeholder="Dear fellow traveler..."
        placeholderTextColor={Colors.textMuted}
        value={letterText}
        onChangeText={setLetterText}
        multiline
        maxLength={500}
        textAlignVertical="top"
        autoFocus
        accessibilityRole="text"
        accessibilityLabel="Write your letter"
      />
      <Text style={st.charCount}>{letterText.length}/500</Text>

      {/* Safety reminder */}
      <Text style={st.safetyText}>
        Your letter is anonymous. It will find someone who needs it.
      </Text>

      {/* Submit button */}
      <TouchableOpacity
        style={[st.submitBtn, (submitting || letterText.trim().length < 10) && st.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={submitting || letterText.trim().length < 10}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Send letter"
        accessibilityState={{ disabled: submitting || letterText.trim().length < 10 }}
      >
        {submitting ? (
          <ActivityIndicator color={Colors.textOnPrimary} size="small" />
        ) : (
          <View style={st.submitBtnInner}>
            <MailboxIcon size={16} color={Colors.textOnPrimary} />
            <Text style={st.submitBtnText}>Send Letter</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  // ─── Step 2: Celebration ──────────────────────

  const renderCelebrateStep = () => (
    <Animated.View style={[st.celebrateContainer, { opacity: celebrateFade }]}>
      <MailboxIcon size={48} color={CommunityColors.quoteAccent} />
      <Text style={st.celebrateTitle}>Your letter will find someone.</Text>
      <Text style={st.celebrateSubtitle}>
        Someone who needs these words will receive them.
      </Text>
      <View style={st.xpBadge}>
        <Text style={st.xpText}>+15 XP</Text>
      </View>
    </Animated.View>
  );

  // ─── Main Render ──────────────────────────────

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={st.overlay}>
        <View style={st.modalContent}>
          {/* Header */}
          {step !== 'celebrate' && (
            <View style={st.modalHeader}>
              <Text style={st.modalTitle}>Your Letter</Text>
              <TouchableOpacity
                onPress={onDismiss}
                accessibilityRole="button"
                accessibilityLabel="Close letter flow"
              >
                <Text style={st.modalClose}>{'\u2715'}</Text>
              </TouchableOpacity>
            </View>
          )}

          <ScrollView
            contentContainerStyle={st.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {step === 'write' && renderWriteStep()}
            {step === 'celebrate' && renderCelebrateStep()}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const st = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingBottom: 0,
  },
  modalTitle: {
    fontSize: FontSizes.headingM,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  modalClose: {
    fontSize: FontSizes.body,
    color: Colors.textMuted,
    padding: Spacing.xs,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.scrollPadBottom,
  },
  stepContainer: {
    gap: Spacing.md,
    alignItems: 'center',
  },

  // ─── Write ─────────────────────
  aliasRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    alignSelf: 'flex-start',
  },
  aliasDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  aliasLabel: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  promptReminder: {
    backgroundColor: CommunityColors.cardBackground,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: CommunityColors.cardBorder,
    padding: Spacing.md,
    width: '100%',
  },
  promptReminderText: {
    fontSize: FontSizes.bodySmall,
    color: CommunityColors.warmDarkBrown,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  letterInput: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.body,
    color: Colors.text,
    minHeight: 150,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    lineHeight: 22,
    width: '100%',
  },
  charCount: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    textAlign: 'right',
    alignSelf: 'flex-end',
  },
  safetyText: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    height: ButtonSizes.medium,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  submitBtnText: {
    color: Colors.textOnPrimary,
    fontSize: FontSizes.body,
    fontWeight: '600',
  },

  // ─── Celebrate ─────────────────
  celebrateContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    gap: Spacing.md,
  },
  celebrateTitle: {
    fontSize: FontSizes.headingM,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    textAlign: 'center',
  },
  celebrateSubtitle: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  xpBadge: {
    backgroundColor: Colors.accentGold + '20',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.accentGold + '40',
    marginTop: Spacing.sm,
  },
  xpText: {
    fontSize: FontSizes.body,
    fontWeight: '700',
    color: Colors.accentGold,
  },
});
