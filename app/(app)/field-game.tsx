/**
 * Field Game Screen — Full-screen WebView for zone games.
 *
 * Loads the HTML5 game for a given step number and handles
 * WebView ↔ RN bridge messages (completion, practice data, close).
 *
 * Route: /(app)/field-game?step=5
 */

import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebViewMessageEvent } from 'react-native-webview';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors, Spacing, FontSizes, FontFamilies, Typography } from '@/constants/theme';
import { getFieldGameHtml, getFieldGameForStep } from '@/services/field-games/registry';
import type { FieldGameMessage } from '@/services/field-games/bridge';
import { saveMiniGameOutput } from '@/services/minigames';
import { useSoundHaptics } from '@/services/SoundHapticsService';

export default function FieldGameScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const haptics = useSoundHaptics();
  const params = useLocalSearchParams<{ step: string }>();
  const stepNumber = parseInt(params.step ?? '1', 10);
  const webViewRef = useRef<WebView>(null);

  const gameMeta = getFieldGameForStep(stepNumber);
  const html = getFieldGameHtml(stepNumber);

  const handleMessage = useCallback(
    async (event: WebViewMessageEvent) => {
      try {
        const msg: FieldGameMessage = JSON.parse(event.nativeEvent.data);

        switch (msg.type) {
          case 'game:ready':
            // Game loaded — could send config here
            break;

          case 'game:complete':
            haptics.success();
            // Save completion as a mini-game output
            if (user && gameMeta) {
              try {
                await saveMiniGameOutput(user.id, stepNumber, `field-${gameMeta.id}`, {
                  title: `${gameMeta.zoneName} — Complete`,
                  insights: [`Completed The Field zone: ${gameMeta.zoneName}`],
                  data: msg.data ?? {},
                });
              } catch (err) {
                console.warn('[FieldGame] Save error:', err);
              }
            }
            // Navigate back after a brief moment
            setTimeout(() => router.back(), 300);
            break;

          case 'game:practice_complete':
            haptics.success();
            break;

          case 'game:close':
            router.back();
            break;
        }
      } catch (err) {
        console.warn('[FieldGame] Message parse error:', err);
      }
    },
    [user, stepNumber, gameMeta, haptics, router]
  );

  if (!html || !gameMeta) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Game not found for step {stepNumber}</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Close button overlaid on top */}
      <SafeAreaView style={styles.closeWrapper}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Close game"
        >
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <WebView
        ref={webViewRef}
        source={{ html }}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        originWhitelist={['*']}
        // Prevent WebView from opening links externally
        onShouldStartLoadWithRequest={() => true}
        // Performance
        androidLayerType="hardware"
        cacheEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0608',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  closeWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 100,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS === 'ios' ? 8 : 16,
    marginRight: 16,
  },
  closeText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  backButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backButtonText: {
    ...Typography.label,
    color: Colors.textSecondary,
  },
});
