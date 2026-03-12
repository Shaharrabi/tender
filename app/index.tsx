import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useGuest } from '@/context/GuestContext';
import { supabase } from '@/services/supabase';
import { Colors, FontSizes } from '@/constants/theme';

export default function Index() {
  const { session, user, loading } = useAuth();
  const { isGuest } = useGuest();
  const [onboardingCheck, setOnboardingCheck] = useState<'loading' | 'needed' | 'done'>('loading');

  // Check if user has completed onboarding
  useEffect(() => {
    if (loading) return;

    if (!session || !user) {
      // Not logged in — no onboarding check needed
      setOnboardingCheck('done');
      return;
    }

    // Check user_profiles for onboarding_completed_at
    const checkOnboarding = async () => {
      try {
        const { data } = await supabase
          .from('user_profiles')
          .select('onboarding_completed_at')
          .eq('user_id', user.id)
          .maybeSingle();

        if (data?.onboarding_completed_at) {
          setOnboardingCheck('done');
          return;
        }

        // Fallback: if user has completed assessments, they've been through onboarding
        // This handles cases where browser history was cleared but account exists
        const { data: assessments } = await supabase
          .from('assessments')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        if (assessments && assessments.length > 0) {
          // User has assessment data — they completed onboarding before.
          // Backfill the onboarding flag so this check doesn't repeat.
          await supabase.from('user_profiles').upsert(
            { user_id: user.id, onboarding_completed_at: new Date().toISOString() },
            { onConflict: 'user_id' }
          );
          setOnboardingCheck('done');
          return;
        }

        setOnboardingCheck('needed');
      } catch {
        // If queries fail, try the assessment fallback
        try {
          const { data: assessments } = await supabase
            .from('assessments')
            .select('id')
            .eq('user_id', user.id)
            .limit(1);

          if (assessments && assessments.length > 0) {
            setOnboardingCheck('done');
            return;
          }
        } catch { /* ignore */ }
        setOnboardingCheck('needed');
      }
    };

    checkOnboarding();
  }, [loading, session, user]);

  if (loading || (session && onboardingCheck === 'loading')) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Tender</Text>
        <Text style={styles.subtitle}>The Science of Relationships</Text>
        <ActivityIndicator size="large" color={Colors.primary} style={styles.spinner} />
      </View>
    );
  }

  // Logged in but hasn't completed onboarding
  if (session && onboardingCheck === 'needed') {
    return <Redirect href="/(onboarding)/status" />;
  }

  // Logged in and onboarding done (or guest)
  if (session || isGuest) {
    return <Redirect href="/(app)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: FontSizes.hero,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
  },
  spinner: {
    marginTop: 24,
  },
});
