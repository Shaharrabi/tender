/**
 * Chat screen — texting-style conversation with Nuance, the relationship guide.
 *
 * Supports inline exercise suggestions — tapping an exercise card
 * in the conversation navigates to the exercise runner.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useGuest } from '@/context/GuestContext';
import { useChat, ChatProvider } from '@/context/ChatContext';
import MessageFlow from '@/components/chat/MessageFlow';
import UserInput from '@/components/chat/UserInput';
import SafetyBanner from '@/components/chat/SafetyBanner';
import SessionList from '@/components/chat/SessionList';
import HomeButton from '@/components/HomeButton';
import { COACH } from '@/constants/coach';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius } from '@/constants/theme';
import { getCurrentStepNumber } from '@/services/steps';
import { getNuanceOpeningPrompts } from '@/utils/steps/twelve-steps';

function ChatScreenInner({ topic }: { topic?: string }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { isGuest } = useGuest();
  const {
    activeSession,
    sessions,
    messages,
    loading,
    sending,
    error,
    safetyAlert,
    sendMessage,
    startNewSession,
    loadSession,
    loadSessions,
    dismissSafetyAlert,
  } = useChat();
  const [showSessions, setShowSessions] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [sessionCreateAttempted, setSessionCreateAttempted] = useState(false);
  const [nuanceStarters, setNuanceStarters] = useState<string[] | undefined>(undefined);
  const topicSentRef = useRef(false);

  useEffect(() => {
    if (!user || authLoading) return; // Wait for auth to settle
    const init = async () => {
      await loadSessions();
      // Load step-specific starters
      try {
        const stepNum = await getCurrentStepNumber(user.id);
        setNuanceStarters(getNuanceOpeningPrompts(stepNum));
      } catch {
        // Fall back to defaults
      }
      setInitialized(true);
    };
    init();
  }, [user, authLoading]);

  // Auto-start a new session if none active (only after initial load)
  useEffect(() => {
    if (!user) return; // Can't create sessions without auth
    if (initialized && !activeSession && !loading && sessions.length === 0 && !sessionCreateAttempted) {
      console.log('[ChatScreen] No sessions found, auto-creating one...');
      setSessionCreateAttempted(true);
      startNewSession();
    } else if (initialized && !activeSession && sessions.length > 0) {
      // Load the most recent session
      console.log('[ChatScreen] Loading most recent session...');
      loadSession(sessions[0].id);
    }
  }, [initialized, activeSession, loading, sessions, user, sessionCreateAttempted]);

  // Auto-send an opening message when navigated with a topic (e.g. from "Ask Nuance" on a result card)
  useEffect(() => {
    if (topic && activeSession && !topicSentRef.current && !loading && !sending && initialized) {
      topicSentRef.current = true;
      const opener = `I'd like to understand my "${topic}" results. What patterns do you see, and what do they mean for my relationship?`;
      sendMessage(opener);
    }
  }, [topic, activeSession, loading, sending, initialized]);

  const handleBack = () => {
    router.back();
  };

  const handleExerciseTap = (exerciseId: string) => {
    router.push({
      pathname: '/(app)/exercise' as any,
      params: { id: exerciseId },
    });
  };

  const handleSuggestedTap = (text: string) => {
    sendMessage(text);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          style={styles.headerSide}
        >
          <Text style={styles.backText}>{'\u2039'} Back</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {COACH.name} {COACH.avatar}
          </Text>
          <Text style={styles.headerSubtitle}>{COACH.tagline}</Text>
        </View>

        <TouchableOpacity
          onPress={() => setShowSessions(true)}
          activeOpacity={0.7}
          style={[styles.headerSide, styles.headerSideRight]}
        >
          <Text style={styles.historyText}>History</Text>
        </TouchableOpacity>
      </View>

      {/* Auth warning */}
      {!authLoading && !user && (
        <View style={styles.authBanner}>
          <Text style={styles.authBannerText}>
            {isGuest
              ? 'Nuance needs an account to remember your conversations. Create one to start chatting.'
              : 'Please sign in to use the chat feature.'}
          </Text>
          <TouchableOpacity
            onPress={() => router.replace('/(auth)/login' as any)}
            activeOpacity={0.7}
          >
            <Text style={styles.authSignInText}>
              {isGuest ? 'Create Account' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Safety banner */}
      {safetyAlert && !safetyAlert.safe && (
        <SafetyBanner
          safetyResult={safetyAlert}
          onDismiss={dismissSafetyAlert}
        />
      )}

      {/* Error banner */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{error}</Text>
          <TouchableOpacity onPress={startNewSession} activeOpacity={0.7}>
            <Text style={styles.errorRetryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading state */}
      {loading && !activeSession && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Starting conversation...</Text>
        </View>
      )}

      {/* Chat content — use KeyboardAvoidingView only on native */}
      {Platform.OS === 'web' ? (
        <View style={styles.keyboardContainer}>
          <MessageFlow
            messages={messages}
            sending={sending}
            onExerciseTap={handleExerciseTap}
            onSuggestedTap={handleSuggestedTap}
            suggestedStarters={nuanceStarters}
          />
          <UserInput onSend={sendMessage} disabled={sending || !user} />
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          <MessageFlow
            messages={messages}
            sending={sending}
            onExerciseTap={handleExerciseTap}
            onSuggestedTap={handleSuggestedTap}
            suggestedStarters={nuanceStarters}
          />
          <UserInput onSend={sendMessage} disabled={sending || !user} />
        </KeyboardAvoidingView>
      )}

      <HomeButton />

      {/* Session history modal */}
      <Modal
        visible={showSessions}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSessions(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Conversations</Text>
            <TouchableOpacity
              onPress={() => setShowSessions(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalClose}>Done</Text>
            </TouchableOpacity>
          </View>

          <SessionList
            sessions={sessions}
            activeSessionId={activeSession?.id}
            onSelect={(id) => {
              loadSession(id);
              setShowSessions(false);
            }}
            onNewSession={() => {
              startNewSession();
              setShowSessions(false);
            }}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

export default function ChatScreen() {
  const { coupleMode, coupleId, topic } = useLocalSearchParams<{
    coupleMode?: string;
    coupleId?: string;
    topic?: string;
  }>();

  return (
    <ChatProvider
      coupleMode={coupleMode === 'true'}
      coupleId={coupleId || undefined}
    >
      <ChatScreenInner topic={topic || undefined} />
    </ChatProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.background,
  },
  headerSide: {
    minWidth: 60,
  },
  headerSideRight: {
    alignItems: 'flex-end',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: Spacing.sm,
  },
  headerTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    marginTop: 1,
  },
  backText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
  historyText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },

  // ── Auth banner ──
  authBanner: {
    backgroundColor: '#FFF8E7',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0E0B8',
  },
  authBannerText: {
    fontSize: FontSizes.bodySmall,
    color: '#8B6914',
    flex: 1,
    fontWeight: '500',
  },
  authSignInText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '700',
    marginLeft: Spacing.sm,
  },

  // ── Error banner ──
  errorBanner: {
    backgroundColor: '#FFF0F0',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FFD0D0',
  },
  errorBannerText: {
    fontSize: FontSizes.caption,
    color: '#C44',
    flex: 1,
  },
  errorRetryText: {
    fontSize: FontSizes.caption,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  loadingContainer: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.textMuted,
  },

  // ── Modal ──
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  modalTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingM,
    fontWeight: '600',
    color: Colors.text,
  },
  modalClose: {
    fontSize: FontSizes.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
});
