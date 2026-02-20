/**
 * L2: Activation Body Scan — Body Hotspots + Thermometer
 *
 * User taps body zones (head, chest, gut, hands, legs) to discover
 * their personal hyper/hypoarousal signals. A thermometer fills
 * as zones are explored. Signal chips are selectable.
 *
 * Returns StepResponseEntry[] with the user's activation signature.
 */

import React, { useState, useRef, useCallback } from 'react';
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
import { MC2_PALETTE } from '@/constants/mc2Theme';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import {
  BrainIcon,
  HeartPulseIcon,
  FireIcon,
  HandshakeIcon,
  WindIcon,
  LightningIcon,
  WaveIcon,
} from '@/assets/graphics/icons';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

type BodyZone = 'head' | 'chest' | 'gut' | 'hands' | 'legs';

interface ZoneConfig {
  id: BodyZone;
  label: string;
  Icon: React.ComponentType<{ size: number; color: string }>;
  hyperSignals: string[];
  hypoSignals: string[];
}

const ZONES: ZoneConfig[] = [
  {
    id: 'head',
    label: 'Head',
    Icon: BrainIcon,
    hyperSignals: ['Racing thoughts', 'Tunnel vision', 'Jaw clenching', 'Heat in face'],
    hypoSignals: ['Brain fog', "Can't find words", 'Feeling far away', 'Blank mind'],
  },
  {
    id: 'chest',
    label: 'Chest',
    Icon: HeartPulseIcon,
    hyperSignals: ['Heart pounding', 'Chest tight', 'Breath shallow', 'Pressure'],
    hypoSignals: ['Empty feeling', 'Heavy', 'No sensation', 'Flat'],
  },
  {
    id: 'gut',
    label: 'Gut',
    Icon: FireIcon,
    hyperSignals: ['Nausea', 'Butterflies', 'Stomach dropping', 'Acid feeling'],
    hypoSignals: ['Nothing', 'Disconnected', "Can't feel body", 'Hollowness'],
  },
  {
    id: 'hands',
    label: 'Hands',
    Icon: HandshakeIcon,
    hyperSignals: ['Fists clenching', 'Trembling', 'Sweating', 'Urge to grip'],
    hypoSignals: ['Cold', 'Tingling', 'Limp', "Can't grip"],
  },
  {
    id: 'legs',
    label: 'Legs',
    Icon: WindIcon,
    hyperSignals: ['Restless', 'Urge to run', 'Bouncing', 'Ready to flee'],
    hypoSignals: ['Heavy like lead', "Can't move", 'Wobbly', 'Disconnected from floor'],
  },
];

interface L2ActivationBodyScanProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

export function L2ActivationBodyScan({
  content,
  attachmentStyle,
  onComplete,
}: L2ActivationBodyScanProps) {
  const haptics = useSoundHaptics();

  const [tappedZones, setTappedZones] = useState<Set<BodyZone>>(new Set());
  const [selectedSignals, setSelectedSignals] = useState<Record<BodyZone, string[]>>({
    head: [],
    chest: [],
    gut: [],
    hands: [],
    legs: [],
  });
  const [activeZone, setActiveZone] = useState<BodyZone | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  // Thermometer fill animation
  const thermFill = useRef(new Animated.Value(0)).current;
  // Signal card fade
  const cardFade = useRef(new Animated.Value(0)).current;

  const handleZoneTap = useCallback(
    (zone: BodyZone) => {
      haptics.tap();
      setActiveZone(zone);

      // Fade in signal card
      cardFade.setValue(0);
      Animated.timing(cardFade, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      if (!tappedZones.has(zone)) {
        const newTapped = new Set([...tappedZones, zone]);
        setTappedZones(newTapped);

        // Animate thermometer
        haptics.playExerciseReveal();
        Animated.timing(thermFill, {
          toValue: (newTapped.size / 5) * 100,
          duration: 600,
          useNativeDriver: false,
        }).start();
      }
    },
    [tappedZones, haptics, thermFill, cardFade]
  );

  const handleSignalSelect = useCallback(
    (zone: BodyZone, signal: string) => {
      haptics.tapSoft();
      setSelectedSignals((prev) => {
        const current = prev[zone];
        const updated = current.includes(signal)
          ? current.filter((s) => s !== signal)
          : [...current, signal];
        return { ...prev, [zone]: updated };
      });
    },
    [haptics]
  );

  const handleFinish = useCallback(() => {
    setIsComplete(true);
    haptics.success();

    // Build activation signature summary
    const signatureSummary = Object.entries(selectedSignals)
      .filter(([_, sigs]) => sigs.length > 0)
      .map(([zone, sigs]) => `${zone}: ${sigs.join(', ')}`)
      .join(' | ');

    setTimeout(() => {
      const responses: StepResponseEntry[] = [
        {
          step: 1,
          prompt: 'Body zones scanned',
          response: `Scanned ${tappedZones.size} of 5 zones: ${Array.from(tappedZones).join(', ')}`,
          type: 'body-scan',
        },
        {
          step: 2,
          prompt: 'Activation signature',
          response: signatureSummary || 'No specific signals selected',
          type: 'signal-selection',
        },
      ];
      onComplete(responses);
    }, 1200);
  }, [haptics, selectedSignals, tappedZones, onComplete]);

  const activeZoneData = activeZone ? ZONES.find((z) => z.id === activeZone) : null;

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>YOUR ACTIVATION MAP</Text>
      <Text style={styles.subtitle}>
        Tap each zone to discover your signals.
      </Text>

      <View style={styles.bodyRow}>
        {/* Body zones */}
        <View style={styles.bodyColumn}>
          {ZONES.map((zone) => {
            const isTapped = tappedZones.has(zone.id);
            const isActive = activeZone === zone.id;
            return (
              <TouchableOpacity
                key={zone.id}
                style={[
                  styles.hotspot,
                  isTapped && styles.hotspotTapped,
                  isActive && styles.hotspotActive,
                ]}
                onPress={() => handleZoneTap(zone.id)}
                activeOpacity={0.7}
              >
                <zone.Icon size={20} color={isActive ? Colors.text : (isTapped ? MC2_PALETTE.sage : Colors.textMuted)} />
                <Text
                  style={[
                    styles.hotspotLabel,
                    isTapped && { color: MC2_PALETTE.sage, fontWeight: '600' },
                  ]}
                >
                  {zone.label}
                </Text>
                {isTapped && (
                  <View style={styles.checkBadge}>
                    <Text style={styles.checkText}>{'\u2713'}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Thermometer */}
        <View style={styles.thermometer}>
          <Animated.View
            style={[
              styles.thermFill,
              {
                height: thermFill.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
          <Text style={styles.thermLabel}>
            {tappedZones.size}/5
          </Text>
        </View>
      </View>

      {/* Signal Selection Card */}
      {activeZoneData && (
        <Animated.View style={[styles.signalCard, { opacity: cardFade }]}>
          <View style={styles.signalTitleRow}>
            <activeZoneData.Icon size={18} color={Colors.text} />
            <Text style={styles.signalTitle}>
              {activeZoneData.label.toUpperCase()}
            </Text>
          </View>

          <View style={styles.signalSubheadRow}>
            <Text style={styles.signalSubhead}>When activated (hyper)</Text>
            <LightningIcon size={12} color={Colors.textMuted} />
          </View>
          <View style={styles.signalGrid}>
            {activeZoneData.hyperSignals.map((sig) => {
              const isSelected = selectedSignals[activeZoneData.id].includes(sig);
              return (
                <TouchableOpacity
                  key={sig}
                  style={[styles.signalChip, isSelected && styles.signalChipSelected]}
                  onPress={() => handleSignalSelect(activeZoneData.id, sig)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.signalChipText,
                      isSelected && styles.signalChipTextSelected,
                    ]}
                  >
                    {sig}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.signalSubheadRow}>
            <Text style={styles.signalSubhead}>When shut down (hypo)</Text>
            <WaveIcon size={12} color={Colors.textMuted} />
          </View>
          <View style={styles.signalGrid}>
            {activeZoneData.hypoSignals.map((sig) => {
              const isSelected = selectedSignals[activeZoneData.id].includes(sig);
              return (
                <TouchableOpacity
                  key={sig}
                  style={[styles.signalChip, isSelected && styles.signalChipSelected]}
                  onPress={() => handleSignalSelect(activeZoneData.id, sig)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.signalChipText,
                      isSelected && styles.signalChipTextSelected,
                    ]}
                  >
                    {sig}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      )}

      {/* Complete button — appears after at least 2 zones tapped */}
      {tappedZones.size >= 2 && !isComplete && (
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleFinish}
          activeOpacity={0.7}
        >
          <Text style={styles.completeButtonText}>I KNOW MY SIGNALS</Text>
        </TouchableOpacity>
      )}

      {isComplete && (
        <View style={styles.insightCard}>
          <Text style={styles.insightText}>
            These are your early warning signals. Catch them at 10% {'\u2014'}{' '}
            before your thinking brain goes offline.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },

  // ─── Body + Thermometer row ─────────
  bodyRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  bodyColumn: {
    flex: 1,
    gap: Spacing.sm,
  },
  hotspot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceElevated,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  hotspotTapped: {
    borderColor: MC2_PALETTE.sage,
    backgroundColor: MC2_PALETTE.sage + '10',
  },
  hotspotActive: {
    borderColor: Colors.text,
    borderWidth: 2,
  },
  // (hotspotEmoji removed — using SVG icons now)
  hotspotLabel: {
    flex: 1,
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.heading,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  checkBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: MC2_PALETTE.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },

  // ─── Thermometer ────────────────────
  thermometer: {
    width: 32,
    height: '100%',
    minHeight: 260,
    backgroundColor: Colors.progressTrack,
    borderRadius: 16,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    position: 'relative',
  },
  thermFill: {
    backgroundColor: MC2_PALETTE.sage,
    borderRadius: 16,
    width: '100%',
  },
  thermLabel: {
    position: 'absolute',
    top: Spacing.sm,
    alignSelf: 'center',
    fontSize: 10,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    color: Colors.textMuted,
  },

  // ─── Signal Card ────────────────────
  signalCard: {
    width: '100%',
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: MC2_PALETTE.sage,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.subtle,
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  signalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  signalTitle: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.heading,
    fontWeight: '800',
    letterSpacing: 2,
    color: Colors.text,
  },
  signalSubheadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  signalSubhead: {
    fontSize: FontSizes.caption - 1,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  signalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  signalChip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  signalChipSelected: {
    backgroundColor: MC2_PALETTE.sage + '18',
    borderColor: MC2_PALETTE.sage,
  },
  signalChipText: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.body,
    color: Colors.textMuted,
  },
  signalChipTextSelected: {
    color: Colors.text,
    fontWeight: '600',
  },

  // ─── Buttons ────────────────────────
  completeButton: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.text,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    ...Shadows.subtle,
  },
  completeButtonText: {
    color: Colors.background,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    fontSize: FontSizes.bodySmall,
    letterSpacing: 2,
    textAlign: 'center',
  },
  insightCard: {
    marginTop: Spacing.lg,
    backgroundColor: MC2_PALETTE.sage + '15',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 3,
    borderLeftColor: MC2_PALETTE.sage,
    width: '100%',
  },
  insightText: {
    fontSize: FontSizes.bodySmall,
    fontFamily: FontFamilies.body,
    color: MC2_PALETTE.sage,
    fontStyle: 'italic',
    lineHeight: 22,
    textAlign: 'center',
  },
});
