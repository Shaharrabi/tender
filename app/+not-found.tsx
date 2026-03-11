/**
 * 404 — Catch-all for unmatched routes.
 *
 * Expo Router renders this when no route matches the URL.
 * Provides a friendly message and a way back to the home screen.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius } from '@/constants/theme';
import TenderButton from '@/components/ui/TenderButton';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.emoji}>🍂</Text>
        <Text style={styles.title}>Page not found</Text>
        <Text style={styles.body}>
          This path doesn't lead anywhere — but your journey does.
        </Text>
        <TenderButton
          title="Go Home"
          onPress={() => router.replace('/(app)/home')}
          style={styles.button}
          accessibilityLabel="Return to home screen"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xl,
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  body: {
    fontSize: FontSizes.md,
    fontFamily: FontFamilies.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  button: {
    minWidth: 160,
  },
});
