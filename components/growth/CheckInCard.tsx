/**
 * CheckInCard -- Daily check-in widget, framed through polyvagal theory
 * and Acceptance & Commitment Therapy (ACT) language.
 *
 * Dimension 1 ("mood" internally): Nervous-system state
 *   10 = Ventral vagal  -- grounded, open, connected, safe
 *    5 = Sympathetic     -- activated, on edge, restless
 *    1 = Dorsal vagal    -- shutdown, numb, disconnected (a protective response)
 *
 * Dimension 2 ("relationship" internally): Relational safety / co-regulation
 *   10 = Open, attuned, emotionally available
 *    1 = Withdrawn, guarded, disconnected
 *
 * Prop names and the DailyCheckIn type are intentionally unchanged so
 * the rest of the codebase keeps working without edits.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { CheckmarkIcon } from '@/assets/graphics/icons';
import type { DailyCheckIn } from '@/types/growth';

// ─── Anchor descriptions ────────────────────────────────

const INNER_STATE_ANCHORS = {
  low: 'Shutdown, numb, disconnected',
  mid: 'Activated, on edge, restless',
  high: 'Grounded, open, connected',
};

const CONNECTION_ANCHORS = {
  low: 'Withdrawn, guarded, disconnected',
  high: 'Open, attuned, emotionally available',
};

// ─── Component ──────────────────────────────────────────

interface CheckInCardProps {
  todaysCheckIn: DailyCheckIn | null;
  onSubmit: (
    mood: number,
    relationship: number,
    practiced: boolean,
    note?: string,
  ) => Promise<void>;
}

export default function CheckInCard({
  todaysCheckIn,
  onSubmit,
}: CheckInCardProps) {
  const [mood, setMood] = useState(5);
  const [relationship, setRelationship] = useState(5);
  const [practiced, setPracticed] = useState(false);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);

  // ── Already checked in (show summary with Update option) ──
  if (todaysCheckIn && !editing) {
    return (
      <View style={styles.card}>
        <View style={styles.checkedInHeader}>
          <View style={styles.checkCircle}>
            <CheckmarkIcon size={16} color={Colors.textOnPrimary} />
          </View>
          <Text style={styles.checkedInTitle}>Checked in today</Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Inner State</Text>
            <Text style={styles.summaryValue}>
              {todaysCheckIn.moodRating}/10
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Connection</Text>
            <Text style={styles.summaryValue}>
              {todaysCheckIn.relationshipRating}/10
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Practiced</Text>
            <Text style={styles.summaryValue}>
              {todaysCheckIn.practicedGrowthEdge ? 'Yes' : 'No'}
            </Text>
          </View>
        </View>

        {todaysCheckIn.note ? (
          <Text style={styles.notePreview}>{todaysCheckIn.note}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => {
            // Pre-fill form with existing values
            setMood(todaysCheckIn.moodRating);
            setRelationship(todaysCheckIn.relationshipRating);
            setPracticed(todaysCheckIn.practicedGrowthEdge);
            setNote(todaysCheckIn.note ?? '');
            setEditing(true);
          }}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Update check-in"
        >
          <Text style={styles.updateButtonText}>Update Check-In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Check-in form ─────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmit(mood, relationship, practiced, note || undefined);
      setEditing(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.formTitle}>
        {editing ? 'Update Check-In' : 'Daily Check-In'}
      </Text>
      <Text style={styles.formSubtitle}>
        {editing
          ? 'Adjust where you are now.'
          : 'Notice where you are right now.'}
      </Text>

      {/* ── Inner State (nervous-system regulation) ─── */}
      <View style={styles.sliderSection}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>How Regulated Do You Feel?</Text>
          <Text style={styles.sliderValue}>{mood}/10</Text>
        </View>

        <View style={styles.sliderTrack}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
            <TouchableOpacity
              key={val}
              style={[
                styles.sliderDot,
                val <= mood && styles.sliderDotActive,
                val <= mood && { backgroundColor: Colors.calm },
              ]}
              onPress={() => setMood(val)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Regulation rating ${val} of 10`}
            />
          ))}
        </View>

        {/* Anchor labels beneath the dot track */}
        <View style={styles.anchorRow}>
          <Text style={styles.anchorLeft}>{INNER_STATE_ANCHORS.low}</Text>
          <Text style={styles.anchorCenter}>{INNER_STATE_ANCHORS.mid}</Text>
          <Text style={styles.anchorRight}>{INNER_STATE_ANCHORS.high}</Text>
        </View>
      </View>

      {/* ── Connection With Partner ──────────────── */}
      <View style={styles.sliderSection}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>Connection With Partner</Text>
          <Text style={styles.sliderValue}>{relationship}/10</Text>
        </View>

        <View style={styles.sliderTrack}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
            <TouchableOpacity
              key={val}
              style={[
                styles.sliderDot,
                val <= relationship && styles.sliderDotActive,
                val <= relationship && { backgroundColor: Colors.secondary },
              ]}
              onPress={() => setRelationship(val)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Connection rating ${val} of 10`}
            />
          ))}
        </View>

        {/* Anchor labels beneath the dot track */}
        <View style={styles.anchorRow}>
          <Text style={styles.anchorLeft}>{CONNECTION_ANCHORS.low}</Text>
          <Text style={styles.anchorRight}>{CONNECTION_ANCHORS.high}</Text>
        </View>
      </View>

      {/* ── Practiced toggle ─────────────────────── */}
      <TouchableOpacity
        style={styles.toggleRow}
        onPress={() => setPracticed(!practiced)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Practiced a growth edge today, ${practiced ? 'checked' : 'unchecked'}`}
      >
        <View
          style={[
            styles.toggleIndicator,
            practiced && styles.toggleIndicatorActive,
          ]}
        >
          {practiced && <CheckmarkIcon size={14} color={Colors.textOnPrimary} />}
        </View>
        <Text style={styles.toggleLabel}>
          I practiced a growth edge today
        </Text>
      </TouchableOpacity>

      {/* ── Optional note ────────────────────────── */}
      <TextInput
        style={styles.noteInput}
        placeholder="Anything you want to name or notice (optional)"
        placeholderTextColor={Colors.textMuted}
        value={note}
        onChangeText={setNote}
        multiline
        numberOfLines={2}
        textAlignVertical="top"
        accessibilityRole="text"
        accessibilityLabel="Optional note"
      />

      {/* ── Submit button ────────────────────────── */}
      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        activeOpacity={0.7}
        disabled={submitting}
        accessibilityRole="button"
        accessibilityLabel={editing ? 'Save changes' : 'Submit check-in'}
        accessibilityState={{ disabled: submitting }}
      >
        {submitting ? (
          <ActivityIndicator color={Colors.textOnPrimary} size="small" />
        ) : (
          <Text style={styles.submitText}>
            {editing ? 'Save Changes' : 'Submit Check-In'}
          </Text>
        )}
      </TouchableOpacity>

      {editing && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => setEditing(false)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Cancel editing"
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    gap: Spacing.sm,
    ...Shadows.card,
  },

  // ── Checked-in state ──────────────────────────────────
  checkedInHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    fontSize: 16,
    color: Colors.textOnPrimary,
    fontWeight: '700',
  },
  checkedInTitle: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    gap: 2,
  },
  summaryLabel: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.text,
  },
  summaryDivider: {
    width: 1,
    height: 22,
    backgroundColor: Colors.border,
  },
  notePreview: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },

  // ── Form state ────────────────────────────────────────
  formTitle: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  formSubtitle: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: 17,
    marginTop: -Spacing.xs,
  },

  // ── Slider ────────────────────────────────────────────
  sliderSection: {
    gap: 3,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
    color: Colors.text,
  },
  sliderDescription: {
    fontSize: FontSizes.caption - 1,
    color: Colors.textSecondary,
    lineHeight: 15,
  },
  sliderValue: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  sliderTrack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.borderLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sliderDotActive: {
    borderColor: 'transparent',
  },

  // ── Anchor labels beneath sliders ─────────────────────
  anchorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 1,
  },
  anchorLeft: {
    fontSize: FontSizes.caption - 2,
    color: Colors.textMuted,
    textAlign: 'left',
    flex: 1,
  },
  anchorCenter: {
    fontSize: FontSizes.caption - 2,
    color: Colors.textMuted,
    textAlign: 'center',
    flex: 1,
  },
  anchorRight: {
    fontSize: FontSizes.caption - 2,
    color: Colors.textMuted,
    textAlign: 'right',
    flex: 1,
  },

  // ── Toggle ────────────────────────────────────────────
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  toggleIndicator: {
    width: 20,
    height: 20,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleIndicatorActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  toggleCheck: {
    fontSize: 14,
    color: Colors.textOnPrimary,
    fontWeight: '700',
  },
  toggleLabel: {
    fontSize: FontSizes.caption,
    color: Colors.text,
  },

  // ── Note ──────────────────────────────────────────────
  noteInput: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.xs,
    fontSize: FontSizes.caption,
    color: Colors.text,
    minHeight: 44,
  },

  // ── Submit ────────────────────────────────────────────
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.xs + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.textOnPrimary,
  },

  // ── Update / Cancel ────────────────────────────────────
  updateButton: {
    alignItems: 'center',
    paddingVertical: Spacing.xs + 2,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    marginTop: Spacing.xs,
  },
  updateButtonText: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.primary,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  cancelButtonText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
