import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, FontSizes, FontFamilies } from '@/constants/theme';
import TenderButton from '@/components/ui/TenderButton';
import TenderTextInput from '@/components/ui/TenderTextInput';
import {
  isValidEmail,
  checkPasswordStrength,
  checkRateLimit,
  recordAttempt,
} from '@/utils/security/validation';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const passwordStrength = useMemo(
    () => checkPasswordStrength(password),
    [password]
  );

  const handleRegister = async () => {
    setError('');

    // Rate limit check
    const rateCheck = checkRateLimit('register');
    if (!rateCheck.allowed) {
      const minutes = Math.ceil((rateCheck.lockedUntilMs ?? 0) / 60000);
      setError(`Too many attempts. Please try again in ${minutes} minute${minutes !== 1 ? 's' : ''}.`);
      return;
    }

    // Validate name
    if (!firstName.trim()) {
      setError('Please enter your first name');
      return;
    }

    // Validate email
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate password
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (passwordStrength.score < 2) {
      setError('Please choose a stronger password');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Consent check
    if (!agreedToTerms) {
      setError('Please agree to the terms to continue');
      return;
    }

    recordAttempt('register');
    setLoading(true);
    const { error: authError } = await signUp(email.trim(), password);
    setLoading(false);

    if (authError) {
      setError(authError);
    } else {
      // Stash name so the onboarding flow can save it reliably
      // (session may not be ready yet at this point)
      try {
        await AsyncStorage.setItem('pending_display_name', firstName.trim());
      } catch {
        // Non-blocking — name will fall back to email prefix
      }
      router.replace('/(onboarding)/status');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>
            Begin your relationship growth journey
          </Text>
        </View>

        <View style={styles.form}>
          <TenderTextInput
            label="First name"
            placeholder="Your first name"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
            autoComplete="given-name"
          />

          <TenderTextInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={email.length > 0 && !isValidEmail(email) ? 'Please enter a valid email' : undefined}
          />

          <TenderTextInput
            label="Password"
            placeholder="Min. 8 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="new-password"
          />
          {/* Password strength indicator */}
          {password.length > 0 && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBarTrack}>
                {[0, 1, 2, 3].map((i) => (
                  <View
                    key={i}
                    style={[
                      styles.strengthBarSegment,
                      {
                        backgroundColor:
                          i < passwordStrength.score
                            ? passwordStrength.color
                            : Colors.borderLight,
                      },
                    ]}
                  />
                ))}
              </View>
              <Text
                style={[
                  styles.strengthLabel,
                  { color: passwordStrength.color },
                ]}
              >
                {passwordStrength.label}
              </Text>
              {passwordStrength.feedback.length > 0 && (
                <Text style={styles.strengthFeedback}>
                  Tip: {passwordStrength.feedback[0]}
                </Text>
              )}
            </View>
          )}

          <TenderTextInput
            label="Confirm password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoComplete="new-password"
            error={confirmPassword.length > 0 && password !== confirmPassword ? "Passwords don't match" : undefined}
          />

          {/* Terms / Consent */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
            activeOpacity={0.7}
            accessibilityRole="checkbox"
            accessibilityLabel="Agree to Terms of Service"
            accessibilityState={{ checked: agreedToTerms }}
          >
            <View
              style={[
                styles.checkbox,
                agreedToTerms && styles.checkboxChecked,
              ]}
            >
              {agreedToTerms && <Text style={styles.checkboxCheck}>{'✓'}</Text>}
            </View>
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text
                style={styles.termsLink}
                onPress={() => setShowTerms(true)}
                accessibilityRole="link"
              >
                Terms of Service
              </Text>
              . Tender is a wellness tool, not therapy. My data is used to
              generate my relational portrait and provide personalized
              guidance, and is never shared without my explicit consent.
            </Text>
          </TouchableOpacity>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TenderButton
            title="Create account"
            onPress={handleRegister}
            loading={loading}
            variant="primary"
            size="lg"
            fullWidth
            style={{ marginTop: Spacing.sm }}
            accessibilityLabel="Sign up"
          />
        </View>

        {/* Terms of Service Modal */}
        <Modal
          visible={showTerms}
          transparent
          animationType="fade"
          onRequestClose={() => setShowTerms(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Terms of Service</Text>
              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                <Text style={styles.modalDate}>Effective: March 2026</Text>
                <View style={styles.modalDisclaimer}>
                  <Text style={styles.modalDisclaimerText}>
                    Tender is a relational wellness tool — not therapy, and not a
                    substitute for professional mental health care. If you need
                    clinical support, please reach out to a licensed therapist or
                    call 988 (Suicide & Crisis Lifeline).
                  </Text>
                </View>
                <Text style={styles.modalSectionTitle}>1. Acceptance of Terms</Text>
                <Text style={styles.modalBody}>
                  By creating an account or using Tender, you agree to these Terms
                  of Service and our Privacy practices described within the app.
                </Text>
                <Text style={styles.modalSectionTitle}>2. What Tender Is (and Is Not)</Text>
                <Text style={styles.modalBody}>
                  Tender provides relationship self-assessment tools, educational
                  exercises, and AI-assisted reflections. Tender is not a medical
                  device, not a diagnostic tool, and does not provide therapy or
                  clinical treatment.
                </Text>
                <Text style={styles.modalSectionTitle}>3. Your Data</Text>
                <Text style={styles.modalBody}>
                  Assessment responses and chat history are stored securely. You may
                  delete all data at any time from Privacy & Data settings. We never
                  sell your personal data.
                </Text>
                <Text style={styles.modalSectionTitle}>4. Couple Features</Text>
                <Text style={styles.modalBody}>
                  When you link with a partner, you choose which results to share.
                  You can revoke sharing at any time.
                </Text>
                <Text style={styles.modalSectionTitle}>5. Limitation of Liability</Text>
                <Text style={styles.modalBody}>
                  Tender is provided "as is" without warranties. We are not liable
                  for decisions made based on assessment results or AI insights.
                </Text>
              </ScrollView>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowTerms(false)}
                accessibilityRole="button"
                accessibilityLabel="Close terms"
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Link href="/(auth)/login" asChild>
          <TouchableOpacity
            style={styles.linkContainer}
            accessibilityRole="link"
            accessibilityLabel="Already have an account? Login"
          >
            <Text style={styles.linkText}>
              Already have an account?{' '}
              <Text style={styles.linkBold}>Login</Text>
            </Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.headingL,
    fontWeight: 'bold',
    color: Colors.text,
    fontFamily: FontFamilies.heading,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  form: {
    gap: Spacing.md,
  },
  // Password strength
  strengthContainer: {
    gap: Spacing.xs,
  },
  strengthBarTrack: {
    flexDirection: 'row',
    gap: 4,
  },
  strengthBarSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
  },
  strengthFeedback: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },

  // Terms
  termsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
    paddingVertical: Spacing.xs,
    marginTop: Spacing.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxCheck: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
  },
  termsText: {
    flex: 1,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  termsLink: {
    color: Colors.primary,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },

  // Terms modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(45, 34, 38, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalCard: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: Spacing.lg,
    maxHeight: '80%',
    width: '100%',
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: FontSizes.headingM,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  modalScroll: {
    marginBottom: Spacing.md,
  },
  modalDate: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  modalDisclaimer: {
    backgroundColor: Colors.warningLight ?? '#FFF8E1',
    borderLeftWidth: 3,
    borderLeftColor: Colors.warning ?? '#F9A825',
    borderRadius: 8,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  modalDisclaimerText: {
    fontSize: FontSizes.caption,
    color: Colors.text,
    lineHeight: 18,
  },
  modalSectionTitle: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  modalBody: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  modalCloseButton: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    color: Colors.white,
    fontSize: FontSizes.body,
    fontWeight: '600',
  },

  errorText: {
    color: Colors.error,
    fontSize: FontSizes.bodySmall,
  },
  linkContainer: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  linkText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.bodySmall,
  },
  linkBold: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
