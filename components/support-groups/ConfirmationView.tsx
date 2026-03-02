/**
 * ConfirmationView — Post-registration confirmation or waitlist status.
 *
 * Shows "You're in!" if active, or waitlist position if group is full.
 * Plays celebration sound for active registrations.
 */

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import {
  SparkleIcon,
  CalendarIcon,
  CheckmarkIcon,
  SeedlingIcon,
  ChatBubbleIcon,
  CommunityIcon,
} from '@/assets/graphics/icons';
import { SoundHaptics } from '@/services/SoundHapticsService';
import type { SupportGroup, SupportGroupMember, SupportGroupSession } from '@/types/support-groups';
import CrisisFooter from './CrisisFooter';

// ─── Props ─────────────────────────────────────────────

interface ConfirmationViewProps {
  membership: SupportGroupMember;
  group: SupportGroup;
  nextSession: SupportGroupSession | null;
  onViewSession: () => void;
  onGoHome: () => void;
  onNavigate: (route: string) => void;
}

// ─── Component ─────────────────────────────────────────

export default function ConfirmationView({
  membership,
  group,
  nextSession,
  onViewSession,
  onGoHome,
  onNavigate,
}: ConfirmationViewProps) {
  const isActive = membership.status === 'active';
  const isWaitlisted = membership.status === 'waitlisted';

  const accentColor = group.groupType === 'avoidant'
    ? Colors.attachmentAvoidant
    : Colors.attachmentAnxious;

  // Play celebration sound for active registration
  useEffect(() => {
    if (isActive) {
      SoundHaptics.playBadgeUnlock();
    }
  }, [isActive]);

  if (isWaitlisted) {
    return <WaitlistView
      membership={membership}
      group={group}
      onGoHome={onGoHome}
      onNavigate={onNavigate}
      accentColor={accentColor}
    />;
  }

  return (
    <View style={styles.container}>
      {/* Sparkle */}
      <SparkleIcon size={28} color={accentColor} />

      {/* Title */}
      <Text style={styles.title}>You're in.</Text>
      <Text style={styles.subtitle}>
        Welcome to {group.name}.
        {nextSession
          ? ` Your group starts ${formatDate(nextSession.sessionDate)}.`
          : ' Session dates will be announced soon.'}
      </Text>

      {/* What to expect */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>WHAT TO EXPECT</Text>
        <InfoRow text="Weekly sessions via Zoom" />
        <InfoRow text={`${group.durationMinutes} minutes each`} />
        <InfoRow text={`Small group (max ${group.maxMembers})`} />
        <InfoRow text="Facilitated + structured" />
        <InfoRow text="12 weeks, one step per week" />

        {nextSession && (
          <>
            <Text style={[styles.infoTitle, { marginTop: Spacing.md }]}>
              YOUR FIRST SESSION
            </Text>
            <View style={styles.sessionRow}>
              <CalendarIcon size={16} color={accentColor} />
              <Text style={styles.sessionText}>
                {formatDate(nextSession.sessionDate)}
                {nextSession.sessionTime ? ` at ${nextSession.sessionTime}` : ''}
              </Text>
            </View>
          </>
        )}

        <Text style={[styles.infoTitle, { marginTop: Spacing.md }]}>
          PREPARATION
        </Text>
        <Text style={styles.prepText}>
          Before your first session, you might revisit Step 1 in your
          healing journey: {'\u201C'}Acknowledge the Strain{'\u201D'}
        </Text>
        <TouchableOpacity
          style={[styles.reviewBtn, { borderColor: accentColor }]}
          onPress={() => onNavigate('/(app)/growth')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Review Step 1"
        >
          <SeedlingIcon size={14} color={accentColor} />
          <Text style={[styles.reviewBtnText, { color: accentColor }]}>
            Review Step 1
          </Text>
        </TouchableOpacity>
      </View>

      {/* Buttons */}
      <TouchableOpacity
        style={[styles.primaryBtn, { backgroundColor: accentColor }]}
        onPress={onViewSession}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Go to my group"
      >
        <Text style={styles.primaryBtnText}>Go to My Group</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={onGoHome}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Back to therapy page"
      >
        <Text style={styles.secondaryBtnText}>Back to Therapy Page</Text>
      </TouchableOpacity>

      <CrisisFooter />
    </View>
  );
}

// ─── Waitlist Sub-view ─────────────────────────────────

function WaitlistView({
  membership,
  group,
  onGoHome,
  onNavigate,
  accentColor,
}: {
  membership: SupportGroupMember;
  group: SupportGroup;
  onGoHome: () => void;
  onNavigate: (route: string) => void;
  accentColor: string;
}) {
  return (
    <View style={styles.container}>
      <SparkleIcon size={28} color={Colors.accentGold} />

      <Text style={styles.title}>You're on the list.</Text>
      <Text style={styles.subtitle}>
        The current {group.name} group is full, but you're
        #{membership.waitlistPosition ?? '?'} on the waitlist.
        We'll notify you as soon as a spot opens or a new cohort starts.
      </Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>WHILE YOU WAIT</Text>
        <Text style={styles.prepText}>
          Your healing journey continues individually. Here are some things
          that will prepare you for group:
        </Text>

        <TouchableOpacity
          style={styles.waitlistAction}
          onPress={() => onNavigate('/(app)/growth')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Continue the 12 Steps"
        >
          <SeedlingIcon size={16} color={Colors.primary} />
          <Text style={styles.waitlistActionText}>Continue the 12 Steps</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.waitlistAction}
          onPress={() => onNavigate('/(app)/chat')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Practice with Nuance"
        >
          <ChatBubbleIcon size={16} color={Colors.secondary} />
          <Text style={styles.waitlistActionText}>Practice with Nuance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.waitlistAction}
          onPress={() => onNavigate('/(app)/community')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Join the Community"
        >
          <CommunityIcon size={16} color={Colors.accentGold} />
          <Text style={styles.waitlistActionText}>Join the Community</Text>
        </TouchableOpacity>
      </View>

      {membership.waitlistPosition && (
        <Text style={styles.positionText}>
          Position: #{membership.waitlistPosition}
        </Text>
      )}

      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={onGoHome}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Back to therapy page"
      >
        <Text style={styles.secondaryBtnText}>Back to Therapy Page</Text>
      </TouchableOpacity>

      <CrisisFooter />
    </View>
  );
}

// ─── Helpers ───────────────────────────────────────────

function InfoRow({ text }: { text: string }) {
  return (
    <View style={styles.infoRow}>
      <CheckmarkIcon size={12} color={Colors.success} />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// ─── Styles ────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingTop: Spacing.xl,
  },
  title: {
    fontFamily: FontFamilies.accent,
    fontSize: FontSizes.headingL,
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: FontSizes.bodySmall * 1.5,
    paddingHorizontal: Spacing.md,
  },

  // Info card
  infoCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    width: '100%',
    gap: Spacing.sm,
    ...Shadows.card,
  },
  infoTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  infoText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sessionText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    fontWeight: '500',
  },
  prepText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: FontSizes.caption * 1.5,
  },
  reviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
    borderRadius: BorderRadius.pill,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.xs,
  },
  reviewBtnText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    fontWeight: '600',
  },

  // Waitlist actions
  waitlistAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.backgroundAlt || Colors.background,
    borderRadius: BorderRadius.md,
  },
  waitlistActionText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
  },
  positionText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },

  // Buttons
  primaryBtn: {
    width: '100%',
    height: 48,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
    ...Shadows.card,
  },
  primaryBtnText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    fontWeight: '700',
    color: Colors.white,
  },
  secondaryBtn: {
    paddingVertical: Spacing.sm,
  },
  secondaryBtnText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textMuted,
  },
});
