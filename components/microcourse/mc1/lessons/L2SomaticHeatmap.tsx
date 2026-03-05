/**
 * L2: Somatic Heatmap — Body Region Map
 *
 * Shows introductory text, then a simplified body outline with 5 tappable
 * zones. Tapping a zone creates a bloom animation and prompts a description.
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
import { HeartPulseIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { ResolvedLessonContent } from '@/utils/microcourses/course-content';
import type { AttachmentStyle } from '@/types';
import type { StepResponseEntry } from '@/types/intervention';

type BodyRegion = 'head' | 'chest' | 'gut' | 'hands' | 'legs';

interface RegionData {
  key: BodyRegion;
  label: string;
  emoji: string; // Using text labels since we don't have body part icons
  description: string;
}

const BODY_REGIONS: RegionData[] = [
  { key: 'head', label: 'Head', emoji: 'Head', description: 'Racing thoughts, tension, pressure' },
  { key: 'chest', label: 'Chest', emoji: 'Chest', description: 'Tightness, racing heart, heat' },
  { key: 'gut', label: 'Stomach', emoji: 'Gut', description: 'Knots, nausea, butterflies' },
  { key: 'hands', label: 'Hands', emoji: 'Hands', description: 'Tingling, clenching, numbness' },
  { key: 'legs', label: 'Legs', emoji: 'Legs', description: 'Restless, weak, urge to run' },
];

type Phase = 'intro' | 'map';

interface SelectedRegion {
  key: BodyRegion;
  description: string;
}

interface L2SomaticHeatmapProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

export function L2SomaticHeatmap({ content, attachmentStyle, onComplete }: L2SomaticHeatmapProps) {
  const haptics = useSoundHaptics();
  const isAnxious = attachmentStyle === 'anxious-preoccupied';

  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedRegions, setSelectedRegions] = useState<Map<BodyRegion, string>>(new Map());
  const [activeRegion, setActiveRegion] = useState<BodyRegion | null>(null);
  const [inputText, setInputText] = useState('');

  // Bloom animations per region
  const bloomScales = useRef(
    Object.fromEntries(BODY_REGIONS.map(r => [r.key, new Animated.Value(0)])) as Record<BodyRegion, Animated.Value>
  ).current;

  const handleTapRegion = useCallback((region: BodyRegion) => {
    haptics.playMoodSelect();
    setActiveRegion(region);
    setInputText(selectedRegions.get(region) || '');

    // Bloom animation
    bloomScales[region].setValue(0);
    Animated.spring(bloomScales[region], {
      toValue: 1,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [haptics, selectedRegions, bloomScales]);

  const handleSaveRegion = useCallback(() => {
    if (!activeRegion || !inputText.trim()) return;
    haptics.tap();

    const newRegions = new Map(selectedRegions);
    newRegions.set(activeRegion, inputText.trim());
    setSelectedRegions(newRegions);
    setActiveRegion(null);
    setInputText('');
  }, [haptics, activeRegion, inputText, selectedRegions]);

  const handleContinue = useCallback(() => {
    haptics.tap();
    const regions = Array.from(selectedRegions.entries()).map(([key, desc]) => ({
      area: key,
      description: desc,
    }));
    const responses: StepResponseEntry[] = [
      {
        step: 1,
        prompt: 'Body sensations',
        response: JSON.stringify({ regions }),
        type: 'somatic-map',
      },
    ];
    onComplete(responses);
  }, [haptics, selectedRegions, onComplete]);

  const hasSelections = selectedRegions.size > 0;

  // ─── Intro Phase ──────────────────────────────

  if (phase === 'intro') {
    const paragraphs = content.readContent.split('\n\n').filter(Boolean);

    return (
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.introContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconCircle}>
          <HeartPulseIcon size={28} color={Colors.primary} />
        </View>

        <Text style={styles.title}>WHERE DO YOU FEEL IT?</Text>

        {paragraphs.slice(0, 3).map((p, i) => (
          <Text key={i} style={styles.paragraph}>{p}</Text>
        ))}

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            haptics.tap();
            setPhase('map');
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.startButtonText}>Explore Your Body Map</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ─── Map Phase ────────────────────────────────

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.mapContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.mapTitle}>
        Tap where the alarm shows up first.
      </Text>

      {/* Body regions as tappable zones */}
      <View style={styles.bodyContainer}>
        {BODY_REGIONS.map((region) => {
          const isSelected = selectedRegions.has(region.key);
          const isActive = activeRegion === region.key;

          return (
            <TouchableOpacity
              key={region.key}
              style={[
                styles.regionButton,
                isSelected && styles.regionButtonSelected,
                isActive && styles.regionButtonActive,
              ]}
              onPress={() => handleTapRegion(region.key)}
              activeOpacity={0.7}
            >
              {/* Bloom circle */}
              <Animated.View
                style={[
                  styles.bloomCircle,
                  {
                    transform: [{ scale: bloomScales[region.key] }],
                    backgroundColor: isAnxious
                      ? Colors.primary + '20'
                      : Colors.secondary + '20',
                  },
                ]}
              />

              <View style={styles.regionContent}>
                <Text style={[
                  styles.regionLabel,
                  isSelected && styles.regionLabelSelected,
                ]}>
                  {region.label}
                </Text>
                <Text style={styles.regionHint}>{region.description}</Text>
                {isSelected && (
                  <Text style={styles.regionSavedText}>
                    "{selectedRegions.get(region.key)}"
                  </Text>
                )}
              </View>

              {isSelected && (
                <View style={styles.checkBadge}>
                  <Text style={styles.checkBadgeText}>{'\u2713'}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Active region input */}
      {activeRegion && (
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>
            What do you feel in your {BODY_REGIONS.find(r => r.key === activeRegion)?.label.toLowerCase()}?
          </Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Tight, hot, racing, numb..."
            placeholderTextColor={Colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            autoFocus
          />
          <TouchableOpacity
            style={[styles.saveButton, !inputText.trim() && styles.saveButtonDisabled]}
            onPress={handleSaveRegion}
            disabled={!inputText.trim()}
            activeOpacity={0.7}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Selected tags */}
      {hasSelections && !activeRegion && (
        <View style={styles.tagsContainer}>
          <Text style={styles.tagsLabel}>Your body's alarm signals:</Text>
          <View style={styles.tagsRow}>
            {Array.from(selectedRegions.entries()).map(([key, desc]) => (
              <View key={key} style={styles.tag}>
                <Text style={styles.tagTitle}>
                  {BODY_REGIONS.find(r => r.key === key)?.label}
                </Text>
                <Text style={styles.tagDesc}>{desc}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Continue button */}
      {hasSelections && !activeRegion && (
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.7}
        >
          <Text style={styles.continueButtonText}>Continue to Reflection</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  introContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.scrollPadBottom,
    alignItems: 'center',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 1.5,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  paragraph: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 26,
    marginBottom: Spacing.md,
  },
  startButton: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: BorderRadius.pill,
    ...Shadows.subtle,
  },
  startButtonText: {
    color: Colors.textOnPrimary,
    fontWeight: '600',
    fontSize: FontSizes.body,
  },

  // ─── Map ─────────────────────────────
  mapContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.scrollPadBottom,
  },
  mapTitle: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  bodyContainer: {
    gap: Spacing.sm,
  },
  regionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
    position: 'relative',
  },
  regionButtonSelected: {
    borderColor: Colors.success + '60',
    backgroundColor: Colors.success + '05',
  },
  regionButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '05',
  },
  bloomCircle: {
    position: 'absolute',
    left: -10,
    top: -10,
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  regionContent: {
    flex: 1,
    zIndex: 1,
  },
  regionLabel: {
    fontSize: FontSizes.body,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  regionLabelSelected: {
    color: Colors.success,
  },
  regionHint: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },
  regionSavedText: {
    fontSize: FontSizes.caption,
    color: Colors.text,
    fontStyle: 'italic',
    marginTop: 4,
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  checkBadgeText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  },

  // ─── Input ───────────────────────────
  inputSection: {
    marginTop: Spacing.md,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
    ...Shadows.subtle,
  },
  inputLabel: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    fontSize: FontSizes.body,
    color: Colors.text,
    backgroundColor: '#FFFCF7',
  },
  saveButton: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.pill,
    alignSelf: 'flex-end',
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveButtonText: {
    color: Colors.textOnPrimary,
    fontWeight: '600',
    fontSize: FontSizes.bodySmall,
  },

  // ─── Tags ────────────────────────────
  tagsContainer: {
    marginTop: Spacing.lg,
  },
  tagsLabel: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tag: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    minWidth: 100,
  },
  tagTitle: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  tagDesc: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },

  // ─── Continue ────────────────────────
  continueButton: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: BorderRadius.pill,
    alignSelf: 'center',
    ...Shadows.subtle,
  },
  continueButtonText: {
    color: Colors.textOnPrimary,
    fontWeight: '600',
    fontSize: FontSizes.body,
  },
});
