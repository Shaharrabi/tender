/**
 * UserInput — messaging-app-style input bar with rounded field and send button.
 *
 * Rounded text input with sage-green circular send arrow.
 * Looks and feels like iMessage / WhatsApp input.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '@/constants/theme';
import { COACH } from '@/constants/coach';

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function UserInput({
  onSend,
  disabled = false,
  placeholder = `Message ${COACH.name}...`,
}: Props) {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    // Re-focus the input after sending
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleKeyPress = (e: any) => {
    // On web, Enter sends the message (Shift+Enter for newline)
    if (
      Platform.OS === 'web' &&
      e.nativeEvent?.key === 'Enter' &&
      !e.nativeEvent?.shiftKey
    ) {
      e.preventDefault?.();
      handleSend();
    }
  };

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <View style={styles.inputWrapper}>
          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              Platform.OS === 'web' && styles.inputWeb,
            ]}
            value={text}
            onChangeText={setText}
            placeholder={placeholder}
            placeholderTextColor={Colors.textMuted}
            multiline
            maxLength={2000}
            editable={!disabled}
            returnKeyType="default"
            blurOnSubmit={false}
            onKeyPress={handleKeyPress}
            autoFocus={false}
          />
        </View>

        <TouchableOpacity
          style={[styles.sendButton, !canSend && styles.sendDisabled]}
          onPress={handleSend}
          disabled={!canSend}
          activeOpacity={0.7}
        >
          <Text style={[styles.sendArrow, !canSend && styles.sendArrowDisabled]}>
            {'\u2191'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderLight,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? Spacing.lg : Spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? Spacing.sm + 2 : Spacing.sm,
    fontSize: FontSizes.body,
    color: Colors.text,
    maxHeight: 120,
    minHeight: 40,
    lineHeight: 22,
  },
  inputWeb: {
    // @ts-ignore — web-only property for better textarea behavior
    outlineStyle: 'none',
    minHeight: 42,
  } as any,
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.subtle,
  },
  sendDisabled: {
    backgroundColor: Colors.border,
  },
  sendArrow: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '700',
    marginTop: -1,
  },
  sendArrowDisabled: {
    color: Colors.textMuted,
  },
});
