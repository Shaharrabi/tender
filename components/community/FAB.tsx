/**
 * FAB — Floating Action Button for sharing stories.
 */

import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  Shadows,
} from '@/constants/theme';
import { PenIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';

interface FABProps {
  onPress: () => void;
  visible: boolean;
}

export function FAB({ onPress, visible }: FABProps) {
  const haptics = useSoundHaptics();
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const translateY = useRef(new Animated.Value(visible ? 0 : 20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: visible ? 0 : 20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  const handlePress = () => {
    haptics.tap();
    onPress();
  };

  return (
    <Animated.View
      style={[
        st.container,
        { opacity, transform: [{ translateY }] },
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <TouchableOpacity
        style={st.button}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <PenIcon size={16} color={Colors.textOnPrimary} />
        <Text style={st.text}>Share</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const st = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: 24,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    ...Shadows.elevated,
  },
  text: {
    color: Colors.textOnPrimary,
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
  },
});
