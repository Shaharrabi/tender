/**
 * Onboarding -- Choose Your Practice Partner
 *
 * Shows the 4 demo partner archetypes with descriptions.
 * Only reached when user selects "Demo Partner" mode.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/context/OnboardingContext';
import { SoundHaptics } from '@/services/SoundHapticsService';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import {
  ArrowLeftIcon,
  BrainIcon,
  HeartPulseIcon,
  LeafIcon,
  CompassIcon,
} from '@/assets/graphics/icons';
import type { IconProps } from '@/assets/graphics/icons';
import { DEMO_PARTNER_LIST, type DemoPartnerId } from '@/constants/demoPartners';

const PARTNER_ICONS: Record<string, React.ComponentType<IconProps>> = {
  brain: BrainIcon,
  flame: HeartPulseIcon,
  leaf: LeafIcon,
  compass: CompassIcon,
};

export default function PartnerSelectScreen() {
  const router = useRouter();
  const { data, setDemoPartnerId } = useOnboarding();
  const [selected, setSelected] = useState<DemoPartnerId | null>(data.demoPartnerId);

  const handleSelect = (id: DemoPartnerId) => {
    SoundHaptics.tap();
    setSelected(id);
  };

  const handleContinue = () => {
    if (!selected) return;
    SoundHaptics.success();
    setDemoPartnerId(selected);
    router.push('/(onboarding)/goals' as any);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(1000)} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeftIcon size={16} color={Colors.primary} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.stepIndicator}>{data.relationshipStatus === 'single' ? '2 of 4' : '3 of 5'}</Text>
          <View style={styles.headerSpacer} />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(800)} style={styles.titleSection}>
        <Text style={styles.title}>Choose Your AI Practice Partner</Text>
        <Text style={styles.subtitle}>
          Each AI partner brings different relational{'\n'}patterns for realistic practice.
        </Text>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {DEMO_PARTNER_LIST.map((partner, index) => {
          const isSelected = selected === partner.id;
          const Icon = PARTNER_ICONS[partner.iconName] ?? CompassIcon;

          return (
            <Animated.View
              key={partner.id}
              entering={FadeInDown.duration(600).delay(200 + index * 100)}
            >
              <TouchableOpacity
                style={[
                  styles.partnerCard,
                  isSelected && styles.partnerCardSelected,
                  isSelected && { borderColor: partner.color },
                ]}
                onPress={() => handleSelect(partner.id)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`${partner.name}: ${partner.shortDescription}`}
                accessibilityState={{ selected: isSelected }}
              >
                <View style={[styles.partnerIconCircle, { backgroundColor: partner.color + '20' }]}>
                  <Icon size={28} color={partner.color} />
                </View>
                <View style={styles.partnerInfo}>
                  <Text style={[styles.partnerName, isSelected && { color: partner.color }]}>
                    {partner.name}
                  </Text>
                  <Text style={styles.partnerTitle}>{partner.displayName}</Text>
                  <Text style={styles.partnerDesc}>{partner.shortDescription}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* Continue button */}
      <Animated.View entering={FadeIn.duration(800).delay(600)} style={styles.bottomSection}>
        <TouchableOpacity
          style={[styles.continueButton, !selected && styles.continueButtonDisabled]}
          onPress={handleContinue}
          activeOpacity={selected ? 0.8 : 1}
          disabled={!selected}
          accessibilityRole="button"
          accessibilityLabel="Choose partner"
          accessibilityState={{ disabled: !selected }}
        >
          <Text style={[styles.continueText, !selected && styles.continueTextDisabled]}>
            Choose Partner
          </Text>
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
  header: {
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  backText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
    fontFamily: 'JosefinSans_600SemiBold',
  },
  headerSpacer: {
    width: 52,
  },
  stepIndicator: {
    fontSize: FontSizes.caption,
    fontFamily: 'JosefinSans_500Medium',
    color: Colors.primary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  titleSection: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.headingL,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.body,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  partnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
  },
  partnerCardSelected: {
    backgroundColor: Colors.surface,
    ...Shadows.subtle,
  },
  partnerIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerInfo: {
    flex: 1,
    gap: 2,
  },
  partnerName: {
    fontSize: FontSizes.headingM,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    color: Colors.text,
  },
  partnerTitle: {
    fontSize: FontSizes.caption,
    fontFamily: FontFamilies.accent,
    fontStyle: 'italic',
    color: Colors.textSecondary,
  },
  partnerDesc: {
    fontSize: FontSizes.caption,
    fontFamily: 'JosefinSans_400Regular',
    color: Colors.textMuted,
    marginTop: 2,
  },
  bottomSection: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 50 : 30,
    paddingTop: Spacing.sm,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    height: 52,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: Colors.progressTrack,
  },
  continueText: {
    color: Colors.white,
    fontSize: FontSizes.body,
    fontFamily: FontFamilies.heading,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  continueTextDisabled: {
    color: Colors.textMuted,
  },
});
