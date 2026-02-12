import { VALUE_DOMAINS } from '@/utils/assessments/configs/values';

export function getGapLabel(gap: number): string {
  if (gap <= 1) return 'Well-aligned';
  if (gap <= 3) return 'Moderate gap';
  if (gap <= 5) return 'Significant gap';
  return 'Major gap';
}

export function getGapColor(gap: number): string {
  if (gap <= 1) return '#10B981';
  if (gap <= 3) return '#F59E0B';
  if (gap <= 5) return '#EF4444';
  return '#DC2626';
}

export function getAvoidanceLabel(score: number): string {
  if (score <= 0.12) return 'Low avoidance';
  if (score <= 0.25) return 'Mild avoidance';
  if (score <= 0.37) return 'Moderate avoidance';
  if (score <= 0.50) return 'Elevated avoidance';
  return 'High avoidance';
}

export function getDomainLabel(domainId: string): string {
  const domain = VALUE_DOMAINS.find((d) => d.id === domainId);
  return domain?.label || domainId;
}
