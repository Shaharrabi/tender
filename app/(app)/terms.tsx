/**
 * Terms of Service Screen
 *
 * Displays app terms of service, data usage, and mental health disclaimer.
 * Accessible from registration, privacy settings, and the "More" menu.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { ArrowLeftIcon, ShieldIcon } from '@/assets/graphics/icons';

// ─── Component ────────────────────────────────────────

export default function TermsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeftIcon size={18} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Effective date */}
        <Text style={styles.effectiveDate}>Effective: March 2026</Text>

        {/* Mental Health Disclaimer — prominent */}
        <View style={styles.disclaimerCard}>
          <View style={styles.disclaimerHeader}>
            <ShieldIcon size={20} color={Colors.warning} />
            <Text style={styles.disclaimerTitle}>Important Notice</Text>
          </View>
          <Text style={styles.disclaimerText}>
            Tender is a relational wellness tool — not therapy, and not a
            substitute for professional mental health care. The insights,
            exercises, and AI coaching provided here are educational and
            supportive in nature. If you are in crisis or need clinical
            support, please reach out to a licensed therapist or call 988
            (Suicide & Crisis Lifeline).
          </Text>
        </View>

        {/* Section 1 */}
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.body}>
          By creating an account or using Tender, you agree to these Terms of
          Service and our Privacy practices described on the Privacy & Data
          screen within the app. If you do not agree, please do not use the
          app.
        </Text>

        {/* Section 2 */}
        <Text style={styles.sectionTitle}>2. What Tender Is (and Is Not)</Text>
        <Text style={styles.body}>
          Tender provides relationship self-assessment tools, educational
          exercises, and AI-assisted reflections to support personal and
          relational growth. Tender is not a medical device, not a diagnostic
          tool, and does not provide therapy, counseling, or clinical
          treatment. No content in Tender should be interpreted as a clinical
          diagnosis or professional recommendation.
        </Text>

        {/* Section 3 */}
        <Text style={styles.sectionTitle}>3. Your Data</Text>
        <Text style={styles.body}>
          Assessment responses, scores, portraits, and chat history are stored
          securely in our database and associated with your account. You may
          delete all of your data at any time from the Privacy & Data screen.
          We never sell your personal data to third parties.
        </Text>
        <Text style={styles.body}>
          AI-powered features (Sage) send conversation context to our AI
          provider to generate responses. These conversations are not used to
          train AI models. See our Privacy & Data screen for full details on
          what we store and how we protect it.
        </Text>

        {/* Section 4 */}
        <Text style={styles.sectionTitle}>4. Couple Features & Sharing</Text>
        <Text style={styles.body}>
          When you link with a partner, you choose which assessment results to
          share. Shared data is visible to your linked partner. You can revoke
          sharing at any time. If a couple is unlinked, shared data is removed
          from the partner view.
        </Text>

        {/* Section 5 */}
        <Text style={styles.sectionTitle}>5. Acceptable Use</Text>
        <Text style={styles.body}>
          You agree to use Tender for personal, non-commercial purposes. You
          will not attempt to reverse-engineer, scrape, or redistribute app
          content. You are responsible for maintaining the security of your
          account credentials.
        </Text>

        {/* Section 6 */}
        <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
        <Text style={styles.body}>
          Tender is provided "as is" without warranties of any kind. We are
          not liable for any decisions you make based on assessment results,
          AI-generated insights, or exercise content. In no event shall
          Tender's total liability exceed the amount you paid for the service
          in the preceding 12 months.
        </Text>

        {/* Section 7 */}
        <Text style={styles.sectionTitle}>7. Changes to Terms</Text>
        <Text style={styles.body}>
          We may update these terms from time to time. Continued use of
          Tender after changes constitutes acceptance. We will notify users
          of material changes through the app.
        </Text>

        {/* Section 8 */}
        <Text style={styles.sectionTitle}>8. Contact</Text>
        <Text style={styles.body}>
          Questions about these terms? Reach us at the support email listed
          on the Privacy & Data screen.
        </Text>

        {/* Bottom spacing */}
        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingS,
    color: Colors.text,
  },
  content: {
    padding: Spacing.lg,
  },
  effectiveDate: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
  },

  // Disclaimer card
  disclaimerCard: {
    backgroundColor: Colors.warningLight,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.warning,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  disclaimerTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: Colors.warningDark,
    fontWeight: '600',
  },
  disclaimerText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    lineHeight: 20,
  },

  // Content
  sectionTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingS,
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  body: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
});
