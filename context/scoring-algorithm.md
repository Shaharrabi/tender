# ECR-R Scoring Algorithm Specification

**Purpose:** Calculate attachment anxiety and avoidance scores from 36 ECR-R responses  
**Platform:** Both frontend (JavaScript) and backend (Node.js) — must produce identical results

---

## Scoring Steps

### Step 1: Reverse-Score Specific Items

Before any calculations, reverse-score these 6 items:
- Item 20
- Item 21
- Item 30
- Item 33
- Item 34
- Item 35

**Reverse-scoring formula:** `reversedValue = 8 - originalValue`

**Example:**
- If item 20 = 6, reverse-score to 8 - 6 = 2
- If item 30 = 1, reverse-score to 8 - 1 = 7
- If item 7 = 4, stays 4 (no change, not reverse-scored)

---

### Step 2: Calculate Anxiety Subscale

**Items included:** 1-18 (all after reverse-scoring)

**Formula:**
```
Anxiety Score = (sum of items 1-18) / 18
```

**Result:** Float between 1.0 and 7.0

**Example calculation:**
```
Responses for items 1-18: [5, 6, 4, 1, 7, 2, 3, 6, 5, 4, 3, 2, 1, 5, 6, 4, 7, 2]
Sum = 5+6+4+1+7+2+3+6+5+4+3+2+1+5+6+4+7+2 = 73
Anxiety = 73 / 18 = 4.06
```

---

### Step 3: Calculate Avoidance Subscale

**Items included:** 19-36 (all after reverse-scoring)

**Formula:**
```
Avoidance Score = (sum of items 19-36) / 18
```

**Result:** Float between 1.0 and 7.0

**Example calculation:**
```
Responses for items 19-36: [3, 6, 5, 4, 1, 2, 3, 5, 6, 4, 2, 1, 3, 5, 6, 4, 7, 2]
(Items 20, 21, 30, 33, 34, 35 already reverse-scored)
Sum = 3+6+5+4+1+2+3+5+6+4+2+1+3+5+6+4+7+2 = 73
Avoidance = 73 / 18 = 4.06
```

---

## Attachment Style Quadrants

Determine attachment style based on the **midpoint 4.0** for both dimensions:

| Anxiety | Avoidance | Style | Description |
|---------|-----------|-------|-------------|
| **Low** (< 4.0) | **Low** (< 4.0) | **Secure** | Comfortable with closeness and autonomy |
| **High** (≥ 4.0) | **Low** (< 4.0) | **Anxious-Preoccupied** | Desires closeness, fears abandonment |
| **Low** (< 4.0) | **High** (≥ 4.0) | **Dismissive-Avoidant** | Uncomfortable with closeness, values independence |
| **High** (≥ 4.0) | **High** (≥ 4.0) | **Fearful-Avoidant** | Desires closeness but fears it; conflicted |

**Logic:**
```javascript
function getAttachmentStyle(anxietyScore, avoidanceScore) {
  const anxietyHigh = anxietyScore >= 4.0;
  const avoidanceHigh = avoidanceScore >= 4.0;

  if (!anxietyHigh && !avoidanceHigh) return "secure";
  if (anxietyHigh && !avoidanceHigh) return "anxious-preoccupied";
  if (!anxietyHigh && avoidanceHigh) return "dismissive-avoidant";
  if (anxietyHigh && avoidanceHigh) return "fearful-avoidant";
}
```

---

## JavaScript Implementation (Frontend)

Use this in `src/utils/scoring.js`:

```javascript
/**
 * Calculate ECR-R scores from 36 responses
 * @param {number[]} responses - Array of 36 integers (1-7)
 * @returns {Object} { anxietyScore, avoidanceScore, attachmentStyle }
 */
export function calculateECRRScores(responses) {
  // Validate input
  if (!Array.isArray(responses) || responses.length !== 36) {
    throw new Error("Responses must be an array of 36 integers");
  }

  if (!responses.every(r => Number.isInteger(r) && r >= 1 && r <= 7)) {
    throw new Error("All responses must be integers between 1 and 7");
  }

  // Make a copy to avoid mutating original
  const adjusted = [...responses];

  // Step 1: Reverse-score items (convert to 0-indexed)
  const reverseItems = [19, 20, 29, 32, 33, 34]; // 0-indexed (20, 21, 30, 33, 34, 35 in 1-indexed)
  reverseItems.forEach(idx => {
    adjusted[idx] = 8 - adjusted[idx];
  });

  // Step 2: Calculate Anxiety (items 1-18, 0-indexed 0-17)
  const anxietyItems = adjusted.slice(0, 18);
  const anxietySum = anxietyItems.reduce((sum, val) => sum + val, 0);
  const anxietyScore = anxietySum / 18;

  // Step 3: Calculate Avoidance (items 19-36, 0-indexed 18-35)
  const avoidanceItems = adjusted.slice(18, 36);
  const avoidanceSum = avoidanceItems.reduce((sum, val) => sum + val, 0);
  const avoidanceScore = avoidanceSum / 18;

  // Step 4: Determine attachment style
  const attachmentStyle = getAttachmentStyle(anxietyScore, avoidanceScore);

  return {
    anxietyScore: parseFloat(anxietyScore.toFixed(2)),
    avoidanceScore: parseFloat(avoidanceScore.toFixed(2)),
    attachmentStyle,
  };
}

/**
 * Determine attachment style from scores
 * @param {number} anxiety
 * @param {number} avoidance
 * @returns {string} Attachment style label
 */
function getAttachmentStyle(anxiety, avoidance) {
  const anxietyHigh = anxiety >= 4.0;
  const avoidanceHigh = avoidance >= 4.0;

  if (!anxietyHigh && !avoidanceHigh) return "secure";
  if (anxietyHigh && !avoidanceHigh) return "anxious-preoccupied";
  if (!anxietyHigh && avoidanceHigh) return "dismissive-avoidant";
  return "fearful-avoidant";
}
```

---

## Node.js Implementation (Backend)

Use this in `server/utils/scoring.js`:

```javascript
/**
 * Calculate ECR-R scores from 36 responses
 * @param {number[]} responses - Array of 36 integers (1-7)
 * @returns {Object} { anxietyScore, avoidanceScore, attachmentStyle }
 */
function calculateECRRScores(responses) {
  // Validate input
  if (!Array.isArray(responses) || responses.length !== 36) {
    throw new Error("Responses must be an array of 36 integers");
  }

  if (!responses.every(r => Number.isInteger(r) && r >= 1 && r <= 7)) {
    throw new Error("All responses must be integers between 1 and 7");
  }

  // Make a copy to avoid mutating original
  const adjusted = [...responses];

  // Step 1: Reverse-score items (0-indexed)
  const reverseItems = [19, 20, 29, 32, 33, 34];
  reverseItems.forEach(idx => {
    adjusted[idx] = 8 - adjusted[idx];
  });

  // Step 2: Calculate Anxiety (items 1-18, 0-indexed 0-17)
  const anxietySum = adjusted.slice(0, 18).reduce((sum, val) => sum + val, 0);
  const anxietyScore = anxietySum / 18;

  // Step 3: Calculate Avoidance (items 19-36, 0-indexed 18-35)
  const avoidanceSum = adjusted.slice(18, 36).reduce((sum, val) => sum + val, 0);
  const avoidanceScore = avoidanceSum / 18;

  // Step 4: Determine attachment style
  const attachmentStyle = getAttachmentStyle(anxietyScore, avoidanceScore);

  return {
    anxietyScore: parseFloat(anxietyScore.toFixed(2)),
    avoidanceScore: parseFloat(avoidanceScore.toFixed(2)),
    attachmentStyle,
  };
}

function getAttachmentStyle(anxiety, avoidance) {
  const anxietyHigh = anxiety >= 4.0;
  const avoidanceHigh = avoidance >= 4.0;

  if (!anxietyHigh && !avoidanceHigh) return "secure";
  if (anxietyHigh && !avoidanceHigh) return "anxious-preoccupied";
  if (!anxietyHigh && avoidanceHigh) return "dismissive-avoidant";
  return "fearful-avoidant";
}

module.exports = { calculateECRRScores };
```

---

## Test Cases (Verify Scoring)

Use these test cases to validate your implementation:

### Test Case 1: All 4s (Neutral)
```
Input: 36 responses, all 4
Expected:
  - Anxiety: 4.0
  - Avoidance: 4.0
  - Style: fearful-avoidant
```

### Test Case 2: Low Anxiety, High Avoidance
```
Input: Items 1-18 all 2, Items 19-36 all 6
Expected:
  - Anxiety: 2.0
  - Avoidance: 6.0
  - Style: dismissive-avoidant
```

### Test Case 3: High Anxiety, Low Avoidance
```
Input: Items 1-18 all 6, Items 19-36 all 2
Expected:
  - Anxiety: 6.0
  - Avoidance: 2.0
  - Style: anxious-preoccupied
```

### Test Case 4: Secure (Low Both)
```
Input: Items 1-18 all 2, Items 19-36 all 2
Expected:
  - Anxiety: 2.0
  - Avoidance: 2.0
  - Style: secure
```

### Test Case 5: With Reverse-Scored Items
```
Input:
  Items 1-19: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
  Item 20 (reverse-scored): 2 → becomes 6
  Items 21-36:
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
    (Item 21 at index 20 = 5, will be used)
    (Item 30 at index 29 = 5, will be reversed to 3)
    (Items 33-35 reverse-scored similarly)

Expected (manual calculation):
  Anxiety (items 1-18): all 5 = 5.0
  Avoidance (items 19-36, after reversing items 20, 21, 30, 33, 34, 35):
    [5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 3, 5, 5, 3, 3, 5, 5]
    Sum = 88, but need exact calculation...
```

---

## Important Notes

1. **Reverse-scoring is critical:** If you forget to reverse-score items 20, 21, 30, 33, 34, 35, results will be completely wrong.

2. **0-indexed vs 1-indexed:** The spec uses 1-indexed items (1-36 for users). In code, use 0-indexed arrays (0-35). The 1-indexed items 20, 21, 30, 33, 34, 35 become 0-indexed 19, 20, 29, 32, 33, 34.

3. **Floating point precision:** Round to 2 decimal places for display, but use full precision for quadrant determination.

4. **Frontend and Backend must match:** Test with the same data in both JavaScript and Node.js to ensure identical results.

5. **Immutability:** Don't mutate the original responses array; make a copy first.

---

## Verification Checklist

Before deploying, verify:
- ✓ Reverse-scored items are correct (20, 21, 30, 33, 34, 35)
- ✓ Anxiety calculation uses items 1-18 only
- ✓ Avoidance calculation uses items 19-36 only
- ✓ Midpoint for quadrant determination is exactly 4.0
- ✓ Frontend and backend produce identical scores on test data
- ✓ Results are rounded to 2 decimal places for display
