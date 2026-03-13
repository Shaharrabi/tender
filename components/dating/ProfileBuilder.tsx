/**
 * My Shape — Profile Builder
 *
 * Build your dating profile through thoughtful preferences,
 * not a sales pitch. Three sections: Basics, Lifestyle, Depth.
 * Constellation badge from The Field game displayed at top.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut } from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius, Typography, Shadows, FontFamilies } from '@/constants/theme';
import { PREFERENCE_SECTIONS } from '@/constants/dating/preferences';
import ConstellationBadge from './ConstellationBadge';
import type { DatingPreferences } from '@/types/dating';

interface ProfileBuilderProps {
  constellation: string[] | null;
  initialPreferences?: Partial<DatingPreferences>;
  initialBio?: string;
  initialIsVisible?: boolean;
  initialIsActive?: boolean;
  onPreferencesChange?: (preferences: Record<string, any>) => void;
  onBioChange?: (bio: string) => void;
  onVisibilityChange?: (isVisible: boolean, isActive: boolean) => void;
}

export default function ProfileBuilder({
  constellation,
  initialPreferences,
  initialBio = '',
  initialIsVisible = true,
  initialIsActive = true,
  onPreferencesChange,
  onBioChange,
  onVisibilityChange,
}: ProfileBuilderProps) {
  const [activeSection, setActiveSection] = useState(0);
  const [preferences, setPreferences] = useState<Record<string, any>>(
    initialPreferences ? flattenPreferences(initialPreferences) : {},
  );
  const [bio, setBio] = useState(initialBio);
  const [isVisible, setIsVisible] = useState(initialIsVisible);
  const [isActive, setIsActive] = useState(initialIsActive);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bioTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (bioTimerRef.current) clearTimeout(bioTimerRef.current);
    };
  }, []);

  const showSaveStatus = useCallback(() => {
    setSaveStatus('saving');
    // Clear any existing timer
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      setSaveStatus('saved');
      saveTimerRef.current = setTimeout(() => setSaveStatus('idle'), 2000);
    }, 600);
  }, []);

  const handleSelect = useCallback(
    (fieldId: string, value: string, isMulti: boolean) => {
      const newPrefs = { ...preferences };
      if (isMulti) {
        const current: string[] = newPrefs[fieldId] || [];
        newPrefs[fieldId] = current.includes(value)
          ? current.filter((v: string) => v !== value)
          : [...current, value];
      } else {
        newPrefs[fieldId] = value;
      }
      setPreferences(newPrefs);
      onPreferencesChange?.(newPrefs);
      showSaveStatus();
    },
    [preferences, onPreferencesChange, showSaveStatus],
  );

  const handleBioChange = useCallback(
    (text: string) => {
      setBio(text);
      // Debounce bio saves
      if (bioTimerRef.current) clearTimeout(bioTimerRef.current);
      bioTimerRef.current = setTimeout(() => {
        onBioChange?.(text);
        showSaveStatus();
      }, 800);
    },
    [onBioChange, showSaveStatus],
  );

  const section = PREFERENCE_SECTIONS[activeSection];

  return (
    <View>
      {/* Constellation Badge */}
      {constellation && constellation.length > 0 && (
        <ConstellationBadge topTraits={constellation} />
      )}

      {/* Section Tabs */}
      <View style={styles.tabRow}>
        {PREFERENCE_SECTIONS.map((s, i) => (
          <TouchableOpacity
            key={s.id}
            style={[styles.tab, activeSection === i && styles.tabActive]}
            onPress={() => setActiveSection(i)}
            accessibilityRole="tab"
            accessibilityLabel={s.title}
            accessibilityState={{ selected: activeSection === i }}
          >
            {s.Icon ? (
              <s.Icon size={16} color={activeSection === i ? Colors.primary : Colors.textSecondary} />
            ) : (
              <Text style={styles.tabIcon}>{s.icon}</Text>
            )}
            <Text style={[styles.tabLabel, activeSection === i && styles.tabLabelActive]}>
              {s.title.split(' ').slice(1).join(' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Section Content */}
      <Animated.View key={section.id} entering={FadeIn.duration(300)}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
        </View>

        <View style={styles.fieldsContainer}>
          {section.fields.map((field) => (
            <View key={field.id} style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>{field.label}</Text>

              {field.type === 'range' ? (
                <View style={styles.rangeRow}>
                  <TextInput
                    style={styles.rangeInput}
                    value={String(preferences[`${field.id}_min`] || field.min || 18)}
                    onChangeText={(text) => {
                      const val = parseInt(text) || field.min || 18;
                      const newPrefs = { ...preferences, [`${field.id}_min`]: val };
                      setPreferences(newPrefs);
                      onPreferencesChange?.(newPrefs);
                    }}
                    keyboardType="number-pad"
                    maxLength={2}
                    accessibilityRole="text"
                    accessibilityLabel={`${field.label} minimum`}
                  />
                  <Text style={styles.rangeDash}>—</Text>
                  <TextInput
                    style={styles.rangeInput}
                    value={String(preferences[`${field.id}_max`] || field.max || 80)}
                    onChangeText={(text) => {
                      const val = parseInt(text) || field.max || 80;
                      const newPrefs = { ...preferences, [`${field.id}_max`]: val };
                      setPreferences(newPrefs);
                      onPreferencesChange?.(newPrefs);
                    }}
                    keyboardType="number-pad"
                    maxLength={2}
                    accessibilityRole="text"
                    accessibilityLabel={`${field.label} maximum`}
                  />
                </View>
              ) : (
                <View style={styles.chipsRow}>
                  {(field.options || []).map((opt) => {
                    const isSelected =
                      field.type === 'multi'
                        ? (preferences[field.id] || []).includes(opt)
                        : preferences[field.id] === opt;
                    return (
                      <TouchableOpacity
                        key={opt}
                        style={[styles.chip, isSelected && styles.chipSelected]}
                        onPress={() => handleSelect(field.id, opt, field.type === 'multi')}
                        accessibilityRole="button"
                        accessibilityLabel={`${field.label}: ${opt}`}
                        accessibilityState={{ selected: isSelected }}
                      >
                        <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Bio — "Your Letter to the Lobby" */}
      <View style={styles.bioContainer}>
        <Text style={styles.bioTitle}>Your Letter to the Lobby</Text>
        <Text style={styles.bioSubtitle}>
          Not a sales pitch. Not a resume. Just — what would you want someone to
          know about the space they'd be entering with you?
        </Text>
        <TextInput
          style={styles.bioInput}
          value={bio}
          onChangeText={handleBioChange}
          placeholder="I'm someone who..."
          placeholderTextColor={Colors.textMuted}
          multiline
          maxLength={500}
          textAlignVertical="top"
          accessibilityRole="text"
          accessibilityLabel="Your letter to the lobby bio"
        />
        <Text style={styles.bioCounter}>{bio.length}/500</Text>
      </View>

      {/* Visibility Controls */}
      <View style={styles.visibilityContainer}>
        <Text style={styles.visibilitySectionTitle}>Privacy</Text>

        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => {
            const newVal = !isVisible;
            setIsVisible(newVal);
            onVisibilityChange?.(newVal, isActive);
          }}
          accessibilityRole="switch"
          accessibilityState={{ checked: isVisible }}
          accessibilityLabel="Appear in Discovery"
        >
          <View style={styles.toggleTextWrap}>
            <Text style={styles.toggleLabel}>Appear in Discovery</Text>
            <Text style={styles.toggleDesc}>
              {isVisible ? 'Others can find your profile' : 'Your profile is hidden from discovery'}
            </Text>
          </View>
          <View style={[styles.toggleSwitch, isVisible && styles.toggleSwitchActive]}>
            <View style={[styles.toggleThumb, isVisible && styles.toggleThumbActive]} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => {
            const newVal = !isActive;
            setIsActive(newVal);
            onVisibilityChange?.(isVisible, newVal);
          }}
          accessibilityRole="switch"
          accessibilityState={{ checked: isActive }}
          accessibilityLabel="Profile Active"
        >
          <View style={styles.toggleTextWrap}>
            <Text style={styles.toggleLabel}>Profile Active</Text>
            <Text style={styles.toggleDesc}>
              {isActive ? 'You can send and receive letters' : 'Paused — no new letters'}
            </Text>
          </View>
          <View style={[styles.toggleSwitch, isActive && styles.toggleSwitchActive]}>
            <View style={[styles.toggleThumb, isActive && styles.toggleThumbActive]} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Save Status Indicator */}
      {saveStatus !== 'idle' && (
        <Animated.View
          entering={FadeInUp.duration(200)}
          exiting={FadeOut.duration(200)}
          style={styles.saveStatusContainer}
        >
          <Text style={[
            styles.saveStatusText,
            saveStatus === 'saved' && styles.saveStatusSaved,
            saveStatus === 'error' && styles.saveStatusError,
          ]}>
            {saveStatus === 'saving' ? 'Saving...' :
             saveStatus === 'saved' ? 'All changes saved' :
             'Failed to save — try again'}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

/** Flatten DatingPreferences into a flat key-value map for the form */
function flattenPreferences(p: Partial<DatingPreferences>): Record<string, any> {
  const flat: Record<string, any> = {};
  if (p.genderIdentity) flat.gender_identity = p.genderIdentity;
  if (p.lookingFor) flat.looking_for = p.lookingFor;
  if (p.ageRangeMin) flat.age_range_min = p.ageRangeMin;
  if (p.ageRangeMax) flat.age_range_max = p.ageRangeMax;
  if (p.locationRadius) flat.location_radius = p.locationRadius;
  if (p.kids) flat.kids = p.kids;
  if (p.smoking) flat.smoking = p.smoking;
  if (p.drinking) flat.drinking = p.drinking;
  if (p.relationshipStyle) flat.relationship_style = p.relationshipStyle;
  if (p.therapyStance) flat.therapy = p.therapyStance;
  if (p.spirituality) flat.spirituality = p.spirituality;
  if (p.conflictStyle) flat.conflict_style = p.conflictStyle;
  if (p.loveLanguages) flat.love_language = p.loveLanguages;
  return flat;
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  tabActive: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryFaded,
  },
  tabIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  tabLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  tabLabelActive: {
    color: Colors.primary,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 20,
    color: Colors.text,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 14,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  fieldsContainer: {
    gap: Spacing.md,
  },
  fieldGroup: {},
  fieldLabel: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 15,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipSelected: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryFaded,
  },
  chipText: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  chipTextSelected: {
    color: Colors.primaryDark,
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  rangeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontFamily: 'Jost_500Medium',
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    backgroundColor: Colors.surface,
  },
  rangeDash: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  bioContainer: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  bioTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 17,
    color: Colors.text,
    fontWeight: '700',
    marginBottom: 4,
  },
  bioSubtitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 13,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginBottom: 14,
    lineHeight: 19,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: 14,
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 14,
    lineHeight: 22,
    color: Colors.text,
    backgroundColor: Colors.surface,
    minHeight: 100,
  },
  bioCounter: {
    fontFamily: 'Jost_500Medium',
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: 4,
  },
  saveStatusContainer: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.backgroundAlt,
    alignItems: 'center',
  },
  saveStatusText: {
    fontFamily: FontFamilies.body,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  saveStatusSaved: {
    color: Colors.success,
  },
  saveStatusError: {
    color: Colors.error,
  },
  visibilityContainer: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 4,
  },
  visibilitySectionTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 17,
    color: Colors.text,
    fontWeight: '700',
    marginBottom: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  toggleTextWrap: {
    flex: 1,
    gap: 2,
  },
  toggleLabel: {
    fontFamily: 'JosefinSans_500Medium',
    fontSize: 14,
    color: Colors.text,
  },
  toggleDesc: {
    fontFamily: 'JosefinSans_300Light',
    fontSize: 12,
    color: Colors.textMuted,
  },
  toggleSwitch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.border,
    padding: 2,
    justifyContent: 'center',
  },
  toggleSwitchActive: {
    backgroundColor: Colors.primary,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
});
