/**
 * HomeButton — Shared bottom-of-page Home navigation button.
 *
 * Renders a small, unobtrusive "Home" link at the bottom of any screen.
 * Uses router.replace to go back to the home screen (avoids stacking).
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { HomeIcon } from '@/assets/graphics/icons';
import { Colors, Spacing, FontSizes, FontFamilies } from '@/constants/theme';
import { SoundHaptics } from '@/services/SoundHapticsService';

export default function HomeButton() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          SoundHaptics.tapSoft();
          router.replace('/(app)/home' as any);
        }}
        activeOpacity={0.7}
      >
        <HomeIcon size={16} color={Colors.textSecondary} />
        <Text style={styles.label}>Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  label: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
});
