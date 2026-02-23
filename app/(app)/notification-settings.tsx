/**
 * Notification Settings Screen
 *
 * Allows users to configure which types of reminders and insights
 * they want to receive. Settings are stored in AsyncStorage.
 * Push notifications require native setup with expo-notifications,
 * but this screen manages preference state.
 */

import React, { useEffect, useState } from 'react';
import HomeButton from '@/components/HomeButton';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import {
  CalendarIcon,
  MeditationIcon,
  CompassIcon,
  SparkleIcon,
  CoupleIcon,
  BookOpenIcon,
  LightbulbIcon,
  MasksIcon,
  TargetIcon,
  SeedlingIcon,
  HeartDoubleIcon,
  FireIcon,
  HandshakeIcon,
} from '@/assets/graphics/icons';
import type { IconProps } from '@/assets/graphics/icons';
import {
  getEngagementPrefs,
  saveEngagementPrefs,
} from '@/utils/notification-selector';
import type { EngagementNotificationPreferences } from '@/types/notifications';
import { DEFAULT_ENGAGEMENT_PREFS } from '@/constants/engagement-prompts';

// ─── Settings Types ──────────────────────────────────────

interface NotificationPreferences {
  dailyCheckInReminder: boolean;
  practiceReminders: boolean;
  assessmentNudges: boolean;
  nuanceInsights: boolean;
  partnerActivity: boolean;
  motivationalQuotes: boolean;
  reminderTime: 'morning' | 'afternoon' | 'evening';
}

const DEFAULT_PREFS: NotificationPreferences = {
  dailyCheckInReminder: true,
  practiceReminders: true,
  assessmentNudges: true,
  nuanceInsights: true,
  partnerActivity: true,
  motivationalQuotes: true,
  reminderTime: 'morning',
};

const STORAGE_KEY = 'tender_notification_prefs';

const TIME_OPTIONS: { key: NotificationPreferences['reminderTime']; label: string; description: string }[] = [
  { key: 'morning', label: 'Morning', description: '8:00 AM' },
  { key: 'afternoon', label: 'Afternoon', description: '1:00 PM' },
  { key: 'evening', label: 'Evening', description: '7:00 PM' },
];

// ─── Component ───────────────────────────────────────────

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_PREFS);
  const [engagementPrefs, setEngagementPrefs] = useState<EngagementNotificationPreferences>(DEFAULT_ENGAGEMENT_PREFS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadPrefs();
  }, []);

  const loadPrefs = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(stored) });
      }
      const engStored = await getEngagementPrefs();
      setEngagementPrefs(engStored);
    } catch {
      // Use defaults
    }
    setLoaded(true);
  };

  const updatePref = async <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Silently fail
    }
  };

  const updateEngagementPref = async <K extends keyof EngagementNotificationPreferences>(
    key: K,
    value: boolean
  ) => {
    const updated = { ...engagementPrefs, [key]: value };
    setEngagementPrefs(updated);
    try {
      await saveEngagementPrefs(updated);
    } catch {
      // Silently fail
    }
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(app)/home' as any);
    }
  };

  if (!loaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
          <Text style={styles.backText}>{'\u2039'} Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro */}
        <Text style={styles.sectionDescription}>
          Choose which reminders help you stay connected to your growth journey.
          You can change these anytime.
        </Text>

        {/* Toggle Section: Reminders */}
        <Text style={styles.sectionLabel}>REMINDERS</Text>

        <ToggleRow
          IconComponent={CalendarIcon}
          title="Daily Check-In"
          description="A gentle reminder to notice how you're feeling"
          value={prefs.dailyCheckInReminder}
          onToggle={(v) => updatePref('dailyCheckInReminder', v)}
        />

        <ToggleRow
          IconComponent={MeditationIcon}
          title="Practice Reminders"
          description="Reminders to complete your weekly practices"
          value={prefs.practiceReminders}
          onToggle={(v) => updatePref('practiceReminders', v)}
        />

        <ToggleRow
          IconComponent={CompassIcon}
          title="Assessment Insights"
          description="Reminders to continue your assessments"
          value={prefs.assessmentNudges}
          onToggle={(v) => updatePref('assessmentNudges', v)}
        />

        {/* Toggle Section: Insights */}
        <Text style={styles.sectionLabel}>INSIGHTS & UPDATES</Text>

        <ToggleRow
          IconComponent={SparkleIcon}
          title="Nuance Insights"
          description="Personalized reflections from your AI relationship guide"
          value={prefs.nuanceInsights}
          onToggle={(v) => updatePref('nuanceInsights', v)}
        />

        <ToggleRow
          IconComponent={CoupleIcon}
          title="Partner Activity"
          description="Know when your partner completes a practice or assessment"
          value={prefs.partnerActivity}
          onToggle={(v) => updatePref('partnerActivity', v)}
        />

        <ToggleRow
          IconComponent={SparkleIcon}
          title="Daily Wisdom"
          description="Motivational quotes and relationship insights"
          value={prefs.motivationalQuotes}
          onToggle={(v) => updatePref('motivationalQuotes', v)}
        />

        {/* Toggle Section: Engagement Content */}
        <Text style={styles.sectionLabel}>ENGAGEMENT CONTENT</Text>
        <Text style={styles.sectionDescription}>
          Banners and tips that appear on your home screen. Toggle off any category you don't want to see.
        </Text>

        <ToggleRow
          IconComponent={BookOpenIcon}
          title="Science Drops"
          description="Research-backed relationship facts"
          value={engagementPrefs.scienceDrops}
          onToggle={(v) => updateEngagementPref('scienceDrops', v)}
        />

        <ToggleRow
          IconComponent={LightbulbIcon}
          title="Micro-Insights"
          description="Perspective shifts from relationship science"
          value={engagementPrefs.microInsights}
          onToggle={(v) => updateEngagementPref('microInsights', v)}
        />

        <ToggleRow
          IconComponent={MasksIcon}
          title="Playful Prompts"
          description="Lighthearted relationship humor"
          value={engagementPrefs.duolingoWit}
          onToggle={(v) => updateEngagementPref('duolingoWit', v)}
        />

        <ToggleRow
          IconComponent={TargetIcon}
          title="Practice Reminders"
          description="Gentle reminders to try an exercise"
          value={engagementPrefs.practiceNudges}
          onToggle={(v) => updateEngagementPref('practiceNudges', v)}
        />

        <ToggleRow
          IconComponent={SeedlingIcon}
          title="Growth Mirrors"
          description="Reflections on your progress"
          value={engagementPrefs.growthMirrors}
          onToggle={(v) => updateEngagementPref('growthMirrors', v)}
        />

        <ToggleRow
          IconComponent={HeartDoubleIcon}
          title="Couple Warmth"
          description="Messages celebrating your connection"
          value={engagementPrefs.coupleBubble}
          onToggle={(v) => updateEngagementPref('coupleBubble', v)}
        />

        <ToggleRow
          IconComponent={FireIcon}
          title="Milestones"
          description="Celebrations for streaks and achievements"
          value={engagementPrefs.milestoneStreak}
          onToggle={(v) => updateEngagementPref('milestoneStreak', v)}
        />

        <ToggleRow
          IconComponent={HandshakeIcon}
          title="Weekly Check-Ins"
          description="Warm weekly motivation and encouragement"
          value={engagementPrefs.weeklyCheckin}
          onToggle={(v) => updateEngagementPref('weeklyCheckin', v)}
        />

        {/* Preferred Time */}
        <Text style={styles.sectionLabel}>PREFERRED TIME</Text>
        <Text style={styles.sectionDescription}>
          When would you like to receive reminders?
        </Text>

        <View style={styles.timeOptions}>
          {TIME_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.timeOption,
                prefs.reminderTime === opt.key && styles.timeOptionActive,
              ]}
              onPress={() => updatePref('reminderTime', opt.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.timeOptionLabel,
                  prefs.reminderTime === opt.key && styles.timeOptionLabelActive,
                ]}
              >
                {opt.label}
              </Text>
              <Text
                style={[
                  styles.timeOptionTime,
                  prefs.reminderTime === opt.key && styles.timeOptionTimeActive,
                ]}
              >
                {opt.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer note */}
        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            {Platform.OS === 'web'
              ? 'Push notifications are available when you install this app on your phone.'
              : 'Notification delivery depends on your device settings. Make sure notifications are enabled for Tender in your phone settings.'}
          </Text>
        </View>
      </ScrollView>
      <HomeButton />
    </SafeAreaView>
  );
}

// ─── Toggle Row ──────────────────────────────────────────

function ToggleRow({
  IconComponent,
  title,
  description,
  value,
  onToggle,
}: {
  IconComponent: React.ComponentType<IconProps>;
  title: string;
  description: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleIcon}>
        <IconComponent size={20} color={Colors.text} />
      </View>
      <View style={styles.toggleInfo}>
        <Text style={styles.toggleTitle}>{title}</Text>
        <Text style={styles.toggleDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: Colors.borderLight, true: `${Colors.primary}80` }}
        thumbColor={value ? Colors.primary : Colors.textMuted}
      />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backText: {
    fontSize: FontSizes.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: Colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 48,
  },

  // Content
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.sm,
  },

  sectionLabel: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  sectionDescription: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },

  // Toggle rows
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.md,
    ...Shadows.subtle,
  },
  toggleIcon: {
    width: 24,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  toggleInfo: {
    flex: 1,
    gap: 2,
  },
  toggleTitle: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.text,
  },
  toggleDescription: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    lineHeight: 16,
  },

  // Time options
  timeOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  timeOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.surfaceElevated,
    gap: 4,
  },
  timeOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  timeOptionLabel: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  timeOptionLabelActive: {
    color: Colors.primary,
  },
  timeOptionTime: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },
  timeOptionTimeActive: {
    color: Colors.primary,
  },

  // Footer
  footerNote: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.lg,
  },
  footerNoteText: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    lineHeight: 18,
    textAlign: 'center',
  },
});
