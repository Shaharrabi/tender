/**
 * Discover View — WEARE-based resonance cards
 *
 * "Not a swipe. A discovery."
 *
 * Shows profiles surfaced by resonance — how constellations,
 * values, and growth directions align. Currently uses mock data.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/theme';
import { COMPATIBILITY_DIMS } from '@/constants/dating/rooms';
import CompatibilityBars from './CompatibilityBars';

// ─── Mock Data ───────────────────────────────────────────────

const SAMPLE_PROFILES = [
  {
    alias: 'The Quiet Gardener',
    constellation: ['Steady Flame', 'Still Water', 'Long Game'],
    resonance: 84,
    excerpt: "I'm someone who shows up slowly but stays. I like mornings, libraries, and the way a conversation can change shape when both people stop performing.",
    age: 34,
    distance: '3 km',
    bars: { attunement: 82, co_creation: 68, space: 91, growth: 74, resilience: 78 },
  },
  {
    alias: 'The Bright Cartographer',
    constellation: ['Bright Seeker', 'Open Window', 'Deep Diver'],
    resonance: 71,
    excerpt: "I map everything — emotions, neighborhoods, the distance between what people say and what they mean. Looking for someone who wants to get gloriously lost.",
    age: 29,
    distance: 'Same city',
    bars: { attunement: 76, co_creation: 89, space: 55, growth: 82, resilience: 64 },
  },
  {
    alias: 'The Storm Walker',
    constellation: ['Brave Heart', 'Spiral', 'Tender Storm'],
    resonance: 67,
    excerpt: "I've done the work. Still doing it. I want someone who knows that healing isn't a destination and that the best conversations happen in the rain.",
    age: 41,
    distance: '12 km',
    bars: { attunement: 62, co_creation: 71, space: 58, growth: 93, resilience: 85 },
  },
];

export default function DiscoverView() {
  const [viewMode, setViewMode] = useState<'resonance' | 'explore' | 'nearby'>('resonance');

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Not a swipe. A discovery.</Text>
        <Text style={styles.headerDesc}>
          People here aren't ranked by attractiveness. They're surfaced by
          resonance — how your constellations, values, and growth directions align.
        </Text>
      </View>

      {/* View Modes */}
      <View style={styles.modeRow}>
        {[
          { id: 'resonance' as const, label: 'Resonance', desc: 'WEARE resonance' },
          { id: 'explore' as const, label: 'Explore', desc: 'Surprise me' },
          { id: 'nearby' as const, label: 'Nearby', desc: 'Location' },
        ].map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[styles.modeButton, viewMode === m.id && styles.modeButtonActive]}
            onPress={() => setViewMode(m.id)}
            accessibilityRole="button"
            accessibilityLabel={`View mode: ${m.label}`}
            accessibilityState={{ selected: viewMode === m.id }}
          >
            <Text style={[styles.modeLabel, viewMode === m.id && styles.modeLabelActive]}>
              {m.label}
            </Text>
            <Text style={styles.modeDesc}>{m.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Profile Cards */}
      <View style={styles.cardsContainer}>
        {SAMPLE_PROFILES.map((p, i) => (
          <Animated.View key={i} entering={FadeInDown.delay(i * 150).duration(400)}>
            <View style={styles.profileCard}>
              {/* Resonance Bar */}
              <View style={styles.resonanceBarTrack}>
                <View style={[styles.resonanceBarFill, { width: `${p.resonance}%` }]} />
              </View>

              <View style={styles.cardContent}>
                <View style={styles.cardTopRow}>
                  <View>
                    <Text style={styles.profileAlias}>{p.alias}</Text>
                    <Text style={styles.profileMeta}>
                      {p.age} · {p.distance}
                    </Text>
                  </View>
                  <View style={styles.resonanceBadge}>
                    <Text style={styles.resonancePercent}>{p.resonance}%</Text>
                    <Text style={styles.resonanceLabel}>resonance</Text>
                  </View>
                </View>

                {/* Constellation Tags */}
                <View style={styles.tagsRow}>
                  {p.constellation.map((c, j) => (
                    <View key={j} style={styles.tag}>
                      <Text style={styles.tagText}>{c}</Text>
                    </View>
                  ))}
                </View>

                {/* Excerpt */}
                <Text style={styles.excerpt}>"{p.excerpt}"</Text>

                {/* Compatibility Bars */}
                <CompatibilityBars bars={p.bars} compact />

                {/* Actions */}
                <View style={styles.actionsRow}>
                  <TouchableOpacity style={styles.sendLetterButton} accessibilityRole="button" accessibilityLabel={`Send a letter to ${p.alias}`}>
                    <Text style={styles.sendLetterText}>Send a Letter</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.exploreButton} accessibilityRole="button" accessibilityLabel={`Explore ${p.alias}'s profile`}>
                    <Text style={styles.exploreButtonText}>Explore</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  headerLabel: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 13,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: Colors.textMuted,
    marginBottom: 4,
  },
  headerDesc: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
    maxWidth: 400,
    textAlign: 'center',
  },
  modeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  modeButtonActive: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryFaded,
  },
  modeLabel: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  modeLabelActive: {
    color: Colors.primary,
  },
  modeDesc: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  cardsContainer: {
    gap: Spacing.md,
  },
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  resonanceBarTrack: {
    height: 4,
    backgroundColor: Colors.borderLight,
  },
  resonanceBarFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  cardContent: {
    padding: Spacing.md,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  profileAlias: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 18,
    color: Colors.text,
    fontWeight: '700',
  },
  profileMeta: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  resonanceBadge: {
    backgroundColor: Colors.primaryFaded,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resonancePercent: {
    fontFamily: 'Jost_500Medium',
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  resonanceLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  tagText: {
    fontFamily: 'Jost_500Medium',
    fontSize: 10,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  excerpt: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: Spacing.md,
  },
  sendLetterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  sendLetterText: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 13,
    fontWeight: '600',
    color: Colors.white,
    letterSpacing: 1,
  },
  exploreButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  exploreButtonText: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 13,
    color: Colors.secondary,
  },
});
