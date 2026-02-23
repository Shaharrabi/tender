/**
 * L1BodyBoundaryMap — MC8 Lesson 1
 *
 * Interactive body silhouette with tap zones. User taps zones where they
 * FEEL boundary violations. Each tap reveals a sensation vocabulary card.
 * After mapping 3+ zones, insight card summarizes findings.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
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
import { MC8_PALETTE, MC8_TIMING } from '@/constants/mc8Theme';
import { PersonIcon, SparkleIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

// ─── Body Zones ──────────────────────────────────────────

interface BodyZone {
  id: string;
  label: string;
  area: string;
  sensations: string[];
  description: string;
}

const BODY_ZONES: BodyZone[] = [
  { id: 'head', label: 'Head', area: 'top', sensations: ['pressure', 'fogginess', 'racing thoughts', 'headache'], description: 'Head tension often signals overthinking a boundary — your mind working overtime to justify saying no.' },
  { id: 'throat', label: 'Throat', area: 'upper', sensations: ['tightness', 'lump', 'constriction', 'dryness'], description: 'Throat tightness is your body holding back words that need to be spoken. The boundary is literally stuck in your throat.' },
  { id: 'chest', label: 'Chest', area: 'upper', sensations: ['heaviness', 'tightness', 'racing heart', 'pressure'], description: 'Chest sensations often signal anxiety about the relationship cost of a boundary. Your heart knows what it needs.' },
  { id: 'stomach', label: 'Stomach', area: 'middle', sensations: ['dropping', 'nausea', 'butterflies', 'churning'], description: 'Gut feelings are real boundary signals. That stomach drop is your body saying "this doesn\'t feel right."' },
  { id: 'shoulders', label: 'Shoulders', area: 'upper', sensations: ['tension', 'heaviness', 'raised', 'pain'], description: 'Shoulder tension comes from carrying too much. When boundaries are weak, we carry others\' burdens on our shoulders.' },
  { id: 'jaw', label: 'Jaw', area: 'top', sensations: ['clenching', 'grinding', 'tightness', 'pain'], description: 'A clenched jaw often means anger that hasn\'t been expressed. The boundary wants to be spoken but is being held back.' },
  { id: 'hands', label: 'Hands', area: 'lower', sensations: ['tingling', 'clenching', 'sweating', 'numbness'], description: 'Hand sensations connect to your sense of agency. Tingling or clenching means your body wants to take action on a boundary.' },
  { id: 'back', label: 'Lower Back', area: 'middle', sensations: ['aching', 'stiffness', 'pressure', 'weakness'], description: 'Back pain often connects to feeling unsupported. When you don\'t hold boundaries, your body holds the strain instead.' },
];

type Phase = 'intro' | 'mapping' | 'insight' | 'done';

interface MappedZone {
  zoneId: string;
  selectedSensation: string;
}

// ─── Component ───────────────────────────────────────────

interface L1BodyBoundaryMapProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

export function L1BodyBoundaryMap({ content, onComplete }: L1BodyBoundaryMapProps) {
  const haptics = useSoundHaptics();

  const [phase, setPhase] = useState<Phase>('intro');
  const [mappedZones, setMappedZones] = useState<MappedZone[]>([]);
  const [activeZone, setActiveZone] = useState<BodyZone | null>(null);
  const [showSensationPicker, setShowSensationPicker] = useState(false);

  const introFade = useRef(new Animated.Value(0)).current;
  const zonePulse = useRef(new Animated.Value(1)).current;
  const pickerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (phase === 'intro') {
      Animated.timing(introFade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }
  }, [phase]);

  const startMapping = useCallback(() => {
    haptics.tap();
    setPhase('mapping');
  }, [haptics]);

  const handleZoneTap = useCallback((zone: BodyZone) => {
    if (mappedZones.find(m => m.zoneId === zone.id)) return; // Already mapped
    haptics.tap();
    setActiveZone(zone);
    setShowSensationPicker(true);
    pickerFade.setValue(0);
    Animated.timing(pickerFade, { toValue: 1, duration: MC8_TIMING.sensationReveal, useNativeDriver: true }).start();

    // Pulse animation
    zonePulse.setValue(1);
    Animated.sequence([
      Animated.timing(zonePulse, { toValue: 1.1, duration: 150, useNativeDriver: true }),
      Animated.timing(zonePulse, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  }, [mappedZones, haptics, pickerFade, zonePulse]);

  const handleSensationSelect = useCallback((sensation: string) => {
    if (!activeZone) return;
    haptics.playExerciseReveal();
    setMappedZones(prev => [...prev, { zoneId: activeZone.id, selectedSensation: sensation }]);
    setShowSensationPicker(false);
    setActiveZone(null);
  }, [activeZone, haptics]);

  const goToInsight = useCallback(() => {
    haptics.pageTurn();
    setPhase('insight');
  }, [haptics]);

  const handleFinish = useCallback(() => {
    haptics.playReflectionDing();
    const responses: StepResponseEntry[] = [{
      step: 1,
      prompt: 'Body Boundary Map',
      response: JSON.stringify({
        zonesMapped: mappedZones.length,
        zones: mappedZones.map(m => {
          const zone = BODY_ZONES.find(z => z.id === m.zoneId);
          return { zone: zone?.label, sensation: m.selectedSensation };
        }),
      }),
      type: 'game',
    }];
    onComplete(responses);
  }, [mappedZones, onComplete, haptics]);

  // ─── Render ────────────────────────────────────────────

  const renderIntro = () => {
    const paragraphs = content.readContent
      ? content.readContent.split('\n').filter((p: string) => p.trim().length > 0)
      : [];

    return (
      <Animated.View style={[styles.phaseContainer, { opacity: introFade }]}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.introHeader}>
            <PersonIcon size={28} color={MC8_PALETTE.deepTeal} />
            <Text style={styles.introTitle}>Body Boundary Map</Text>
          </View>
          {paragraphs.length > 0 ? (
            paragraphs.map((p: string, i: number) => (
              <Text key={i} style={styles.introParagraph}>{p.trim()}</Text>
            ))
          ) : (
            <Text style={styles.introParagraph}>
              Your body already knows where your boundaries are — even before your mind catches up.
              Think about a time when someone crossed a line. Where did you feel it? Tight chest?
              Stomach drop? Clenched jaw? In this exercise, you'll map those signals.
            </Text>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.startButton} onPress={startMapping} activeOpacity={0.8}>
          <Text style={styles.startButtonText}>Start Mapping</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderMapping = () => {
    const canProceed = mappedZones.length >= 3;

    return (
      <View style={styles.phaseContainer}>
        <Text style={styles.mapInstruction}>
          Tap the body zones where you feel boundary violations. Map at least 3 zones.
        </Text>
        <Text style={styles.mapCount}>{mappedZones.length} zone{mappedZones.length !== 1 ? 's' : ''} mapped</Text>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.zonesGrid} showsVerticalScrollIndicator={false}>
          {BODY_ZONES.map(zone => {
            const isMapped = mappedZones.find(m => m.zoneId === zone.id);
            const isActive = activeZone?.id === zone.id;

            return (
              <TouchableOpacity
                key={zone.id}
                style={[styles.zoneCard, isMapped && styles.zoneCardMapped, isActive && styles.zoneCardActive]}
                onPress={() => handleZoneTap(zone)}
                activeOpacity={0.7}
                disabled={!!isMapped}
              >
                <Text style={[styles.zoneLabel, isMapped && styles.zoneLabelMapped]}>{zone.label}</Text>
                {isMapped && (
                  <Text style={styles.zoneSensation}>{isMapped.selectedSensation}</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Sensation picker */}
        {showSensationPicker && activeZone && (
          <Animated.View style={[styles.sensationPicker, { opacity: pickerFade }]}>
            <Text style={styles.sensationTitle}>What do you feel in your {activeZone.label.toLowerCase()}?</Text>
            <View style={styles.sensationRow}>
              {activeZone.sensations.map(s => (
                <TouchableOpacity key={s} style={styles.sensationChip} onPress={() => handleSensationSelect(s)} activeOpacity={0.7}>
                  <Text style={styles.sensationChipText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {canProceed && !showSensationPicker && (
          <TouchableOpacity style={styles.proceedButton} onPress={goToInsight} activeOpacity={0.8}>
            <Text style={styles.proceedButtonText}>See Your Map</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderInsight = () => (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.insightHeader}>
        <SparkleIcon size={32} color={MC8_PALETTE.deepTeal} />
        <Text style={styles.insightTitle}>Your Body Already Knows</Text>
      </View>

      <Text style={styles.insightSummary}>
        You mapped {mappedZones.length} boundary zones. Here's what your body is telling you:
      </Text>

      <View style={styles.insightGrid}>
        {mappedZones.map(m => {
          const zone = BODY_ZONES.find(z => z.id === m.zoneId);
          if (!zone) return null;
          return (
            <View key={m.zoneId} style={styles.insightCard}>
              <View style={styles.insightCardHeader}>
                <View style={styles.insightDot} />
                <Text style={styles.insightZoneLabel}>{zone.label}</Text>
                <Text style={styles.insightSensationTag}>{m.selectedSensation}</Text>
              </View>
              <Text style={styles.insightDescription}>{zone.description}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.takeawayCard}>
        <Text style={styles.takeawayText}>
          Your body is your first boundary alarm system. When you feel these sensations,
          it's your body saying: "A boundary needs to be set here." Learning to listen
          to these signals is the foundation of embodied boundary-setting.
        </Text>
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={handleFinish} activeOpacity={0.8}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {phase === 'intro' && renderIntro()}
      {phase === 'mapping' && renderMapping()}
      {(phase === 'insight' || phase === 'done') && renderInsight()}
    </View>
  );
}

export default L1BodyBoundaryMap;

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  phaseContainer: { flex: 1, paddingHorizontal: Spacing.lg },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: Spacing.xl, paddingBottom: Spacing.xxxl, paddingHorizontal: Spacing.lg },

  introHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  introTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingL, color: Colors.text, fontWeight: '700' },
  introParagraph: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 26, marginBottom: Spacing.md },
  startButton: { backgroundColor: MC8_PALETTE.deepTeal, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.subtle },
  startButtonText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },

  mapInstruction: { fontFamily: FontFamilies.heading, fontSize: FontSizes.bodySmall, color: Colors.text, textAlign: 'center', paddingTop: Spacing.md },
  mapCount: { fontFamily: FontFamilies.heading, fontSize: FontSizes.caption, color: MC8_PALETTE.deepTeal, textAlign: 'center', fontWeight: '600', marginBottom: Spacing.md },

  zonesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, paddingBottom: Spacing.lg, justifyContent: 'center' },
  zoneCard: { width: '47%', backgroundColor: '#FFFFFF', borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 2, borderColor: MC8_PALETTE.cardBorder, alignItems: 'center', gap: 4, minHeight: 70, justifyContent: 'center' },
  zoneCardMapped: { borderColor: MC8_PALETTE.deepTeal, backgroundColor: MC8_PALETTE.deepTealLight + '30' },
  zoneCardActive: { borderColor: MC8_PALETTE.deepTeal, borderWidth: 2 },
  zoneLabel: { fontFamily: FontFamilies.heading, fontSize: FontSizes.bodySmall, color: Colors.text, fontWeight: '600' },
  zoneLabelMapped: { color: MC8_PALETTE.deepTeal },
  zoneSensation: { fontFamily: FontFamilies.body, fontSize: FontSizes.caption, color: MC8_PALETTE.deepTealDark, fontStyle: 'italic' },

  sensationPicker: { backgroundColor: MC8_PALETTE.cardBg, borderRadius: BorderRadius.lg, padding: Spacing.lg, ...Shadows.card, gap: Spacing.md, marginBottom: Spacing.md },
  sensationTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.bodySmall, color: Colors.text, fontWeight: '600', textAlign: 'center' },
  sensationRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, justifyContent: 'center' },
  sensationChip: { backgroundColor: MC8_PALETTE.bodyWarmLight, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderWidth: 1, borderColor: MC8_PALETTE.bodyWarm },
  sensationChipText: { fontFamily: FontFamilies.body, fontSize: FontSizes.bodySmall, color: MC8_PALETTE.earthBrown },

  proceedButton: { backgroundColor: MC8_PALETTE.deepTeal, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.lg, ...Shadows.subtle },
  proceedButtonText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },

  insightHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  insightTitle: { fontFamily: FontFamilies.heading, fontSize: FontSizes.headingL, color: Colors.text, fontWeight: '700' },
  insightSummary: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, textAlign: 'center', lineHeight: 24, marginBottom: Spacing.lg },
  insightGrid: { gap: Spacing.sm, marginBottom: Spacing.lg },
  insightCard: { backgroundColor: MC8_PALETTE.cardBg, borderRadius: BorderRadius.lg, padding: Spacing.md, borderWidth: 1, borderColor: MC8_PALETTE.cardBorder, gap: Spacing.sm },
  insightCardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  insightDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: MC8_PALETTE.deepTeal },
  insightZoneLabel: { fontFamily: FontFamilies.heading, fontSize: FontSizes.bodySmall, color: Colors.text, fontWeight: '600' },
  insightSensationTag: { fontFamily: FontFamilies.body, fontSize: FontSizes.caption, color: MC8_PALETTE.deepTeal, fontStyle: 'italic', marginLeft: 'auto' },
  insightDescription: { fontFamily: FontFamilies.body, fontSize: FontSizes.bodySmall, color: Colors.text, lineHeight: 22 },

  takeawayCard: { backgroundColor: MC8_PALETTE.deepTealLight + '30', borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.lg, borderWidth: 1, borderColor: MC8_PALETTE.deepTeal + '20' },
  takeawayText: { fontFamily: FontFamilies.body, fontSize: FontSizes.body, color: Colors.text, lineHeight: 26, textAlign: 'center', fontStyle: 'italic' },

  continueButton: { backgroundColor: MC8_PALETTE.deepTeal, paddingVertical: Spacing.md, borderRadius: BorderRadius.lg, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.subtle },
  continueButtonText: { fontFamily: FontFamilies.heading, fontSize: FontSizes.body, color: '#FFFFFF', fontWeight: '600' },
});
