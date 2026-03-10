/**
 * AudioLibrary — Collapsible section showing unlocked portrait audio tracks.
 *
 * Groups tracks by category (Getting Started, Your Patterns, What We Noticed,
 * Your Dance Together) using the selection logic from trackSelection.ts.
 *
 * Lives on the portrait screen, below the tab content.
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
} from 'react-native';
import {
  Colors,
  Spacing,
  FontFamilies,
  FontSizes,
  BorderRadius,
  Shadows,
  Typography,
} from '@/constants/theme';
import { ChevronUpIcon, ChevronDownIcon } from '@/assets/graphics/icons';
import type { IndividualPortrait } from '@/types/portrait';
import type { DeepCouplePortrait } from '@/types/couples';
import {
  selectTracksForPortrait,
  selectTracksForCouplePortrait,
  groupTracksBySection,
  type TrackGroup,
} from '@/utils/audio/trackSelection';
import { totalDuration, type PortraitTrack } from '@/utils/audio/trackMetadata';
import PortraitAudioCard from './PortraitAudioCard';

interface AudioLibraryProps {
  portrait: IndividualPortrait;
  couplePortrait?: DeepCouplePortrait | null;
}

export default function AudioLibrary({
  portrait,
  couplePortrait,
}: AudioLibraryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'Getting Started': true, // first group open by default
  });

  // ── Compute tracks from portrait data ──
  const { groups, trackCount, totalTime } = useMemo(() => {
    const individualTracks = selectTracksForPortrait(portrait);
    const coupleTracks = couplePortrait
      ? selectTracksForCouplePortrait(couplePortrait)
      : [];
    const allTracks = [...individualTracks, ...coupleTracks];
    return {
      groups: groupTracksBySection(allTracks),
      trackCount: allTracks.length,
      totalTime: totalDuration(allTracks),
    };
  }, [portrait, couplePortrait]);

  const handleToggleLibrary = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded((prev) => !prev);
  };

  const handleToggleGroup = (label: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <View style={styles.container}>
      {/* ── Library Header ── */}
      <TouchableOpacity
        style={styles.header}
        onPress={handleToggleLibrary}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        accessibilityLabel={`Portrait Audio Library, ${trackCount} tracks, ${isExpanded ? 'expanded' : 'collapsed'}`}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>{'\uD83C\uDFA7'}</Text>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Portrait Audio Library</Text>
            <Text style={styles.headerSubtitle}>
              {trackCount} tracks selected for you · {totalTime}
            </Text>
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
            Audio companions to your portrait — each track personalized to your patterns.
            Listen in order, or explore what resonates.
          </Text>

          {groups.map((group) => (
            <TrackGroupSection
              key={group.label}
              group={group}
              isExpanded={!!expandedGroups[group.label]}
              onToggle={() => handleToggleGroup(group.label)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Track Group Section ────────────────────────────────

interface TrackGroupSectionProps {
  group: TrackGroup;
  isExpanded: boolean;
  onToggle: () => void;
}

function TrackGroupSection({ group, isExpanded, onToggle }: TrackGroupSectionProps) {
  const groupTime = totalDuration(group.tracks);
  const accentColor = getGroupAccentColor(group.label);

  return (
    <View style={styles.groupContainer}>
      <TouchableOpacity
        style={styles.groupHeader}
        onPress={onToggle}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
      >
        <View style={styles.groupHeaderLeft}>
          <View style={[styles.groupDot, { backgroundColor: accentColor }]} />
          <View>
            <Text style={styles.groupTitle}>{group.label}</Text>
            {!isExpanded && (
              <Text style={styles.groupMeta}>
                {group.tracks.length} tracks · {groupTime}
              </Text>
            )}
          </View>
        </View>
        {isExpanded ? (
          <ChevronUpIcon size={16} color={accentColor} />
        ) : (
          <ChevronDownIcon size={16} color={accentColor} />
        )}
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.groupContent}>
          <Text style={styles.groupSubtitle}>{group.subtitle}</Text>
          {group.tracks.map((track) => (
            <PortraitAudioCard
              key={track.id}
              track={track}
              accentColor={accentColor}
            />
          ))}
        </View>
      )}
    </View>
  );
}

function getGroupAccentColor(label: string): string {
  switch (label) {
    case 'Getting Started':
      return Colors.primary;
    case 'Your Patterns':
      return Colors.accent;
    case 'What We Noticed':
      return Colors.accentGold;
    case 'Your Dance Together':
      return Colors.calm;
    default:
      return Colors.primary;
  }
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  // ── Library header ──
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
  headerIcon: {
    fontSize: 22,
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
  // ── Expanded content ──
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
  // ── Group section ──
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
    ...Typography.headingS,
    fontSize: 15,
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
