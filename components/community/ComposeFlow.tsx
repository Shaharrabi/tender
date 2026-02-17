/**
 * ComposeFlow — Multi-step compose flow for sharing stories.
 *
 * Steps:
 * 1. Choose Type (Story, Letter, Circle, Growth — only Story active)
 * 2. Pick a Prompt (or write freely)
 * 3. Write (text input with alias, char counter, category picker, safety reminder)
 * 4. Celebration (confetti + XP)
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
  Shadows,
} from '@/constants/theme';
import { CommunityColors, POST_CATEGORIES, WRITING_PROMPTS } from '@/constants/community';
import {
  PenIcon,
  MailboxIcon,
  CommunityIcon,
  SeedlingIcon,
  LockIcon,
  SparkleIcon,
  CloseIcon,
} from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import { checkSafety } from '@/utils/agent/safety-check';
import { sanitizeTextInput } from '@/utils/security/validation';
import type { CommunityAlias } from '@/types/community';
import type { PostCategory } from '@/types/community';

type ComposeStep = 'type' | 'prompt' | 'write' | 'celebrate';

interface ComposeFlowProps {
  visible: boolean;
  alias: CommunityAlias;
  onDismiss: () => void;
  onSubmit: (content: string, category: PostCategory) => Promise<void>;
  submitting: boolean;
}

const POST_TYPES = [
  { key: 'story', label: 'A Story', Icon: PenIcon, locked: false },
  { key: 'letter', label: 'A Letter', Icon: MailboxIcon, locked: true },
  { key: 'circle', label: 'A Circle\nReflection', Icon: CommunityIcon, locked: true },
  { key: 'growth', label: 'A Moment\nof Growth', Icon: SeedlingIcon, locked: true },
] as const;

export function ComposeFlow({
  visible,
  alias,
  onDismiss,
  onSubmit,
  submitting,
}: ComposeFlowProps) {
  const haptics = useSoundHaptics();

  const [step, setStep] = useState<ComposeStep>('type');
  const [composeText, setComposeText] = useState('');
  const [composeCategory, setComposeCategory] = useState<PostCategory>('Growth');
  const celebrateFade = useRef(new Animated.Value(0)).current;

  // Reset state when closed
  useEffect(() => {
    if (!visible) {
      setStep('type');
      setComposeText('');
      setComposeCategory('Growth');
      celebrateFade.setValue(0);
    }
  }, [visible]);

  // Celebration animation
  useEffect(() => {
    if (step === 'celebrate') {
      haptics.playConfetti();
      Animated.timing(celebrateFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      // Auto-dismiss after 2.5s
      const timer = setTimeout(() => {
        onDismiss();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleSelectType = useCallback((key: string, locked: boolean) => {
    if (locked) {
      Alert.alert('Coming Soon', 'This sharing type will be available in a future update.');
      return;
    }
    haptics.tap();
    setStep('prompt');
  }, [haptics]);

  const handleSelectPrompt = useCallback((prompt: string | null) => {
    haptics.tap();
    if (prompt) {
      setComposeText(prompt + ' ');
    }
    setStep('write');
  }, [haptics]);

  const handleSubmit = useCallback(async () => {
    const sanitized = sanitizeTextInput(composeText);
    if (!sanitized || sanitized.length < 10) {
      Alert.alert('Too Short', 'Please share a bit more \u2014 at least a sentence or two.');
      return;
    }
    if (sanitized.length > 1000) {
      Alert.alert('Too Long', 'Please keep your story under 1000 characters.');
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
        `Your story was not posted, but help is available.\n\n${resourceLines}`,
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      await onSubmit(sanitized, composeCategory);
      setStep('celebrate');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to share your story. Please try again.');
    }
  }, [composeText, composeCategory, onSubmit]);

  // ─── Step 1: Choose Type ──────────────────────

  const renderTypeStep = () => (
    <View style={st.stepContainer}>
      <Text style={st.stepTitle}>What would you like to share?</Text>
      <View style={st.typeGrid}>
        {POST_TYPES.map((type) => (
          <TouchableOpacity
            key={type.key}
            style={[st.typeCard, type.locked && st.typeCardLocked]}
            onPress={() => handleSelectType(type.key, type.locked)}
            activeOpacity={0.7}
          >
            <type.Icon size={28} color={type.locked ? Colors.textMuted : Colors.primary} />
            <Text style={[st.typeLabel, type.locked && st.typeLabelLocked]}>
              {type.label}
            </Text>
            {type.locked && (
              <View style={st.lockBadge}>
                <LockIcon size={10} color={Colors.textMuted} />
                <Text style={st.lockText}>Soon</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // ─── Step 2: Pick a Prompt ────────────────────

  const renderPromptStep = () => (
    <View style={st.stepContainer}>
      <Text style={st.stepTitle}>Start with a prompt, or write freely:</Text>
      <View style={st.promptList}>
        {WRITING_PROMPTS.map((prompt, i) => (
          <TouchableOpacity
            key={i}
            style={st.promptCard}
            onPress={() => handleSelectPrompt(prompt)}
            activeOpacity={0.7}
          >
            <Text style={st.promptText}>{`"${prompt}"`}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[st.promptCard, st.promptCardFree]}
          onPress={() => handleSelectPrompt(null)}
          activeOpacity={0.7}
        >
          <PenIcon size={16} color={Colors.primary} />
          <Text style={st.promptTextFree}>Write freely</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ─── Step 3: Write ────────────────────────────

  const renderWriteStep = () => (
    <View style={st.stepContainer}>
      {/* Alias display */}
      <View style={st.aliasRow}>
        <View style={[st.aliasDot, { backgroundColor: alias.color }]} />
        <Text style={st.aliasLabel}>Sharing as {alias.name}</Text>
      </View>

      {/* Text input */}
      <TextInput
        style={st.composeInput}
        placeholder="What's alive in your relationship right now?"
        placeholderTextColor={Colors.textMuted}
        value={composeText}
        onChangeText={setComposeText}
        multiline
        maxLength={1000}
        textAlignVertical="top"
        autoFocus
      />
      <Text style={st.charCount}>{composeText.length}/1000</Text>

      {/* Category picker */}
      <Text style={st.pickerLabel}>CATEGORY</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={st.categoryRow}
      >
        {POST_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[st.categoryPill, composeCategory === cat && st.categoryPillActive]}
            onPress={() => {
              haptics.tapSoft();
              setComposeCategory(cat);
            }}
            activeOpacity={0.7}
          >
            <Text style={[st.categoryText, composeCategory === cat && st.categoryTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Safety reminder */}
      <Text style={st.safetyText}>
        Your post is anonymous and reviewed for safety.
      </Text>

      {/* Submit button */}
      <TouchableOpacity
        style={[st.submitBtn, (submitting || composeText.trim().length < 10) && st.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={submitting || composeText.trim().length < 10}
        activeOpacity={0.7}
      >
        {submitting ? (
          <ActivityIndicator color={Colors.textOnPrimary} size="small" />
        ) : (
          <Text style={st.submitBtnText}>Share Story</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  // ─── Step 4: Celebration ──────────────────────

  const renderCelebrateStep = () => (
    <Animated.View style={[st.celebrateContainer, { opacity: celebrateFade }]}>
      <SparkleIcon size={48} color={Colors.accentGold} />
      <Text style={st.celebrateTitle}>Your story is out there now.</Text>
      <Text style={st.celebrateSubtitle}>
        Someone who needs to hear it will find it.
      </Text>
      <View style={st.xpBadge}>
        <Text style={st.xpText}>+25 XP</Text>
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
              <Text style={st.modalTitle}>
                {step === 'type' ? 'Share' : step === 'prompt' ? 'Choose a Prompt' : 'Your Story'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (step === 'write') {
                    setStep('prompt');
                  } else if (step === 'prompt') {
                    setStep('type');
                  } else {
                    onDismiss();
                  }
                }}
              >
                <Text style={st.modalClose}>
                  {step === 'type' ? '\u2715' : '\u2039 Back'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <ScrollView
            contentContainerStyle={st.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {step === 'type' && renderTypeStep()}
            {step === 'prompt' && renderPromptStep()}
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
    paddingBottom: Spacing.xxxl,
  },
  stepContainer: {
    gap: Spacing.md,
  },
  stepTitle: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },

  // ─── Type Grid ────────────────────
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  typeCard: {
    width: '47%',
    aspectRatio: 1.2,
    backgroundColor: CommunityColors.cardBackground,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: CommunityColors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
  },
  typeCardLocked: {
    opacity: 0.5,
  },
  typeLabel: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    textAlign: 'center',
  },
  typeLabelLocked: {
    color: Colors.textMuted,
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  lockText: {
    fontSize: 9,
    color: Colors.textMuted,
    fontWeight: '600',
  },

  // ─── Prompt List ──────────────────
  promptList: {
    gap: Spacing.sm,
  },
  promptCard: {
    backgroundColor: CommunityColors.cardBackground,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: CommunityColors.cardBorder,
    padding: Spacing.md,
  },
  promptCardFree: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary + '08',
    borderColor: Colors.primary + '30',
  },
  promptText: {
    fontSize: FontSizes.body,
    color: CommunityColors.warmDarkBrown,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  promptTextFree: {
    fontSize: FontSizes.body,
    color: Colors.primary,
    fontWeight: '600',
  },

  // ─── Write ────────────────────────
  aliasRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
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
  composeInput: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.body,
    color: Colors.text,
    minHeight: 120,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    lineHeight: 22,
  },
  charCount: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    textAlign: 'right',
  },
  pickerLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  categoryRow: {
    gap: Spacing.xs,
    flexDirection: 'row',
  },
  categoryPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  categoryTextActive: {
    color: Colors.textOnPrimary,
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
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: Colors.textOnPrimary,
    fontSize: FontSizes.body,
    fontWeight: '600',
  },

  // ─── Celebrate ────────────────────
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
    borderRadius: 20,
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
