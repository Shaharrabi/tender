import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useGuest } from '@/context/GuestContext';
import { supabase } from '@/services/supabase';
import { Colors } from '@/constants/theme';

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
          .single();

        if (data?.onboarding_completed_at) {
          setOnboardingCheck('done');
        } else {
          setOnboardingCheck('needed');
        }
      } catch {
        // If profile doesn't exist yet, onboarding is needed
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
    return <Redirect href="/(onboarding)/welcome" />;
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
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  spinner: {
    marginTop: 24,
  },
});
