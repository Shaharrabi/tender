/**
 * Ripple Effects — Calculate predicted impacts when a dimension shifts.
 *
 * Given a dimension change direction, walks the ASSESSMENT_CONNECTIONS graph
 * to produce a list of downstream effects with direction, strength, and insight.
 */

import {
  ASSESSMENT_CONNECTIONS,
  ASSESSMENT_LABELS,
  type AssessmentConnection,
  type ConnectionStrength,
  type ConnectionDirection,
} from '@/constants/connectionMatrix';

export interface RippleEffect {
  /** Assessment that's affected */
  targetAssessment: string;
  targetAssessmentLabel: string;
  /** Dimension that's affected */
  targetDimension: string;
  targetDimensionLabel: string;
  /** Direction of the predicted shift */
  predictedDirection: 'increase' | 'decrease';
  /** Connection strength */
  strength: ConnectionStrength;
  strengthValue: number;
  /** Human-readable insight */
  insight: string;
}

/**
 * Calculate ripple effects from a change in a specific dimension.
 *
 * @param assessment - The assessment being changed (e.g., 'ecr-r')
 * @param dimension - The dimension being changed (e.g., 'anxietyScore')
 * @param changeDirection - Whether the value is going up or down
 */
export function calculateRipples(
  assessment: string,
  dimension: string,
  changeDirection: 'increase' | 'decrease'
): RippleEffect[] {
  const effects: RippleEffect[] = [];

  for (const conn of ASSESSMENT_CONNECTIONS) {
    // Check if this connection originates from the changed dimension
    if (conn.from.assessment === assessment && conn.from.dimension === dimension) {
      const predictedDirection = getPredictedDirection(
        changeDirection,
        conn.direction
      );

      effects.push({
        targetAssessment: conn.to.assessment,
        targetAssessmentLabel:
          ASSESSMENT_LABELS[conn.to.assessment] || conn.to.assessment,
        targetDimension: conn.to.dimension,
        targetDimensionLabel: conn.to.label,
        predictedDirection,
        strength: conn.strength,
        strengthValue: conn.strengthValue,
        insight: conn.insight,
      });
    }

    // Also check reverse connections (dimension is the target)
    if (conn.to.assessment === assessment && conn.to.dimension === dimension) {
      const predictedDirection = getPredictedDirection(
        changeDirection,
        conn.direction
      );

      effects.push({
        targetAssessment: conn.from.assessment,
        targetAssessmentLabel:
          ASSESSMENT_LABELS[conn.from.assessment] || conn.from.assessment,
        targetDimension: conn.from.dimension,
        targetDimensionLabel: conn.from.label,
        predictedDirection,
        strength: conn.strength,
        strengthValue: conn.strengthValue,
        insight: conn.insight,
      });
    }
  }

  // Sort by strength (strongest first)
  effects.sort((a, b) => b.strengthValue - a.strengthValue);

  return effects;
}

/**
 * Get all unique connections for a given assessment.
 */
export function getConnectionsForAssessment(
  assessment: string
): AssessmentConnection[] {
  return ASSESSMENT_CONNECTIONS.filter(
    (c) => c.from.assessment === assessment || c.to.assessment === assessment
  );
}

/**
 * Get all assessments that connect to a given assessment.
 */
export function getConnectedAssessments(assessment: string): string[] {
  const connected = new Set<string>();

  for (const conn of ASSESSMENT_CONNECTIONS) {
    if (conn.from.assessment === assessment) {
      connected.add(conn.to.assessment);
    }
    if (conn.to.assessment === assessment) {
      connected.add(conn.from.assessment);
    }
  }

  return Array.from(connected);
}

// ─── Helpers ──────────────────────────────────────────────

function getPredictedDirection(
  sourceChange: 'increase' | 'decrease',
  connectionDirection: ConnectionDirection
): 'increase' | 'decrease' {
  // Positive connection: same direction
  // Negative connection: opposite direction
  if (connectionDirection === 'positive') {
    return sourceChange;
  }
  return sourceChange === 'increase' ? 'decrease' : 'increase';
}
