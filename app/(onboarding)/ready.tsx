/**
 * Onboarding — Ready Screen
 *
 * Final screen. Affirming message, then "Let's go" button
 * that marks onboarding complete and routes to the main app.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';
import { useOnboarding } from '@/context/OnboardingContext';
import { SoundHaptics } from '@/services/SoundHapticsService';
import { supabase } from '@/services/supabase';
import { setupDemoPartnerCouple } from '@/services/couples';
import { seedDyadicAssessments } from '@/utils/demo-data';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  ButtonSizes,
  BorderRadius,
} from '@/constants/theme';
import { LeafIcon } from '@/assets/graphics/icons';

export default function ReadyScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: onboardingData } = useOnboarding();

  const handleLetsGo = async () => {
    SoundHaptics.success();
    // Save all onboarding data + mark complete
    if (user) {
      try {
        // Pick up the name stashed during registration
        let displayName: string | null = null;
        try {
          displayName = await AsyncStorage.getItem('pending_display_name');
        } catch (e) {
          console.warn('[Ready] Failed to read pending_display_name:', e);
        }

        console.log('[Ready] Saving onboarding data for user:', user.id, 'displayName:', displayName);

        const upsertPayload: Record<string, any> = {
          user_id: user.id,
          onboarding_completed_at: new Date().toISOString(),
          relationship_status: onboardingData.relationshipStatus || null,
          relationship_duration: onboardingData.relationshipDuration || null,
          goals: onboardingData.goals.length > 0 ? onboardingData.goals : null,
          time_commitment: onboardingData.timeCommitment || null,
          relationship_mode: onboardingData.relationshipMode || 'solo',
          demo_partner_id: onboardingData.demoPartnerId || null,
        };

        // Only include display_name if we have one — avoid overwriting with null on re-onboarding
        if (displayName) {
          upsertPayload.display_name = displayName;
        }

        const { error: upsertError } = await supabase
          .from('user_profiles')
          .upsert(upsertPayload, { onConflict: 'user_id' });

        if (upsertError) {
          console.error('[Ready] Upsert error:', upsertError);
        } else {
          console.log('[Ready] Onboarding data saved successfully');
        }

        // Clean up the stashed name
        if (displayName) {
          await AsyncStorage.removeItem('pending_display_name').catch(() => {});
        }

        // Solo mode: auto-create a virtual partner so the user has
        // someone to do the 12-step journey with. Uses "Casey" (secure
        // explorer) as the default partner archetype.
        const mode = onboardingData.relationshipMode || 'solo';
        if (mode === 'solo') {
          try {
            // Set a default demo partner (Casey — secure, grounded)
            await supabase
              .from('user_profiles')
              .update({ demo_partner_id: 'secure_explorer' })
              .eq('user_id', user.id);

            // Create the self-couple record
            const couple = await setupDemoPartnerCouple(user.id);
            if (couple) {
              // Seed dyadic assessments so the relationship portal works
              await seedDyadicAssessments(couple.id, user.id, user.id);
              console.log('[Ready] Solo mode: virtual partner connected (Casey)');
            }
          } catch (soloErr) {
            console.warn('[Ready] Solo partner setup failed (non-critical):', soloErr);
          }
        }
      } catch (err) {
        console.error('[Ready] Failed to save onboarding data:', err);
      }
    } else {
      console.warn('[Ready] No user available — onboarding data not saved!');
    }
    router.replace('/(app)/home');
  };

  return (
    <View style={styles.container}>
      {/* Step indicator */}
      <Animated.View entering={FadeIn.duration(1000)} style={styles.headerSection}>
        <Text style={styles.stepIndicator}>6 of 6</Text>
      </Animated.View>

      <View style={styles.content}>
        <Animated.View entering={FadeIn.duration(1500)} style={styles.emojiSection}>
          <LeafIcon size={56} color={Colors.primary} />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(1200).delay(500)}>
          <Text style={styles.title}>You're ready.</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(1200).delay(1000)}>
          <Text style={styles.message}>
            This isn't about being perfect.{'\n'}
            It's about showing up —{'\n'}
            for yourself, and for the people you love.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(1200).delay(1500)}>
          <Text style={styles.submessage}>
            We'll start with a gentle assessment{'\n'}
            to understand how you connect.
          </Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeIn.duration(1000).delay(2000)} style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.letsGoButton}
          onPress={handleLetsGo}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Let's begin"
        >
          <Text style={styles.letsGoText}>Let's begin →</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerSection: {
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
    paddingHorizontal: Spacing.xl,
  },
  stepIndicator: {
    fontSize: FontSizes.caption,
    fontFamily: 'JosefinSans_500Medium',
    color: Colors.primary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emojiSection: {
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  message: {
    fontSize: FontSizes.headingM,
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: Spacing.lg,
  },
  submessage: {
    fontSize: FontSizes.body,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomSection: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 50 : 30,
  },
  letsGoButton: {
    backgroundColor: Colors.primary,
    height: ButtonSizes.large + 8,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letsGoText: {
    color: Colors.white,
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
