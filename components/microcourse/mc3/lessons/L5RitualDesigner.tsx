/**
 * L5: Ritual Designer — Menu-based repair ritual builder
 *
 * Users build a personalized "repair ritual" by choosing from menus
 * (timing, location, opening phrase, gesture). Selections assemble
 * into a ritual card. Ends with commitment text + stamp animation.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { MC3_PALETTE } from '@/constants/mc3Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

type Phase = 'intro' | 'building' | 'preview' | 'commitment';

interface L5RitualDesignerProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

interface RitualOption {
  id: string;
  label: string;
  description: string;
}

interface RitualCategory {
  label: string;
  description: string;
  options: RitualOption[];
}

const RITUAL_OPTIONS: Record<string, RitualCategory> = {
  timing: {
    label: 'WHEN DO WE REPAIR?',
    description: 'Choose your repair window',
    options: [
      { id: '24hr', label: 'Within 24 hours', description: 'The 24-hour rule \u2014 repair before a day passes' },
      { id: 'same_day', label: 'Same day', description: "Don't go to bed angry (or at least try)" },
      { id: 'cool_down', label: 'After a cool-down period', description: 'Take 20+ minutes to self-soothe, then come back' },
      { id: 'daily_checkin', label: 'Daily \u201CHow are we?\u201D check-in', description: 'Prevent ruptures from building up' },
    ],
  },
  location: {
    label: 'WHERE?',
    description: 'A consistent repair space',
    options: [
      { id: 'couch', label: 'The couch', description: 'Side by side, not across from each other' },
      { id: 'walk', label: 'On a walk', description: 'Movement helps the nervous system regulate' },
      { id: 'bed', label: 'In bed', description: 'Lying next to each other, low lights' },
      { id: 'kitchen', label: 'Kitchen table', description: 'Face to face, grounded' },
    ],
  },
  opening: {
    label: 'HOW DO WE START?',
    description: 'The first words matter',
    options: [
      { id: 'how_are_we', label: '\u201CHow are we?\u201D', description: 'Simple, direct, about the space between' },
      { id: 'not_leave_it', label: "\u201CI don't want to leave it like this.\u201D", description: 'Shows willingness without blame' },
      { id: 'something_off', label: '\u201CSomething feels off between us.\u201D', description: 'Names the disconnection honestly' },
      { id: 'im_sorry', label: "\u201CI'm sorry. Can we start over?\u201D", description: 'Direct ownership' },
    ],
  },
  gesture: {
    label: 'WHAT DO OUR BODIES DO?',
    description: 'Physical reconnection matters',
    options: [
      { id: 'hand_hold', label: 'Hold hands', description: 'Simple physical bridge' },
      { id: 'eye_contact', label: 'Eye contact first', description: '5 seconds of looking before speaking' },
      { id: 'hug', label: 'Hug for 20 seconds', description: 'Long enough for oxytocin to release' },
      { id: 'hand_heart', label: "Hand on each other's heart", description: "Feel each other's heartbeat" },
      { id: 'sit_close', label: 'Just sit close', description: 'Proximity without pressure' },
    ],
  },
};

const CATEGORIES = Object.keys(RITUAL_OPTIONS);

export function L5RitualDesigner({ content, attachmentStyle, onComplete }: L5RitualDesignerProps) {
  const haptics = useSoundHaptics();

  const [phase, setPhase] = useState<Phase>('intro');
  const [currentCategory, setCurrentCategory] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [commitment, setCommitment] = useState('');
  const [signed, setSigned] = useState(false);

  // Stamp animation
  const stampScale = useRef(new Animated.Value(5)).current;
  const stampOpacity = useRef(new Animated.Value(0)).current;
  const stampRotate = useRef(new Animated.Value(-15)).current;
  // Fade
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const category = CATEGORIES[currentCategory];
  const categoryData = RITUAL_OPTIONS[category];

  const selectOption = useCallback((optionId: string) => {
    haptics.tap();
    setSelections(prev => ({ ...prev, [category]: optionId }));
  }, [haptics, category]);

  const nextCategory = useCallback(() => {
    if (currentCategory < CATEGORIES.length - 1) {
      haptics.tap();
      // Fade transition
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
        setCurrentCategory(currentCategory + 1);
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      });
    } else {
      // All selected — show preview
      haptics.playConfetti();
      setPhase('preview');
    }
  }, [currentCategory, haptics, fadeAnim]);

  const doStamp = useCallback(() => {
    haptics.playConfetti();
    setSigned(true);

    // Stamp animation
    stampOpacity.setValue(1);
    Animated.parallel([
      Animated.spring(stampScale, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.spring(stampRotate, {
        toValue: 0,
        friction: 6,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      const responses: StepResponseEntry[] = [
        {
          step: 1,
          prompt: 'Repair Ritual Designer',
          response: JSON.stringify({
            ritual: selections,
            commitment: commitment.trim(),
          }),
          type: 'commitment',
        },
      ];
      onComplete(responses);
    }, 1500);
  }, [haptics, selections, commitment, onComplete, stampScale, stampRotate, stampOpacity]);

  const stampTransform = {
    opacity: stampOpacity,
    transform: [
      { scale: stampScale },
      {
        rotate: stampRotate.interpolate({
          inputRange: [-15, 0],
          outputRange: ['-15deg', '0deg'],
        }),
      },
    ],
  };

  // ─── Intro Phase ───────────────────────────────

  if (phase === 'intro') {
    return (
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.introContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>YOUR REPAIR RITUAL</Text>
        <Text style={styles.body}>
          A single repair conversation is valuable. A repair CULTURE is transformative.
          {"\n"}Let's build yours \u2014 a personalized ritual you and your partner can return to
          whenever things go sideways.
        </Text>

        <View style={styles.practicesCard}>
          <Text style={styles.practicesTitle}>THREE REPAIR PRACTICES</Text>
          <Text style={styles.practiceItem}>
            1. The Daily Check-in \u2014 {'\u201C'}How are we?{'\u201D'} (2 minutes)
          </Text>
          <Text style={styles.practiceItem}>
            2. The 24-Hour Repair Rule \u2014 attempt repair within a day
          </Text>
          <Text style={styles.practiceItem}>
            3. The Weekly Weather Report \u2014 10-15 minutes together
          </Text>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            haptics.tap();
            setPhase('building');
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>BUILD MY RITUAL</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ─── Building Phase ────────────────────────────

  if (phase === 'building') {
    return (
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.buildingContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Category progress */}
        <View style={styles.categoryProgress}>
          {CATEGORIES.map((cat, idx) => (
            <View
              key={cat}
              style={[
                styles.categoryDot,
                idx === currentCategory && styles.categoryDotActive,
                selections[cat] && idx !== currentCategory && styles.categoryDotDone,
              ]}
            />
          ))}
        </View>

        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.categoryTitle}>{categoryData.label}</Text>
          <Text style={styles.categoryDesc}>{categoryData.description}</Text>

          {categoryData.options.map(option => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                selections[category] === option.id && styles.optionCardSelected,
              ]}
              onPress={() => selectOption(option.id)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.optionLabel,
                selections[category] === option.id && styles.optionLabelSelected,
              ]}>
                {option.label}
              </Text>
              <Text style={styles.optionDesc}>{option.description}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        <TouchableOpacity
          style={[
            styles.actionButton,
            !selections[category] && styles.actionButtonDisabled,
          ]}
          onPress={nextCategory}
          disabled={!selections[category]}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>
            {currentCategory < CATEGORIES.length - 1 ? 'NEXT' : 'SEE MY RITUAL'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ─── Preview Phase ─────────────────────────────

  if (phase === 'preview') {
    return (
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.previewContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>YOUR REPAIR RITUAL</Text>

        <View style={styles.ritualCard}>
          {CATEGORIES.map((cat, idx) => {
            const catData = RITUAL_OPTIONS[cat];
            const selectedOption = catData.options.find(o => o.id === selections[cat]);
            return (
              <View
                key={cat}
                style={[
                  styles.ritualRow,
                  idx === CATEGORIES.length - 1 && { borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 },
                ]}
              >
                <Text style={styles.ritualCategoryLabel}>{catData.label}</Text>
                <Text style={styles.ritualValue}>
                  {selectedOption?.label || 'Not selected'}
                </Text>
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            haptics.tap();
            setPhase('commitment');
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>SEAL THE COMMITMENT</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ─── Commitment Phase ──────────────────────────

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.commitmentContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>YOUR COMMITMENT</Text>
      <Text style={styles.body}>
        When rupture happens {'\u2014'} and it will {'\u2014'} I commit to:
      </Text>

      <TextInput
        style={styles.commitmentInput}
        placeholder="attempting repair within..."
        placeholderTextColor={Colors.textMuted}
        value={commitment}
        onChangeText={setCommitment}
        multiline
        textAlignVertical="top"
        editable={!signed}
      />

      {/* Stamp zone */}
      <View style={styles.stampZone}>
        {!signed && (
          <TouchableOpacity
            style={[
              styles.stampButton,
              !commitment.trim() && styles.stampButtonDisabled,
            ]}
            onPress={doStamp}
            disabled={!commitment.trim()}
            activeOpacity={0.7}
          >
            <Text style={styles.stampButtonText}>STAMP IT</Text>
          </TouchableOpacity>
        )}

        <Animated.View
          style={[styles.stamp, stampTransform]}
          pointerEvents={signed ? 'auto' : 'none'}
        >
          <Text style={styles.stampText}>COMMITTED</Text>
          <Text style={styles.stampSubtext}>to repair</Text>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  introContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  buildingContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: 100,
  },
  previewContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  commitmentContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '800',
    letterSpacing: 3,
    color: Colors.text,
    textAlign: 'center',
  },
  body: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },

  // ─── Practices ─────────────────────
  practicesCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    width: '100%',
    ...Shadows.subtle,
  },
  practicesTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: MC3_PALETTE.amber,
    marginBottom: Spacing.sm,
  },
  practiceItem: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 4,
  },

  // ─── Category Progress ─────────────
  categoryProgress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.borderLight,
  },
  categoryDotActive: {
    backgroundColor: MC3_PALETTE.amber,
    width: 24,
  },
  categoryDotDone: {
    backgroundColor: MC3_PALETTE.repairGreen,
  },
  categoryTitle: {
    fontSize: FontSizes.headingS,
    fontFamily: FontFamilies.heading,
    fontWeight: '800',
    letterSpacing: 2,
    color: Colors.text,
    textAlign: 'center',
  },
  categoryDesc: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
    marginBottom: Spacing.lg,
  },

  // ─── Option Cards ──────────────────
  optionCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadows.subtle,
  },
  optionCardSelected: {
    borderColor: MC3_PALETTE.amber,
    backgroundColor: MC3_PALETTE.amber + '10',
  },
  optionLabel: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.text,
  },
  optionLabelSelected: {
    color: MC3_PALETTE.amber,
  },
  optionDesc: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },

  // ─── Ritual Card ───────────────────
  ritualCard: {
    backgroundColor: MC3_PALETTE.paper,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    borderWidth: 2,
    borderColor: MC3_PALETTE.amber,
    width: '100%',
    ...Shadows.elevated,
  },
  ritualRow: {
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  ritualCategoryLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  ritualValue: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.text,
  },

  // ─── Commitment ────────────────────
  commitmentInput: {
    backgroundColor: MC3_PALETTE.paper,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.body,
    color: Colors.text,
    width: '100%',
    minHeight: 80,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },

  // ─── Stamp ─────────────────────────
  stampZone: {
    marginTop: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    height: 140,
  },
  stamp: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: MC3_PALETTE.amber,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: MC3_PALETTE.deepAmber,
    position: 'absolute',
  },
  stampText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#FFF',
  },
  stampSubtext: {
    fontSize: 11,
    color: '#FFF',
    fontStyle: 'italic',
  },
  stampButton: {
    backgroundColor: MC3_PALETTE.amber,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: BorderRadius.pill,
  },
  stampButtonText: {
    color: '#FFF',
    fontSize: FontSizes.body + 2,
    fontWeight: '700',
    letterSpacing: 2,
  },
  stampButtonDisabled: {
    opacity: 0.4,
  },

  // ─── Action ────────────────────────
  actionButton: {
    backgroundColor: Colors.text,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: BorderRadius.pill,
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: FontSizes.body,
    fontWeight: '600',
    letterSpacing: 1,
  },
  actionButtonDisabled: {
    opacity: 0.4,
  },
});
