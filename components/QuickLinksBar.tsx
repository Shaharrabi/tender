/**
 * QuickLinksBar — Shared bottom navigation row for all screens.
 *
 * Shows 4 quick links (Nuance, Courses, Practices, Journal) and
 * optionally a Home link below. Used at the bottom of every screen
 * to give fast access to core features.
 *
 * Props:
 * - showHome: show "Home" link below the quick links (default: true)
 * - currentScreen: hides the link for the screen the user is already on
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChatBubbleIcon,
  BookOpenIcon,
  TargetIcon,
  HomeIcon,
} from '@/assets/graphics/icons';
import { Colors, Spacing, FontSizes, FontFamilies } from '@/constants/theme';
import { SoundHaptics } from '@/services/SoundHapticsService';

type ScreenKey = 'nuance' | 'courses' | 'practices' | 'journal' | 'home';

interface QuickLinksBarProps {
  showHome?: boolean;
  currentScreen?: ScreenKey;
}

export default function QuickLinksBar({ showHome = true, currentScreen }: QuickLinksBarProps) {
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {currentScreen !== 'nuance' && (
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => { SoundHaptics.tapSoft(); router.push('/(app)/chat' as any); }}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Nuance AI"
          >
            <ChatBubbleIcon size={20} color={Colors.secondary} />
            <Text style={styles.linkLabel}>Nuance</Text>
          </TouchableOpacity>
        )}

        {currentScreen !== 'courses' && (
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => { SoundHaptics.tapSoft(); router.push('/(app)/courses' as any); }}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Courses"
          >
            <BookOpenIcon size={20} color={Colors.secondary} />
            <Text style={styles.linkLabel}>Courses</Text>
          </TouchableOpacity>
        )}

        {currentScreen !== 'practices' && (
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => { SoundHaptics.tapSoft(); router.push('/(app)/exercises' as any); }}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Practices"
          >
            <TargetIcon size={20} color={Colors.secondary} />
            <Text style={styles.linkLabel}>Practices</Text>
          </TouchableOpacity>
        )}

        {currentScreen !== 'journal' && (
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => { SoundHaptics.tapSoft(); router.push('/(app)/journal' as any); }}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Journal"
          >
            <BookOpenIcon size={20} color={Colors.primary} />
            <Text style={styles.linkLabel}>Journal</Text>
          </TouchableOpacity>
        )}
      </View>

      {showHome && currentScreen !== 'home' && (
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => { SoundHaptics.tapSoft(); router.replace('/(app)/home' as any); }}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go to home screen"
        >
          <HomeIcon size={16} color={Colors.textSecondary} />
          <Text style={styles.homeLabel}>Home</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: Spacing.lg,
  },
  linkButton: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  linkLabel: {
    fontSize: 11,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.xs,
  },
  homeLabel: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
});
