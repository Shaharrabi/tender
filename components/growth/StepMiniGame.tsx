/**
 * StepMiniGame — Container that loads the correct mini-game by step number.
 *
 * Each step has a unique interactive exercise that generates insights
 * for the journal. This wrapper handles routing + save logic.
 */

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useAuth } from '@/context/AuthContext';
import { saveMiniGameOutput } from '@/services/minigames';
import { TWELVE_STEPS } from '@/utils/steps/twelve-steps';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import type { MiniGameOutput } from '@/types/growth';

// Mini-game components
import PatternSpotter from './mini-games/PatternSpotter';
import BidOrMiss from './mini-games/BidOrMiss';
import StoryVsTruth from './mini-games/StoryVsTruth';
import MyHorseman from './mini-games/MyHorseman';
import TheUnsaid from './mini-games/TheUnsaid';
import BehindTheWall from './mini-games/BehindTheWall';
import RitualBuilder from './mini-games/RitualBuilder';
import RepairInventory from './mini-games/RepairInventory';
import SoftStartupSim from './mini-games/SoftStartupSim';
import PatternCheckIn from './mini-games/PatternCheckIn';
import TheThirdVoice from './mini-games/TheThirdVoice';
import RelationshipManifesto from './mini-games/RelationshipManifesto';

export interface MiniGameComponentProps {
  onComplete: (result: { title: string; insights: string[]; data: Record<string, any> }) => void;
  onSkip: () => void;
  phaseColor: string;
}

const GAME_COMPONENTS: Record<string, React.ComponentType<MiniGameComponentProps>> = {
  'pattern-spotter': PatternSpotter,
  'bid-or-miss': BidOrMiss,
  'story-vs-truth': StoryVsTruth,
  'my-horseman': MyHorseman,
  'the-unsaid': TheUnsaid,
  'behind-the-wall': BehindTheWall,
  'ritual-builder': RitualBuilder,
  'repair-inventory': RepairInventory,
  'soft-startup-sim': SoftStartupSim,
  'pattern-check-in': PatternCheckIn,
  'the-third-voice': TheThirdVoice,
  'relationship-manifesto': RelationshipManifesto,
};

interface StepMiniGameProps {
  stepNumber: number;
  onComplete: (output: MiniGameOutput) => void;
  onSkip: () => void;
}

export default function StepMiniGame({ stepNumber, onComplete, onSkip }: StepMiniGameProps) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const step = TWELVE_STEPS.find((s) => s.stepNumber === stepNumber);
  const gameId = step?.miniGameId;
  const GameComponent = gameId ? GAME_COMPONENTS[gameId] : null;

  // Phase color for theming the game
  const phaseColor =
    stepNumber <= 2 ? Colors.primaryDark :
    stepNumber <= 5 ? Colors.secondary :
    stepNumber <= 8 ? Colors.accent :
    stepNumber <= 10 ? Colors.success :
    Colors.accentGold;

  const handleGameComplete = useCallback(
    async (result: { title: string; insights: string[]; data: Record<string, any> }) => {
      if (!user || !gameId || saving) return;
      setSaving(true);
      try {
        const output = await saveMiniGameOutput(user.id, stepNumber, gameId, result);
        onComplete(output);
      } catch (err) {
        console.warn('[StepMiniGame] Save error:', err);
        // Still complete the game locally
        onComplete({
          userId: user.id,
          stepNumber,
          gameId,
          title: result.title,
          insights: result.insights,
          data: result.data,
          completedAt: new Date().toISOString(),
        });
      } finally {
        setSaving(false);
      }
    },
    [user, stepNumber, gameId, saving, onComplete]
  );

  if (!GameComponent) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>
          This exercise is coming soon.
        </Text>
        <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (saving) {
    return (
      <Animated.View entering={FadeIn.duration(300)} style={styles.savingContainer}>
        <ActivityIndicator size="large" color={phaseColor} />
        <Text style={styles.savingText}>Saving your insight...</Text>
      </Animated.View>
    );
  }

  return <GameComponent onComplete={handleGameComplete} onSkip={onSkip} phaseColor={phaseColor} />;
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  fallbackText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  skipButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  skipText: {
    ...Typography.buttonSmall,
    color: Colors.textSecondary,
  },
  savingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  savingText: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
});
