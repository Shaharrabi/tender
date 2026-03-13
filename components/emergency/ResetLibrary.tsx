/**
 * ResetLibrary — Browsable library of all 6 pattern-reset audio scripts.
 *
 * Used in the Couple Portal so both partners can access every reset,
 * organized as Hot (activated) and Cold (shutdown).
 *
 * Hot  (🔥): R-1 Slow Your Reach, R-3 Anchor Before You Leave, R-5 Steady the Swing
 * Cold (❄️): R-2 Thaw the Freeze, R-4 Gentle Re-Entry, R-6 Find Your Center
 *
 * Tapping a card opens the same full-screen ResetPlayer from PatternReset.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import {
  Colors,
  Spacing,
  FontFamilies,
  FontSizes,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import {
  HeartPulseIcon,
  FireIcon,
  SnowflakeIcon,
} from '@/assets/graphics/icons';
import {
  getResetScript,
  type ResetScript,
  type ActivationState,
} from '@/utils/emergency/resetScripts';

// Import ResetPlayer from PatternReset — it's not exported, so we
// duplicate a lightweight version that accepts script + activationState.
// Actually, let's just re-export ResetPlayer. But it's not exported...
// We'll import the whole PatternReset module approach differently.
// Simplest: inline the Modal + player by importing the core player.

// Since ResetPlayer is not exported from PatternReset, we import it
// via a small wrapper. Let's make it work by re-using the same modal pattern.
import PatternResetPlayer from './PatternResetPlayer';

// ─── Script Groups ───────────────────────────────────────

const HOT_SCRIPTS = ['R-1', 'R-3', 'R-5'] as const;
const COLD_SCRIPTS = ['R-2', 'R-4', 'R-6'] as const;

export default function ResetLibrary() {
  const [activeScript, setActiveScript] = useState<ResetScript | null>(null);
  const [activationState, setActivationState] = useState<ActivationState>('activated');
  const [isOpen, setIsOpen] = useState(false);

  const openScript = useCallback((id: string, state: ActivationState) => {
    const script = getResetScript(id);
    if (!script) return;
    setActiveScript(script);
    setActivationState(state);
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setActiveScript(null);
  }, []);

  return (
    <>
      <View style={styles.container}>
        {/* Hot / Activated resets */}
        <Animated.View entering={FadeIn.duration(400)}>
          <View style={styles.groupHeader}>
            <FireIcon size={14} color="#B85C38" />
            <Text style={styles.groupLabel}>WHEN YOU'RE ACTIVATED</Text>
          </View>
          <Text style={styles.groupSubtitle}>
            Heart racing, words rushing out, chasing connection
          </Text>
          <View style={styles.cardList}>
            {HOT_SCRIPTS.map((id, i) => {
              const script = getResetScript(id);
              if (!script) return null;
              return (
                <Animated.View key={id} entering={FadeInDown.duration(300).delay(i * 80)}>
                  <TouchableOpacity
                    style={[styles.card, styles.hotCard]}
                    onPress={() => openScript(id, 'activated')}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`Play ${script.title}`}
                  >
                    <View style={styles.cardContent}>
                      <Text style={[styles.cardTitle, styles.hotTitle]}>{script.title}</Text>
                      <Text style={styles.cardTagline}>{script.tagline}</Text>
                    </View>
                    <Text style={[styles.cardDuration, styles.hotDuration]}>{script.duration}</Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>

        {/* Cold / Shutdown resets */}
        <Animated.View entering={FadeIn.duration(400).delay(200)}>
          <View style={[styles.groupHeader, { marginTop: Spacing.lg }]}>
            <SnowflakeIcon size={14} color={Colors.calm} />
            <Text style={styles.groupLabel}>WHEN YOU'RE SHUT DOWN</Text>
          </View>
          <Text style={styles.groupSubtitle}>
            Numb, frozen, wanting to disappear or leave the room
          </Text>
          <View style={styles.cardList}>
            {COLD_SCRIPTS.map((id, i) => {
              const script = getResetScript(id);
              if (!script) return null;
              return (
                <Animated.View key={id} entering={FadeInDown.duration(300).delay(200 + i * 80)}>
                  <TouchableOpacity
                    style={[styles.card, styles.coldCard]}
                    onPress={() => openScript(id, 'shutdown')}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`Play ${script.title}`}
                  >
                    <View style={styles.cardContent}>
                      <Text style={[styles.cardTitle, styles.coldTitle]}>{script.title}</Text>
                      <Text style={styles.cardTagline}>{script.tagline}</Text>
                    </View>
                    <Text style={[styles.cardDuration, styles.coldDuration]}>{script.duration}</Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>
      </View>

      {/* Full-Screen Reset Player */}
      {isOpen && activeScript && (
        <Modal
          visible={isOpen}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={handleClose}
        >
          <PatternResetPlayer
            script={activeScript}
            activationState={activationState}
            onClose={handleClose}
          />
        </Modal>
      )}
    </>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  groupLabel: {
    fontFamily: FontFamilies.body,
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 1.5,
  },
  groupSubtitle: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: Spacing.sm,
  },
  cardList: {
    gap: Spacing.xs,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  hotCard: {
    backgroundColor: '#FFF0E6',
    borderColor: '#E8A87C40',
  },
  coldCard: {
    backgroundColor: '#E8F0F8',
    borderColor: '#89B0D040',
  },
  cardContent: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    fontWeight: '600',
  },
  hotTitle: {
    color: '#B85C38',
  },
  coldTitle: {
    color: '#4A6FA5',
  },
  cardTagline: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
  },
  cardDuration: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    marginLeft: Spacing.sm,
  },
  hotDuration: {
    color: '#B85C38',
  },
  coldDuration: {
    color: '#4A6FA5',
  },
});
