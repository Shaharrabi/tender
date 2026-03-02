/**
 * TenderText — Themed Typography Component
 *
 * Drop-in replacement for <Text> that applies Typography presets
 * from the design system. Supports all Typography variants, custom
 * colors, alignment, and passes through all React Native Text props.
 *
 * Usage:
 *   <TenderText variant="headingL">Title</TenderText>
 *   <TenderText variant="body" color={Colors.textSecondary}>Body copy</TenderText>
 *   <TenderText variant="serifItalic" align="center">A quote</TenderText>
 */

import React from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';
import { Typography, Colors } from '@/constants/theme';

export type TypographyVariant = keyof typeof Typography;

interface TenderTextProps extends TextProps {
  /** Typography preset — maps to the Typography object in theme.ts */
  variant?: TypographyVariant;
  /** Override color (defaults to Colors.text) */
  color?: string;
  /** Text alignment shorthand */
  align?: TextStyle['textAlign'];
  children: React.ReactNode;
}

export default function TenderText({
  variant = 'body',
  color,
  align,
  style,
  children,
  accessibilityRole = 'text',
  ...rest
}: TenderTextProps) {
  const variantStyle = Typography[variant] as TextStyle;

  const baseStyle: TextStyle = {
    ...variantStyle,
    color: color ?? Colors.text,
    ...(align ? { textAlign: align } : {}),
  };

  return (
    <Text
      style={[baseStyle, style]}
      accessibilityRole={accessibilityRole}
      {...rest}
    >
      {children}
    </Text>
  );
}
