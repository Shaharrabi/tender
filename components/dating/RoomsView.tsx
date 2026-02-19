/**
 * Rooms View — Meeting Rooms (V2) + Hotel Rooms (V1)
 *
 * "Connection happens in rooms, not feeds."
 *
 * Two sections:
 * 1. Meeting Rooms — social spaces for connecting with others
 * 2. Self-Guided Journey — 7 hotel rooms of dating wisdom
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, SlideInUp } from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/theme';
import { MEETING_ROOMS, HOTEL_ROOMS } from '@/constants/dating/rooms';
import RoomContent from './rooms/RoomContent';
import FloorIndicator from './rooms/FloorIndicator';
import type { HotelRoom } from '@/types/dating';

type ViewSection = 'meeting' | 'hotel';

export default function RoomsView() {
  const [viewSection, setViewSection] = useState<ViewSection>('hotel');
  const [activeRoom, setActiveRoom] = useState(0);
  const [visitedRooms, setVisitedRooms] = useState(new Set([0]));
  const scrollRef = useRef<ScrollView>(null);

  const room = HOTEL_ROOMS[activeRoom];

  const goToRoom = (index: number) => {
    setActiveRoom(index);
    setVisitedRooms((prev) => new Set([...prev, index]));
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <View>
      {/* Section Toggle */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleButton, viewSection === 'hotel' && styles.toggleActive]}
          onPress={() => setViewSection('hotel')}
        >
          <Text style={[styles.toggleText, viewSection === 'hotel' && styles.toggleTextActive]}>
            🏨 Self-Guided Journey
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, viewSection === 'meeting' && styles.toggleActive]}
          onPress={() => setViewSection('meeting')}
        >
          <Text style={[styles.toggleText, viewSection === 'meeting' && styles.toggleTextActive]}>
            💬 Meeting Rooms
          </Text>
        </TouchableOpacity>
      </View>

      {viewSection === 'meeting' ? (
        <MeetingRoomsSection />
      ) : (
        <HotelRoomsSection
          activeRoom={activeRoom}
          visitedRooms={visitedRooms}
          room={room}
          goToRoom={goToRoom}
          scrollRef={scrollRef}
        />
      )}
    </View>
  );
}

// ─── Meeting Rooms Section ───────────────────────────────────

function MeetingRoomsSection() {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>Connection happens in rooms, not feeds</Text>
        <Text style={styles.sectionDesc}>
          Each room is a different way of meeting. No swiping. No scrolling.
          Just showing up with intention.
        </Text>
      </View>

      <View style={styles.meetingCards}>
        {MEETING_ROOMS.map((room, i) => (
          <Animated.View key={i} entering={FadeInDown.delay(i * 100).duration(400)}>
            <View style={styles.meetingCard}>
              {room.status === 'upcoming' && (
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>Coming Soon</Text>
                </View>
              )}

              <View style={styles.meetingCardRow}>
                <View style={styles.meetingIconBox}>
                  <Text style={styles.meetingIcon}>{room.icon}</Text>
                </View>
                <View style={styles.meetingCardBody}>
                  <Text style={styles.meetingName}>{room.name}</Text>
                  <Text style={styles.meetingPeople}>
                    {room.people} people here now
                  </Text>
                  <Text style={styles.meetingDesc}>{room.desc}</Text>
                  <View style={styles.meetingPromptBox}>
                    <Text style={styles.meetingPrompt}>{room.prompt}</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.meetingButton,
                  room.status === 'upcoming' && styles.meetingButtonDisabled,
                ]}
                disabled={room.status === 'upcoming'}
              >
                <Text
                  style={[
                    styles.meetingButtonText,
                    room.status === 'upcoming' && styles.meetingButtonTextDisabled,
                  ]}
                >
                  {room.status === 'upcoming' ? 'Notify Me' : 'Enter Room'}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

// ─── Hotel Rooms Section ─────────────────────────────────────

function HotelRoomsSection({
  activeRoom,
  visitedRooms,
  room,
  goToRoom,
  scrollRef,
}: {
  activeRoom: number;
  visitedRooms: Set<number>;
  room: HotelRoom;
  goToRoom: (index: number) => void;
  scrollRef: React.RefObject<ScrollView | null>;
}) {
  return (
    <View>
      {/* Floor Indicator */}
      <View style={styles.floorRow}>
        {HOTEL_ROOMS.map((r, i) => (
          <FloorIndicator
            key={i}
            floor={r.floor}
            active={activeRoom === i}
            color={r.color}
            onPress={() => goToRoom(i)}
          />
        ))}
      </View>

      {/* Room Header */}
      <Animated.View
        key={activeRoom}
        entering={SlideInUp.duration(400)}
        style={styles.roomHeader}
      >
        <Text style={styles.roomEmoji}>{room.icon}</Text>
        <Text style={styles.roomFloor}>Floor {room.floor}</Text>
        <Text style={styles.roomName}>{room.name}</Text>
        <Text style={[styles.roomSubtitle, { color: room.color }]}>{room.subtitle}</Text>
        <Text style={styles.roomDescription}>{room.description}</Text>
      </Animated.View>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerSymbol}>✦</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Room Content */}
      <Animated.View
        key={`content-${activeRoom}`}
        entering={FadeIn.delay(100).duration(400)}
      >
        <RoomContent room={room} />
      </Animated.View>

      {/* Navigation */}
      <View style={styles.navRow}>
        <TouchableOpacity
          onPress={() => activeRoom > 0 && goToRoom(activeRoom - 1)}
          disabled={activeRoom === 0}
        >
          <Text
            style={[
              styles.navButton,
              activeRoom === 0 && styles.navButtonDisabled,
            ]}
          >
            ← Previous
          </Text>
        </TouchableOpacity>

        <Text style={styles.navCounter}>
          {visitedRooms.size} of {HOTEL_ROOMS.length} rooms visited
        </Text>

        <TouchableOpacity
          onPress={() =>
            activeRoom < HOTEL_ROOMS.length - 1 && goToRoom(activeRoom + 1)
          }
          disabled={activeRoom === HOTEL_ROOMS.length - 1}
        >
          <Text
            style={[
              styles.navButton,
              styles.navButtonNext,
              activeRoom === HOTEL_ROOMS.length - 1 && styles.navButtonDisabled,
            ]}
          >
            Next →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toggleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  toggleActive: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryFaded,
  },
  toggleText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: Colors.primary,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 13,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: Colors.textMuted,
    marginBottom: 4,
  },
  sectionDesc: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
    maxWidth: 400,
    textAlign: 'center',
  },

  // Meeting rooms
  meetingCards: {
    gap: 14,
  },
  meetingCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: Spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  comingSoonBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.accentGold,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderBottomLeftRadius: BorderRadius.md,
    zIndex: 1,
  },
  comingSoonText: {
    fontFamily: 'Jost_500Medium',
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#1a0a2e',
  },
  meetingCardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  meetingIconBox: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meetingIcon: {
    fontSize: 24,
  },
  meetingCardBody: {
    flex: 1,
  },
  meetingName: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 17,
    color: Colors.text,
    fontWeight: '700',
    marginBottom: 2,
  },
  meetingPeople: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  meetingDesc: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 10,
  },
  meetingPromptBox: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.sm,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  meetingPrompt: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 12,
    color: Colors.primary,
    fontStyle: 'italic',
  },
  meetingButton: {
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primaryFaded,
    alignItems: 'center',
  },
  meetingButtonDisabled: {
    backgroundColor: Colors.borderLight,
  },
  meetingButtonText: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  meetingButtonTextDisabled: {
    color: Colors.textMuted,
  },

  // Hotel rooms
  floorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: Spacing.lg,
  },
  roomHeader: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  roomEmoji: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  roomFloor: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: Colors.textMuted,
    marginBottom: 4,
  },
  roomName: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 26,
    color: Colors.text,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  roomSubtitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 15,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  roomDescription: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
    maxWidth: 480,
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
    paddingHorizontal: 40,
    gap: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerSymbol: {
    color: Colors.textMuted,
    fontSize: 10,
    letterSpacing: 2,
    fontFamily: 'PlayfairDisplay_600SemiBold',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  navButton: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 13,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.textSecondary,
  },
  navButtonNext: {
    color: Colors.primary,
    fontWeight: '600',
  },
  navButtonDisabled: {
    color: Colors.textMuted,
  },
  navCounter: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 13,
    color: Colors.textMuted,
  },
});
