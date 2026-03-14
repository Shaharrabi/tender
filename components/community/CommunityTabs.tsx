/**
 * CommunityTabs — 4-tab navigation for community sections.
 *
 * For You / All Stories / Letters (locked) / Circle (locked)
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
} from '@/constants/theme';
import {
  SparkleIcon,
  BookOpenIcon,
  MailboxIcon,
  FireIcon,
  LockIcon,
  PenIcon,
} from '@/assets/graphics/icons';
import { useSoundHaptics } from '@/services/SoundHapticsService';
import type { CommunityTab } from '@/types/community';
import type { ComponentType } from 'react';
import type { IconProps } from '@/assets/graphics/icons';

interface TabConfig {
  key: CommunityTab;
  label: string;
  Icon: ComponentType<IconProps>;
  locked: boolean;
}

const TABS: TabConfig[] = [
  { key: 'forYou', label: 'For You', Icon: SparkleIcon, locked: false },
  { key: 'allStories', label: 'All Stories', Icon: BookOpenIcon, locked: false },
  { key: 'letters', label: 'Letters', Icon: MailboxIcon, locked: false },
  { key: 'articles', label: 'Articles', Icon: PenIcon, locked: false },
  { key: 'circle', label: 'Circle', Icon: FireIcon, locked: false },
];

interface CommunityTabsProps {
  activeTab: CommunityTab;
  onTabChange: (tab: CommunityTab) => void;
}

export function CommunityTabs({ activeTab, onTabChange }: CommunityTabsProps) {
  const haptics = useSoundHaptics();

  const handleTabPress = (tab: TabConfig) => {
    haptics.tap();
    if (tab.locked) {
      Alert.alert('Coming Soon', `${tab.label} will be available in a future update.`);
      return;
    }
    onTabChange(tab.key);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={st.container}
      style={st.scroll}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[st.tab, isActive && st.tabActive, tab.locked && st.tabLocked]}
            onPress={() => handleTabPress(tab)}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityLabel={`${tab.label}${tab.locked ? ', coming soon' : ''}`}
            accessibilityState={{ selected: isActive, disabled: tab.locked }}
          >
            <tab.Icon
              size={14}
              color={isActive ? Colors.textOnPrimary : Colors.textSecondary}
            />
            <Text style={[st.tabText, isActive && st.tabTextActive]}>
              {tab.label}
            </Text>
            {tab.locked && (
              <LockIcon size={10} color={Colors.textMuted} />
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const st = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: 2,
    backgroundColor: Colors.background,
  },
  container: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabLocked: {
    opacity: 0.7,
  },
  tabText: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.textOnPrimary,
  },
});
