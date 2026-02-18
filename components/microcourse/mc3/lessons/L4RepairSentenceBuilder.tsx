/**
 * L4: Repair Sentence Builder — Fill-in-blank repair templates
 *
 * Three repair templates with increasing vulnerability levels.
 * User fills in blanks with text or suggestion chips. Preview
 * shows the completed sentence.
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

interface L4RepairSentenceBuilderProps {
  content: ResolvedLessonContent;
  attachmentStyle?: AttachmentStyle;
  onComplete: (responses: StepResponseEntry[]) => void;
}

interface TemplateSlot {
  id: string;
  placeholder: string;
  label: string;
}

interface RepairTemplate {
  id: string;
  title: string;
  vulnerability: number;
  fixedPrefix?: string;
  slots: TemplateSlot[];
  suggestions: Record<string, string[]>;
}

const REPAIR_TEMPLATES: RepairTemplate[] = [
  {
    id: 'acknowledgment',
    title: 'The Acknowledgment',
    vulnerability: 1,
    slots: [
      { id: 'wrong_about', placeholder: 'what specifically...', label: 'I was wrong about:' },
      { id: 'should_have_said', placeholder: "what you wish you'd said...", label: 'What I should have said was:' },
    ],
    suggestions: {
      wrong_about: ['how I started that conversation', 'blaming you for everything', 'assuming the worst'],
      should_have_said: ['I was frustrated, not angry at you', 'Can we talk about this?', 'I need your help'],
    },
  },
  {
    id: 'underneath',
    title: 'The Underneath',
    vulnerability: 2,
    slots: [
      { id: 'what_i_said', placeholder: 'the words you used...', label: 'When I said:' },
      { id: 'what_i_meant', placeholder: 'what was underneath...', label: 'What I really meant was:' },
      { id: 'what_i_felt', placeholder: 'the primary emotion...', label: 'What I was actually feeling was:' },
    ],
    suggestions: {
      what_i_felt: ['scared of losing you', 'not important to you', 'alone', 'overwhelmed', 'ashamed'],
    },
  },
  {
    id: 'bridge',
    title: 'The Bridge',
    vulnerability: 3,
    fixedPrefix: "I don't want to be right. I want to be close.",
    slots: [
      { id: 'what_i_need', placeholder: 'what the relationship needs...', label: 'What I need from us is:' },
    ],
    suggestions: {
      what_i_need: ["to feel like we're on the same team", 'to know we can get through this', 'to feel safe being honest'],
    },
  },
];

export function L4RepairSentenceBuilder({ content, attachmentStyle, onComplete }: L4RepairSentenceBuilderProps) {
  const haptics = useSoundHaptics();

  const [currentTemplate, setCurrentTemplate] = useState(0);
  const [responses, setResponses] = useState<Record<string, Record<string, string>>>({});
  const [completedTemplates, setCompletedTemplates] = useState<string[]>([]);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const template = REPAIR_TEMPLATES[currentTemplate];

  const updateSlot = useCallback((slotId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [template.id]: {
        ...(prev[template.id] || {}),
        [slotId]: value,
      },
    }));
  }, [template.id]);

  const selectSuggestion = useCallback((slotId: string, suggestion: string) => {
    haptics.tap();
    updateSlot(slotId, suggestion);
  }, [haptics, updateSlot]);

  const isTemplateComplete = useCallback(() => {
    const templateResponses = responses[template.id] || {};
    return template.slots.every(slot => templateResponses[slot.id]?.trim().length > 0);
  }, [responses, template]);

  const completeTemplate = useCallback(() => {
    haptics.playConfetti();

    const newCompleted = [...completedTemplates, template.id];
    setCompletedTemplates(newCompleted);

    if (currentTemplate < REPAIR_TEMPLATES.length - 1) {
      // Fade out and switch
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
        setCurrentTemplate(currentTemplate + 1);
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
      });
    } else {
      // All done
      const stepResponses: StepResponseEntry[] = [
        {
          step: 1,
          prompt: 'Repair Sentence Builder',
          response: JSON.stringify({
            templates: REPAIR_TEMPLATES.map(t => ({
              id: t.id,
              responses: responses[t.id] || {},
            })),
            completedAll: newCompleted.length === REPAIR_TEMPLATES.length,
          }),
          type: 'interactive',
        },
      ];
      onComplete(stepResponses);
    }
  }, [completedTemplates, currentTemplate, template, responses, haptics, fadeAnim, onComplete]);

  // Build preview text
  const buildPreview = useCallback(() => {
    const templateResponses = responses[template.id] || {};
    let text = template.fixedPrefix ? `${template.fixedPrefix} ` : '';
    text += template.slots
      .map(slot => `${slot.label.replace(':', '')} ${templateResponses[slot.id] || '___'}.`)
      .join(' ');
    return text;
  }, [responses, template]);

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Progress */}
      <View style={styles.progressRow}>
        {REPAIR_TEMPLATES.map((t, idx) => (
          <View
            key={t.id}
            style={[
              styles.progressDot,
              idx === currentTemplate && styles.progressDotActive,
              completedTemplates.includes(t.id) && styles.progressDotDone,
            ]}
          />
        ))}
      </View>

      {/* Vulnerability indicator */}
      <View style={styles.vulnerabilityRow}>
        <Text style={styles.vulnerabilityLabel}>VULNERABILITY LEVEL</Text>
        {[1, 2, 3].map(level => (
          <View
            key={level}
            style={[
              styles.vulnerabilityDot,
              level <= template.vulnerability && styles.vulnerabilityDotActive,
            ]}
          />
        ))}
      </View>

      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.templateTitle}>{template.title}</Text>

        {template.fixedPrefix && (
          <Text style={styles.fixedPrefix}>{template.fixedPrefix}</Text>
        )}

        {template.slots.map(slot => (
          <View key={slot.id} style={styles.slotContainer}>
            <Text style={styles.slotLabel}>{slot.label}</Text>
            <TextInput
              style={styles.slotInput}
              placeholder={slot.placeholder}
              placeholderTextColor={Colors.textMuted}
              value={responses[template.id]?.[slot.id] || ''}
              onChangeText={(text) => updateSlot(slot.id, text)}
              multiline
              textAlignVertical="top"
            />

            {/* Suggestion chips */}
            {template.suggestions[slot.id] && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.suggestionsRow}
              >
                {template.suggestions[slot.id].map(suggestion => (
                  <TouchableOpacity
                    key={suggestion}
                    style={styles.suggestionChip}
                    onPress={() => selectSuggestion(slot.id, suggestion)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        ))}

        {/* Preview */}
        {isTemplateComplete() && (
          <View style={styles.previewCard}>
            <Text style={styles.previewLabel}>YOUR REPAIR SENTENCE</Text>
            <Text style={styles.previewText}>{buildPreview()}</Text>
          </View>
        )}
      </Animated.View>

      <TouchableOpacity
        style={[
          styles.actionButton,
          !isTemplateComplete() && styles.actionButtonDisabled,
        ]}
        onPress={completeTemplate}
        disabled={!isTemplateComplete()}
        activeOpacity={0.7}
      >
        <Text style={styles.actionButtonText}>
          {currentTemplate < REPAIR_TEMPLATES.length - 1 ? 'NEXT TEMPLATE' : 'COMPLETE'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: 100,
  },

  // ─── Progress ──────────────────────
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.borderLight,
  },
  progressDotActive: {
    backgroundColor: MC3_PALETTE.amber,
    width: 24,
  },
  progressDotDone: {
    backgroundColor: MC3_PALETTE.repairGreen,
  },

  // ─── Vulnerability ─────────────────
  vulnerabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: Spacing.lg,
  },
  vulnerabilityLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    color: Colors.textMuted,
    marginRight: 4,
  },
  vulnerabilityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.borderLight,
  },
  vulnerabilityDotActive: {
    backgroundColor: MC3_PALETTE.warmCoral,
  },

  // ─── Template ──────────────────────
  templateTitle: {
    fontSize: FontSizes.headingS,
    fontFamily: FontFamilies.heading,
    fontWeight: '800',
    letterSpacing: 2,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  fixedPrefix: {
    fontSize: FontSizes.body,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: Spacing.lg,
    lineHeight: 24,
  },
  slotContainer: {
    marginBottom: Spacing.lg,
  },
  slotLabel: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: MC3_PALETTE.amber,
    marginBottom: Spacing.xs,
  },
  slotInput: {
    backgroundColor: MC3_PALETTE.paper,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: 14,
    fontSize: FontSizes.body,
    color: Colors.text,
    minHeight: 60,
  },
  suggestionsRow: {
    marginTop: Spacing.xs,
    flexDirection: 'row',
  },
  suggestionChip: {
    backgroundColor: MC3_PALETTE.amber + '15',
    borderRadius: BorderRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: Spacing.xs,
    borderWidth: 1,
    borderColor: MC3_PALETTE.amber + '30',
  },
  suggestionText: {
    fontSize: 12,
    color: MC3_PALETTE.amber,
    fontWeight: '500',
  },

  // ─── Preview ───────────────────────
  previewCard: {
    backgroundColor: MC3_PALETTE.gold + '15',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: MC3_PALETTE.gold,
  },
  previewLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: MC3_PALETTE.amber,
    marginBottom: Spacing.xs,
  },
  previewText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
    fontStyle: 'italic',
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
