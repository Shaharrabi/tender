/**
 * L5SeenRitual — MC10 Lesson 5
 *
 * Build a "being seen" ritual: When, How, Duration, Frequency.
 * Creates ritual card. Course completion commitment with stamp animation.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import { MC10_PALETTE } from '@/constants/mc10Theme';
import { FlagIcon, SparkleIcon, StarIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

const WHEN_OPTIONS = ['Morning', 'Evening', 'Weekend', 'Before Bed'];
const HOW_OPTIONS = ['Eye Contact Exercise (2 min of looking into each other\'s eyes)', 'Appreciation Share (Each share one specific appreciation)', 'Curiosity Question (Ask one deep question from your deck)', 'Body Scan Together (Sit together and notice how the other is feeling)'];
const DURATION_OPTIONS = ['5 minutes', '10 minutes', '15 minutes', '20 minutes'];
const FREQUENCY_OPTIONS = ['Daily', 'Every other day', '3x per week', 'Weekly'];

type Phase = 'intro' | 'build' | 'complete';
type BuildStep = 0 | 1 | 2 | 3;

const STEP_LABELS = ['When', 'How', 'Duration', 'Frequency'];

export default function L5SeenRitual({ content, onComplete }: { content: ResolvedLessonContent; attachmentStyle?: AttachmentStyle; onComplete: (r: StepResponseEntry[]) => void }) {
  const haptics = useSoundHaptics();
  const [phase, setPhase] = useState<Phase>('intro');
  const [buildStep, setBuildStep] = useState<BuildStep>(0);
  const [selections, setSelections] = useState<string[]>([]);
  const [stamped, setStamped] = useState(false);
  const introFade = useRef(new Animated.Value(0)).current;
  const stepFade = useRef(new Animated.Value(0)).current;
  const stampScale = useRef(new Animated.Value(0)).current;
  const stampRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => { if (phase === 'intro') Animated.timing(introFade, { toValue: 1, duration: 500, useNativeDriver: true }).start(); }, [phase]);
  useEffect(() => { stepFade.setValue(0); Animated.timing(stepFade, { toValue: 1, duration: 300, useNativeDriver: true }).start(); }, [buildStep]);

  const startBuild = useCallback(() => { haptics.tap(); setPhase('build'); }, [haptics]);

  const handleSelect = useCallback((value: string) => {
    haptics.tap();
    const updated = [...selections, value];
    setSelections(updated);
    if (buildStep < 3) { setBuildStep((buildStep + 1) as BuildStep); }
    else { haptics.playExerciseReveal(); setPhase('complete'); }
  }, [buildStep, selections, haptics]);

  const handleStamp = useCallback(() => {
    haptics.playConfetti();
    setStamped(true);
    Animated.parallel([
      Animated.spring(stampScale, { toValue: 1, friction: 4, tension: 60, useNativeDriver: true }),
      Animated.timing(stampRotate, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [haptics, stampScale, stampRotate]);

  const handleFinish = useCallback(() => {
    haptics.playReflectionDing();
    const responses: StepResponseEntry[] = [{ step: 1, prompt: 'Seen Ritual', response: JSON.stringify({ when: selections[0], how: selections[1], duration: selections[2], frequency: selections[3] }), type: 'game' }];
    onComplete(responses);
  }, [selections, onComplete, haptics]);

  const OPTIONS = [WHEN_OPTIONS, HOW_OPTIONS, DURATION_OPTIONS, FREQUENCY_OPTIONS];
  const STEP_PROMPTS = ['When will you practice being seen?', 'How will you create the seeing moment?', 'How long will each session be?', 'How often will you do this?'];

  const renderIntro = () => {
    const paragraphs = content.readContent ? content.readContent.split('\n').filter((p: string) => p.trim()) : [];
    return (
      <Animated.View style={[styles.phase, { opacity: introFade }]}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.introHeader}><FlagIcon size={28} color={MC10_PALETTE.deepViolet} /><Text style={styles.introTitle}>Seen Ritual</Text></View>
          {paragraphs.length > 0 ? paragraphs.map((p: string, i: number) => <Text key={i} style={styles.bodyText}>{p.trim()}</Text>) : (
            <Text style={styles.bodyText}>Feeling truly seen isn't an accident — it's a practice. In this final lesson, you'll build a personal "being seen" ritual. A small, repeatable moment where you and your partner practice really seeing each other.</Text>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.startBtn} onPress={startBuild} activeOpacity={0.8}><Text style={styles.startBtnText}>Build Your Ritual</Text></TouchableOpacity>
      </Animated.View>
    );
  };

  const renderBuild = () => (
    <Animated.View style={[styles.phase, { opacity: stepFade }]}>
      {/* Growing ritual card */}
      <View style={styles.ritualPreview}>
        <Text style={styles.ritualPreviewLabel}>Your Seen Ritual</Text>
        {selections.map((s, i) => (
          <Text key={i} style={styles.ritualPreviewItem}><Text style={styles.ritualPreviewKey}>{STEP_LABELS[i]}: </Text>{s}</Text>
        ))}
      </View>

      <View style={styles.stepRow}>{[0, 1, 2, 3].map(s => <View key={s} style={[styles.stepDot, s < buildStep && styles.stepDotDone, s === buildStep && styles.stepDotCurrent]} />)}</View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.optionsContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.stepTitle}>{STEP_PROMPTS[buildStep]}</Text>
        <View style={styles.optionsGrid}>
          {OPTIONS[buildStep].map((opt, i) => (
            <TouchableOpacity key={i} style={styles.optionCard} onPress={() => handleSelect(opt)} activeOpacity={0.7}>
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Animated.View>
  );

  const renderComplete = () => {
    const spin = stampRotate.interpolate({ inputRange: [0, 1], outputRange: ['-15deg', '0deg'] });
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.completeHeader}><SparkleIcon size={32} color={MC10_PALETTE.warmGold} /><Text style={styles.completeTitle}>Your Seen Ritual</Text></View>

        <View style={styles.ritualCard}>
          <View style={styles.ritualSection}><Text style={styles.ritualKey}>When</Text><Text style={styles.ritualValue}>{selections[0]}</Text></View>
          <View style={styles.ritualSection}><Text style={styles.ritualKey}>How</Text><Text style={styles.ritualValue}>{selections[1]}</Text></View>
          <View style={styles.ritualSection}><Text style={styles.ritualKey}>Duration</Text><Text style={styles.ritualValue}>{selections[2]}</Text></View>
          <View style={styles.ritualSection}><Text style={styles.ritualKey}>Frequency</Text><Text style={styles.ritualValue}>{selections[3]}</Text></View>

          {stamped && (
            <Animated.View style={[styles.stamp, { transform: [{ scale: stampScale }, { rotate: spin }] }]}>
              <StarIcon size={20} color={MC10_PALETTE.warmGold} />
              <Text style={styles.stampText}>SEEN</Text>
            </Animated.View>
          )}
        </View>

        {!stamped ? (
          <TouchableOpacity style={styles.stampBtn} onPress={handleStamp} activeOpacity={0.8}><Text style={styles.stampBtnText}>Seal Your Commitment</Text></TouchableOpacity>
        ) : (
          <>
            <Text style={styles.completeInsight}>You've completed the entire "Seen" course. Remember: being seen isn't about grand gestures. It's about the daily practice of noticing, naming, and cherishing what makes your partner who they are.</Text>
            <TouchableOpacity style={styles.continueBtn} onPress={handleFinish} activeOpacity={0.8}><Text style={styles.continueBtnText}>Complete Course</Text></TouchableOpacity>
          </>
        )}
      </ScrollView>
    );
  };

  return <View style={styles.container}>{phase === 'intro' && renderIntro()}{phase === 'build' && renderBuild()}{phase === 'complete' && renderComplete()}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  phase: { flex: 1, paddingHorizontal: Spacing.lg },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: Spacing.xl, paddingBottom: Spacing.scrollPadBottom, paddingHorizontal: Spacing.lg },
  optionsContent: { paddingTop: Spacing.md, paddingBottom: Spacing.scrollPadBottom },
  introHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  introTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingL, color: Colors.text, fontWeight: '700' },
  bodyText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 26, marginBottom: Spacing.md },
  startBtn: { backgroundColor: MC10_PALETTE.deepViolet, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.subtle },
  startBtnText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
  ritualPreview: { backgroundColor: MC10_PALETTE.cardBg, borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: MC10_PALETTE.deepViolet + '30', marginTop: Spacing.md, gap: 2 },
  ritualPreviewLabel: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, color: MC10_PALETTE.deepViolet, fontWeight: '600', marginBottom: 4 },
  ritualPreviewItem: { fontFamily: FontFamilies.body, fontSize: FontSizes.caption, color: Colors.text },
  ritualPreviewKey: { fontWeight: '600', color: MC10_PALETTE.warmGoldDark },
  stepRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingVertical: Spacing.md },
  stepDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.borderLight },
  stepDotDone: { backgroundColor: MC10_PALETTE.deepViolet },
  stepDotCurrent: { backgroundColor: MC10_PALETTE.warmGold, width: 16, height: 16, borderRadius: 8 },
  stepTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingM, color: Colors.text, fontWeight: '600', marginBottom: Spacing.lg },
  optionsGrid: { gap: Spacing.md },
  optionCard: { backgroundColor: '#FFFFFF', borderRadius: BorderRadius.lg, padding: Spacing.lg, borderWidth: 1.5, borderColor: MC10_PALETTE.deepViolet + '30', ...Shadows.subtle },
  optionText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 24 },
  completeHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  completeTitle: { fontFamily: FontFamilies.accent, fontSize: FontSizes.headingL, color: MC10_PALETTE.warmGoldDark },
  ritualCard: { backgroundColor: MC10_PALETTE.letterBg, borderRadius: BorderRadius.xl, padding: Spacing.xl, borderWidth: 2, borderColor: MC10_PALETTE.warmGold, ...Shadows.elevated, gap: Spacing.md, marginBottom: Spacing.lg, position: 'relative' },
  ritualSection: { gap: 2 },
  ritualKey: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, color: MC10_PALETTE.warmGoldDark, fontWeight: '600' },
  ritualValue: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 24 },
  stamp: { position: 'absolute', top: Spacing.md, right: Spacing.md, width: 64, height: 64, borderRadius: 32, borderWidth: 3, borderColor: MC10_PALETTE.warmGold, alignItems: 'center', justifyContent: 'center', backgroundColor: MC10_PALETTE.warmGoldLight },
  stampText: { fontFamily: FontFamilies.heading, fontSize: 10, color: MC10_PALETTE.warmGoldDark, fontWeight: '700', letterSpacing: 1 },
  stampBtn: { backgroundColor: MC10_PALETTE.warmGold, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.lg, ...Shadows.subtle },
  stampBtnText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
  completeInsight: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 26, fontStyle: 'italic', marginBottom: Spacing.lg },
  continueBtn: { backgroundColor: MC10_PALETTE.deepViolet, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.subtle },
  continueBtnText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
});
