/**
 * AppButton — Premium reusable button component
 *
 * Variants: primary, secondary, outline, ghost, danger
 * Sizes: small, medium, large
 * Features: press animation, haptic feedback, loading state, icon support
 */

import React, { useRef, useCallback } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, Spacing, FontSizes, ButtonSizes, BorderRadius, Shadows } from '@/constants/theme';

// Graceful haptic import — degrades silently if expo-haptics is not installed
let Haptics: any = null;
try {
  Haptics = require('expo-haptics');
} catch {}

// ─── Types ──────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  fullWidth?: boolean;
  style?: ViewStyle;
}

// ─── Variant Styles ─────────────────────────────────────

interface VariantTokens {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  textColor: string;
  loaderColor: string;
}

const variantTokens: Record<ButtonVariant, VariantTokens> = {
  primary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    borderWidth: 0,
    textColor: Colors.textOnPrimary,
    loaderColor: Colors.textOnPrimary,
  },
  secondary: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
    borderWidth: 0,
    textColor: Colors.textOnSecondary,
    loaderColor: Colors.textOnSecondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: Colors.primary,
    borderWidth: 1.5,
    textColor: Colors.primary,
    loaderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
    textColor: Colors.primary,
    loaderColor: Colors.primary,
  },
  danger: {
    backgroundColor: Colors.error,
    borderColor: Colors.error,
    borderWidth: 0,
    textColor: Colors.white,
    loaderColor: Colors.white,
  },
};

// ─── Size Styles ────────────────────────────────────────

interface SizeTokens {
  height: number;
  paddingHorizontal: number;
  fontSize: number;
  iconSize: number;
}

const sizeTokens: Record<ButtonSize, SizeTokens> = {
  small: {
    height: ButtonSizes.small,
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.bodySmall,
    iconSize: 14,
  },
  medium: {
    height: ButtonSizes.medium,
    paddingHorizontal: Spacing.lg,
    fontSize: FontSizes.body,
    iconSize: 16,
  },
  large: {
    height: ButtonSizes.large,
    paddingHorizontal: Spacing.xl,
    fontSize: FontSizes.body,
    iconSize: 18,
  },
};

// ─── Component ──────────────────────────────────────────

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
}: AppButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const isDisabled = disabled || loading;

  const tokens = variantTokens[variant];
  const sizing = sizeTokens[size];

  // ── Press animations ─────────────────────────────────

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleAnim]);

  // ── Haptic + onPress ─────────────────────────────────

  const handlePress = useCallback(() => {
    if (isDisabled) return;
    Haptics?.impactAsync?.(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [isDisabled, onPress]);

  // ── Computed styles ──────────────────────────────────

  const containerStyle: ViewStyle = {
    height: sizing.height,
    paddingHorizontal: sizing.paddingHorizontal,
    backgroundColor: tokens.backgroundColor,
    borderColor: tokens.borderColor,
    borderWidth: tokens.borderWidth,
    borderRadius: BorderRadius.pill,
    alignSelf: fullWidth ? 'stretch' : 'center',
    ...(variant === 'primary' || variant === 'secondary' || variant === 'danger'
      ? Shadows.subtle
      : {}),
  };

  const textStyle: TextStyle = {
    color: tokens.textColor,
    fontSize: sizing.fontSize,
    fontWeight: '600',
    letterSpacing: 0.3,
  };

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }] },
        isDisabled && { opacity: 0.5 },
      ]}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.base,
          containerStyle,
          pressed && styles.pressed,
          style,
        ]}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
      >
        {loading ? (
          <ActivityIndicator color={tokens.loaderColor} size="small" />
        ) : (
          <>
            {icon ? <Text style={[styles.icon, { fontSize: sizing.iconSize }]}>{icon}</Text> : null}
            <Text style={[styles.text, textStyle]}>{title}</Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

// ─── Base Styles ────────────────────────────────────────

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    textAlign: 'center',
  },
  icon: {
    marginRight: Spacing.sm,
  },
});
