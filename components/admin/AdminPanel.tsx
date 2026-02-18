/**
 * AdminPanel — Dev/testing panel for quickly seeding assessments,
 * generating portraits, and resetting data. Activated by triple-tap
 * on the app tagline in home.tsx.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
} from '@/constants/theme';
import {
  SettingsIcon,
  RefreshIcon,
  SparkleIcon,
  TargetIcon,
  CloseIcon,
  CoupleIcon,
} from '@/assets/graphics/icons';
import {
  seedDemoAssessments,
  seedSingleAssessment,
  seedDyadicAssessments,
  clearDemoAssessments,
  DEMO_ECRR,
  DEMO_DUTCH,
  DEMO_SSEIT,
  DEMO_DSIR,
  DEMO_IPIP,
  DEMO_VALUES,
  DEMO_SUPPLEMENTS,
} from '@/utils/demo-data';
import { generatePortrait } from '@/utils/portrait/portrait-generator';
import { getPortrait, savePortrait, fetchAllScores } from '@/services/portrait';
import { eraseUserData } from '@/services/consent';
import { getMyCouple, disconnectCouple } from '@/services/couples';
import { supabase } from '@/services/supabase';
import type { AllAssessmentScores } from '@/types';

const ASSESSMENT_TYPES = [
  { type: 'ecr-r', label: 'How You Connect (ECR-R)' },
  { type: 'dutch', label: 'How You Fight (DUTCH)' },
  { type: 'sseit', label: 'How You Feel (SSEIT)' },
  { type: 'dsi-r', label: 'How You Hold Ground (DSI-R)' },
  { type: 'ipip-neo-120', label: 'Who You Are (IPIP)' },
  { type: 'values', label: 'What Matters (Values)' },
] as const;

interface AdminPanelProps {
  userId: string;
  onDataChanged: () => void;
  onClose: () => void;
}

export default function AdminPanel({ userId, onDataChanged, onClose }: AdminPanelProps) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  const handleSeedAll = async () => {
    setBusy('seed-all');
    try {
      const ids = await seedDemoAssessments(userId);
      const scores: AllAssessmentScores = {
        ecrr: DEMO_ECRR,
        dutch: DEMO_DUTCH,
        sseit: DEMO_SSEIT,
        dsir: DEMO_DSIR,
        ipip: DEMO_IPIP,
        values: DEMO_VALUES,
      };
      const portrait = generatePortrait(userId, ids, scores, DEMO_SUPPLEMENTS);
      await savePortrait(portrait);
      Alert.alert('Done', 'All 6 assessments seeded + portrait generated.');
      onDataChanged();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to seed assessments');
    } finally {
      setBusy(null);
    }
  };

  const handleSeedSingle = async (type: string) => {
    setBusy(`seed-${type}`);
    try {
      await seedSingleAssessment(userId, type);
      Alert.alert('Done', `Seeded ${type} assessment.`);
      onDataChanged();
    } catch (e: any) {
      Alert.alert('Error', e.message || `Failed to seed ${type}`);
    } finally {
      setBusy(null);
    }
  };

  const handleGeneratePortrait = async () => {
    setBusy('portrait');
    try {
      const allScores = await fetchAllScores(userId);
      if (!allScores) {
        Alert.alert('No scores', 'Complete at least some assessments first.');
        setBusy(null);
        return;
      }
      // Check which scores exist
      const { data: completed } = await supabase
        .from('assessments')
        .select('id, type')
        .eq('user_id', userId);
      if (!completed || completed.length === 0) {
        Alert.alert('No assessments', 'Seed at least one assessment first.');
        setBusy(null);
        return;
      }
      const ids = completed.map((r: any) => r.id);
      const portrait = generatePortrait(userId, ids, allScores, DEMO_SUPPLEMENTS);
      await savePortrait(portrait);
      Alert.alert('Done', 'Portrait generated from current scores.');
      onDataChanged();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to generate portrait');
    } finally {
      setBusy(null);
    }
  };

  const handleResetAll = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all assessments, portrait, growth progress, journal entries, and chat history. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            setBusy('reset');
            try {
              await eraseUserData(userId);
              Alert.alert('Done', 'All data erased.');
              onDataChanged();
            } catch (e: any) {
              Alert.alert('Error', e.message || 'Failed to erase data');
            } finally {
              setBusy(null);
            }
          },
        },
      ]
    );
  };

  const handleClearPortrait = async () => {
    setBusy('clear-portrait');
    try {
      await supabase.from('portraits').delete().eq('user_id', userId);
      Alert.alert('Done', 'Portrait cleared. Assessment data preserved.');
      onDataChanged();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to clear portrait');
    } finally {
      setBusy(null);
    }
  };

  // ─── Couple Testing Handlers ──────────────────────────

  const handleSetupTestCouple = async () => {
    setBusy('setup-couple');
    try {
      // Check if couple already exists
      let couple = await getMyCouple(userId);

      if (!couple) {
        // Create self-referencing couple (passes RLS: auth.uid() matches both)
        const { data: newCouple, error: coupleErr } = await supabase
          .from('couples')
          .insert({
            partner_a_id: userId,
            partner_b_id: userId,
            status: 'active',
          })
          .select()
          .single();

        if (coupleErr) throw coupleErr;
        couple = newCouple;
      }

      // Ensure user has a portrait for the couple portal
      const existingPortrait = await getPortrait(userId);
      if (!existingPortrait) {
        const ids = await seedDemoAssessments(userId);
        const scores: AllAssessmentScores = {
          ecrr: DEMO_ECRR,
          dutch: DEMO_DUTCH,
          sseit: DEMO_SSEIT,
          dsir: DEMO_DSIR,
          ipip: DEMO_IPIP,
          values: DEMO_VALUES,
        };
        const portrait = generatePortrait(userId, ids, scores, DEMO_SUPPLEMENTS);
        await savePortrait(portrait);
      }

      // Seed dyadic assessments (both "partners" are the same user)
      await seedDyadicAssessments(couple.id, userId, userId);

      Alert.alert(
        'Test Couple Ready',
        'Self-couple created with dyadic assessments. You can now access the couple portal.',
        [
          { text: 'Open Portal', onPress: () => router.push('/(app)/couple-portal' as any) },
          { text: 'OK' },
        ]
      );
      onDataChanged();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to setup test couple');
    } finally {
      setBusy(null);
    }
  };

  const handleOpenCouplePortal = () => {
    router.push('/(app)/couple-portal' as any);
  };

  const handleDisconnectCouple = async () => {
    setBusy('disconnect-couple');
    try {
      const couple = await getMyCouple(userId);
      if (!couple) {
        Alert.alert('No Couple', 'No active couple to disconnect.');
        setBusy(null);
        return;
      }

      // Delete dyadic assessments for this couple
      await supabase.from('dyadic_assessments').delete().eq('couple_id', couple.id);
      // Delete relationship portrait
      await supabase.from('relationship_portraits').delete().eq('couple_id', couple.id);
      // Disconnect the couple
      await disconnectCouple(couple.id);

      Alert.alert('Done', 'Test couple disconnected and dyadic data cleared.');
      onDataChanged();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to disconnect couple');
    } finally {
      setBusy(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <SettingsIcon size={18} color={Colors.warning} />
          <Text style={styles.headerTitle}>Admin Panel</Text>
        </View>
        <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
          <CloseIcon size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
        <View style={styles.buttonRow}>
          <ActionButton
            label="Seed All Assessments"
            icon={<TargetIcon size={14} color={Colors.white} />}
            color={Colors.primary}
            busy={busy === 'seed-all'}
            onPress={handleSeedAll}
            disabled={!!busy}
          />
          <ActionButton
            label="Generate Portrait"
            icon={<SparkleIcon size={14} color={Colors.white} />}
            color={Colors.calm}
            busy={busy === 'portrait'}
            onPress={handleGeneratePortrait}
            disabled={!!busy}
          />
        </View>
        <View style={styles.buttonRow}>
          <ActionButton
            label="Clear Portrait"
            icon={<RefreshIcon size={14} color={Colors.white} />}
            color={Colors.textSecondary}
            busy={busy === 'clear-portrait'}
            onPress={handleClearPortrait}
            disabled={!!busy}
          />
          <ActionButton
            label="Reset All Data"
            icon={<CloseIcon size={14} color={Colors.white} />}
            color="#C85A54"
            busy={busy === 'reset'}
            onPress={handleResetAll}
            disabled={!!busy}
          />
        </View>
      </View>

      {/* Seed Individual */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>SEED INDIVIDUAL ASSESSMENT</Text>
        {ASSESSMENT_TYPES.map(({ type, label }) => (
          <TouchableOpacity
            key={type}
            style={[styles.seedRow, !!busy && styles.seedRowDisabled]}
            onPress={() => handleSeedSingle(type)}
            disabled={!!busy}
            activeOpacity={0.7}
          >
            {busy === `seed-${type}` ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <View style={styles.seedDot} />
            )}
            <Text style={styles.seedLabel}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Couple Testing */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>COUPLE TESTING</Text>
        <View style={styles.buttonRow}>
          <ActionButton
            label="Setup Test Couple"
            icon={<CoupleIcon size={14} color={Colors.white} />}
            color={Colors.secondary}
            busy={busy === 'setup-couple'}
            onPress={handleSetupTestCouple}
            disabled={!!busy}
          />
          <ActionButton
            label="Open Couple Portal"
            icon={<SparkleIcon size={14} color={Colors.white} />}
            color={Colors.calm}
            busy={false}
            onPress={handleOpenCouplePortal}
            disabled={!!busy}
          />
        </View>
        <View style={styles.buttonRow}>
          <ActionButton
            label="Disconnect Couple"
            icon={<CloseIcon size={14} color={Colors.white} />}
            color="#C85A54"
            busy={busy === 'disconnect-couple'}
            onPress={handleDisconnectCouple}
            disabled={!!busy}
          />
        </View>
      </View>
    </View>
  );
}

function ActionButton({
  label,
  icon,
  color,
  busy,
  onPress,
  disabled,
}: {
  label: string;
  icon: React.ReactNode;
  color: string;
  busy: boolean;
  onPress: () => void;
  disabled: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.actionBtn, { backgroundColor: color }, disabled && !busy && styles.actionBtnDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {busy ? (
        <ActivityIndicator size="small" color={Colors.white} />
      ) : (
        <>
          {icon}
          <Text style={styles.actionBtnText}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF8E7',
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.warning + '40',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  headerTitle: {
    fontSize: FontSizes.body,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  section: {
    marginBottom: Spacing.sm,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    minHeight: 40,
  },
  actionBtnDisabled: {
    opacity: 0.5,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
  },
  seedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 8,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface,
    marginBottom: 4,
  },
  seedRowDisabled: {
    opacity: 0.5,
  },
  seedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary + '40',
  },
  seedLabel: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    fontWeight: '500',
  },
});
