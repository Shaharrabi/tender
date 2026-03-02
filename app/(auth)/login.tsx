import React, { useState } from 'react';
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
import { useGuest } from '@/context/GuestContext';
import { Colors, Spacing, FontSizes, ButtonSizes, FontFamilies, BorderRadius } from '@/constants/theme';
import {
  isValidEmail,
  checkRateLimit,
  recordAttempt,
  clearRateLimit,
} from '@/utils/security/validation';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const { setGuestMode } = useGuest();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');

    // Rate limit check
    const rateCheck = checkRateLimit('login');
    if (!rateCheck.allowed) {
      const minutes = Math.ceil((rateCheck.lockedUntilMs ?? 0) / 60000);
      setError(`Too many login attempts. Please try again in ${minutes} minute${minutes !== 1 ? 's' : ''}.`);
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Password required');
      return;
    }

    recordAttempt('login');
    setLoading(true);
    const { error: authError } = await signIn(email.trim(), password);
    setLoading(false);

    if (authError) {
      setError(authError);
    } else {
      clearRateLimit('login');
      router.replace('/(app)/home');
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
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
          <Text style={styles.appTagline}>Tender — The Science of Relationships</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={Colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            accessibilityRole="text"
            accessibilityLabel="Email address"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={Colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            accessibilityRole="text"
            accessibilityLabel="Password"
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Log in"
            accessibilityState={{ disabled: loading }}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>

        <Link href="/(auth)/register" asChild>
          <TouchableOpacity
            style={styles.linkContainer}
            accessibilityRole="link"
            accessibilityLabel="Don't have an account? Register"
          >
            <Text style={styles.linkText}>
              Don't have an account? <Text style={styles.linkBold}>Register</Text>
            </Text>
          </TouchableOpacity>
        </Link>

        <View style={styles.guestDivider}>
          <View style={styles.guestDividerLine} />
          <Text style={styles.guestDividerText}>or</Text>
          <View style={styles.guestDividerLine} />
        </View>

        <TouchableOpacity
          style={styles.guestButton}
          onPress={async () => {
            await setGuestMode(true);
            router.replace('/(app)/home');
          }}
          accessibilityRole="button"
          accessibilityLabel="Continue as guest"
        >
          <Text style={styles.guestButtonText}>Continue as Guest</Text>
        </TouchableOpacity>
        <Text style={styles.guestHint}>
          Try assessments without an account. Your data stays on this device.
        </Text>
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
  },
  appTagline: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: Spacing.sm,
    letterSpacing: 0.5,
  },
  form: {
    gap: Spacing.md,
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
  guestDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  guestDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  guestDividerText: {
    marginHorizontal: Spacing.sm,
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },
  guestButton: {
    marginTop: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    height: ButtonSizes.medium,
  },
  guestButtonText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.bodySmall,
    fontWeight: '500',
  },
  guestHint: {
    textAlign: 'center',
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
});
