/**
 * ResetLibrary — Collapsible audio library of all 6 pattern-reset scripts.
 *
 * Matches the AudioLibrary / PortraitAudioCard design language:
 *   • Collapsible header with chevron
 *   • Two grouped sections: Hot (activated) and Cold (shutdown)
 *   • Inline play/pause cards with progress bar (no full-screen modal)
 *
 * Hot  (🔥): R-1 Slow Your Reach, R-3 Anchor Before You Leave, R-6 Find Your Center
 * Cold (❄️): R-2 Thaw the Freeze, R-4 Gentle Re-Entry, R-5 Steady the Swing
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import {
  Colors,
  Spacing,
  FontFamilies,
  FontSizes,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import {
  HeartPulseIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  FireIcon,
  SnowflakeIcon,
} from '@/assets/graphics/icons';
import {
  getResetScript,
  resolveResetAudio,
  type ResetScript,
} from '@/utils/emergency/resetScripts';
import { audioManager } from '@/services/AudioManager';

// ─── Script Groups ───────────────────────────────────────

const HOT_SCRIPTS = ['R-1', 'R-3', 'R-6'] as const;
const COLD_SCRIPTS = ['R-2', 'R-4', 'R-5'] as const;

const GROUPS = [
  {
    key: 'hot',
    label: 'When You\'re Activated',
    subtitle: 'Heart racing, words rushing out, chasing connection',
    scripts: HOT_SCRIPTS,
    Icon: FireIcon,
    accentColor: '#B85C38',
  },
  {
    key: 'cold',
    label: 'When You\'re Shut Down',
    subtitle: 'Numb, frozen, wanting to disappear or leave the room',
    scripts: COLD_SCRIPTS,
    Icon: SnowflakeIcon,
    accentColor: Colors.calm,
  },
] as const;

// ─── Main Component ──────────────────────────────────────

interface ResetLibraryProps {
  /** Start expanded (default: false) */
  defaultExpanded?: boolean;
}

export default function ResetLibrary({ defaultExpanded = false }: ResetLibraryProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    hot: true,
  });

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded((p) => !p);
  };

  const handleGroupToggle = (key: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedGroups((p) => ({ ...p, [key]: !p[key] }));
  };

  return (
    <View style={styles.container}>
      {/* ── Collapsible Header ── */}
      <TouchableOpacity
        style={styles.header}
        onPress={handleToggle}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        accessibilityLabel={`Pattern Reset Library, 6 guided resets, ${isExpanded ? 'expanded' : 'collapsed'}`}
      >
        <View style={styles.headerLeft}>
          <HeartPulseIcon size={22} color={Colors.accent} />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Pattern Reset Library</Text>
            <Text style={styles.headerSubtitle}>6 guided resets · 3 hot, 3 cold</Text>
          </View>
        </View>
        {isExpanded ? (
          <ChevronUpIcon size={18} color={Colors.accent} />
        ) : (
          <ChevronDownIcon size={18} color={Colors.accent} />
        )}
      </TouchableOpacity>

      {/* ── Expanded Content ── */}
      {isExpanded && (
        <View style={styles.content}>
          <Text style={styles.introText}>
            Emergency pattern-interrupts — short guided resets to break the cycle in the moment.
          </Text>

          {GROUPS.map((group) => (
            <View key={group.key} style={styles.groupContainer}>
              <TouchableOpacity
                style={styles.groupHeader}
                onPress={() => handleGroupToggle(group.key)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityState={{ expanded: !!expandedGroups[group.key] }}
              >
                <View style={styles.groupHeaderLeft}>
                  <View style={[styles.groupDot, { backgroundColor: group.accentColor }]} />
                  <View>
                    <Text style={styles.groupTitle}>{group.label}</Text>
                    {!expandedGroups[group.key] && (
                      <Text style={styles.groupMeta}>
                        {group.scripts.length} resets
                      </Text>
                    )}
                  </View>
                </View>
                {expandedGroups[group.key] ? (
                  <ChevronUpIcon size={16} color={group.accentColor} />
                ) : (
                  <ChevronDownIcon size={16} color={group.accentColor} />
                )}
              </TouchableOpacity>

              {expandedGroups[group.key] && (
                <View style={styles.groupContent}>
                  <Text style={styles.groupSubtitle}>{group.subtitle}</Text>
                  {group.scripts.map((id) => {
                    const script = getResetScript(id);
                    if (!script) return null;
                    return (
                      <ResetAudioCard
                        key={id}
                        script={script}
                        accentColor={group.accentColor}
                      />
                    );
                  })}
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Inline Reset Audio Card ─────────────────────────────
// Mirrors PortraitAudioCard: play button, title, tagline, progress bar

interface ResetAudioCardProps {
  script: ResetScript;
  accentColor: string;
}

function formatTime(millis: number): string {
  const totalSec = Math.floor(millis / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

function ResetAudioCard({ script, accentColor }: ResetAudioCardProps) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasFinished, setHasFinished] = useState(false);

  const audioSource = resolveResetAudio(script.filePath);
  const isAvailable = !!audioSource;
  const ownerId = useRef(`reset-${script.id}`).current;

  // Breathing animation while playing
  const breathe = useSharedValue(1);

  useEffect(() => {
    if (isPlaying) {
      breathe.value = withRepeat(
        withSequence(
          withTiming(1.12, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );
    } else {
      breathe.value = withTiming(1, { duration: 300 });
    }
  }, [isPlaying]);

  const breatheStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathe.value }],
  }));

  const onPlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (!status.isLoaded) return;
      setPosition(status.positionMillis);
      setDuration(status.durationMillis ?? 0);
      setIsPlaying(status.isPlaying);
      if (status.didJustFinish && !hasFinished) {
        setHasFinished(true);
      }
    },
    [hasFinished]
  );

  const handlePlayPause = useCallback(async () => {
    if (!isAvailable) return;

    if (soundRef.current) {
      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await soundRef.current.pauseAsync();
        } else {
          await audioManager.stopCurrent(ownerId);
          if (status.didJustFinish) {
            await soundRef.current.setPositionAsync(0);
            setHasFinished(false);
          }
          await soundRef.current.playAsync();
          await audioManager.register(soundRef.current, ownerId);
        }
        return;
      }
    }

    await audioManager.stopCurrent(ownerId);
    setIsLoading(true);
    try {
      const { sound } = await Audio.Sound.createAsync(
        audioSource,
        { shouldPlay: true, volume: 1.0 },
        onPlaybackStatusUpdate
      );
      soundRef.current = sound;
      setIsLoaded(true);
      await audioManager.register(sound, ownerId);
    } catch (err) {
      console.warn('[ResetAudioCard] Failed to load:', script.id, err);
    } finally {
      setIsLoading(false);
    }
  }, [audioSource, isAvailable, onPlaybackStatusUpdate, script.id, ownerId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
      audioManager.unregister(ownerId);
    };
  }, []);

  const progress = duration > 0 ? position / duration : 0;
  const playIconName: keyof typeof Ionicons.glyphMap = isPlaying
    ? 'pause'
    : hasFinished
      ? 'refresh'
      : 'play';

  return (
    <View style={cardStyles.card}>
      {/* Play button */}
      <TouchableOpacity
        onPress={handlePlayPause}
        activeOpacity={0.7}
        disabled={isLoading || !isAvailable}
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? `Pause ${script.title}` : `Play ${script.title}`}
      >
        <Animated.View
          style={[
            cardStyles.playButton,
            {
              backgroundColor: accentColor + '15',
              borderColor: accentColor + '40',
            },
            isPlaying && breatheStyle,
          ]}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={accentColor} />
          ) : (
            <Ionicons name={playIconName} size={18} color={accentColor} />
          )}
        </Animated.View>
      </TouchableOpacity>

      {/* Info */}
      <View style={cardStyles.info}>
        <View style={cardStyles.titleRow}>
          <Text style={cardStyles.title} numberOfLines={1}>{script.title}</Text>
          <Text style={cardStyles.duration}>{script.duration}</Text>
        </View>
        <Text style={cardStyles.description} numberOfLines={2}>{script.tagline}</Text>

        {/* Progress bar (only when loaded) */}
        {isLoaded && (
          <View style={cardStyles.progressContainer}>
            <View style={cardStyles.progressTrack}>
              <View
                style={[
                  cardStyles.progressFill,
                  { width: `${progress * 100}%`, backgroundColor: accentColor },
                ]}
              />
            </View>
            <View style={cardStyles.timeRow}>
              <Text style={cardStyles.timeText}>{formatTime(position)}</Text>
              <Text style={cardStyles.timeText}>{duration > 0 ? formatTime(duration) : '--:--'}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Library Styles (matches AudioLibrary) ───────────────

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.card,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  headerTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.headingS,
    color: Colors.text,
  },
  headerSubtitle: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },
  content: {
    marginTop: Spacing.sm,
    gap: Spacing.md,
  },
  introText: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 22,
    paddingHorizontal: Spacing.xs,
  },
  groupContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  groupHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  groupDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  groupTitle: {
    fontFamily: FontFamilies.heading,
    fontSize: 15,
    color: Colors.text,
  },
  groupMeta: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  groupSubtitle: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
    lineHeight: 18,
    paddingHorizontal: Spacing.xs,
  },
  groupContent: {
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
});

// ─── Card Styles (matches PortraitAudioCard) ─────────────

const cardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  title: {
    fontFamily: FontFamilies.heading,
    fontSize: FontSizes.body,
    color: Colors.text,
    flex: 1,
  },
  duration: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textMuted,
  },
  description: {
    fontFamily: FontFamilies.body,
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  progressContainer: {
    marginTop: 4,
    gap: 2,
  },
  progressTrack: {
    height: 3,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 10,
    color: Colors.textMuted,
    fontFamily: FontFamilies.body,
  },
});
