/**
 * TenderButton — Consolidated button component for the Tender app.
 *
 * Combines the best of AppButton (Pressable, haptics, animation) and Button
 * (simple API) into a single shared component.
 *
 * Variants: primary, secondary, outline, ghost, destructive
 * Sizes: sm, md, lg
 * Features: press animation, haptic feedback, loading state, disabled state,
 *           icon support, full accessibility annotations.
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

export type TenderButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type TenderButtonSize = 'sm' | 'md' | 'lg';

export interface TenderButtonProps {
  title: string;
  onPress: () => void;
  variant?: TenderButtonVariant;
  size?: TenderButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

// ─── Variant Tokens ─────────────────────────────────────

interface VariantTokens {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  textColor: string;
  loaderColor: string;
}

const variantTokens: Record<TenderButtonVariant, VariantTokens> = {
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
  destructive: {
    backgroundColor: Colors.error,
    borderColor: Colors.error,
    borderWidth: 0,
    textColor: Colors.white,
    loaderColor: Colors.white,
  },
};

// ─── Size Tokens ────────────────────────────────────────

interface SizeTokens {
  height: number;
  paddingHorizontal: number;
  fontSize: number;
  iconSize: number;
}

const sizeTokens: Record<TenderButtonSize, SizeTokens> = {
  sm: {
    height: ButtonSizes.small,
    paddingHorizontal: Spacing.md,
    fontSize: FontSizes.bodySmall,
    iconSize: 14,
  },
  md: {
    height: ButtonSizes.medium,
    paddingHorizontal: Spacing.lg,
    fontSize: FontSizes.body,
    iconSize: 16,
  },
  lg: {
    height: ButtonSizes.large,
    paddingHorizontal: Spacing.xl,
    fontSize: FontSizes.body,
    iconSize: 18,
  },
};

// ─── Component ──────────────────────────────────────────

export default function TenderButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
  textStyle,
  accessibilityLabel,
}: TenderButtonProps) {
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
    ...(variant === 'primary' || variant === 'secondary' || variant === 'destructive'
      ? Shadows.subtle
      : {}),
  };

  const computedTextStyle: TextStyle = {
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
        accessibilityLabel={accessibilityLabel || title}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
      >
        {loading ? (
          <ActivityIndicator color={tokens.loaderColor} size="small" />
        ) : (
          <>
            {icon ? <Text style={[styles.icon, { fontSize: sizing.iconSize }]}>{icon}</Text> : null}
            <Text style={[styles.text, computedTextStyle, textStyle]}>{title}</Text>
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
