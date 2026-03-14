/**
 * CommunityHeader — Title, subtitle, back button, alias display with rotation.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
} from '@/constants/theme';
import { ArrowLeftIcon, SettingsIcon } from '@/assets/graphics/icons';
import type { CommunityAlias } from '@/types/community';

interface CommunityHeaderProps {
  alias: CommunityAlias | null;
  onBack: () => void;
  onRotateAlias: () => void;
}

export function CommunityHeader({ alias, onBack, onRotateAlias }: CommunityHeaderProps) {
  const handleRotate = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        'Refresh Your Name?\n\nGet a new anonymous name? Your old posts will keep their original name.'
      );
      if (confirmed) onRotateAlias();
    } else {
      Alert.alert(
        'Refresh Your Name',
        'Get a new anonymous name? Your old posts will keep their original name.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Refresh', onPress: onRotateAlias },
        ]
      );
    }
  };

  return (
    <View style={st.container}>
      {/* Back button */}
      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.7}
        style={st.backRow}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <ArrowLeftIcon size={16} color={Colors.primary} />
        <Text style={st.backText}>Back</Text>
      </TouchableOpacity>

      {/* Title + alias row */}
      <View style={st.titleRow}>
        <View style={st.titleSection}>
          <Text style={st.pageTitle}>Community</Text>
          <Text style={st.pageSubtitle}>
            A warm space for sharing, anonymously.
          </Text>
        </View>

        {alias && (
          <TouchableOpacity
            style={st.aliasChip}
            onPress={handleRotate}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Current alias: ${alias.name}. Tap to refresh alias`}
          >
            <View style={[st.aliasDot, { backgroundColor: alias.color }]} />
            <Text style={st.aliasName} numberOfLines={1}>
              {alias.name}
            </Text>
            <SettingsIcon size={12} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleSection: {
    flex: 1,
    gap: Spacing.xs,
  },
  pageTitle: {
    fontSize: FontSizes.headingL,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  pageSubtitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  aliasChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    maxWidth: 160,
  },
  aliasDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  aliasName: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
