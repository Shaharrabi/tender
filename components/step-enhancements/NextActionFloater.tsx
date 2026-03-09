/**
 * NextActionFloater — "What should I do now?" floating card.
 *
 * Positioned above QuickLinksBar. QuickLinksBar wrapper = paddingTop:16 + row ~36 + paddingBottom:24
 * plus optional Home button ~32 = ~108px. We use bottom: 110 to clear it.
 *
 * Verified: FadeInDown/FadeOutDown from reanimated, Shadows.elevated, Colors.white='#FFFFFF'
 */

import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import TenderText from '@/components/ui/TenderText';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

export type NextActionType = 'read' | 'game' | 'practice' | 'reflect' | 'complete';

export interface NextAction {
  type: NextActionType;
  label: string;
  sublabel: string;
  icon: string;
}

interface NextActionFloaterProps {
  action: NextAction | null;
  phaseColor: string;
  onPress: () => void;
}

/** Compute next recommended action from step state. */
export function computeNextAction(opts: {
  hasReadTeaching: boolean;
  hasMiniGameOutput: boolean;
  miniGameDuration?: string;
  practiceCount: number;
  firstPracticeName?: string;
  firstPracticeDuration?: number;
  hasReflection: boolean;
  isStepCompleted: boolean;
}): NextAction | null {
  if (opts.isStepCompleted) return null;
  if (!opts.hasReadTeaching) return { type: 'read', label: 'Read the teaching', sublabel: 'Start with understanding', icon: '\uD83D\uDCD6' };
  if (!opts.hasMiniGameOutput) return { type: 'game', label: 'Try the mini-game', sublabel: opts.miniGameDuration ?? '~3 min activity', icon: '\uD83C\uDF00' };
  if (opts.practiceCount === 0 && opts.firstPracticeName) return { type: 'practice', label: opts.firstPracticeName, sublabel: opts.firstPracticeDuration ? `${opts.firstPracticeDuration} min practice` : 'Your first practice', icon: '\uD83E\uDDD8' };
  if (!opts.hasReflection) return { type: 'reflect', label: 'Write your first reflection', sublabel: '~3 min to reflect', icon: '\u270D\uFE0F' };
  return null;
}

export default function NextActionFloater({ action, phaseColor, onPress }: NextActionFloaterProps) {
  const [dismissed, setDismissed] = useState(false);
  if (!action || dismissed) return null;

  return (
    <Animated.View entering={FadeInDown.delay(800).duration(400)} exiting={FadeOutDown.duration(300)} style={styles.wrapper}>
      <TouchableOpacity style={[styles.card, { borderColor: phaseColor + '30' }]} onPress={onPress} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel={`Next: ${action.label}`}>
        <View style={[styles.iconBox, { backgroundColor: phaseColor + '15' }]}>
          <TenderText variant="headingS" style={{ fontSize: 18 }}>{action.icon}</TenderText>
        </View>
        <View style={styles.content}>
          <TenderText variant="bodyMedium" color={Colors.text} numberOfLines={1}>{action.label}</TenderText>
          <TenderText variant="caption" color={Colors.textMuted}>{action.sublabel}</TenderText>
        </View>
        <TouchableOpacity onPress={() => setDismissed(true)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} accessibilityLabel="Dismiss">
          <TenderText variant="caption" color={Colors.textMuted}>{'\u2715'}</TenderText>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'absolute', bottom: 110, left: Spacing.md, right: Spacing.md, zIndex: 20 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.white, borderRadius: BorderRadius.lg, borderWidth: 1,
    padding: Spacing.sm + 4, ...Shadows.elevated,
  },
  iconBox: { width: 40, height: 40, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, gap: 1 },
});
