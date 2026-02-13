/**
 * Find Your Therapist — Personalized therapy recommendations
 *
 * Based on assessment results, recommends specific therapy modalities
 * and links to directories. Not a therapist directory itself.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { getPortrait } from '@/services/portrait';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
  ButtonSizes,
} from '@/constants/theme';
import type { IndividualPortrait } from '@/types/portrait';

// ─── Therapy Recommendation Logic ──────────────────────

interface TherapyRecommendation {
  modality: string;
  abbreviation: string;
  reason: string;
  directory: string;
  directoryName: string;
  icon: string;
  priority: number;
}

function getTherapyRecommendations(portrait: IndividualPortrait | null): TherapyRecommendation[] {
  const recs: TherapyRecommendation[] = [];

  if (!portrait) {
    // Default recommendations when no portrait
    return [
      {
        modality: 'Emotionally Focused Therapy',
        abbreviation: 'EFT',
        reason: 'EFT helps couples understand and reshape emotional patterns in relationships.',
        directory: 'https://iceeft.com/therapist-finder/',
        directoryName: 'ICEEFT Therapist Finder',
        icon: '💕',
        priority: 1,
      },
      {
        modality: 'Gottman Method Couples Therapy',
        abbreviation: 'Gottman',
        reason: 'Evidence-based approach focused on communication, conflict management, and building friendship.',
        directory: 'https://www.gottman.com/couples/find-a-therapist/',
        directoryName: 'Gottman Referral Network',
        icon: '🏠',
        priority: 2,
      },
    ];
  }

  const cs = portrait.compositeScores;
  const nc = portrait.negativeCycle;

  // EFT — recommended for attachment patterns
  if (cs.accessibility < 60 || cs.responsiveness < 60 || nc.position === 'pursuer' || nc.position === 'withdrawer') {
    recs.push({
      modality: 'Emotionally Focused Therapy',
      abbreviation: 'EFT',
      reason: `Your ${nc.position} pattern and attachment profile suggest EFT could help you build more secure connection.`,
      directory: 'https://iceeft.com/therapist-finder/',
      directoryName: 'ICEEFT Therapist Finder',
      icon: '💕',
      priority: 1,
    });
  }

  // Gottman — for communication & conflict
  if (cs.regulationScore < 55 || portrait.patterns.some(p => p.category === 'attachment-conflict')) {
    recs.push({
      modality: 'Gottman Method Couples Therapy',
      abbreviation: 'Gottman',
      reason: 'Your regulation patterns and conflict style suggest the Gottman Method could help with communication and de-escalation.',
      directory: 'https://www.gottman.com/couples/find-a-therapist/',
      directoryName: 'Gottman Referral Network',
      icon: '🏠',
      priority: 2,
    });
  }

  // DBT-informed — for emotional regulation
  if (cs.windowWidth < 45 || cs.regulationScore < 40) {
    recs.push({
      modality: 'DBT-Informed Therapy',
      abbreviation: 'DBT',
      reason: 'Your narrower window of tolerance suggests skills-based regulation work could be highly beneficial.',
      directory: 'https://www.psychologytoday.com/us/therapists/dialectical-behavior-therapy',
      directoryName: 'Psychology Today (DBT)',
      icon: '🧘',
      priority: 3,
    });
  }

  // ACT — for values-behavior gaps
  if (cs.valuesCongruence < 50) {
    recs.push({
      modality: 'Acceptance & Commitment Therapy',
      abbreviation: 'ACT',
      reason: 'The gap between your values and actions suggests ACT could help you live more aligned with what matters most.',
      directory: 'https://www.psychologytoday.com/us/therapists/acceptance-and-commitment-act',
      directoryName: 'Psychology Today (ACT)',
      icon: '🧭',
      priority: 4,
    });
  }

  // IFS — for parts work
  if (cs.selfLeadership < 45) {
    recs.push({
      modality: 'Internal Family Systems',
      abbreviation: 'IFS',
      reason: 'Your inner parts may benefit from IFS work to build more Self-leadership and reduce internal conflict.',
      directory: 'https://ifs-institute.com/practitioners',
      directoryName: 'IFS Institute Directory',
      icon: '🎭',
      priority: 5,
    });
  }

  // Sort by priority
  recs.sort((a, b) => a.priority - b.priority);

  // Always include at least the top 2 generic ones if empty
  if (recs.length === 0) {
    recs.push(
      {
        modality: 'Emotionally Focused Therapy',
        abbreviation: 'EFT',
        reason: 'EFT is one of the most evidence-based approaches for couple therapy.',
        directory: 'https://iceeft.com/therapist-finder/',
        directoryName: 'ICEEFT Therapist Finder',
        icon: '💕',
        priority: 1,
      },
      {
        modality: 'Gottman Method Couples Therapy',
        abbreviation: 'Gottman',
        reason: 'The Gottman approach excels at communication patterns and friendship-building.',
        directory: 'https://www.gottman.com/couples/find-a-therapist/',
        directoryName: 'Gottman Referral Network',
        icon: '🏠',
        priority: 2,
      }
    );
  }

  return recs;
}

// ─── General Directories ──────────────────────────────

const GENERAL_DIRECTORIES = [
  {
    name: 'Psychology Today',
    url: 'https://www.psychologytoday.com/us/therapists',
    description: 'Largest therapist directory — filter by specialty, insurance, and location',
    icon: '📖',
  },
  {
    name: 'Open Path Collective',
    url: 'https://openpathcollective.org/',
    description: 'Affordable therapy — $30-$80 per session',
    icon: '💚',
  },
  {
    name: 'Inclusive Therapists',
    url: 'https://www.inclusivetherapists.com/',
    description: 'Therapists committed to anti-oppressive, culturally responsive care',
    icon: '🌈',
  },
  {
    name: 'AASECT (Sex Therapy)',
    url: 'https://www.aasect.org/referral-directory',
    description: 'Certified sex therapists and sexuality educators',
    icon: '❤️‍🔥',
  },
];

// ─── Component ────────────────────────────────────────

export default function FindTherapistScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [portrait, setPortrait] = useState<IndividualPortrait | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getPortrait(user.id)
      .then(setPortrait)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const recommendations = getTherapyRecommendations(portrait);
  const topRec = recommendations[0];
  const otherRecs = recommendations.slice(1);

  if (loading) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container}>
      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ──────────────────────── */}
        <View style={s.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={s.backText}>{'←'} Back</Text>
          </TouchableOpacity>
        </View>

        <View style={s.heroSection}>
          <Text style={s.heroIcon}>{'🔍'}</Text>
          <Text style={s.heroTitle}>Find a Therapist</Text>
          <Text style={s.heroSubtitle}>
            {portrait
              ? 'Based on your assessment results, here are the types of therapy that might be most helpful for you.'
              : 'Explore therapy options. Complete assessments for personalized recommendations.'}
          </Text>
        </View>

        {/* ── Top Recommendation ─────────── */}
        {topRec && (
          <View style={s.topRecCard}>
            <View style={s.topRecBadge}>
              <Text style={s.topRecBadgeText}>{'⭐'} RECOMMENDED FOR YOU</Text>
            </View>
            <View style={s.topRecHeader}>
              <Text style={s.topRecIcon}>{topRec.icon}</Text>
              <View style={s.topRecTitleGroup}>
                <Text style={s.topRecTitle}>{topRec.modality}</Text>
                <Text style={s.topRecAbbrev}>({topRec.abbreviation})</Text>
              </View>
            </View>
            <Text style={s.topRecReason}>{topRec.reason}</Text>
            <TouchableOpacity
              style={s.directoryButton}
              onPress={() => Linking.openURL(topRec.directory)}
              activeOpacity={0.7}
            >
              <Text style={s.directoryButtonText}>
                Find {topRec.abbreviation} Therapists {'→'}
              </Text>
            </TouchableOpacity>
            <Text style={s.directoryHint}>{topRec.directoryName}</Text>
          </View>
        )}

        {/* ── Other Recommendations ──────── */}
        {otherRecs.length > 0 && (
          <>
            <Text style={s.sectionLabel}>ALSO CONSIDER</Text>
            {otherRecs.map((rec) => (
              <View key={rec.abbreviation} style={s.recCard}>
                <View style={s.recHeader}>
                  <Text style={s.recIcon}>{rec.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.recTitle}>{rec.modality}</Text>
                    <Text style={s.recReason}>{rec.reason}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={s.recDirectoryButton}
                  onPress={() => Linking.openURL(rec.directory)}
                  activeOpacity={0.7}
                >
                  <Text style={s.recDirectoryText}>
                    Find {rec.abbreviation} Therapists {'→'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}

        {/* ── General Directories ──────── */}
        <Text style={s.sectionLabel}>GENERAL DIRECTORIES</Text>
        {GENERAL_DIRECTORIES.map((dir) => (
          <TouchableOpacity
            key={dir.name}
            style={s.dirCard}
            onPress={() => Linking.openURL(dir.url)}
            activeOpacity={0.7}
          >
            <Text style={s.dirIcon}>{dir.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.dirName}>{dir.name}</Text>
              <Text style={s.dirDescription}>{dir.description}</Text>
            </View>
            <Text style={s.dirArrow}>{'→'}</Text>
          </TouchableOpacity>
        ))}

        {/* ── Ask Nuance ──────────────────── */}
        <View style={s.nuanceCard}>
          <Text style={s.nuanceIcon}>{'✦'}</Text>
          <Text style={s.nuanceTitle}>Not sure which therapy is right?</Text>
          <Text style={s.nuanceSubtitle}>
            Ask Nuance to help you understand which type of therapy would be best for your specific patterns.
          </Text>
          <TouchableOpacity
            style={s.nuanceButton}
            onPress={() => router.push('/(app)/chat' as any)}
            activeOpacity={0.7}
          >
            <Text style={s.nuanceButtonText}>Chat with Nuance {'→'}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Share with Therapist ──────── */}
        <Text style={s.sectionLabel}>SHARE WITH YOUR THERAPIST</Text>
        <View style={s.shareCard}>
          <Text style={s.shareBody}>
            If you already have a therapist, you can share your assessment results and portrait with them. This helps your therapist understand your patterns quickly.
          </Text>
          <TouchableOpacity
            style={s.shareButton}
            onPress={() => {
              // TODO: PDF report generation
            }}
            activeOpacity={0.7}
          >
            <Text style={s.shareButtonText}>{'📄'} Generate Report (Coming Soon)</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ─────────────────────────────────────────────

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: Spacing.xl, paddingBottom: Spacing.xxxl },

  header: { marginBottom: Spacing.lg },
  backText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },

  heroSection: {
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  heroIcon: { fontSize: 48, marginBottom: Spacing.xs },
  heroTitle: {
    fontSize: FontSizes.headingL,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  heroSubtitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Top recommendation
  topRecCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.primary + '30',
    ...Shadows.elevated,
  },
  topRecBadge: {
    backgroundColor: Colors.primary + '15',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.pill,
  },
  topRecBadgeText: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  topRecHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  topRecIcon: { fontSize: 32 },
  topRecTitleGroup: { flex: 1, gap: 2 },
  topRecTitle: {
    fontSize: FontSizes.headingM,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  topRecAbbrev: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
  },
  topRecReason: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
  },
  directoryButton: {
    backgroundColor: Colors.primary,
    height: ButtonSizes.medium,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  directoryButtonText: {
    color: Colors.white,
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
  },
  directoryHint: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    textAlign: 'center',
  },

  // Section label
  sectionLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },

  // Other recommendations
  recCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    ...Shadows.subtle,
  },
  recHeader: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-start',
  },
  recIcon: { fontSize: 24 },
  recTitle: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  recReason: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  recDirectoryButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  recDirectoryText: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
    color: Colors.primary,
  },

  // General directories
  dirCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.subtle,
  },
  dirIcon: { fontSize: 24 },
  dirName: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  dirDescription: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  dirArrow: {
    fontSize: 18,
    color: Colors.textMuted,
  },

  // Nuance section
  nuanceCard: {
    backgroundColor: Colors.secondary + '12',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.secondary + '25',
  },
  nuanceIcon: { fontSize: 36 },
  nuanceTitle: {
    fontSize: FontSizes.body,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    textAlign: 'center',
  },
  nuanceSubtitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  nuanceButton: {
    backgroundColor: Colors.secondary,
    height: ButtonSizes.small,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xs,
  },
  nuanceButtonText: {
    color: Colors.white,
    fontSize: FontSizes.caption,
    fontWeight: '700',
  },

  // Share with therapist
  shareCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.subtle,
  },
  shareBody: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  shareButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    height: ButtonSizes.medium,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
