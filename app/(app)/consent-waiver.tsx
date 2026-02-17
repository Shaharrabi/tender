/**
 * Consent Waiver Screen
 *
 * A warm, transparent consent flow that lets users choose how their
 * deeply personal assessment data is stored before viewing results.
 *
 * Two paths:
 *  - store_and_share: encrypted storage with sharing & deletion controls
 *  - view_and_erase: one-time view, then permanent erasure
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { saveConsent } from '@/services/consent';
import type { ConsentType } from '@/types/consent';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
  ButtonSizes,
} from '@/constants/theme';
import {
  ShieldIcon,
  EyeIcon,
  CheckmarkIcon,
  ArrowLeftIcon,
} from '@/assets/graphics/icons';
import type { ComponentType } from 'react';
import type { IconProps } from '@/assets/graphics/icons';

// ─── Helpers ──────────────────────────────────────────────

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function buildWaiverText(option: ConsentType, name: string): string {
  const date = formatDate();
  const signer = name.trim() || 'the undersigned';

  if (option === 'store_and_share') {
    return (
      `Data Consent Agreement\n` +
      `Date: ${date}\n\n` +
      `I, ${signer}, acknowledge the following:\n\n` +
      `What was collected:\n` +
      `Through the relationship assessments I completed, data was gathered about my ` +
      `attachment patterns, personality traits, emotional intelligence, conflict style, ` +
      `differentiation of self, and personal values. I understand this paints an intimate ` +
      `picture of who I am in relationships.\n\n` +
      `My choice — Keep My Data:\n` +
      `I have chosen to store my results securely. This means:\n` +
      `  - My data is encrypted at rest and in transit using industry-standard security\n` +
      `  - I control exactly which assessments are shared with my partner\n` +
      `  - I may share a report with my therapist at my discretion\n` +
      `  - I can return and view my results at any time\n` +
      `  - I can permanently delete all of my data at any time from Settings\n\n` +
      `A promise from us:\n` +
      `We will never sell, share, monetize, or use your data for any purpose other than ` +
      `showing it to you and the people you explicitly choose to share it with. Your ` +
      `relationship data is yours. Period.\n\n` +
      `Honest disclosure:\n` +
      `While we use industry-standard security practices (Supabase with encryption at ` +
      `rest and in transit, row-level security, secure authentication), no online system ` +
      `is 100% risk-free. We want you to know that, because transparency matters more ` +
      `to us than fine print.\n\n` +
      `Your rights:\n` +
      `You may revoke this consent and delete all data at any time. No questions asked, ` +
      `no hoops to jump through. Your data, your choice, always.`
    );
  }

  // view_and_erase
  return (
    `Data Consent Agreement\n` +
    `Date: ${date}\n\n` +
    `I, ${signer}, acknowledge the following:\n\n` +
    `What was collected:\n` +
    `Through the relationship assessments I completed, data was gathered about my ` +
    `attachment patterns, personality traits, emotional intelligence, conflict style, ` +
    `differentiation of self, and personal values. I understand this paints an intimate ` +
    `picture of who I am in relationships.\n\n` +
    `My choice — View Once & Erase:\n` +
    `I have chosen to view my results one time and then have everything erased. ` +
    `This means:\n` +
    `  - I will see my full results during this session\n` +
    `  - I may download a PDF copy for my own personal records\n` +
    `  - When I leave the results screen, all data will be permanently deleted ` +
    `from our servers\n` +
    `  - No one will ever see my data — not my partner, not a therapist, not even ` +
    `our team\n` +
    `  - I will not be able to use partner sharing features or Nuance coaching for ` +
    `these results\n\n` +
    `I understand:\n` +
    `Once erased, my data cannot be recovered. If I want to see my results again ` +
    `in the future, I would need to retake the assessments.\n\n` +
    `A promise from us:\n` +
    `We will never sell, share, monetize, or use your data for any purpose. ` +
    `When we say erased, we mean erased — fully and permanently.`
  );
}

// ─── Bullet Item Data ─────────────────────────────────────

const STORE_BULLETS = [
  'Your results are stored securely with end-to-end encryption',
  'You choose exactly which assessments to share with your partner',
  'You can share a report with your therapist',
  'Return and view your results anytime',
  'Delete everything at any time from Settings',
  'We will never sell, share, or use your data for anything other than showing it to you',
];

const ERASE_BULLETS = [
  'See your results one time',
  'Download a PDF copy for your own records',
  'All data permanently deleted from our servers when you leave',
  'No one else will ever see it \u2014 not even us',
  "You won't be able to share with a partner or use Nuance coaching",
];

// ─── Component ────────────────────────────────────────────

export default function ConsentWaiverScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [selectedOption, setSelectedOption] = useState<ConsentType | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [signerName, setSignerName] = useState(user?.email?.split('@')[0] ?? '');
  const [saving, setSaving] = useState(false);

  const waiverText = useMemo(() => {
    if (!selectedOption) return '';
    return buildWaiverText(selectedOption, signerName);
  }, [selectedOption, signerName]);

  const canSubmit = selectedOption !== null && agreed && !saving;

  const handleSubmit = async () => {
    if (!canSubmit || !user || !selectedOption) return;
    setSaving(true);
    try {
      await saveConsent(user.id, selectedOption, waiverText);
      router.replace('/(app)/portrait' as any);
    } catch (e: any) {
      console.error('[ConsentWaiver] Save failed:', e);
      Alert.alert(
        'Something went wrong',
        'We couldn\u2019t save your consent. Please try again.',
        [{ text: 'OK' }],
      );
    } finally {
      setSaving(false);
    }
  };

  // ─── Render Helpers ──────────────────────────────────────

  const renderOptionCard = (
    option: ConsentType,
    IconComp: ComponentType<IconProps>,
    title: string,
    bullets: string[],
    accentColor: string,
    note?: string,
  ) => {
    const isSelected = selectedOption === option;
    return (
      <TouchableOpacity
        key={option}
        style={[
          s.optionCard,
          { borderColor: isSelected ? accentColor : Colors.border },
          isSelected && { backgroundColor: accentColor + '0A' },
        ]}
        onPress={() => {
          setSelectedOption(option);
          // Reset agreement when changing option
          setAgreed(false);
        }}
        activeOpacity={0.7}
      >
        {/* Card Header */}
        <View style={s.optionHeader}>
          <IconComp size={24} color={accentColor} />
          <Text style={[s.optionTitle, isSelected && { color: accentColor }]}>
            {title}
          </Text>
          {/* Radio indicator */}
          <View
            style={[
              s.radioOuter,
              { borderColor: isSelected ? accentColor : Colors.textMuted },
            ]}
          >
            {isSelected && (
              <View style={[s.radioInner, { backgroundColor: accentColor }]} />
            )}
          </View>
        </View>

        {/* Bullet Points */}
        <View style={s.bulletList}>
          {bullets.map((text, i) => (
            <View key={i} style={s.bulletRow}>
              <View style={{ width: 18, alignItems: 'center', paddingTop: 3 }}>
                <CheckmarkIcon size={14} color={accentColor} />
              </View>
              <Text style={s.bulletText}>{text}</Text>
            </View>
          ))}
        </View>

        {/* Optional note */}
        {note && (
          <View style={s.noteContainer}>
            <Text style={s.noteText}>{note}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // ─── Main Render ─────────────────────────────────────────

  return (
    <SafeAreaView style={s.container}>
      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Back Button ───────────── */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <ArrowLeftIcon size={16} color={Colors.primary} />
            <Text style={s.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        {/* ── Section 1: Hero ──────── */}
        <View style={s.heroSection}>
          <ShieldIcon size={56} color={Colors.primary} />
          <Text style={s.heroTitle}>Before You See Your Results</Text>
          <Text style={s.heroSubtitle}>
            We believe in complete transparency about your data.{'\n'}
            Here's what you need to know.
          </Text>
        </View>

        {/* ── Section 2: Context ───── */}
        <View style={s.contextSection}>
          <Text style={s.contextText}>
            You've shared deeply personal information through these assessments
            {' \u2014 '}your attachment patterns, emotional tendencies, values, and more.
            This data paints an intimate picture of who you are in relationships.
          </Text>
          <Text style={[s.contextText, { marginTop: Spacing.sm }]}>
            We take that trust seriously.
          </Text>
        </View>

        {/* ── Section 3: Option Cards ─ */}
        <Text style={s.sectionLabel}>CHOOSE YOUR DATA PATH</Text>

        {renderOptionCard(
          'store_and_share',
          ShieldIcon,
          'Keep My Data',
          STORE_BULLETS,
          Colors.primary,
          'While we use industry-standard security (Supabase, encrypted at rest and in transit), no online system is 100% risk-free.',
        )}

        {renderOptionCard(
          'view_and_erase',
          EyeIcon,
          'View Once & Erase',
          ERASE_BULLETS,
          Colors.calm,
        )}

        {/* ── Section 4: Waiver Text ─ */}
        {selectedOption && (
          <View style={s.waiverSection}>
            <Text style={s.sectionLabel}>YOUR AGREEMENT</Text>
            <View style={s.waiverBox}>
              <ScrollView
                nestedScrollEnabled
                style={s.waiverScroll}
                showsVerticalScrollIndicator
              >
                <Text style={s.waiverText}>{waiverText}</Text>
              </ScrollView>
            </View>
          </View>
        )}

        {/* ── Section 5: Agreement ─── */}
        {selectedOption && (
          <View style={s.agreementSection}>
            {/* Checkbox */}
            <TouchableOpacity
              style={s.checkboxRow}
              onPress={() => setAgreed(!agreed)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  s.checkbox,
                  agreed && s.checkboxChecked,
                ]}
              >
                {agreed && <CheckmarkIcon size={14} color={Colors.textOnPrimary} />}
              </View>
              <Text style={s.checkboxLabel}>
                I understand and agree to the above
              </Text>
            </TouchableOpacity>

            {/* Name Input */}
            <View style={s.nameInputWrapper}>
              <Text style={s.nameLabel}>Your name (optional)</Text>
              <TextInput
                style={s.nameInput}
                value={signerName}
                onChangeText={setSignerName}
                placeholder="Enter your name"
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                s.submitButton,
                !canSubmit && s.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!canSubmit}
              activeOpacity={0.8}
            >
              {saving ? (
                <ActivityIndicator color={Colors.textOnPrimary} size="small" />
              ) : (
                <Text
                  style={[
                    s.submitButtonText,
                    !canSubmit && s.submitButtonTextDisabled,
                  ]}
                >
                  Continue
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom spacing */}
        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },

  // ── Header ──────────────────────────
  header: {
    marginBottom: Spacing.lg,
  },
  backText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },

  // ── Hero ────────────────────────────
  heroSection: {
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  heroIcon: {
    // Kept for layout — now rendered by SVG component
  },
  heroTitle: {
    fontSize: FontSizes.headingXL,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 40,
  },
  heroSubtitle: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: Spacing.xs,
  },

  // ── Context ─────────────────────────
  contextSection: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  contextText: {
    fontSize: FontSizes.body,
    color: Colors.text,
    lineHeight: 26,
    fontFamily: FontFamilies.body,
  },

  // ── Section Label ───────────────────
  sectionLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },

  // ── Option Cards ────────────────────
  optionCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  optionIcon: {
    fontSize: 24,
  },
  optionTitle: {
    fontSize: FontSizes.headingM,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    flex: 1,
  },

  // ── Radio Button ────────────────────
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },

  // ── Bullets ─────────────────────────
  bulletList: {
    gap: Spacing.sm,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingRight: Spacing.md,
  },
  bulletCheck: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    lineHeight: 22,
    width: 18,
    textAlign: 'center',
  },
  bulletText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
    flex: 1,
  },

  // ── Note ────────────────────────────
  noteContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  noteText: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
    fontStyle: 'italic',
  },

  // ── Waiver Box ──────────────────────
  waiverSection: {
    marginTop: Spacing.lg,
  },
  waiverBox: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    maxHeight: 260,
    ...Shadows.subtle,
  },
  waiverScroll: {
    padding: Spacing.lg,
  },
  waiverText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
    fontFamily: FontFamilies.body,
  },

  // ── Agreement ───────────────────────
  agreementSection: {
    marginTop: Spacing.xl,
    gap: Spacing.lg,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceElevated,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxMark: {
    color: Colors.textOnPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: -1,
  },
  checkboxLabel: {
    fontSize: FontSizes.body,
    color: Colors.text,
    flex: 1,
    lineHeight: 22,
  },

  // ── Name Input ──────────────────────
  nameInputWrapper: {
    gap: Spacing.xs,
  },
  nameLabel: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  nameInput: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    fontSize: FontSizes.body,
    color: Colors.text,
    fontFamily: FontFamilies.body,
  },

  // ── Submit Button ───────────────────
  submitButton: {
    backgroundColor: Colors.primary,
    height: ButtonSizes.large,
    borderRadius: BorderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    ...Shadows.card,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.border,
    ...Shadows.subtle,
  },
  submitButtonText: {
    fontSize: FontSizes.body,
    fontWeight: '700',
    color: Colors.textOnPrimary,
  },
  submitButtonTextDisabled: {
    color: Colors.textMuted,
  },
});
