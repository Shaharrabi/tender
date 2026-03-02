import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, FontSizes, ButtonSizes, FontFamilies, BorderRadius } from '@/constants/theme';
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
      router.replace('/(onboarding)/welcome');
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
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>First name</Text>
            <TextInput
              style={styles.input}
              placeholder="Your first name"
              placeholderTextColor={Colors.textMuted}
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              autoComplete="given-name"
              accessibilityRole="text"
              accessibilityLabel="First name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[
                styles.input,
                email.length > 0 && !isValidEmail(email) && styles.inputError,
              ]}
              placeholder="you@example.com"
              placeholderTextColor={Colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              accessibilityRole="text"
              accessibilityLabel="Email address"
            />
            {email.length > 0 && !isValidEmail(email) && (
              <Text style={styles.fieldHint}>Please enter a valid email</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Min. 8 characters"
              placeholderTextColor={Colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
              accessibilityRole="text"
              accessibilityLabel="Password"
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
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm password</Text>
            <TextInput
              style={[
                styles.input,
                confirmPassword.length > 0 &&
                  password !== confirmPassword &&
                  styles.inputError,
              ]}
              placeholder="Re-enter password"
              placeholderTextColor={Colors.textMuted}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="new-password"
              accessibilityRole="text"
              accessibilityLabel="Confirm password"
            />
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <Text style={styles.fieldHint}>Passwords don't match</Text>
            )}
          </View>

          {/* Terms / Consent */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
            activeOpacity={0.7}
            accessibilityRole="checkbox"
            accessibilityLabel="Agree to data usage terms"
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
              I agree that my assessment data may be used to generate my
              relational portrait and provide personalized guidance. My data is
              private and never shared without my explicit consent.
            </Text>
          </TouchableOpacity>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Sign up"
            accessibilityState={{ disabled: loading }}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.buttonText}>Create account</Text>
            )}
          </TouchableOpacity>
        </View>

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
  inputGroup: {
    gap: Spacing.xs,
  },
  inputLabel: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    fontSize: FontSizes.body,
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  inputError: {
    borderColor: Colors.error,
  },
  fieldHint: {
    fontSize: FontSizes.caption,
    color: Colors.error,
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

  button: {
    backgroundColor: Colors.primary,
    height: ButtonSizes.large,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
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
