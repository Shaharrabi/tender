/**
 * StepConceptMap — Maps each healing step to its primary therapeutic concept sticker.
 *
 * Renders a small concept sticker badge alongside the step's teaching content.
 * Used in the "Why This Step Comes Now" and course connection cards.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import ConceptSticker, { type ConceptType } from './ConceptSticker';

// ─── Step → Concept mapping ──────────────────────────────
// Each step's primary therapeutic concept (for visual badge)
const STEP_CONCEPTS: Record<number, ConceptType> = {
  1: 'window-of-tolerance',     // Acknowledging = recognizing nervous system state
  2: 'relational-field',        // Trust the Field = the space between
  3: 'bid-response',            // Turning Toward = responding to bids
  4: 'attachment-styles',       // Softening Defenses = attachment patterns
  5: 'safe-haven',              // Vulnerability = creating safety
  6: 'repair-attempt',          // Rupture & Repair
  7: 'co-regulation',           // Building Trust = syncing together
  8: 'protest-behavior',        // Deepening Intimacy = past push-pull
  9: 'repair-attempt',          // Shared Meaning = rebuilding
  10: 'nervous-system',         // Integration = nervous system awareness
  11: 'co-regulation',          // Sustaining = ongoing co-regulation
  12: 'relational-field',       // Ongoing Practice = tending the field
};

interface StepConceptBadgeProps {
  stepNumber: number;
  size?: number;
}

export function StepConceptBadge({ stepNumber, size = 56 }: StepConceptBadgeProps) {
  const concept = STEP_CONCEPTS[stepNumber];
  if (!concept) return null;

  return (
    <View style={styles.badge}>
      <ConceptSticker concept={concept} size={size} showLabel={false} />
    </View>
  );
}

export function getConceptForStep(stepNumber: number): ConceptType | null {
  return STEP_CONCEPTS[stepNumber] ?? null;
}

const styles = StyleSheet.create({
  badge: {
    opacity: 0.7,
  },
});
