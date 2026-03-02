/**
 * CoupleConsentGate — Consent check before couple data is displayed
 *
 * Shows a gentle consent prompt if the user hasn't yet consented to
 * data sharing (store_and_share). The user can:
 *   1. Proceed to the full consent-waiver screen
 *   2. Continue with sharing defaults (private by default)
 *
 * This component renders as a full-screen overlay when consent is missing.
 * Once consent is recorded, it renders children normally.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { saveConsent } from '@/services/consent';
import {
  ShieldIcon,
  ArrowRightIcon,
} from '@/assets/graphics/icons';

interface CoupleConsentGateProps {
  /** Has the user already consented? */
  hasConsent: boolean;
  /** Is the consent check still loading? */
  loading: boolean;
  /** Current user ID */
  userId: string;
  /** Callback after quick consent is saved */
  onConsentGranted: () => void;
  /** Children rendered when consent is active */
  children: React.ReactNode;
}

const QUICK_CONSENT_TEXT =
  'I understand that by using couple features, my shared assessment data ' +
  'will be visible to my connected partner. I can control exactly which ' +
  'assessments are shared from my Sharing Settings at any time. ' +
  'All data is encrypted and I can revoke access or delete my data at any time.';

export default function CoupleConsentGate({
  hasConsent,
  loading,
  userId,
  onConsentGranted,
  children,
}: CoupleConsentGateProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // Loading state
  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={Colors.primary} accessibilityLabel="Checking consent" />
      </View>
    );
  }

  // Consent already granted — show children
  if (hasConsent) {
    return <>{children}</>;
  }

  // ─── Consent Prompt ──────────────────────────────────

  const handleQuickConsent = async () => {
    setSaving(true);
    try {
      await saveConsent(userId, 'store_and_share', QUICK_CONSENT_TEXT);
      onConsentGranted();
    } catch (e) {
      console.error('[CoupleConsentGate] Quick consent failed:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={s.container}>
      <View style={s.iconWrap}>
        <ShieldIcon size={48} color={Colors.primary} />
      </View>

      <Text style={s.title}>Before You Connect</Text>

      <Text style={s.body}>
        When you use couple features, your partner will be able to see
        assessment data you choose to share. Everything is private by default
        — you control exactly what's visible.
      </Text>

      <View style={s.bulletBox}>
        <BulletPoint text="All sharing is opt-in — nothing is shared automatically" />
        <BulletPoint text="You choose which assessments to share" />
        <BulletPoint text="You can revoke sharing at any time" />
        <BulletPoint text="Your data is encrypted at rest and in transit" />
      </View>

      {/* Primary: Quick consent */}
      <TouchableOpacity
        style={s.primaryButton}
        onPress={handleQuickConsent}
        disabled={saving}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="I understand, continue"
      >
        {saving ? (
          <ActivityIndicator color={Colors.textOnPrimary} size="small" accessibilityLabel="Saving" />
        ) : (
          <Text style={s.primaryButtonText}>I Understand, Continue</Text>
        )}
      </TouchableOpacity>

      {/* Secondary: Full waiver screen */}
      <TouchableOpacity
        style={s.secondaryButton}
        onPress={() => router.push('/(app)/consent-waiver' as any)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Read full consent details"
      >
        <Text style={s.secondaryButtonText}>Read Full Details</Text>
        <ArrowRightIcon size={14} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

// ─── Helpers ──────────────────────────────────────────────

function BulletPoint({ text }: { text: string }) {
  return (
    <View style={s.bulletRow}>
      <View style={s.bulletDot} />
      <Text style={s.bulletText}>{text}</Text>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────

const s = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.background,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primary + '12',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.headingL,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  body: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  bulletBox: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    width: '100%',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
    ...Shadows.subtle,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 8,
  },
  bulletText: {
    ...Typography.bodySmall,
    color: Colors.text,
    flex: 1,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    height: 48,
    borderRadius: BorderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    width: '100%',
    ...Shadows.card,
  },
  primaryButtonText: {
    ...Typography.button,
    color: Colors.textOnPrimary,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.md,
  },
  secondaryButtonText: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
});
