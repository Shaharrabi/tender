/**
 * React Query hooks for couple data
 *
 * Wraps couple service functions with caching and deduplication.
 * All couple-related data is keyed by userId or coupleId for
 * targeted invalidation on partner link/unlink.
 *
 * Usage:
 *   const { data: couple } = useMyCouple(userId);
 *   const { data: partner } = usePartnerProfile(userId);
 */

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/services/query-client';
import {
  getMyCouple,
  getPartnerProfile,
  getRelationshipPortrait,
  getDeepCouplePortrait,
  getLatestDyadicScores,
} from '@/services/couples';
import type { DyadicAssessmentType } from '@/types/couples';
import {
  getUserConsent,
  getSharingPreferences,
  getPartnerSharedAssessments,
} from '@/services/consent';

/** Fetch the current user's couple record (or null). */
export function useMyCouple(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.couple.mine(userId ?? ''),
    queryFn: () => getMyCouple(userId!),
    enabled: !!userId,
  });
}

/** Fetch the partner's display name / profile. */
export function usePartnerProfile(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.couple.partnerProfile(userId ?? ''),
    queryFn: () => getPartnerProfile(userId!),
    enabled: !!userId,
  });
}

/** Fetch the relationship portrait for a couple. */
export function useRelationshipPortrait(coupleId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.couple.portrait(coupleId ?? ''),
    queryFn: () => getRelationshipPortrait(coupleId!),
    enabled: !!coupleId,
    staleTime: 10 * 60 * 1000,
  });
}

/** Fetch the deep couple portrait for a couple. */
export function useDeepCouplePortrait(coupleId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.couple.deepPortrait(coupleId ?? ''),
    queryFn: () => getDeepCouplePortrait(coupleId!),
    enabled: !!coupleId,
    staleTime: 10 * 60 * 1000,
  });
}

/** Fetch the latest dyadic assessment scores for a specific type. */
export function useDyadicScores(
  coupleId: string | undefined,
  assessmentType: DyadicAssessmentType,
) {
  return useQuery({
    queryKey: [...queryKeys.couple.dyadicScores(coupleId ?? ''), assessmentType] as const,
    queryFn: () => getLatestDyadicScores(coupleId!, assessmentType),
    enabled: !!coupleId,
  });
}

/** Fetch the user's active data consent. */
export function useUserConsent(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.consent.user(userId ?? ''),
    queryFn: () => getUserConsent(userId!),
    enabled: !!userId,
    staleTime: 30 * 60 * 1000, // Consent doesn't change often
  });
}

/** Fetch sharing preferences for a user–couple pair. */
export function useSharingPreferences(
  userId: string | undefined,
  coupleId: string | undefined,
) {
  return useQuery({
    queryKey: queryKeys.consent.sharing(userId ?? '', coupleId ?? ''),
    queryFn: () => getSharingPreferences(userId!, coupleId!),
    enabled: !!userId && !!coupleId,
  });
}

/** Fetch which assessments the partner has shared. */
export function usePartnerSharedAssessments(
  partnerId: string | undefined,
  coupleId: string | undefined,
) {
  return useQuery({
    queryKey: ['couple', 'partnerShared', partnerId, coupleId] as const,
    queryFn: () => getPartnerSharedAssessments(partnerId!, coupleId!),
    enabled: !!partnerId && !!coupleId,
  });
}
