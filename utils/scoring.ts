import { AttachmentStyle, ECRRScores } from '@/types';

/**
 * Reverse-scored item indices (0-indexed).
 * 1-indexed items 20, 21, 30, 33, 34, 35 → 0-indexed 19, 20, 29, 32, 33, 34
 */
const REVERSE_ITEMS_0_INDEXED = [19, 20, 29, 32, 33, 34];

/**
 * Calculate ECR-R scores from 36 responses.
 *
 * @param responses Array of 36 integers (1-7)
 * @returns { anxietyScore, avoidanceScore, attachmentStyle }
 */
export function calculateECRRScores(responses: number[]): ECRRScores {
  if (responses.length !== 36) {
    throw new Error('Responses must be an array of 36 integers');
  }
  if (!responses.every(r => Number.isInteger(r) && r >= 1 && r <= 7)) {
    throw new Error('All responses must be integers between 1 and 7');
  }

  // Copy to avoid mutation
  const adjusted = [...responses];

  // Step 1: Reverse-score specific items
  for (const idx of REVERSE_ITEMS_0_INDEXED) {
    adjusted[idx] = 8 - adjusted[idx];
  }

  // Step 2: Anxiety = mean of items 1-18 (indices 0-17)
  const anxietySum = adjusted.slice(0, 18).reduce((sum, val) => sum + val, 0);
  const anxietyScore = parseFloat((anxietySum / 18).toFixed(2));

  // Step 3: Avoidance = mean of items 19-36 (indices 18-35)
  const avoidanceSum = adjusted.slice(18, 36).reduce((sum, val) => sum + val, 0);
  const avoidanceScore = parseFloat((avoidanceSum / 18).toFixed(2));

  // Step 4: Determine quadrant
  const attachmentStyle = getAttachmentStyle(anxietyScore, avoidanceScore);

  return { anxietyScore, avoidanceScore, attachmentStyle };
}

function getAttachmentStyle(anxiety: number, avoidance: number): AttachmentStyle {
  const anxietyHigh = anxiety >= 4.0;
  const avoidanceHigh = avoidance >= 4.0;

  if (!anxietyHigh && !avoidanceHigh) return 'secure';
  if (anxietyHigh && !avoidanceHigh) return 'anxious-preoccupied';
  if (!anxietyHigh && avoidanceHigh) return 'dismissive-avoidant';
  return 'fearful-avoidant';
}
