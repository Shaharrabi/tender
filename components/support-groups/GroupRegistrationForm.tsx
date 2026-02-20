/**
 * GroupRegistrationForm — Registration form with pre-filled data and consent.
 *
 * Pre-fills preferred name from user profile. Collects timezone,
 * preferred times, therapy status, emergency contact, and consent.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { CheckmarkIcon, ArrowLeftIcon } from '@/assets/graphics/icons';
import ConsentText from './ConsentText';
import type { SupportGroup, RegistrationFormData, SupportGroupType } from '@/types/support-groups';

// ─── Props ─────────────────────────────────────────────

interface GroupRegistrationFormProps {
  group: SupportGroup;
  userDisplayName: string | null;
  userEmail: string | null;
  attachmentLabel: string | null;
  onSubmit: (formData: RegistrationFormData) => void;
  onBack: () => void;
  onSwitchGroup: () => void;
  otherGroupName: string;
}

// ─── Time Options ──────────────────────────────────────

const TIME_SLOTS = [
  { key: 'mon_eve', label: 'Mon Eve' },
  { key: 'tue_eve', label: 'Tue Eve' },
  { key: 'wed_eve', label: 'Wed Eve' },
  { key: 'thu_eve', label: 'Thu Eve' },
  { key: 'sat_morn', label: 'Sat Morn' },
  { key: 'sun_morn', label: 'Sun Morn' },
];

// ─── Component ─────────────────────────────────────────

export default function GroupRegistrationForm({
  group,
  userDisplayName,
  userEmail,
  attachmentLabel,
  onSubmit,
  onBack,
  onSwitchGroup,
  otherGroupName,
}: GroupRegistrationFormProps) {
  const [preferredName, setPreferredName] = useState(userDisplayName ?? '');
  const [timezone, setTimezone] = useState('');
  const [preferredTimes, setPreferredTimes] = useState<string[]>([]);
  const [inTherapy, setInTherapy] = useState<boolean | null>(null);
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);

  // Auto-detect timezone
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimezone(tz);
    } catch {
      setTimezone('America/New_York');
    }
  }, []);

  const toggleTime = (key: string) => {
    setPreferredTimes((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const canSubmit =
    preferredName.trim().length > 0 &&
    preferredTimes.length > 0 &&
    inTherapy !== null &&
    consentGiven;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      preferredName: preferredName.trim(),
      timezone,
      preferredTimes,
      inTherapy,
      emergencyContactName: emergencyName.trim(),
      emergencyContactPhone: emergencyPhone.trim(),
      consentGiven,
    });
  };

  const accentColor = group.groupType === 'avoidant'
    ? Colors.attachmentAvoidant
    : Colors.attachmentAnxious;

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
        <ArrowLeftIcon size={16} color={Colors.primary} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Join: {group.name}</Text>
      <Text style={[styles.subtitle, { color: accentColor }]}>
        {group.groupType === 'anxious' ? 'Anxious Attachment Group' : 'Avoidant Attachment Group'}
      </Text>

      {/* Pre-filled section */}
      <View style={styles.prefilledCard}>
        <Text style={styles.prefilledLabel}>PRE-FILLED FROM YOUR PROFILE</Text>
        <View style={styles.prefilledRow}>
          <Text style={styles.prefilledKey}>Name</Text>
          <Text style={styles.prefilledValue}>{userDisplayName || 'Not set'}</Text>
        </View>
        <View style={styles.prefilledRow}>
          <Text style={styles.prefilledKey}>Email</Text>
          <Text style={styles.prefilledValue}>{userEmail || 'Not available'}</Text>
        </View>
        {attachmentLabel && (
          <View style={styles.prefilledRow}>
            <Text style={styles.prefilledKey}>Pattern</Text>
            <Text style={styles.prefilledValue}>{attachmentLabel}</Text>
          </View>
        )}
        <TouchableOpacity onPress={onSwitchGroup} activeOpacity={0.7}>
          <Text style={[styles.switchText, { color: accentColor }]}>
            Not the right group? Switch to {otherGroupName} {'\u2192'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Form fields */}
      <Text style={styles.sectionTitle}>A FEW MORE THINGS</Text>

      {/* Preferred name */}
      <Text style={styles.fieldLabel}>What should we call you in group?</Text>
      <TextInput
        style={styles.input}
        value={preferredName}
        onChangeText={setPreferredName}
        placeholder="Your preferred name"
        placeholderTextColor={Colors.textMuted}
      />

      {/* Timezone */}
      <Text style={styles.fieldLabel}>Your timezone</Text>
      <View style={styles.readonlyField}>
        <Text style={styles.readonlyText}>
          {timezone.replace(/_/g, ' ')} (auto-detected)
        </Text>
      </View>

      {/* Preferred times */}
      <Text style={styles.fieldLabel}>When works for you?</Text>
      <View style={styles.timeGrid}>
        {TIME_SLOTS.map((slot) => {
          const selected = preferredTimes.includes(slot.key);
          return (
            <TouchableOpacity
              key={slot.key}
              style={[
                styles.timeChip,
                selected && { backgroundColor: accentColor + '20', borderColor: accentColor },
              ]}
              onPress={() => toggleTime(slot.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.timeChipText,
                  selected && { color: accentColor, fontWeight: '600' },
                ]}
              >
                {slot.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* In therapy? */}
      <Text style={styles.fieldLabel}>Are you currently in therapy?</Text>
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            inTherapy === true && { backgroundColor: Colors.success + '20', borderColor: Colors.success },
          ]}
          onPress={() => setInTherapy(true)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.toggleText,
              inTherapy === true && { color: Colors.success, fontWeight: '600' },
            ]}
          >
            Yes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            inTherapy === false && { backgroundColor: Colors.textMuted + '20', borderColor: Colors.textMuted },
          ]}
          onPress={() => setInTherapy(false)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.toggleText,
              inTherapy === false && { color: Colors.text, fontWeight: '600' },
            ]}
          >
            No
          </Text>
        </TouchableOpacity>
      </View>

      {/* Emergency contact */}
      <Text style={styles.fieldLabel}>Emergency contact (recommended)</Text>
      <TextInput
        style={styles.input}
        value={emergencyName}
        onChangeText={setEmergencyName}
        placeholder="Name"
        placeholderTextColor={Colors.textMuted}
      />
      <TextInput
        style={[styles.input, { marginTop: Spacing.sm }]}
        value={emergencyPhone}
        onChangeText={setEmergencyPhone}
        placeholder="Phone"
        placeholderTextColor={Colors.textMuted}
        keyboardType="phone-pad"
      />

      {/* Consent */}
      <View style={styles.consentSection}>
        <TouchableOpacity
          style={styles.consentCheckRow}
          onPress={() => setConsentGiven(!consentGiven)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, consentGiven && styles.checkboxChecked]}>
            {consentGiven && <CheckmarkIcon size={14} color={Colors.white} />}
          </View>
          <Text style={styles.consentLabel}>
            I have read and agree to the Group Agreement
          </Text>
        </TouchableOpacity>
        <ConsentText />
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[
          styles.submitBtn,
          { backgroundColor: canSubmit ? accentColor : Colors.textMuted + '40' },
        ]}
        onPress={handleSubmit}
        disabled={!canSubmit}
        activeOpacity={0.7}
      >
        <Text style={styles.submitText}>Register for Group</Text>
      </TouchableOpacity>

      <View style={{ height: Spacing.xxl }} />
    </ScrollView>
  );
}

// ─── Styles ────────────────────────────────────────────

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: Spacing.xxxl,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  backText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },

  title: {
    fontFamily: FontFamilies.accent,
    fontSize: FontSizes.headingL,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    marginBottom: Spacing.lg,
  },

  // Pre-filled card
  prefilledCard: {
    backgroundColor: Colors.backgroundAlt || Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  prefilledLabel: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  prefilledRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  prefilledKey: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
  },
  prefilledValue: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    fontWeight: '500',
  },
  switchText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },

  // Form
  sectionTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    fontWeight: '500',
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  input: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.text,
  },
  readonlyField: {
    backgroundColor: Colors.backgroundAlt || Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  readonlyText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
  },

  // Time grid
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  timeChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceElevated,
  },
  timeChipText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
  },

  // Toggle buttons
  toggleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  toggleBtn: {
    flex: 1,
    height: 44,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
  },
  toggleText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
  },

  // Consent
  consentSection: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  consentCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  consentLabel: {
    flex: 1,
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
  },

  // Submit
  submitBtn: {
    height: 48,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
    ...Shadows.card,
  },
  submitText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    fontWeight: '700',
    color: Colors.white,
  },
});
