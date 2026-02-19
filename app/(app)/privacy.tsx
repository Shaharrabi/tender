/**
 * Privacy & Data Settings Screen
 *
 * Transparency about data storage, user controls for data deletion,
 * and sharing permissions management.
 */

import React, { useState } from 'react';
import HomeButton from '@/components/HomeButton';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { eraseUserData } from '@/services/consent';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
  ButtonSizes,
} from '@/constants/theme';
import type { IconProps } from '@/assets/graphics/icons';
import {
  LockIcon,
  ClipboardIcon,
  ShieldIcon,
  PersonIcon,
  RefreshIcon,
  SettingsIcon,
  CloseIcon,
} from '@/assets/graphics/icons';

// ─── Component ────────────────────────────────────────

export default function PrivacyScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleDeleteAllData = () => {
    Alert.alert(
      'Delete All My Data',
      'This will permanently delete all assessment data, results, portraits, chat history, and practice data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            if (!user) return;
            setDeleting(true);
            try {
              await eraseUserData(user.id);
              await signOut();
              router.replace('/(auth)/login');
            } catch (e) {
              console.error('Failed to delete data:', e);
              Alert.alert('Error', 'Failed to delete data. Please try again.');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleDownloadData = () => {
    Alert.alert(
      'Download My Data',
      'Data export will be available in a future update. Your data is securely stored and always accessible through the app.',
      [{ text: 'OK' }]
    );
  };

  // ─── Data we store ──────────────────────────

  const DATA_SECTIONS = [
    {
      id: 'what_we_store',
      title: 'What We Store',
      Icon: ClipboardIcon,
      items: [
        'Your email address (for login)',
        'Your assessment responses and scores',
        'Your relational portrait and analysis',
        'Your practice history and progress',
        'Your AI conversation history with Nuance',
        'Your daily check-in data',
        'Your partner connection status (if connected)',
      ],
    },
    {
      id: 'what_we_never_do',
      title: 'What We Never Do',
      Icon: ShieldIcon,
      items: [
        'Sell your data to anyone, ever',
        'Share your data without your explicit permission',
        'Use your data for advertising or marketing',
        'Keep your data after you delete it',
        'Access your data for any purpose other than providing the service',
        'Train AI models on your personal data',
      ],
    },
    {
      id: 'security',
      title: 'How We Protect Your Data',
      Icon: LockIcon,
      items: [
        'All data encrypted in transit (HTTPS/TLS)',
        'Data stored in encrypted database (Supabase)',
        'Row-level security ensures only you can access your data',
        'JWT authentication with secure session management',
        'No sensitive data stored in local device storage',
        'Partner data sharing requires explicit mutual consent',
      ],
    },
    {
      id: 'who_sees',
      title: 'Who Can See My Data?',
      Icon: PersonIcon,
      items: [
        'Only you (by default)',
        'Your partner (only if you both grant permission)',
        'Your therapist (only if you explicitly share a report)',
        'No one else — not even our team',
      ],
    },
  ];

  return (
    <SafeAreaView style={s.container}>
      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ──────────────────── */}
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={s.backText}>{'←'} Back</Text>
          </TouchableOpacity>
        </View>

        <View style={s.heroSection}>
          <View style={s.heroIcon}>
            <LockIcon size={48} color={Colors.primary} />
          </View>
          <Text style={s.heroTitle}>Your Privacy</Text>
          <Text style={s.heroSubtitle}>
            You're in control of your data. Here's everything you need to know.
          </Text>
        </View>

        {/* ── Info Sections ──────────── */}
        {DATA_SECTIONS.map((section) => {
          const isExpanded = expandedSection === section.id;
          return (
            <View key={section.id}>
              <TouchableOpacity
                style={s.sectionCard}
                onPress={() => toggleSection(section.id)}
                activeOpacity={0.7}
              >
                <View style={s.sectionIcon}>
                  <section.Icon size={22} color={Colors.text} />
                </View>
                <Text style={s.sectionTitle}>{section.title}</Text>
                <Text style={s.sectionArrow}>{isExpanded ? '▴' : '▾'}</Text>
              </TouchableOpacity>
              {isExpanded && (
                <View style={s.sectionContent}>
                  {section.items.map((item, i) => (
                    <View key={i} style={s.sectionItem}>
                      <Text style={s.sectionBullet}>{'•'}</Text>
                      <Text style={s.sectionItemText}>{item}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        {/* ── Your Controls ──────────── */}
        <Text style={s.controlsLabel}>YOUR CONTROLS</Text>

        <TouchableOpacity
          style={s.controlButton}
          onPress={() => router.push('/(app)/sharing-settings' as any)}
          activeOpacity={0.7}
        >
          <View style={s.controlIcon}><RefreshIcon size={22} color={Colors.text} /></View>
          <View style={{ flex: 1 }}>
            <Text style={s.controlTitle}>Sharing Settings</Text>
            <Text style={s.controlSubtitle}>Control what your partner can see</Text>
          </View>
          <Text style={s.controlArrow}>{'→'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.controlButton}
          onPress={() => router.push('/(app)/notification-settings' as any)}
          activeOpacity={0.7}
        >
          <View style={s.controlIcon}><SettingsIcon size={22} color={Colors.text} /></View>
          <View style={{ flex: 1 }}>
            <Text style={s.controlTitle}>Notification Settings</Text>
            <Text style={s.controlSubtitle}>Manage reminders and nudges</Text>
          </View>
          <Text style={s.controlArrow}>{'→'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.controlButton}
          onPress={handleDownloadData}
          activeOpacity={0.7}
        >
          <View style={s.controlIcon}><ClipboardIcon size={22} color={Colors.text} /></View>
          <View style={{ flex: 1 }}>
            <Text style={s.controlTitle}>Download My Data</Text>
            <Text style={s.controlSubtitle}>Get a copy of all your data</Text>
          </View>
          <Text style={s.controlArrow}>{'→'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.controlButton, s.controlButtonDanger]}
          onPress={handleDeleteAllData}
          disabled={deleting}
          activeOpacity={0.7}
        >
          {deleting ? (
            <ActivityIndicator color={Colors.error} size="small" />
          ) : (
            <>
              <View style={s.controlIcon}><CloseIcon size={22} color={Colors.error} /></View>
              <View style={{ flex: 1 }}>
                <Text style={[s.controlTitle, { color: Colors.error }]}>
                  Delete All My Data
                </Text>
                <Text style={s.controlSubtitle}>
                  Permanently removes your account and all data
                </Text>
              </View>
            </>
          )}
        </TouchableOpacity>

        {/* ── Footer ──────────────────── */}
        <View style={s.footer}>
          <View style={s.footerIcon}>
            <LockIcon size={24} color={Colors.textMuted} />
          </View>
          <Text style={s.footerText}>
            All data encrypted in transit and at rest.{'\n'}
            Your privacy is our priority.
          </Text>
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
  heroIcon: { },
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

  // Expandable sections
  sectionCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: 2,
    ...Shadows.subtle,
  },
  sectionIcon: { justifyContent: 'center' as const },
  sectionTitle: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  sectionArrow: {
    fontSize: FontSizes.body,
    color: Colors.textMuted,
  },
  sectionContent: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  sectionItem: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingLeft: Spacing.xs,
  },
  sectionBullet: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textMuted,
    lineHeight: 22,
  },
  sectionItemText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 22,
    flex: 1,
  },

  // Controls
  controlsLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  controlButton: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.subtle,
  },
  controlButtonDanger: {
    borderWidth: 1,
    borderColor: Colors.error + '30',
  },
  controlIcon: { justifyContent: 'center' as const },
  controlTitle: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.text,
  },
  controlSubtitle: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  controlArrow: {
    fontSize: 18,
    color: Colors.textMuted,
  },

  // Footer
  footer: {
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  footerIcon: { },
  footerText: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
