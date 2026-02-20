/**
 * CrisisFooter — Small, unobtrusive crisis resource footer.
 *
 * Displays 988 Suicide & Crisis Lifeline and Crisis Text Line.
 * Appears at the bottom of every support group screen.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
} from '@/constants/theme';

export default function CrisisFooter() {
  const handleCall988 = () => {
    Linking.openURL('tel:988').catch(() => {});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        In crisis?{' '}
        <Text style={styles.link} onPress={handleCall988}>
          Call 988
        </Text>
        {' '}(Suicide & Crisis Lifeline) or text HOME to 741741
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  text: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: FontSizes.caption * 1.5,
  },
  link: {
    fontWeight: '600',
    textDecorationLine: 'underline',
    color: Colors.textSecondary,
  },
});
