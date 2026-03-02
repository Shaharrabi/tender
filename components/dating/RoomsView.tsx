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
  TextInput,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, SlideInUp } from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius, Typography, Shadows, FontFamilies } from '@/constants/theme';
import { CompassIcon, ChatBubbleIcon, SparkleIcon } from '@/assets/graphics/icons';
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
    // Scroll the parent page to top when switching rooms
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <View>
      {/* Section Toggle */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleButton, viewSection === 'hotel' && styles.toggleActive]}
          onPress={() => setViewSection('hotel')}
          accessibilityRole="button"
          accessibilityLabel="Self-guided journey"
          accessibilityState={{ selected: viewSection === 'hotel' }}
        >
          <View style={styles.toggleInner}>
            <CompassIcon size={14} color={viewSection === 'hotel' ? Colors.primary : Colors.textSecondary} />
            <Text style={[styles.toggleText, viewSection === 'hotel' && styles.toggleTextActive]}>
              Self-Guided Journey
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, viewSection === 'meeting' && styles.toggleActive]}
          onPress={() => setViewSection('meeting')}
          accessibilityRole="button"
          accessibilityLabel="Meeting rooms"
          accessibilityState={{ selected: viewSection === 'meeting' }}
        >
          <View style={styles.toggleInner}>
            <ChatBubbleIcon size={14} color={viewSection === 'meeting' ? Colors.primary : Colors.textSecondary} />
            <Text style={[styles.toggleText, viewSection === 'meeting' && styles.toggleTextActive]}>
              Meeting Rooms
            </Text>
          </View>
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
  const [enteredRoom, setEnteredRoom] = useState<number | null>(null);
  const [response, setResponse] = useState('');

  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionLabel}>Connection happens in rooms, not feeds</Text>
        <Text style={styles.sectionDesc}>
          Each room is a different way of meeting. No swiping. No scrolling.
          Just showing up with intention.
        </Text>
      </View>

      {/* Active Room View */}
      {enteredRoom !== null && (() => {
        const activeRoom = MEETING_ROOMS[enteredRoom];
        const RoomIcon = activeRoom.Icon || ChatBubbleIcon;
        return (
        <Animated.View entering={FadeIn.duration(300)} style={styles.activeRoomView}>
          <View style={styles.activeRoomHeader}>
            <View style={styles.meetingIconBox}>
              <RoomIcon size={22} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.meetingName}>{activeRoom.name}</Text>
              <Text style={styles.meetingPeople}>{activeRoom.people} people reflecting</Text>
            </View>
            <TouchableOpacity
              style={styles.leaveButton}
              onPress={() => { setEnteredRoom(null); setResponse(''); }}
              accessibilityRole="button"
              accessibilityLabel="Leave room"
            >
              <Text style={styles.leaveButtonText}>Leave</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.activeRoomPromptBox}>
            <SparkleIcon size={16} color={Colors.accentGold} />
            <Text style={styles.activeRoomPrompt}>{activeRoom.prompt}</Text>
          </View>

          <Text style={styles.activeRoomInstructions}>
            This is a space for reflection. Write your response below — when community matching is live, others will be able to read and respond to what you share here.
          </Text>

          <View style={styles.activeRoomInputWrap}>
            <TextInput
              style={styles.activeRoomInput}
              value={response}
              onChangeText={setResponse}
              placeholder="Share your reflection..."
              placeholderTextColor={Colors.textMuted}
              multiline
              textAlignVertical="top"
              maxLength={800}
              accessibilityRole="text"
              accessibilityLabel="Share your reflection"
            />
            <Text style={styles.activeRoomCounter}>{response.length}/800</Text>
          </View>

          <Text style={styles.activeRoomNote}>
            Community matching is being prepared with care. We'll notify you when others are here to connect with.
          </Text>
        </Animated.View>
        );
      })()}

      <View style={styles.meetingCards}>
        {MEETING_ROOMS.map((room, i) => (
          <Animated.View key={i} entering={FadeInDown.delay(i * 100).duration(400)}>
            <View style={[styles.meetingCard, enteredRoom === i && styles.meetingCardActive]}>
              {room.status === 'upcoming' && (
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>Coming Soon</Text>
                </View>
              )}

              <View style={styles.meetingCardRow}>
                <View style={styles.meetingIconBox}>
                  {room.Icon ? (
                    <room.Icon size={22} color={Colors.primary} />
                  ) : (
                    <ChatBubbleIcon size={22} color={Colors.primary} />
                  )}
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
                  enteredRoom === i && styles.meetingButtonEntered,
                ]}
                disabled={room.status === 'upcoming'}
                accessibilityRole="button"
                accessibilityLabel={room.status === 'upcoming' ? `Notify me about ${room.name}` : enteredRoom === i ? `You are in ${room.name}` : `Enter ${room.name}`}
                accessibilityState={{ disabled: room.status === 'upcoming' }}
                onPress={() => {
                  if (room.status === 'active') {
                    setEnteredRoom(enteredRoom === i ? null : i);
                    setResponse('');
                  } else {
                    Alert.alert(
                      room.name,
                      'This room is being prepared with care. We\'ll notify you when it\'s ready.',
                    );
                  }
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.meetingButtonText,
                    room.status === 'upcoming' && styles.meetingButtonTextDisabled,
                  ]}
                >
                  {room.status === 'upcoming' ? 'Notify Me' : enteredRoom === i ? 'You\'re Here' : 'Enter Room'}
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
        {room.Icon ? (
          <room.Icon size={32} color={room.color} />
        ) : (
          <SparkleIcon size={32} color={room.color} />
        )}
        <Text style={styles.roomFloor}>Floor {room.floor}</Text>
        <Text style={styles.roomName}>{room.name}</Text>
        <Text style={[styles.roomSubtitle, { color: room.color }]}>{room.subtitle}</Text>
        <Text style={styles.roomDescription}>{room.description}</Text>
      </Animated.View>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <SparkleIcon size={10} color={Colors.textMuted} />
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
          accessibilityRole="button"
          accessibilityLabel="Previous room"
          accessibilityState={{ disabled: activeRoom === 0 }}
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
          accessibilityRole="button"
          accessibilityLabel="Next room"
          accessibilityState={{ disabled: activeRoom === HOTEL_ROOMS.length - 1 }}
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
  toggleInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    color: Colors.text,
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
  meetingCardActive: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  meetingButtonEntered: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },

  // Active room view
  activeRoomView: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
    ...Shadows.card,
  },
  activeRoomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  leaveButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.textMuted,
  },
  leaveButtonText: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  activeRoomPromptBox: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accentGold,
    marginBottom: Spacing.md,
  },
  activeRoomPrompt: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontStyle: 'italic',
    fontSize: 15,
    color: Colors.text,
    flex: 1,
    lineHeight: 22,
  },
  activeRoomInstructions: {
    fontFamily: FontFamilies.body,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: Spacing.md,
  },
  activeRoomInputWrap: {
    marginBottom: Spacing.sm,
  },
  activeRoomInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: 14,
    fontFamily: FontFamilies.body,
    fontSize: 14,
    lineHeight: 22,
    color: Colors.text,
    backgroundColor: Colors.surface,
    minHeight: 120,
  },
  activeRoomCounter: {
    fontFamily: FontFamilies.heading,
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: 4,
  },
  activeRoomNote: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 17,
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
    gap: Spacing.xs,
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
