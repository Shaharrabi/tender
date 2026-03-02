/**
 * SessionList — displays past conversations.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Colors, Spacing, FontSizes, FontFamilies, BorderRadius, Shadows } from '@/constants/theme';
import type { ChatSession } from '@/types/chat';

interface Props {
  sessions: ChatSession[];
  activeSessionId?: string;
  onSelect: (sessionId: string) => void;
  onNewSession: () => void;
}

export default function SessionList({
  sessions,
  activeSessionId,
  onSelect,
  onNewSession,
}: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.newButton}
        onPress={onNewSession}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Start a new conversation"
      >
        <Text style={styles.newButtonText}>+ New Conversation</Text>
      </TouchableOpacity>

      {sessions.length === 0 ? (
        <Text style={styles.emptyText}>No conversations yet</Text>
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id}
          accessibilityRole="list"
          accessibilityLabel="Past conversations"
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.sessionItem,
                item.id === activeSessionId && styles.sessionActive,
              ]}
              onPress={() => onSelect(item.id)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Open conversation: ${item.title}, ${formatDate(item.updatedAt)}`}
              accessibilityState={{ selected: item.id === activeSessionId }}
            >
              <Text
                style={[
                  styles.sessionTitle,
                  item.id === activeSessionId && styles.sessionTitleActive,
                ]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text style={styles.sessionDate}>
                {formatDate(item.updatedAt)}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  newButton: {
    backgroundColor: Colors.primary,
    margin: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.pill,
    alignItems: 'center',
  },
  newButtonText: {
    color: Colors.white,
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: FontSizes.bodySmall,
    marginTop: Spacing.xl,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    gap: 2,
  },
  sessionItem: {
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  sessionActive: {
    backgroundColor: Colors.surface,
  },
  sessionTitle: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    fontWeight: '500',
  },
  sessionTitleActive: {
    fontWeight: '600',
    color: Colors.primary,
  },
  sessionDate: {
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
