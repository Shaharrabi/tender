/**
 * Group Support & Therapy — Support groups + personalized therapy recommendations
 *
 * Based on assessment results, recommends specific therapy modalities
 * and links to directories. Also offers attachment-based support groups.
 */

import React, { useEffect, useState } from 'react';
import HomeButton from '@/components/HomeButton';
import SupportGroupsCard from '@/components/support-groups/SupportGroupsCard';
import { getRecommendedGroup } from '@/services/support-groups';
import type { GroupRecommendation } from '@/types/support-groups';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Linking,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { getPortrait } from '@/services/portrait';
import { generatePortraitPDF } from '@/services/pdf-export';
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
import type { IconProps } from '@/assets/graphics/icons';
import {
  HeartDoubleIcon,
  HomeIcon,
  MeditationIcon,
  CompassIcon,
  MasksIcon,
  BookOpenIcon,
  GreenHeartIcon,
  RainbowIcon,
  HeartFireIcon,
  SearchIcon,
  SparkleIcon,
  StarIcon,
  ClipboardIcon,
} from '@/assets/graphics/icons';

// ─── Therapy Recommendation Logic ──────────────────────

interface TherapyRecommendation {
  modality: string;
  abbreviation: string;
  reason: string;
  directory: string;
  directoryName: string;
  Icon: React.ComponentType<IconProps>;
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
        Icon: HeartDoubleIcon,
        priority: 1,
      },
      {
        modality: 'Gottman Method Couples Therapy',
        abbreviation: 'Gottman',
        reason: 'Evidence-based approach focused on communication, conflict management, and building friendship.',
        directory: 'https://www.gottman.com/couples/find-a-therapist/',
        directoryName: 'Gottman Referral Network',
        Icon: HomeIcon,
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
      Icon: HeartDoubleIcon,
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
      Icon: HomeIcon,
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
      Icon: MeditationIcon,
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
      Icon: CompassIcon,
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
      Icon: MasksIcon,
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
        Icon: HeartDoubleIcon,
        priority: 1,
      },
      {
        modality: 'Gottman Method Couples Therapy',
        abbreviation: 'Gottman',
        reason: 'The Gottman approach excels at communication patterns and friendship-building.',
        directory: 'https://www.gottman.com/couples/find-a-therapist/',
        directoryName: 'Gottman Referral Network',
        Icon: HomeIcon,
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
    Icon: BookOpenIcon,
  },
  {
    name: 'Open Path Collective',
    url: 'https://openpathcollective.org/',
    description: 'Affordable therapy — $30-$80 per session',
    Icon: GreenHeartIcon,
  },
  {
    name: 'Inclusive Therapists',
    url: 'https://www.inclusivetherapists.com/',
    description: 'Therapists committed to anti-oppressive, culturally responsive care',
    Icon: RainbowIcon,
  },
  {
    name: 'AASECT (Sex Therapy)',
    url: 'https://www.aasect.org/referral-directory',
    description: 'Certified sex therapists and sexuality educators',
    Icon: HeartFireIcon,
  },
];

// ─── Component ────────────────────────────────────────

export default function FindTherapistScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [portrait, setPortrait] = useState<IndividualPortrait | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [groupRec, setGroupRec] = useState<GroupRecommendation | null>(null);

  useEffect(() => {
    if (!user) return;
    getPortrait(user.id)
      .then(setPortrait)
      .catch(() => {})
      .finally(() => setLoading(false));
    getRecommendedGroup(user.id)
      .then(setGroupRec)
      .catch(() => {});
  }, [user]);

  const recommendations = getTherapyRecommendations(portrait);
  const topRec = recommendations[0];
  const otherRecs = recommendations.slice(1);

  if (loading) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.center}>
          <ActivityIndicator size="large" color={Colors.primary} accessibilityLabel="Loading" />
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
            accessibilityRole="button"
            accessibilityLabel="Group Support and Therapy"
          >
            <Text style={s.backText}>{'←'} Back</Text>
          </TouchableOpacity>
        </View>

        <View style={s.heroSection}>
          <View style={s.heroIcon}>
            <SearchIcon size={48} color={Colors.primary} />
          </View>
          <Text style={s.heroTitle}>Group Support and Therapy</Text>
          <Text style={s.heroSubtitle}>
            {portrait
              ? 'Explore support groups and therapy options matched to your assessment results.'
              : 'Explore group support and therapy options. Complete assessments for personalized recommendations.'}
          </Text>
        </View>

        {/* ── Support Groups ─────────────── */}
        <SupportGroupsCard
          recommendation={groupRec}
          onPress={() => router.push('/(app)/support-groups' as any)}
        />

        {/* ── Top Recommendation ─────────── */}
        {topRec && (
          <View style={s.topRecCard}>
            <View style={s.topRecBadge}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <StarIcon size={12} color={Colors.primary} />
                <Text style={s.topRecBadgeText}>RECOMMENDED FOR YOU</Text>
              </View>
            </View>
            <View style={s.topRecHeader}>
              <View style={s.topRecIcon}>
                <topRec.Icon size={32} color={Colors.primary} />
              </View>
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
              accessibilityRole="button"
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
                  <View style={s.recIcon}>
                    <rec.Icon size={24} color={Colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.recTitle}>{rec.modality}</Text>
                    <Text style={s.recReason}>{rec.reason}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={s.recDirectoryButton}
                  onPress={() => Linking.openURL(rec.directory)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
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
            accessibilityRole="button"
          >
            <View style={s.dirIcon}>
              <dir.Icon size={24} color={Colors.text} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.dirName}>{dir.name}</Text>
              <Text style={s.dirDescription}>{dir.description}</Text>
            </View>
            <Text style={s.dirArrow}>{'→'}</Text>
          </TouchableOpacity>
        ))}

        {/* ── Ask Nuance ──────────────────── */}
        <View style={s.nuanceCard}>
          <View style={s.nuanceIcon}>
            <SparkleIcon size={36} color={Colors.secondary} />
          </View>
          <Text style={s.nuanceTitle}>Not sure which therapy is right?</Text>
          <Text style={s.nuanceSubtitle}>
            Ask Nuance to help you understand which type of therapy would be best for your specific patterns.
          </Text>
          <TouchableOpacity
            style={s.nuanceButton}
            onPress={() => router.push('/(app)/chat' as any)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="SHARE WITH YOUR THERAPIST"
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
            style={[s.shareButton, !portrait && { opacity: 0.5 }]}
            onPress={async () => {
              if (!portrait) {
                const msg = 'Complete your assessments first to generate a report.';
                Platform.OS === 'web' ? alert(msg) : Alert.alert('Portrait Required', msg);
                return;
              }
              setExporting(true);
              try {
                await generatePortraitPDF(portrait);
              } catch (err) {
                const msg = 'Unable to generate report. Please try again.';
                Platform.OS === 'web' ? alert(msg) : Alert.alert('Error', msg);
              } finally {
                setExporting(false);
              }
            }}
            disabled={exporting}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={{ disabled: exporting }}
          >
            {exporting ? (
              <ActivityIndicator size="small" color={Colors.textSecondary} accessibilityLabel="Loading" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <ClipboardIcon size={16} color={Colors.textSecondary} />
                <Text style={s.shareButtonText}>
                  {portrait ? 'Generate Report' : 'Complete Assessments First'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
      <HomeButton />
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
  heroIcon: { marginBottom: Spacing.xs },
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
  topRecIcon: { },
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
  recIcon: { },
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
  dirIcon: { },
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
  nuanceIcon: { },
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
