/**
 * WeeklyCheckInCard — Weekly relational check-in widget
 *
 * Three sliders + optional text, following the CheckInCard.tsx pattern.
 *
 * 1. External Stress: "How much pressure is life putting on your relationship?"
 * 2. Support System: "How supported do you feel by people outside your relationship?"
 * 3. Relationship Satisfaction: "How alive does the space between you feel this week?"
 * + Optional: "What practice felt most alive this week?"
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
import type { WeeklyCheckIn } from '@/types/weare';

// ─── Anchor descriptions ────────────────────────────────

const STRESS_ANCHORS = {
  low: 'Very little pressure',
  high: 'Intense pressure',
};

const SUPPORT_ANCHORS = {
  low: 'Very unsupported',
  high: 'Well supported',
};

const SATISFACTION_ANCHORS = {
  low: 'Disconnected, cold',
  high: 'Deeply alive, warm',
};

// ─── Component ──────────────────────────────────────────

interface WeeklyCheckInCardProps {
  existingCheckIn: WeeklyCheckIn | null;
  onSubmit: (
    externalStress: number,
    supportSystem: number,
    satisfaction: number,
    practiceHighlight?: string,
  ) => Promise<void>;
}

export default function WeeklyCheckInCard({
  existingCheckIn,
  onSubmit,
}: WeeklyCheckInCardProps) {
  const [stress, setStress] = useState(5);
  const [support, setSupport] = useState(5);
  const [satisfaction, setSatisfaction] = useState(5);
  const [highlight, setHighlight] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);

  // ── Already checked in (show summary with Update option) ──
  if (existingCheckIn && !editing) {
    return (
      <View style={styles.card}>
        <View style={styles.checkedInHeader}>
          <View style={styles.checkCircle}>
            <Text style={styles.checkMark}>{'✓'}</Text>
          </View>
          <Text style={styles.checkedInTitle}>Weekly check-in complete</Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Life Pressure</Text>
            <Text style={styles.summaryValue}>
              {existingCheckIn.externalStressLevel}/10
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Support</Text>
            <Text style={styles.summaryValue}>
              {existingCheckIn.supportSystemRating}/10
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Aliveness</Text>
            <Text style={styles.summaryValue}>
              {existingCheckIn.relationshipSatisfaction}/10
            </Text>
          </View>
        </View>

        {existingCheckIn.practiceHighlight ? (
          <Text style={styles.notePreview}>
            {existingCheckIn.practiceHighlight}
          </Text>
        ) : null}

        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => {
            setStress(existingCheckIn.externalStressLevel);
            setSupport(existingCheckIn.supportSystemRating);
            setSatisfaction(existingCheckIn.relationshipSatisfaction);
            setHighlight(existingCheckIn.practiceHighlight ?? '');
            setEditing(true);
          }}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Update weekly check-in"
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
      await onSubmit(stress, support, satisfaction, highlight || undefined);
      setEditing(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.formTitle}>
        {editing ? 'Update Weekly Check-In' : 'Weekly Check-In'}
      </Text>
      <Text style={styles.formSubtitle}>
        {editing
          ? 'Adjust your reflections to match where you are now.'
          : 'Take a moment to notice the space between you this week.'}
      </Text>

      {/* ── External Stress ─────────────────────── */}
      <View style={styles.sliderSection}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>
            How Much Pressure Is Life Putting on Your Relationship?
          </Text>
          <Text style={styles.sliderValue}>{stress}/10</Text>
        </View>

        <Text style={styles.sliderDescription}>
          Work, health, finances, family — pressures that come from outside
          the relationship but affect the space between you.
        </Text>

        <View style={styles.sliderTrack}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
            <TouchableOpacity
              key={val}
              style={[
                styles.sliderDot,
                val <= stress && styles.sliderDotActive,
                val <= stress && { backgroundColor: Colors.secondary },
              ]}
              onPress={() => setStress(val)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Life pressure: ${val} of 10`}
              accessibilityState={{ selected: val === stress }}
            />
          ))}
        </View>

        <View style={styles.anchorRow}>
          <Text style={styles.anchorLeft}>{STRESS_ANCHORS.low}</Text>
          <Text style={styles.anchorRight}>{STRESS_ANCHORS.high}</Text>
        </View>
      </View>

      {/* ── Support System ──────────────────────── */}
      <View style={styles.sliderSection}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>
            How Supported Do You Feel Outside Your Relationship?
          </Text>
          <Text style={styles.sliderValue}>{support}/10</Text>
        </View>

        <Text style={styles.sliderDescription}>
          Friends, family, community — people who nourish you beyond your
          partner.
        </Text>

        <View style={styles.sliderTrack}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
            <TouchableOpacity
              key={val}
              style={[
                styles.sliderDot,
                val <= support && styles.sliderDotActive,
                val <= support && { backgroundColor: Colors.calm },
              ]}
              onPress={() => setSupport(val)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Support level: ${val} of 10`}
              accessibilityState={{ selected: val === support }}
            />
          ))}
        </View>

        <View style={styles.anchorRow}>
          <Text style={styles.anchorLeft}>{SUPPORT_ANCHORS.low}</Text>
          <Text style={styles.anchorRight}>{SUPPORT_ANCHORS.high}</Text>
        </View>
      </View>

      {/* ── Relationship Satisfaction ────────────── */}
      <View style={styles.sliderSection}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>
            How Alive Does the Space Between You Feel?
          </Text>
          <Text style={styles.sliderValue}>{satisfaction}/10</Text>
        </View>

        <Text style={styles.sliderDescription}>
          The quality of connection this week — not how much time you spent,
          but how alive it felt.
        </Text>

        <View style={styles.sliderTrack}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
            <TouchableOpacity
              key={val}
              style={[
                styles.sliderDot,
                val <= satisfaction && styles.sliderDotActive,
                val <= satisfaction && { backgroundColor: Colors.primary },
              ]}
              onPress={() => setSatisfaction(val)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Relationship aliveness: ${val} of 10`}
              accessibilityState={{ selected: val === satisfaction }}
            />
          ))}
        </View>

        <View style={styles.anchorRow}>
          <Text style={styles.anchorLeft}>{SATISFACTION_ANCHORS.low}</Text>
          <Text style={styles.anchorRight}>{SATISFACTION_ANCHORS.high}</Text>
        </View>
      </View>

      {/* ── Practice Highlight (optional) ────────── */}
      <TextInput
        style={styles.noteInput}
        placeholder="What practice felt most alive this week? (optional)"
        placeholderTextColor={Colors.textMuted}
        value={highlight}
        onChangeText={setHighlight}
        multiline
        numberOfLines={2}
        textAlignVertical="top"
        accessibilityRole="text"
        accessibilityLabel="Practice highlight note"
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
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.card,
  },

  // ── Checked-in state ──────────────────────────────────
  checkedInHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
    fontSize: FontSizes.body,
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
    height: 28,
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
    fontSize: FontSizes.headingM,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  formSubtitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: -Spacing.sm,
  },

  // ── Slider ────────────────────────────────────────────
  sliderSection: {
    gap: Spacing.xs,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderLabel: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: Spacing.sm,
  },
  sliderDescription: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  sliderValue: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  sliderTrack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
    marginTop: 2,
  },
  anchorLeft: {
    fontSize: FontSizes.caption - 1,
    color: Colors.textMuted,
    textAlign: 'left',
    flex: 1,
  },
  anchorRight: {
    fontSize: FontSizes.caption - 1,
    color: Colors.textMuted,
    textAlign: 'right',
    flex: 1,
  },

  // ── Note ──────────────────────────────────────────────
  noteInput: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.sm,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    minHeight: 60,
  },

  // ── Submit ────────────────────────────────────────────
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    fontSize: FontSizes.body,
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
