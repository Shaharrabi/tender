/**
 * WelcomeModal — Shown on first community visit to introduce the user's alias.
 */

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { CommunityIcon } from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { CommunityAlias } from '@/types/community';

interface WelcomeModalProps {
  visible: boolean;
  alias: CommunityAlias;
  onDismiss: () => void;
}

export function WelcomeModal({ visible, alias, onDismiss }: WelcomeModalProps) {
  const haptics = useSoundHaptics();

  useEffect(() => {
    if (visible) {
      haptics.success();
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={st.overlay}>
        <View style={st.card}>
          <View style={st.iconCircle}>
            <CommunityIcon size={36} color={Colors.primary} />
          </View>

          <Text style={st.title}>Welcome to the Community</Text>

          <View style={st.aliasSection}>
            <Text style={st.aliasLabel}>Here, you are known as</Text>
            <View style={st.aliasRow}>
              <View style={[st.aliasDot, { backgroundColor: alias.color }]} />
              <Text style={st.aliasName}>{alias.name}</Text>
            </View>
          </View>

          <Text style={st.subtitle}>
            Your identity is protected. Share freely, be honest, and be kind.
          </Text>

          <TouchableOpacity
            style={st.continueBtn}
            onPress={onDismiss}
            activeOpacity={0.7}
          >
            <Text style={st.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const st = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    ...Shadows.elevated,
    gap: Spacing.md,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSizes.headingM,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
    textAlign: 'center',
  },
  aliasSection: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  aliasLabel: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
  },
  aliasRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  aliasDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  aliasName: {
    fontSize: FontSizes.headingL,
    fontFamily: FontFamilies.accent,
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  continueBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: Spacing.xxl,
    borderRadius: 24,
    marginTop: Spacing.sm,
  },
  continueBtnText: {
    color: Colors.textOnPrimary,
    fontSize: FontSizes.body,
    fontWeight: '600',
  },
});
