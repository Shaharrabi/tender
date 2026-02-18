/**
 * OnboardingContext — Collects answers across onboarding screens.
 *
 * Each question screen sets its value here.
 * The final "ready" screen saves everything to Supabase in one upsert.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { RelationshipMode, DemoPartnerId } from '@/constants/demoPartners';

export interface OnboardingData {
  displayName: string | null;
  relationshipStatus: string | null;
  relationshipDuration: string | null;
  goals: string[];
  timeCommitment: string | null;
  relationshipMode: RelationshipMode | null;
  demoPartnerId: DemoPartnerId | null;
}

interface OnboardingContextValue {
  data: OnboardingData;
  setDisplayName: (name: string) => void;
  setStatus: (status: string) => void;
  setDuration: (duration: string) => void;
  toggleGoal: (goalId: string) => void;
  setGoals: (goals: string[]) => void;
  setTimeCommitment: (time: string) => void;
  setRelationshipMode: (mode: RelationshipMode) => void;
  setDemoPartnerId: (partnerId: DemoPartnerId | null) => void;
}

const defaultData: OnboardingData = {
  displayName: null,
  relationshipStatus: null,
  relationshipDuration: null,
  goals: [],
  timeCommitment: null,
  relationshipMode: null,
  demoPartnerId: null,
};

const OnboardingCtx = createContext<OnboardingContextValue>({
  data: defaultData,
  setDisplayName: () => {},
  setStatus: () => {},
  setDuration: () => {},
  toggleGoal: () => {},
  setGoals: () => {},
  setTimeCommitment: () => {},
  setRelationshipMode: () => {},
  setDemoPartnerId: () => {},
});

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OnboardingData>(defaultData);

  const setDisplayName = useCallback((name: string) => {
    setData((prev) => ({ ...prev, displayName: name }));
  }, []);

  const setStatus = useCallback((status: string) => {
    setData((prev) => ({ ...prev, relationshipStatus: status }));
  }, []);

  const setDuration = useCallback((duration: string) => {
    setData((prev) => ({ ...prev, relationshipDuration: duration }));
  }, []);

  const toggleGoal = useCallback((goalId: string) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter((g) => g !== goalId)
        : [...prev.goals, goalId],
    }));
  }, []);

  const setGoals = useCallback((goals: string[]) => {
    setData((prev) => ({ ...prev, goals }));
  }, []);

  const setTimeCommitment = useCallback((time: string) => {
    setData((prev) => ({ ...prev, timeCommitment: time }));
  }, []);

  const setRelationshipMode = useCallback((mode: RelationshipMode) => {
    setData((prev) => ({ ...prev, relationshipMode: mode }));
  }, []);

  const setDemoPartnerId = useCallback((partnerId: DemoPartnerId | null) => {
    setData((prev) => ({ ...prev, demoPartnerId: partnerId }));
  }, []);

  return (
    <OnboardingCtx.Provider
      value={{
        data,
        setDisplayName,
        setStatus,
        setDuration,
        toggleGoal,
        setGoals,
        setTimeCommitment,
        setRelationshipMode,
        setDemoPartnerId,
      }}
    >
      {children}
    </OnboardingCtx.Provider>
  );
}

export function useOnboarding() {
  return useContext(OnboardingCtx);
}
