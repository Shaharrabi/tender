/**
 * GroupSessionView — Active group session view.
 *
 * Shows next session info with "Join Zoom" button, this week's adapted
 * 12-step content, and session history with attendance records.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import {
  CalendarIcon,
  CheckmarkIcon,
  SparkleIcon,
  BookOpenIcon,
  PenIcon,
} from '@/assets/graphics/icons';
import type {
  SupportGroup,
  SupportGroupMember,
  SupportGroupSession,
  SupportGroupAttendance,
  AdaptedStep,
} from '@/types/support-groups';
import CrisisFooter from './CrisisFooter';
import GroupCommunityRoom from './GroupCommunityRoom';

// ─── Props ─────────────────────────────────────────────

type SessionTab = 'sessions' | 'room';

interface GroupSessionViewProps {
  group: SupportGroup;
  membership: SupportGroupMember;
  nextSession: SupportGroupSession | null;
  sessions: (SupportGroupSession & { attendance?: SupportGroupAttendance })[];
  adaptedStep: AdaptedStep | null;
  onRecordAttendance: (sessionId: string, notes?: string) => void;
  onNavigateToStep: () => void;
  onLeaveGroup: () => void;
  userId: string;
}

// ─── Component ─────────────────────────────────────────

export default function GroupSessionView({
  group,
  membership,
  nextSession,
  sessions,
  adaptedStep,
  onRecordAttendance,
  onNavigateToStep,
  onLeaveGroup,
  userId,
}: GroupSessionViewProps) {
  const [activeTab, setActiveTab] = useState<SessionTab>('sessions');
  const [noteSessionId, setNoteSessionId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const accentColor = group.groupType === 'avoidant'
    ? Colors.attachmentAvoidant
    : Colors.attachmentAnxious;

  // ── Group Room tab ──────────────────────
  if (activeTab === 'room') {
    return (
      <View style={{ flex: 1 }}>
        <SessionTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          accentColor={accentColor}
        />
        <GroupCommunityRoom group={group} userId={userId} />
      </View>
    );
  }

  const handleJoinZoom = async () => {
    const link = nextSession?.zoomLink || group.zoomLink;
    if (!link) {
      const msg = 'Zoom link will be available before the session starts.';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Coming Soon', msg);
      return;
    }

    try {
      const canOpen = await Linking.canOpenURL(link);
      if (canOpen) {
        await Linking.openURL(link);
      } else {
        await Linking.openURL('https://zoom.us/download');
      }
    } catch {
      const msg = 'Unable to open Zoom. Please install the Zoom app.';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Error', msg);
    }
  };

  const handleSaveNote = (sessionId: string) => {
    onRecordAttendance(sessionId, noteText.trim() || undefined);
    setNoteSessionId(null);
    setNoteText('');
  };

  return (
    <View style={{ flex: 1 }}>
      <SessionTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        accentColor={accentColor}
      />
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Text style={[styles.groupName, { color: accentColor }]}>
        {group.name}
      </Text>
      <Text style={styles.groupMeta}>
        Cohort #{group.cohortNumber} {'\u00B7'} Step {group.currentStep} of 12
      </Text>

      {/* Next Session Card */}
      <View style={[styles.sessionCard, { borderColor: accentColor + '40' }]}>
        <Text style={styles.sessionLabel}>NEXT SESSION</Text>

        {nextSession ? (
          <>
            <View style={styles.sessionRow}>
              <CalendarIcon size={16} color={accentColor} />
              <Text style={styles.sessionDate}>
                {formatDate(nextSession.sessionDate)}
              </Text>
            </View>
            {nextSession.sessionTime && (
              <Text style={styles.sessionTime}>
                {nextSession.sessionTime} {group.scheduleTimezone.split('/')[1]?.replace('_', ' ') || ''}
                {' \u00B7 '}
                {group.durationMinutes} min
              </Text>
            )}
            <Text style={styles.sessionFocus}>
              This Week's Focus: Step {nextSession.stepNumber}
              {adaptedStep ? ` \u2014 "${adaptedStep.adaptedTitle}"` : ''}
            </Text>
          </>
        ) : (
          <Text style={styles.noSession}>
            No upcoming sessions scheduled yet. Check back soon.
          </Text>
        )}

        <TouchableOpacity
          style={[styles.zoomBtn, { backgroundColor: accentColor }]}
          onPress={handleJoinZoom}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Join session on Zoom"
        >
          <Text style={styles.zoomBtnText}>Join on Zoom</Text>
        </TouchableOpacity>
        <Text style={styles.zoomHint}>Zoom opens 5 min before start</Text>
      </View>

      {/* This Week's Step */}
      {adaptedStep && (
        <View style={styles.stepCard}>
          <Text style={styles.stepLabel}>THIS WEEK'S STEP</Text>
          <Text style={styles.stepTitle}>
            STEP {adaptedStep.stepNumber}: {adaptedStep.adaptedTitle.toUpperCase()}
          </Text>
          <Text style={styles.stepSubtitle}>
            "{adaptedStep.standardTitle}"
          </Text>
          <Text style={styles.stepContent}>
            {adaptedStep.groupFocus}
          </Text>

          {/* Reflection prompts */}
          <Text style={[styles.stepLabel, { marginTop: Spacing.md }]}>
            REFLECTION PROMPTS
          </Text>
          {adaptedStep.reflectionPrompts.map((prompt, i) => (
            <View key={i} style={styles.promptRow}>
              <Text style={styles.promptBullet}>{i + 1}.</Text>
              <Text style={styles.promptText}>{prompt}</Text>
            </View>
          ))}

          <View style={styles.stepActions}>
            <TouchableOpacity
              style={[styles.outlineBtn, { borderColor: accentColor }]}
              onPress={onNavigateToStep}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Read full step"
            >
              <BookOpenIcon size={14} color={accentColor} />
              <Text style={[styles.outlineBtnText, { color: accentColor }]}>
                Read Full Step
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Session History */}
      {sessions.length > 0 && (
        <>
          <Text style={styles.historyLabel}>SESSION HISTORY</Text>
          {sessions.map((session) => {
            const attended = session.attendance?.attended;
            const hasNotes = !!session.attendance?.personalNotes;
            const isNoteOpen = noteSessionId === session.id;

            return (
              <View key={session.id} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyTitle}>
                      Week {session.sessionNumber} \u00B7 Step {session.stepNumber}
                    </Text>
                    <Text style={styles.historyDate}>
                      {formatDate(session.sessionDate)}
                    </Text>
                  </View>
                  <View style={styles.attendanceBadge}>
                    {attended ? (
                      <>
                        <CheckmarkIcon size={12} color={Colors.success} />
                        <Text style={styles.attendedText}>Attended</Text>
                      </>
                    ) : (
                      <Text style={styles.missedText}>
                        {session.status === 'completed' ? 'Missed' : 'Upcoming'}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Notes toggle */}
                {attended && !isNoteOpen && (
                  <TouchableOpacity
                    style={styles.noteToggle}
                    onPress={() => {
                      setNoteSessionId(session.id);
                      setNoteText(session.attendance?.personalNotes || '');
                    }}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={hasNotes ? 'Edit reflection notes' : 'Add reflection notes'}
                  >
                    <PenIcon size={12} color={Colors.textMuted} />
                    <Text style={styles.noteToggleText}>
                      {hasNotes ? 'Edit notes' : 'Add reflection notes'}
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Notes editor */}
                {isNoteOpen && (
                  <View style={styles.noteEditor}>
                    <TextInput
                      style={styles.noteInput}
                      value={noteText}
                      onChangeText={setNoteText}
                      placeholder="What came up for you in this session?"
                      placeholderTextColor={Colors.textMuted}
                      multiline
                      numberOfLines={3}
                      accessibilityRole="text"
                      accessibilityLabel="Session reflection notes"
                    />
                    <View style={styles.noteActions}>
                      <TouchableOpacity
                        onPress={() => setNoteSessionId(null)}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel="Cancel editing notes"
                      >
                        <Text style={styles.noteCancelText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.noteSaveBtn, { backgroundColor: accentColor }]}
                        onPress={() => handleSaveNote(session.id)}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel="Save notes"
                      >
                        <Text style={styles.noteSaveText}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </>
      )}

      {/* Motivational quote */}
      <View style={styles.quoteCard}>
        <Text style={styles.quoteText}>
          {'\u201C'}You keep showing up. That rhythm changes everything.{'\u201D'}
        </Text>
      </View>

      {/* Leave group link */}
      <TouchableOpacity
        onPress={() => {
          const msg = `Are you sure you want to leave ${group.name}? You can rejoin later if a spot is available.`;
          if (Platform.OS === 'web') {
            if (confirm(msg)) onLeaveGroup();
          } else {
            Alert.alert(
              'Leave Group',
              msg,
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Leave', style: 'destructive', onPress: onLeaveGroup },
              ],
            );
          }
        }}
        activeOpacity={0.7}
        style={styles.leaveBtn}
        accessibilityRole="button"
        accessibilityLabel="Leave group"
      >
        <Text style={styles.leaveBtnText}>Leave Group</Text>
      </TouchableOpacity>

      <CrisisFooter />

      <View style={{ height: Spacing.xxl }} />
    </ScrollView>
    </View>
  );
}

// ─── Session Tabs ─────────────────────────────────────

function SessionTabs({
  activeTab,
  onTabChange,
  accentColor,
}: {
  activeTab: SessionTab;
  onTabChange: (tab: SessionTab) => void;
  accentColor: string;
}) {
  return (
    <View style={styles.tabRow}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'sessions' && { borderBottomColor: accentColor },
        ]}
        onPress={() => onTabChange('sessions')}
        activeOpacity={0.7}
        accessibilityRole="tab"
        accessibilityLabel="Sessions tab"
        accessibilityState={{ selected: activeTab === 'sessions' }}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'sessions' && { color: accentColor, fontWeight: '600' },
          ]}
        >
          Sessions
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'room' && { borderBottomColor: accentColor },
        ]}
        onPress={() => onTabChange('room')}
        activeOpacity={0.7}
        accessibilityRole="tab"
        accessibilityLabel="Group Room tab"
        accessibilityState={{ selected: activeTab === 'room' }}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'room' && { color: accentColor, fontWeight: '600' },
          ]}
        >
          Group Room
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Helpers ───────────────────────────────────────────

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// ─── Styles ────────────────────────────────────────────

const styles = StyleSheet.create({
  // Tab row
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textMuted,
  },

  scrollContent: {
    paddingBottom: Spacing.xxxl,
  },

  groupName: {
    fontFamily: FontFamilies.accent,
    fontSize: FontSizes.headingL,
    marginBottom: Spacing.xs,
  },
  groupMeta: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },

  // Next session card
  sessionCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    padding: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  sessionLabel: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sessionDate: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.body,
    color: Colors.text,
    fontWeight: '600',
  },
  sessionTime: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
  },
  sessionFocus: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    fontWeight: '500',
    marginTop: Spacing.xs,
  },
  noSession: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  zoomBtn: {
    height: 44,
    borderRadius: BorderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  zoomBtnText: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.white,
  },
  zoomHint: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    textAlign: 'center',
  },

  // Step card
  stepCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  stepLabel: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  stepTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.bodySmall,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 0.5,
  },
  stepSubtitle: {
    fontFamily: FontFamilies.accent,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  stepContent: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    lineHeight: FontSizes.bodySmall * 1.6,
  },
  promptRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingLeft: Spacing.xs,
  },
  promptBullet: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    width: 16,
  },
  promptText: {
    flex: 1,
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: FontSizes.caption * 1.5,
  },
  stepActions: {
    marginTop: Spacing.sm,
  },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
    borderRadius: BorderRadius.pill,
    paddingVertical: Spacing.sm,
  },
  outlineBtnText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    fontWeight: '600',
  },

  // Session history
  historyLabel: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: Spacing.sm,
  },
  historyCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.subtle,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  historyTitle: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    fontWeight: '500',
  },
  historyDate: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },
  attendanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attendedText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.success,
    fontWeight: '500',
  },
  missedText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },

  // Notes
  noteToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  noteToggleText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },
  noteEditor: {
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  noteInput: {
    backgroundColor: Colors.backgroundAlt || Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  noteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.md,
    alignItems: 'center',
  },
  noteCancelText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },
  noteSaveBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.pill,
  },
  noteSaveText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    fontWeight: '600',
    color: Colors.white,
  },

  // Quote
  quoteCard: {
    backgroundColor: Colors.backgroundAlt || Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginTop: Spacing.md,
  },
  quoteText: {
    fontFamily: FontFamilies.accent,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: FontSizes.bodySmall * 1.6,
  },

  // Leave group
  leaveBtn: {
    alignSelf: 'center',
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
  },
  leaveBtnText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    textDecorationLine: 'underline',
  },
});
