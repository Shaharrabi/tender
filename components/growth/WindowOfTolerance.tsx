/**
 * WindowOfTolerance — Interactive nervous system state visualization
 *
 * Three zones with contextual responses:
 *   • Hyperarousal (activated): racing heart, tension → grounding exercises
 *   • In-Window (regulated): steady breathing → good for practice
 *   • Hypoarousal (shutdown): heaviness, numbness → gentle wake-up
 *
 * Shown on the Growth screen to give users a quick way to assess
 * their current state and get zone-appropriate suggestions.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import {
  Colors,
  Spacing,
  FontSizes,
  FontFamilies,
  BorderRadius,
  Shadows,
} from '@/constants/theme';
import { FireIcon, GreenHeartIcon, SnowflakeIcon } from '@/assets/graphics/icons';
import type { IconProps } from '@/assets/graphics/icons';

// ─── Zone Data ──────────────────────────────────────────

type Zone = 'hyperarousal' | 'inWindow' | 'hypoarousal';

interface ZoneResponse {
  zone: Zone;
  label: string;
  Icon: React.ComponentType<IconProps>;
  color: string;
  validation: string;
  bodySignals: string;
  practices: string[];
  practiceIds: string[];
  coreMessage: string;
}

const ZONE_RESPONSES: ZoneResponse[] = [
  {
    zone: 'hyperarousal',
    label: 'Activated',
    Icon: FireIcon,
    color: Colors.zoneHyper,
    validation: 'Your system is activated right now. That makes sense.',
    bodySignals: 'Racing heart, tension, heat, restlessness, urgency.',
    practices: [
      '5-4-3-2-1 Grounding',
      'Window of Tolerance Check',
      'Self-Compassion Break',
    ],
    practiceIds: ['grounding-5-4-3-2-1', 'window-check', 'self-compassion-break'],
    coreMessage: 'You are safe. Let\u2019s bring your system back to center.',
  },
  {
    zone: 'inWindow',
    label: 'Regulated',
    Icon: GreenHeartIcon,
    color: Colors.zoneRegulated,
    validation: 'You are in your window right now. This is where growth happens.',
    bodySignals: 'Breathing is steady, thinking is clear, body feels settled.',
    practices: [
      'Any step-appropriate practice',
      'Hold Me Tight Conversation',
      'Love Maps',
    ],
    practiceIds: ['hold-me-tight', 'love-maps'],
    coreMessage: 'Great place to be. This is a good time for a practice.',
  },
  {
    zone: 'hypoarousal',
    label: 'Shutdown',
    Icon: SnowflakeIcon,
    color: Colors.zoneHypo,
    validation: 'Your system has moved into protection mode. That\u2019s okay.',
    bodySignals: 'Heaviness, fog, numbness, flatness, disconnection.',
    practices: [
      'Window of Tolerance Check',
      'Parts Check-In',
      'Grounding Exercise',
    ],
    practiceIds: ['window-check', 'parts-check-in', 'grounding-5-4-3-2-1'],
    coreMessage: 'You are here. Let\u2019s gently wake your system back up.',
  },
];

// ─── Component ──────────────────────────────────────────

interface Props {
  onSelectPractice?: (practiceId: string) => void;
}

export default function WindowOfTolerance({ onSelectPractice }: Props) {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [pulseAnim] = useState(new Animated.Value(1));

  const handleZoneSelect = (zone: Zone) => {
    setSelectedZone(zone);

    // Gentle pulse animation
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(pulseAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 5,
      }),
    ]).start();
  };

  const selectedData = ZONE_RESPONSES.find((z) => z.zone === selectedZone);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Where Is Your Nervous System?</Text>
      <Text style={styles.subtitle}>
        Tap the zone that best describes how you feel right now.
      </Text>

      {/* Zone Selector — Three stacked bars */}
      <View style={styles.zonesColumn}>
        {ZONE_RESPONSES.map((zone) => {
          const isSelected = selectedZone === zone.zone;
          return (
            <TouchableOpacity
              key={zone.zone}
              style={[
                styles.zoneBar,
                { borderColor: zone.color + '40' },
                isSelected && {
                  borderColor: zone.color,
                  backgroundColor: zone.color + '15',
                },
              ]}
              onPress={() => handleZoneSelect(zone.zone)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`${zone.label} zone, ${zone.bodySignals}${isSelected ? ', selected' : ''}`}
            >
              <zone.Icon size={18} color={zone.color} />
              <View style={styles.zoneTextContainer}>
                <Text
                  style={[
                    styles.zoneLabel,
                    isSelected && { color: zone.color, fontWeight: '700' },
                  ]}
                >
                  {zone.label}
                </Text>
                <Text style={styles.zoneSignals} numberOfLines={1}>
                  {zone.bodySignals}
                </Text>
              </View>
              {isSelected && (
                <View style={[styles.zoneIndicator, { backgroundColor: zone.color }]} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Response Card */}
      {selectedData && (
        <Animated.View
          style={[
            styles.responseCard,
            {
              borderLeftColor: selectedData.color,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Text style={[styles.responseValidation, { color: selectedData.color }]}>
            {selectedData.validation}
          </Text>

          <Text style={styles.responseCoreMessage}>
            {selectedData.coreMessage}
          </Text>

          <View style={styles.suggestedPractices}>
            <Text style={styles.suggestedLabel}>SUGGESTED PRACTICES</Text>
            {selectedData.practices.map((practice, i) => (
              <TouchableOpacity
                key={i}
                style={styles.practiceRow}
                onPress={() => {
                  const id = selectedData.practiceIds[i];
                  if (id && onSelectPractice) {
                    onSelectPractice(id);
                  }
                }}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`Start practice: ${practice}`}
              >
                <Text style={styles.practiceText}>
                  {'\u2022'} {practice}
                </Text>
                {selectedData.practiceIds[i] && onSelectPractice && (
                  <Text style={[styles.practiceArrow, { color: selectedData.color }]}>
                    Start {'\u2192'}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  title: {
    fontSize: FontSizes.body,
    fontWeight: '700',
    fontFamily: FontFamilies.heading,
    color: Colors.text,
  },
  subtitle: {
    fontSize: FontSizes.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: -Spacing.xs,
  },

  // Zone selector
  zonesColumn: {
    gap: Spacing.xs,
  },
  zoneBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    gap: Spacing.sm,
    borderWidth: 1.5,
    ...Shadows.subtle,
  },
  zoneIcon: {
  },
  zoneTextContainer: {
    flex: 1,
    gap: 2,
  },
  zoneLabel: {
    fontSize: FontSizes.bodySmall,
    fontWeight: '600',
    color: Colors.text,
  },
  zoneSignals: {
    fontSize: FontSizes.caption - 1,
    color: Colors.textMuted,
    lineHeight: 15,
  },
  zoneIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Response card
  responseCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    gap: Spacing.md,
    ...Shadows.card,
  },
  responseValidation: {
    fontSize: FontSizes.body,
    fontWeight: '600',
    fontFamily: FontFamilies.heading,
    lineHeight: 24,
  },
  responseCoreMessage: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  suggestedPractices: {
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  suggestedLabel: {
    fontSize: FontSizes.caption,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 2,
  },
  practiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  practiceText: {
    fontSize: FontSizes.bodySmall,
    color: Colors.text,
    flex: 1,
  },
  practiceArrow: {
    fontSize: FontSizes.caption,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
});
