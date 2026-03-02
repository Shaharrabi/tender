/**
 * React Query hooks for portrait data
 *
 * Wraps the portrait service with caching, deduplication,
 * and automatic refetching. Replaces manual useEffect + useState
 * patterns throughout the app.
 *
 * Usage:
 *   const { data: portrait, isLoading } = usePortrait(userId);
 *   const { data: canGenerate } = useCanGeneratePortrait(userId);
 */

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/services/query-client';
import {
  getPortrait,
  checkCanGeneratePortrait,
  fetchAllScores,
  fetchPreviousScores,
} from '@/services/portrait';

/** Fetch the user's individual portrait (or null). */
export function usePortrait(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.portrait.detail(userId ?? ''),
    queryFn: () => getPortrait(userId!),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // Portraits change rarely — 10 min
  });
}

/** Check if the user can generate a portrait (all 6 assessments completed). */
export function useCanGeneratePortrait(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.portrait.canGenerate(userId ?? ''),
    queryFn: () => checkCanGeneratePortrait(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

/** Fetch all 6 assessment scores (latest per type). */
export function useAllScores(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.portrait.scores(userId ?? ''),
    queryFn: () => fetchAllScores(userId!),
    enabled: !!userId,
  });
}

/** Fetch previous assessment scores for reassessment delta. */
export function usePreviousScores(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.portrait.previousScores(userId ?? ''),
    queryFn: () => fetchPreviousScores(userId!),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  });
}
