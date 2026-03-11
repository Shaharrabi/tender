/**
 * CouplePlayCard — Interactive couple micro-activity for each step.
 *
 * Lighter and more playful than Partner Exchange.
 * Uses the same write→wait→reveal pattern but with distinct visuals.
 * Rendered as a collapsible section in step-detail.tsx.
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import {
  Colors,
  Spacing,
  FontSizes,
  BorderRadius,
  Shadows,
  Typography,
} from '@/constants/theme';
import { CollapsibleHeader } from '@/components/ui/CollapsibleSection';
import type { CouplePlayActivity } from '@/utils/steps/couple-play';

// ─── Types ──────────────────────────────────────────────

interface CouplePlayCardProps {
  activity: CouplePlayActivity;
  phaseColor: string;
  isExpanded: boolean;
  onToggle: () => void;
  /** Current user's saved response, if any */
  savedResponse: string | null;
  /** Partner's saved response (shown only when both submitted) */
  partnerResponse: string | null;
  /** Follow-up response, if submitted */
  savedFollowUp: string | null;
  /** Handlers */
  onSaveResponse: (text: string) => void;
  onSaveFollowUp: (text: string) => void;
}

// ─── Component ──────────────────────────────────────────

function CouplePlayCard({
  activity,
  phaseColor,
  isExpanded,
  onToggle,
  savedResponse,
  partnerResponse,
  savedFollowUp,
  onSaveResponse,
  onSaveFollowUp,
}: CouplePlayCardProps) {
  const [responseText, setResponseText] = useState('');
  const [followUpText, setFollowUpText] = useState('');

  const hasSubmitted = !!savedResponse;
  const bothSubmitted = hasSubmitted && !!partnerResponse;
  const isComplete = bothSubmitted && !!savedFollowUp;

  return (
    <View style={styles.container}>
      <CollapsibleHeader
        title={`Couple Play: ${activity.name}`}
        subtitle={isComplete ? 'Complete' : bothSubmitted ? 'Both shared \u2014 discuss together' : hasSubmitted ? 'Waiting for partner' : activity.duration}
        isExpanded={isExpanded}
        onToggle={onToggle}
        phaseColor={phaseColor}
      />
      {isExpanded && (
        <Animated.View entering={FadeIn.duration(400)} style={styles.content}>
          {/* Instructions */}
          <View style={[styles.instructionsCard, { borderLeftColor: phaseColor + '60' }]}>
            <Text style={styles.instructionsText}>{activity.instructions}</Text>
          </View>

          {/* Phase: Not submitted yet */}
          {!hasSubmitted && (
            <>
              <Text style={styles.promptText}>{activity.prompt}</Text>
              <TextInput
                style={styles.input}
                multiline
                placeholder="Write your response..."
                placeholderTextColor={Colors.textMuted}
                value={responseText}
                onChangeText={setResponseText}
                textAlignVertical="top"
              />
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  { backgroundColor: phaseColor },
                  !responseText.trim() && styles.submitButtonDisabled,
                ]}
                onPress={() => {
                  if (responseText.trim()) {
                    onSaveResponse(responseText.trim());
                    setResponseText('');
                  }
                }}
                disabled={!responseText.trim()}
                activeOpacity={0.7}
                accessibilityRole="button"
              >
                <Text style={styles.submitButtonText}>Share</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Phase: Submitted, waiting for partner */}
          {hasSubmitted && !bothSubmitted && (
            <>
              <View style={styles.savedCard}>
                <Text style={styles.savedLabel}>YOUR RESPONSE</Text>
                <Text style={styles.savedText}>{savedResponse}</Text>
              </View>
              <Text style={styles.waitingText}>
                Your partner hasn't shared yet \u2014 you'll see their response once they do.
              </Text>
            </>
          )}

          {/* Phase: Both submitted, reveal + follow-up */}
          {bothSubmitted && !isComplete && (
            <>
              <View style={styles.revealRow}>
                <View style={styles.revealCard}>
                  <Text style={styles.savedLabel}>YOU SHARED</Text>
                  <Text style={styles.savedText}>{savedResponse}</Text>
                </View>
                <View style={[styles.revealCard, { borderColor: phaseColor + '40' }]}>
                  <Text style={[styles.savedLabel, { color: Colors.secondary }]}>YOUR PARTNER SHARED</Text>
                  <Text style={[styles.savedText, { fontStyle: 'italic' }]}>{partnerResponse}</Text>
                </View>
              </View>
              <View style={styles.followUpSection}>
                <Text style={styles.followUpPrompt}>{activity.followUp}</Text>
                <TextInput
                  style={styles.input}
                  multiline
                  placeholder="Share your reflection..."
                  placeholderTextColor={Colors.textMuted}
                  value={followUpText}
                  onChangeText={setFollowUpText}
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    { backgroundColor: phaseColor },
                    !followUpText.trim() && styles.submitButtonDisabled,
                  ]}
                  onPress={() => {
                    if (followUpText.trim()) {
                      onSaveFollowUp(followUpText.trim());
                      setFollowUpText('');
                    }
                  }}
                  disabled={!followUpText.trim()}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                >
                  <Text style={styles.submitButtonText}>Save Reflection</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Phase: Complete */}
          {isComplete && (
            <>
              <View style={styles.revealRow}>
                <View style={styles.revealCard}>
                  <Text style={styles.savedLabel}>YOU SHARED</Text>
                  <Text style={styles.savedText}>{savedResponse}</Text>
                </View>
                <View style={[styles.revealCard, { borderColor: phaseColor + '40' }]}>
                  <Text style={[styles.savedLabel, { color: Colors.secondary }]}>YOUR PARTNER SHARED</Text>
                  <Text style={[styles.savedText, { fontStyle: 'italic' }]}>{partnerResponse}</Text>
                </View>
              </View>
              <View style={styles.followUpComplete}>
                <Text style={styles.savedLabel}>YOUR REFLECTION</Text>
                <Text style={styles.savedText}>{savedFollowUp}</Text>
              </View>
            </>
          )}
        </Animated.View>
      )}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  content: {
    gap: Spacing.md,
  },
  instructionsCard: {
    borderLeftWidth: 3,
    paddingLeft: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  instructionsText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  promptText: {
    ...Typography.bodyMedium,
    color: Colors.text,
    lineHeight: 24,
  },
  input: {
    ...Typography.body,
    color: Colors.text,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    minHeight: 80,
    textAlignVertical: 'top' as const,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  submitButton: {
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm + 2,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.4,
  },
  submitButtonText: {
    ...Typography.button,
    color: Colors.white,
  },
  savedCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: 4,
  },
  savedLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    letterSpacing: 1,
    fontSize: 10,
  },
  savedText: {
    ...Typography.bodySmall,
    color: Colors.text,
    lineHeight: 22,
  },
  waitingText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  revealRow: {
    gap: Spacing.sm,
  },
  revealCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  followUpSection: {
    gap: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  followUpPrompt: {
    ...Typography.bodyMedium,
    color: Colors.text,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  followUpComplete: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: 4,
  },
});

export default React.memo(CouplePlayCard);
