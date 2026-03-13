/**
 * ComposeLetterModal — Send a slow letter to a discovered profile.
 *
 * A simple, thoughtful compose modal. 500 character limit
 * encourages intentional writing. Content filter blocks
 * contact info to maintain the slow-letter philosophy.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, FontSizes } from '@/constants/theme';
import { sendLetter } from '@/services/dating';
import { filterLetterContent } from '@/utils/dating/contentFilter';
import { SoundHaptics } from '@/services/SoundHapticsService';

const MAX_CHARS = 500;

interface ComposeLetterModalProps {
  visible: boolean;
  senderId: string;
  recipientId: string;
  recipientAlias: string;
  onClose: () => void;
  onSent: () => void;
}

export default function ComposeLetterModal({
  visible,
  senderId,
  recipientId,
  recipientAlias,
  onClose,
  onSent,
}: ComposeLetterModalProps) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  // Reset on open
  useEffect(() => {
    if (visible) {
      setText('');
      setError(null);
      setSending(false);
      // Focus input after modal animation
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [visible]);

  const handleSend = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 20) {
      setError('Write at least 20 characters. Say something real.');
      return;
    }

    // Content safety check
    const filterResult = filterLetterContent(trimmed);
    if (!filterResult.isClean) {
      setError(filterResult.message);
      return;
    }

    setSending(true);
    setError(null);

    try {
      await sendLetter(senderId, recipientId, trimmed);
      SoundHaptics.tap();

      // Show success
      if (Platform.OS === 'web') {
        window.alert(`Your letter to ${recipientAlias} has been sent. They have 48 hours to read it.`);
      } else {
        Alert.alert(
          'Letter Sent',
          `Your letter to ${recipientAlias} has been sent. They have 48 hours to read it.`,
          [{ text: 'Beautiful', style: 'default' }],
        );
      }

      onSent();
    } catch (err: any) {
      const msg = err?.message || 'Failed to send letter';
      if (msg.includes('rate') || msg.includes('limit')) {
        setError('You\'ve sent your daily letters. Come back tomorrow to write more.');
      } else {
        setError('Something went wrong. Try again in a moment.');
      }
    } finally {
      setSending(false);
    }
  }, [text, senderId, recipientId, recipientAlias, onSent]);

  const charsLeft = MAX_CHARS - text.length;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} accessibilityRole="button" accessibilityLabel="Cancel">
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerLabel}>A LETTER TO</Text>
              <Text style={styles.headerAlias}>{recipientAlias}</Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>

          {/* Guidance */}
          <Text style={styles.guidance}>
            Write something that shows who you are. No small talk.{'\n'}
            What's alive in you right now?
          </Text>

          {/* Text Input */}
          <TextInput
            ref={inputRef}
            style={styles.textInput}
            value={text}
            onChangeText={(t) => {
              if (t.length <= MAX_CHARS) {
                setText(t);
                setError(null);
              }
            }}
            placeholder="Begin your letter..."
            placeholderTextColor={Colors.textMuted}
            multiline
            maxLength={MAX_CHARS}
            textAlignVertical="top"
            accessibilityLabel="Letter content"
          />

          {/* Character count + error */}
          <View style={styles.footer}>
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <Text style={[styles.charCount, charsLeft < 50 && styles.charCountLow]}>
                {charsLeft} characters remaining
              </Text>
            )}

            <TouchableOpacity
              style={[
                styles.sendButton,
                (sending || text.trim().length < 20) && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={sending || text.trim().length < 20}
              accessibilityRole="button"
              accessibilityLabel="Send letter"
            >
              {sending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.sendText}>Send Letter</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Safety note */}
          <Text style={styles.safetyNote}>
            Letters are anonymous until both people choose to connect further.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(45, 34, 38, 0.5)',
  },
  container: {
    backgroundColor: '#FAF7F2',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e3db',
  },
  cancelText: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerLabel: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 9,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: '#6B5E56',
  },
  headerAlias: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 16,
    color: '#3D3530',
    marginTop: 2,
  },
  headerSpacer: {
    width: 50,
  },
  guidance: {
    fontFamily: 'JosefinSans_300Light',
    fontSize: 13,
    color: '#6B5E56',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  textInput: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 15,
    lineHeight: 24,
    color: '#3D3530',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#e8e3db',
    padding: Spacing.md,
    minHeight: 160,
    maxHeight: 240,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  charCount: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 11,
    color: Colors.textMuted,
    flex: 1,
  },
  charCountLow: {
    color: '#C4836A',
  },
  errorText: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 12,
    color: '#C4836A',
    flex: 1,
    lineHeight: 18,
    paddingRight: 12,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: BorderRadius.pill,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.border,
  },
  sendText: {
    fontFamily: 'JosefinSans_500Medium',
    fontSize: 13,
    color: '#fff',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  safetyNote: {
    fontFamily: 'JosefinSans_300Light',
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
  },
});
