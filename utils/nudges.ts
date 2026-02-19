/**
 * @deprecated Use @/utils/insights instead. This file re-exports for backward compatibility.
 */
export {
  type InsightType as NudgeType,
  type Insight as Nudge,
  WEARE_BOTTLENECK_INSIGHTS as WEARE_BOTTLENECK_NUDGES,
  getInsights as getNudges,
} from './insights';

export * from './insights';
