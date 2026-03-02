/**
 * GroupLandingView — Group selection page with optional ECR-R routing.
 *
 * Always shows both support groups (The Reach + The Retreat).
 * Auto-highlights the recommended group if ECR-R assessment is available.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import {
  CommunityIcon,
  StarIcon,
  SparkleIcon,
  CalendarIcon,
  PersonIcon,
} from '@/assets/graphics/icons';
import type { SupportGroup, GroupRecommendation, SupportGroupType } from '@/types/support-groups';
import CrisisFooter from './CrisisFooter';

// ─── Props ─────────────────────────────────────────────

interface GroupLandingViewProps {
  groups: SupportGroup[];
  recommendation: GroupRecommendation | null;
  memberCounts: Record<string, number>;
  onSelectGroup: (groupType: SupportGroupType) => void;
}

// ─── Group Card Config ─────────────────────────────────

const GROUP_CONFIG: Record<SupportGroupType, {
  tagline: string;
  details: string[];
  accentColor: string;
}> = {
  anxious: {
    tagline: 'For those who reach for connection',
    details: [
      '8 members max per group',
      'Weekly sessions, 75 min',
      'Facilitated + structured',
      '12-week program',
    ],
    accentColor: Colors.attachmentAnxious,
  },
  avoidant: {
    tagline: 'For those who protect through distance',
    details: [
      '8 members max per group',
      'Weekly sessions, 75 min',
      'Low-pressure, boundaried',
      '12-week program',
    ],
    accentColor: Colors.attachmentAvoidant,
  },
};

// ─── Component ─────────────────────────────────────────

export default function GroupLandingView({
  groups,
  recommendation,
  memberCounts,
  onSelectGroup,
}: GroupLandingViewProps) {
  const recGroup = recommendation?.recommendedGroup ?? null;

  // Sort: recommended group first (if any)
  const sortedGroups = [...groups].sort((a, b) => {
    if (recGroup && a.groupType === recGroup) return -1;
    if (recGroup && b.groupType === recGroup) return 1;
    return 0;
  });

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <HeroSection />

      {/* Fearful-avoidant note */}
      {recommendation?.isFearfulAvoidant && (
        <View style={styles.faNote}>
          <SparkleIcon size={14} color={Colors.accentGold} />
          <Text style={styles.faText}>
            Your pattern has elements of both reaching and retreating.
            We've suggested a starting group based on your assessment,
            but you can switch anytime.
          </Text>
        </View>
      )}

      {/* Secure user note */}
      {recommendation?.attachmentStyle === 'secure' && (
        <View style={styles.faNote}>
          <SparkleIcon size={14} color={Colors.success} />
          <Text style={styles.faText}>
            Your secure attachment style means either group could benefit you.
            Explore both and choose the one that resonates.
          </Text>
        </View>
      )}

      {/* Section label */}
      {recGroup && (
        <Text style={styles.sectionLabel}>YOUR GROUP</Text>
      )}

      {/* Group cards */}
      {sortedGroups.map((group) => {
        const config = GROUP_CONFIG[group.groupType];
        const isRecommended = group.groupType === recGroup;
        const count = memberCounts[group.id] ?? 0;
        const isFull = count >= group.maxMembers;

        return (
          <View
            key={group.id}
            style={[
              styles.groupCard,
              { borderColor: config.accentColor + (isRecommended ? '60' : '25') },
            ]}
          >
            {isRecommended && (
              <View style={[styles.recBadge, { backgroundColor: config.accentColor + '15' }]}>
                <StarIcon size={12} color={config.accentColor} />
                <Text style={[styles.recBadgeText, { color: config.accentColor }]}>
                  RECOMMENDED FOR YOU
                </Text>
              </View>
            )}

            {!isRecommended && recGroup && (
              <Text style={styles.alsoLabel}>ALSO AVAILABLE</Text>
            )}

            <Text style={styles.groupName}>{group.name}</Text>
            <Text style={[styles.groupTagline, { color: config.accentColor }]}>
              {config.tagline}
            </Text>
            <Text style={styles.groupDesc}>{group.description}</Text>

            <View style={styles.detailsList}>
              {config.details.map((d, i) => (
                <View key={i} style={styles.detailRow}>
                  <Text style={styles.detailBullet}>{'\u25CB'}</Text>
                  <Text style={styles.detailText}>{d}</Text>
                </View>
              ))}
            </View>

            {/* Capacity */}
            <View style={styles.capacityRow}>
              <PersonIcon size={14} color={isFull ? Colors.warning : Colors.textMuted} />
              <Text style={[styles.capacityText, isFull && { color: Colors.warning, fontWeight: '600' }]}>
                {count} / {group.maxMembers} members{isFull ? ' (Full)' : ''}
              </Text>
            </View>

            {/* Schedule */}
            {group.scheduleDay && (
              <View style={styles.capacityRow}>
                <CalendarIcon size={14} color={Colors.textMuted} />
                <Text style={styles.capacityText}>
                  {capitalize(group.scheduleDay)}s at {group.scheduleTime || '7:00 PM'} {group.scheduleTimezone.split('/')[1]?.replace('_', ' ') || ''}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                isRecommended ? styles.primaryButton : styles.outlineButton,
                {
                  backgroundColor: isRecommended ? config.accentColor : 'transparent',
                  borderColor: config.accentColor,
                },
              ]}
              onPress={() => onSelectGroup(group.groupType)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={isFull ? `Join waitlist for ${group.name}` : isRecommended ? `Join ${group.name}` : `Explore ${group.name}`}
            >
              <Text
                style={[
                  isRecommended ? styles.primaryButtonText : styles.outlineButtonText,
                  !isRecommended && { color: config.accentColor },
                ]}
              >
                {isFull ? 'Join Waitlist' : isRecommended ? 'Join This Group' : 'Explore This Group'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <QuoteCard />
      <CrisisFooter />
    </ScrollView>
  );
}

// ─── Sub-components ────────────────────────────────────

function HeroSection() {
  return (
    <View style={styles.hero}>
      <CommunityIcon size={36} color={Colors.accentGold} />
      <Text style={styles.heroTitle}>Support Groups</Text>
      <Text style={styles.heroSubtitle}>
        Healing is relational. You don't have to do this alone.
      </Text>
    </View>
  );
}

function QuoteCard() {
  return (
    <View style={styles.quoteCard}>
      <Text style={styles.quoteText}>
        {'\u201C'}The reach and the retreat are both asking for the same thing.{'\u201D'}
      </Text>
    </View>
  );
}

// ─── Helpers ───────────────────────────────────────────

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ─── Styles ────────────────────────────────────────────

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  heroTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingL,
    fontWeight: '700',
    color: Colors.text,
  },
  heroSubtitle: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: FontSizes.bodySmall * 1.5,
  },

  // Fearful-avoidant / secure note
  faNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.backgroundAlt || Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  faText: {
    flex: 1,
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: FontSizes.caption * 1.5,
  },

  sectionLabel: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: Spacing.sm,
  },

  // Group card
  groupCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  recBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.pill,
    marginBottom: Spacing.xs,
  },
  recBadgeText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.caption,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  alsoLabel: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  groupName: {
    fontFamily: FontFamilies.accent,
    fontSize: FontSizes.headingM,
    color: Colors.text,
  },
  groupTagline: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
  },
  groupDesc: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: FontSizes.bodySmall * 1.5,
  },
  detailsList: {
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailBullet: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  detailText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
  },
  capacityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  capacityText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },

  // Buttons
  primaryButton: {
    height: 44,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  primaryButtonText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.white,
  },
  outlineButton: {
    height: 44,
    borderRadius: BorderRadius.pill,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  outlineButtonText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
  },

  // Quote card
  quoteCard: {
    backgroundColor: Colors.backgroundAlt || Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginTop: Spacing.sm,
  },
  quoteText: {
    fontFamily: FontFamilies.accent,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: FontSizes.bodySmall * 1.6,
  },
});
