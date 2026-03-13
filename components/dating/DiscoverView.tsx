/**
 * Discover View — WEARE-based resonance cards
 *
 * "Not a swipe. A discovery."
 *
 * Shows real profiles surfaced by resonance — how constellations,
 * values, and growth directions align. Uses calculateResonance()
 * for scoring and real Supabase data from discoverProfiles().
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '@/constants/theme';
import { COMPATIBILITY_DIMS } from '@/constants/dating/rooms';
import { ARCHETYPE_MAP } from '@/constants/dating/archetypes';
import { calculateResonance } from '@/utils/dating/resonanceScore';
import { discoverProfiles, getBlockedUserIds, blockUser, reportUser } from '@/services/dating';
import CompatibilityBars from './CompatibilityBars';
import ComposeLetterModal from './ComposeLetterModal';
import type { DatingProfile } from '@/types/dating';

interface DiscoverViewProps {
  userId: string;
  userProfile: DatingProfile | null;
}

interface DiscoverCard {
  profile: DatingProfile;
  alias: string;
  constellation: string[];
  resonance: number;
  excerpt: string;
  bars: Record<string, number>;
}

export default function DiscoverView({ userId, userProfile }: DiscoverViewProps) {
  const [viewMode, setViewMode] = useState<'resonance' | 'explore' | 'nearby'>('resonance');
  const [cards, setCards] = useState<DiscoverCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Letter compose state
  const [letterTarget, setLetterTarget] = useState<DiscoverCard | null>(null);
  const [showCompose, setShowCompose] = useState(false);

  const loadProfiles = useCallback(async () => {
    try {
      setError(null);
      // Fetch blocked IDs first, then filter them out of discovery
      let blockedIds: string[] = [];
      try {
        blockedIds = await getBlockedUserIds(userId);
      } catch {
        // Non-critical — if blocks table doesn't exist yet, skip
      }
      const profiles = await discoverProfiles(userId, {
        blockedIds,
        currentUserProfile: userProfile,
      });

      if (profiles.length === 0) {
        setCards([]);
        return;
      }

      // Build cards with resonance scores
      const discoveredCards: DiscoverCard[] = profiles.map((p) => {
        // Calculate resonance if we have user's profile
        let resonance = 50; // Default baseline
        if (userProfile?.constellation && p.constellation) {
          resonance = calculateResonance(userProfile, p);
        }

        // Get archetype alias from top trait
        const topTrait = p.constellation?.topTraits?.[0] || 'secure';
        const archetype = ARCHETYPE_MAP[topTrait];
        const alias = archetype?.name || 'The Wanderer';

        // Map constellation trait names
        const constellationNames = (p.constellation?.topTraits || []).map(
          (t) => ARCHETYPE_MAP[t]?.name || t,
        );

        // Build WEARE bars from constellation mapping
        const weareMapping = p.constellation?.weareMapping || {};
        const bars: Record<string, number> = {
          attunement: weareMapping.attunement ?? 50,
          co_creation: weareMapping.coCreation ?? 50,
          space: weareMapping.space ?? 50,
          growth: weareMapping.change ?? 50,
          resilience: weareMapping.resistance ?? 50,
        };

        return {
          profile: p,
          alias,
          constellation: constellationNames,
          resonance,
          excerpt: p.bio || archetype?.description || 'A fellow traveler on the path of intentional connection.',
          bars,
        };
      });

      // Sort by resonance (highest first) for default view
      discoveredCards.sort((a, b) => b.resonance - a.resonance);
      setCards(discoveredCards);
    } catch (err) {
      console.error('Failed to load discovery profiles:', err);
      setError('Unable to load profiles. Pull down to try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId, userProfile]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadProfiles();
  }, [loadProfiles]);

  const handleSendLetter = useCallback((card: DiscoverCard) => {
    setLetterTarget(card);
    setShowCompose(true);
  }, []);

  const handleLetterSent = useCallback(() => {
    setShowCompose(false);
    setLetterTarget(null);
  }, []);

  const handleBlockUser = useCallback((card: DiscoverCard) => {
    const doBlock = async () => {
      try {
        await blockUser(userId, card.profile.userId);
        // Remove from UI immediately
        setCards((prev) => prev.filter((c) => c.profile.id !== card.profile.id));
      } catch (err) {
        console.error('Failed to block user:', err);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Block ${card.alias}? They won't appear in your discovery anymore.`)) {
        doBlock();
      }
    } else {
      Alert.alert(
        'Block User',
        `Block ${card.alias}? They won't appear in your discovery anymore.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Block', style: 'destructive', onPress: doBlock },
        ],
      );
    }
  }, [userId]);

  const handleReportUser = useCallback((card: DiscoverCard) => {
    const doReport = async (reason: string) => {
      try {
        await reportUser(userId, card.profile.userId, reason);
        const msg = 'Thank you for helping keep this space safe. We\'ll review this report.';
        if (Platform.OS === 'web') {
          window.alert(msg);
        } else {
          Alert.alert('Report Submitted', msg);
        }
      } catch (err) {
        console.error('Failed to report user:', err);
      }
    };

    if (Platform.OS === 'web') {
      const reason = window.prompt('Why are you reporting this profile?');
      if (reason) doReport(reason);
    } else {
      Alert.alert(
        'Report Profile',
        'Why are you reporting this profile?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Inappropriate Content', onPress: () => doReport('inappropriate_content') },
          { text: 'Harassment', onPress: () => doReport('harassment') },
          { text: 'Spam / Fake', onPress: () => doReport('spam_or_fake') },
        ],
      );
    }
  }, [userId]);

  // Sort cards based on view mode
  const displayCards = [...cards];
  if (viewMode === 'explore') {
    // Shuffle for surprise — Fisher-Yates
    for (let i = displayCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [displayCards[i], displayCards[j]] = [displayCards[j], displayCards[i]];
    }
  }
  // 'nearby' and 'resonance' both use resonance sort for now (no location data yet)

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Discovering resonance...</Text>
      </View>
    );
  }

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

      {/* Error State */}
      {error && (
        <Animated.View entering={FadeIn.duration(300)} style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Empty State */}
      {!error && cards.length === 0 && (
        <Animated.View entering={FadeIn.duration(400)} style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Discoveries Yet</Text>
          <Text style={styles.emptyDesc}>
            As more people complete The Field and build their profiles,
            you'll discover resonance here. Check back soon.
          </Text>
        </Animated.View>
      )}

      {/* Profile Cards */}
      {!error && cards.length > 0 && (
        <View style={styles.cardsContainer}>
          {displayCards.map((card, i) => (
            <Animated.View key={card.profile.id} entering={FadeInDown.delay(i * 150).duration(400)}>
              <View style={styles.profileCard}>
                {/* Resonance Bar */}
                <View style={styles.resonanceBarTrack}>
                  <View style={[styles.resonanceBarFill, { width: `${card.resonance}%` }]} />
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.cardTopRow}>
                    <View>
                      <Text style={styles.profileAlias}>{card.alias}</Text>
                    </View>
                    <View style={styles.resonanceBadge}>
                      <Text style={styles.resonancePercent}>{card.resonance}%</Text>
                      <Text style={styles.resonanceLabel}>resonance</Text>
                    </View>
                  </View>

                  {/* Constellation Tags */}
                  <View style={styles.tagsRow}>
                    {card.constellation.map((c, j) => (
                      <View key={j} style={styles.tag}>
                        <Text style={styles.tagText}>{c}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Excerpt */}
                  <Text style={styles.excerpt}>"{card.excerpt}"</Text>

                  {/* Compatibility Bars */}
                  <CompatibilityBars bars={card.bars} compact />

                  {/* Actions */}
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={styles.sendLetterButton}
                      onPress={() => handleSendLetter(card)}
                      accessibilityRole="button"
                      accessibilityLabel={`Send a letter to ${card.alias}`}
                    >
                      <Text style={styles.sendLetterText}>Send a Letter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.moreButton}
                      onPress={() => {
                        if (Platform.OS === 'web') {
                          const action = window.prompt('Type "block" to block or "report" to report this user.');
                          if (action === 'block') handleBlockUser(card);
                          else if (action === 'report') handleReportUser(card);
                        } else {
                          Alert.alert(
                            card.alias,
                            'What would you like to do?',
                            [
                              { text: 'Cancel', style: 'cancel' },
                              { text: 'Report', onPress: () => handleReportUser(card) },
                              { text: 'Block', style: 'destructive', onPress: () => handleBlockUser(card) },
                            ],
                          );
                        }
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`More options for ${card.alias}`}
                    >
                      <Text style={styles.moreButtonText}>...</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>
      )}

      {/* Compose Letter Modal */}
      <ComposeLetterModal
        visible={showCompose}
        senderId={userId}
        recipientId={letterTarget?.profile.userId || ''}
        recipientAlias={letterTarget?.alias || ''}
        onClose={() => { setShowCompose(false); setLetterTarget(null); }}
        onSent={handleLetterSent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  loadingText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
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
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  errorText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  retryText: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 13,
    color: Colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: Spacing.lg,
    gap: 8,
  },
  emptyTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 18,
    color: Colors.text,
  },
  emptyDesc: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
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
  moreButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textMuted,
    lineHeight: 18,
  },
});
