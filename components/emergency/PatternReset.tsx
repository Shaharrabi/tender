/**
 * PatternReset — Emergency pattern-interrupt component.
 *
 * Two-phase interaction:
 *   1. Compact trigger bar with two buttons: "I'm activated" / "I'm shut down"
 *   2. Tapping either opens a full-screen guided reset player with:
 *      - Matched audio (based on cyclePosition + activation state)
 *      - Grounding text + breathing cue
 *      - Progress bar + close button
 *
 * Uses portrait.negativeCycle.position for personalized reset selection.
 * Falls back to generic resets if no portrait exists.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import {
  Colors,
  Spacing,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import {
  HeartPulseIcon,
  SnowflakeIcon,
  FireIcon,
} from '@/assets/graphics/icons';
import type { IndividualPortrait } from '@/types/portrait';
import {
  selectResetScript,
  type ActivationState,
  type ResetScript,
} from '@/utils/emergency/resetScripts';
import PatternResetPlayer from './PatternResetPlayer';

interface PatternResetProps {
  portrait: IndividualPortrait | null;
}

export default function PatternReset({ portrait }: PatternResetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeScript, setActiveScript] = useState<ResetScript | null>(null);
  const [activationState, setActivationState] = useState<ActivationState | null>(null);

  const handleActivated = useCallback(() => {
    const script = selectResetScript('activated', portrait);
    setActiveScript(script);
    setActivationState('activated');
    setIsOpen(true);
  }, [portrait]);

  const handleShutdown = useCallback(() => {
    const script = selectResetScript('shutdown', portrait);
    setActiveScript(script);
    setActivationState('shutdown');
    setIsOpen(true);
  }, [portrait]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setActiveScript(null);
    setActivationState(null);
  }, []);

  return (
    <>
      {/* ── Compact Trigger Bar ── */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.triggerBar}>
        <View style={styles.triggerHeader}>
          <HeartPulseIcon size={14} color={Colors.accent} />
          <Text style={styles.triggerLabel}>PATTERN RESET</Text>
        </View>

        <View style={styles.triggerButtons}>
          <TouchableOpacity
            style={[styles.triggerButton, styles.activatedButton]}
            onPress={handleActivated}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="I'm activated — start calming reset"
          >
            <FireIcon size={14} color={'#B85C38'} />
            <Text style={[styles.triggerButtonText, styles.activatedText]}>
              I'm activated
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.triggerButton, styles.shutdownButton]}
            onPress={handleShutdown}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="I'm shut down — start warming reset"
          >
            <SnowflakeIcon size={14} color={Colors.calm} />
            <Text style={[styles.triggerButtonText, styles.shutdownText]}>
              I'm shut down
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ── Full-Screen Reset Player ── */}
      {isOpen && activeScript && (
        <Modal
          visible={isOpen}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={handleClose}
        >
          <PatternResetPlayer
            script={activeScript}
            activationState={activationState!}
            onClose={handleClose}
          />
        </Modal>
      )}
    </>
  );
}

// ResetPlayer is now in PatternResetPlayer.tsx (shared with ResetLibrary)

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  // ── Trigger bar (home screen) ──
  triggerBar: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  triggerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  triggerLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 1.5,
  },
  triggerButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  triggerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  activatedButton: {
    backgroundColor: '#FFF0E6',
    borderColor: '#E8A87C40',
  },
  shutdownButton: {
    backgroundColor: '#E8F0F8',
    borderColor: '#89B0D040',
  },
  triggerButtonText: {
    fontFamily: FontFamilies.heading,
    fontSize: 13,
    fontWeight: '600',
  },
  activatedText: {
    color: '#B85C38',
  },
  shutdownText: {
    color: '#4A6FA5',
  },
});
