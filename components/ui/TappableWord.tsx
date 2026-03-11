/**
 * TappableWord — Tap-to-Define Inline Term
 *
 * Renders a term as a dotted-underlined word that, when tapped,
 * shows a modal popup with the glossary definition. Designed to
 * integrate seamlessly with body text — the term is styled inline
 * with a subtle visual cue (dotted underline + slight color shift).
 *
 * Usage:
 *   <TenderText variant="body">
 *     Your <TappableWord term="attachment style" /> shapes how you connect.
 *   </TenderText>
 *
 *   // Custom display text:
 *   <TappableWord term="negative cycle" display="cycle" />
 *
 *   // Custom styling:
 *   <TappableWord term="regulation" variant="bodySmall" color={Colors.textSecondary} />
 */

import React, { useState, useCallback } from 'react';
import {
  Text,
  Modal,
  View,
  Pressable,
  StyleSheet,
  type TextStyle,
} from 'react-native';
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { lookupTerm, type GlossaryEntry } from '@/constants/glossary';

interface TappableWordProps {
  /** Glossary key (case-insensitive). Must match a key in glossary.ts. */
  term: string;
  /** Override display text. Defaults to the glossary entry's `term` field. */
  display?: string;
  /** Typography variant for the inline word. Defaults to inheriting parent style. */
  variant?: keyof typeof Typography;
  /** Override color for the inline word. */
  color?: string;
  /** Additional style for the inline text. */
  style?: TextStyle;
}

export default function TappableWord({
  term,
  display,
  variant,
  color,
  style,
}: TappableWordProps) {
  const [visible, setVisible] = useState(false);
  const entry = lookupTerm(term);

  const handleOpen = useCallback(() => setVisible(true), []);
  const handleClose = useCallback(() => setVisible(false), []);

  // If the term isn't in the glossary, render plain text (graceful degradation)
  if (!entry) {
    return <Text style={style}>{display ?? term}</Text>;
  }

  const variantStyle = variant ? (Typography[variant] as TextStyle) : {};

  return (
    <>
      <Text
        onPress={handleOpen}
        style={[
          variantStyle,
          styles.word,
          color ? { color } : null,
          style,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${display ?? entry.term}. Tap for definition.`}
        accessibilityHint="Opens a popup with the definition"
      >
        {display ?? entry.term}
      </Text>

      <DefinitionModal
        entry={entry}
        visible={visible}
        onClose={handleClose}
      />
    </>
  );
}

// ─── Definition Modal ──────────────────────────────────

interface DefinitionModalProps {
  entry: GlossaryEntry;
  visible: boolean;
  onClose: () => void;
}

function DefinitionModal({ entry, visible, onClose }: DefinitionModalProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close definition"
      >
        <View style={styles.card} onStartShouldSetResponder={() => true}>
          {/* Term title */}
          <Text style={styles.title}>{entry.term}</Text>

          {/* Definition */}
          <Text style={styles.definition}>{entry.definition}</Text>

          {/* Source citation (if present) */}
          {entry.source && (
            <Text style={styles.source}>{entry.source}</Text>
          )}

          {/* Dismiss hint */}
          <Text style={styles.hint}>Tap anywhere to close</Text>
        </View>
      </Pressable>
    </Modal>
  );
}

// ─── Styles ────────────────────────────────────────────

const styles = StyleSheet.create({
  // Inline word
  word: {
    color: Colors.secondary,
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
    textDecorationColor: Colors.secondaryLight,
  },

  // Modal backdrop
  backdrop: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },

  // Definition card
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    maxWidth: 360,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadows.elevated,
  },

  title: {
    ...Typography.headingM,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },

  definition: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },

  source: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginBottom: Spacing.sm,
  },

  hint: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
});
