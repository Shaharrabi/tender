# Assessment Instruments: Technical Specification
## Couples Relationship App - Phase 1 Assessment Battery

**Purpose:** Complete technical specification for Claude Code implementation  
**Version:** 1.1 (Complete - All Items Included)

---

# TABLE OF CONTENTS

1. [ECR-R: Attachment](#1-ecr-r-experiences-in-close-relationships-revised)
2. [IPIP-NEO-120: Personality](#2-ipip-neo-120-personality)
3. [Custom Values Instrument](#3-custom-values-instrument)
4. [SSEIT: Emotional Intelligence](#4-sseit-schutte-self-report-emotional-intelligence-test)
5. [DUTCH: Conflict Style](#5-dutch-conflict-style)
6. [DSI-R: Differentiation of Self](#6-dsi-r-differentiation-of-self-inventory-revised)
7. [Data Schema Summary](#7-data-schema-summary)
8. [Administration Sequence](#8-administration-sequence)

---

# 1. ECR-R: Experiences in Close Relationships - Revised

## Overview

- **Purpose:** Measure adult attachment along two dimensions
- **Items:** 36
- **Subscales:** Attachment Anxiety (18 items), Attachment Avoidance (18 items)
- **Source:** Fraley, Waller, & Brennan (2000) - Public domain
- **Time:** ~8-10 minutes

## Response Scale

7-point Likert scale:
```
1 = Strongly Disagree
2 = Disagree
3 = Slightly Disagree
4 = Neutral/Mixed
5 = Slightly Agree
6 = Agree
7 = Strongly Agree
```

## Instructions

"The following statements concern how you feel in emotionally intimate relationships. We are interested in how you generally experience relationships, not just in what is happening in a current relationship. Respond to each statement by indicating how much you agree or disagree with it."

## Items

### Attachment Anxiety Subscale (18 items)

| Item # | Text | Reverse |
|--------|------|---------|
| 1 | I'm afraid that I will lose my partner's love. | No |
| 2 | I often worry that my partner will not want to stay with me. | No |
| 3 | I often worry that my partner doesn't really love me. | No |
| 4 | I worry that romantic partners won't care about me as much as I care about them. | No |
| 5 | I often wish that my partner's feelings for me were as strong as my feelings for him or her. | No |
| 6 | I worry a lot about my relationships. | No |
| 7 | When my partner is out of sight, I worry that he or she might become interested in someone else. | No |
| 8 | When I show my feelings for romantic partners, I'm afraid they will not feel the same about me. | No |
| 9 | I rarely worry about my partner leaving me. | Yes |
| 10 | My romantic partner makes me doubt myself. | No |
| 11 | I do not often worry about being abandoned. | Yes |
| 12 | I find that my partner(s) don't want to get as close as I would like. | No |
| 13 | Sometimes romantic partners change their feelings about me for no apparent reason. | No |
| 14 | My desire to be very close sometimes scares people away. | No |
| 15 | I'm afraid that once a romantic partner gets to know me, he or she won't like who I really am. | No |
| 16 | It makes me mad that I don't get the affection and support I need from my partner. | No |
| 17 | I worry that I won't measure up to other people. | No |
| 18 | My partner only seems to notice me when I'm angry. | No |

### Attachment Avoidance Subscale (18 items)

| Item # | Text | Reverse |
|--------|------|---------|
| 19 | I prefer not to show a partner how I feel deep down. | No |
| 20 | I feel comfortable sharing my private thoughts and feelings with my partner. | Yes |
| 21 | I find it difficult to allow myself to depend on romantic partners. | No |
| 22 | I am very comfortable being close to romantic partners. | Yes |
| 23 | I don't feel comfortable opening up to romantic partners. | No |
| 24 | I prefer not to be too close to romantic partners. | No |
| 25 | I get uncomfortable when a romantic partner wants to be very close. | No |
| 26 | I find it relatively easy to get close to my partner. | Yes |
| 27 | It's not difficult for me to get close to my partner. | Yes |
| 28 | I usually discuss my problems and concerns with my partner. | Yes |
| 29 | It helps to turn to my romantic partner in times of need. | Yes |
| 30 | I tell my partner just about everything. | Yes |
| 31 | I talk things over with my partner. | Yes |
| 32 | I am nervous when partners get too close to me. | No |
| 33 | I feel comfortable depending on romantic partners. | Yes |
| 34 | I find it easy to depend on romantic partners. | Yes |
| 35 | It's easy for me to be affectionate with my partner. | Yes |
| 36 | My partner really understands me and my needs. | Yes |

## Scoring Algorithm

```javascript
function scoreECRR(responses) {
  // responses = array of 36 integers (1-7)
  
  // Define item indices (0-based)
  const anxietyItems = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
  const avoidanceItems = [18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35];
  
  // Reverse-scored items (0-based indices)
  const reverseItems = [8, 10, 19, 21, 25, 26, 27, 28, 29, 30, 32, 33, 34, 35];
  
  // Reverse score function
  function reverseScore(score) {
    return 8 - score; // 1->7, 2->6, 3->5, 4->4, 5->3, 6->2, 7->1
  }
  
  // Apply reverse scoring
  const scoredResponses = responses.map((r, i) => 
    reverseItems.includes(i) ? reverseScore(r) : r
  );
  
  // Calculate subscale means
  const anxietySum = anxietyItems.reduce((sum, i) => sum + scoredResponses[i], 0);
  const avoidanceSum = avoidanceItems.reduce((sum, i) => sum + scoredResponses[i], 0);
  
  const anxietyScore = anxietySum / 18;
  const avoidanceScore = avoidanceSum / 18;
  
  // Determine attachment style quadrant
  const anxietyCutoff = 3.5;
  const avoidanceCutoff = 3.5;
  
  let attachmentStyle;
  if (anxietyScore <= anxietyCutoff && avoidanceScore <= avoidanceCutoff) {
    attachmentStyle = "secure";
  } else if (anxietyScore > anxietyCutoff && avoidanceScore <= avoidanceCutoff) {
    attachmentStyle = "anxious-preoccupied";
  } else if (anxietyScore <= anxietyCutoff && avoidanceScore > avoidanceCutoff) {
    attachmentStyle = "dismissive-avoidant";
  } else {
    attachmentStyle = "fearful-avoidant";
  }
  
  return {
    anxietyScore: Math.round(anxietyScore * 100) / 100,
    avoidanceScore: Math.round(avoidanceScore * 100) / 100,
    attachmentStyle: attachmentStyle,
    rawResponses: responses
  };
}
```

## Interpretation Thresholds

| Score Range | Anxiety Level | Avoidance Level |
|-------------|---------------|-----------------|
| 1.0 - 2.0 | Very Low | Very Low |
| 2.0 - 3.0 | Low | Low |
| 3.0 - 4.0 | Moderate | Moderate |
| 4.0 - 5.0 | Elevated | Elevated |
| 5.0 - 6.0 | High | High |
| 6.0 - 7.0 | Very High | Very High |

## Quadrant Descriptions

| Style | Pattern | Key Characteristics |
|-------|---------|---------------------|
| **Secure** | Low Anxiety, Low Avoidance | Comfortable with intimacy; trusts partner availability; direct communication of needs |
| **Anxious-Preoccupied** | High Anxiety, Low Avoidance | Fears abandonment; seeks reassurance; hypervigilant to rejection cues; pursues connection |
| **Dismissive-Avoidant** | Low Anxiety, High Avoidance | Discomfort with closeness; values independence; minimizes attachment needs; withdraws |
| **Fearful-Avoidant** | High Anxiety, High Avoidance | Wants closeness but fears it; approach-avoidance pattern; disorganized strategies |

---

# 2. IPIP-NEO-120: Personality

## Overview

- **Purpose:** Measure Big Five personality domains and 30 facets
- **Items:** 120
- **Domains:** 5 (24 items each)
- **Facets:** 30 (4 items each)
- **Source:** Johnson (2014) IPIP-NEO-120 - Public domain
- **Citation:** Johnson, J. A. (2014). Measuring thirty facets of the Five Factor Model with a 120-item public domain inventory: Development of the IPIP-NEO-120. Journal of Research in Personality, 51, 78-89.
- **Time:** ~20-25 minutes

## Response Scale

5-point Likert scale:
```
1 = Very Inaccurate
2 = Moderately Inaccurate
3 = Neither Accurate Nor Inaccurate
4 = Moderately Accurate
5 = Very Accurate
```

## Instructions

"Describe yourself as you generally are now, not as you wish to be in the future. Describe yourself as you honestly see yourself, in relation to other people you know of the same sex as you are, and roughly your same age. Indicate how accurately each statement describes you."

## Complete Item List (120 Items)

### NEUROTICISM (24 items)

**N1: Anxiety (α = .78)**

| Item # | Text | Key |
|--------|------|-----|
| 1 | Worry about things. | + |
| 2 | Fear for the worst. | + |
| 3 | Am afraid of many things. | + |
| 4 | Get stressed out easily. | + |

**N2: Anger (α = .87)**

| Item # | Text | Key |
|--------|------|-----|
| 5 | Get angry easily. | + |
| 6 | Get irritated easily. | + |
| 7 | Lose my temper. | + |
| 8 | Am not easily annoyed. | − |

**N3: Depression (α = .85)**

| Item # | Text | Key |
|--------|------|-----|
| 9 | Often feel blue. | + |
| 10 | Dislike myself. | + |
| 11 | Am often down in the dumps. | + |
| 12 | Feel comfortable with myself. | − |

**N4: Self-Consciousness (α = .70)**

| Item # | Text | Key |
|--------|------|-----|
| 13 | Find it difficult to approach others. | + |
| 14 | Am afraid to draw attention to myself. | + |
| 15 | Only feel comfortable with friends. | + |
| 16 | Am not bothered by difficult social situations. | − |

**N5: Immoderation (α = .69)**

| Item # | Text | Key |
|--------|------|-----|
| 17 | Go on binges. | + |
| 18 | Rarely overindulge. | − |
| 19 | Easily resist temptations. | − |
| 20 | Am able to control my cravings. | − |

**N6: Vulnerability (α = .76)**

| Item # | Text | Key |
|--------|------|-----|
| 21 | Panic easily. | + |
| 22 | Become overwhelmed by events. | + |
| 23 | Feel that I'm unable to deal with things. | + |
| 24 | Remain calm under pressure. | − |

### EXTRAVERSION (24 items)

**E1: Friendliness (α = .81)**

| Item # | Text | Key |
|--------|------|-----|
| 25 | Make friends easily. | + |
| 26 | Feel comfortable around people. | + |
| 27 | Avoid contacts with others. | − |
| 28 | Keep others at a distance. | − |

**E2: Gregariousness (α = .79)**

| Item # | Text | Key |
|--------|------|-----|
| 29 | Love large parties. | + |
| 30 | Talk to a lot of different people at parties. | + |
| 31 | Prefer to be alone. | − |
| 32 | Avoid crowds. | − |

**E3: Assertiveness (α = .85)**

| Item # | Text | Key |
|--------|------|-----|
| 33 | Take charge. | + |
| 34 | Try to lead others. | + |
| 35 | Take control of things. | + |
| 36 | Wait for others to lead the way. | − |

**E4: Activity Level (α = .69)**

| Item # | Text | Key |
|--------|------|-----|
| 37 | Am always busy. | + |
| 38 | Am always on the go. | + |
| 39 | Do a lot in my spare time. | + |
| 40 | Like to take it easy. | − |

**E5: Excitement-Seeking (α = .73)**

| Item # | Text | Key |
|--------|------|-----|
| 41 | Love excitement. | + |
| 42 | Seek adventure. | + |
| 43 | Enjoy being reckless. | + |
| 44 | Act wild and crazy. | + |

**E6: Cheerfulness (α = .79)**

| Item # | Text | Key |
|--------|------|-----|
| 45 | Radiate joy. | + |
| 46 | Have a lot of fun. | + |
| 47 | Love life. | + |
| 48 | Look at the bright side of life. | + |

### OPENNESS TO EXPERIENCE (24 items)

**O1: Imagination (α = .74)**

| Item # | Text | Key |
|--------|------|-----|
| 49 | Have a vivid imagination. | + |
| 50 | Enjoy wild flights of fantasy. | + |
| 51 | Love to daydream. | + |
| 52 | Like to get lost in thought. | + |

**O2: Artistic Interests (α = .74)**

| Item # | Text | Key |
|--------|------|-----|
| 53 | Believe in the importance of art. | + |
| 54 | See beauty in things that others might not notice. | + |
| 55 | Do not like poetry. | − |
| 56 | Do not enjoy going to art museums. | − |

**O3: Emotionality (α = .65)**

| Item # | Text | Key |
|--------|------|-----|
| 57 | Experience my emotions intensely. | + |
| 58 | Feel others' emotions. | + |
| 59 | Rarely notice my emotional reactions. | − |
| 60 | Don't understand people who get emotional. | − |

**O4: Adventurousness (α = .70)**

| Item # | Text | Key |
|--------|------|-----|
| 61 | Prefer variety to routine. | + |
| 62 | Prefer to stick with things that I know. | − |
| 63 | Dislike changes. | − |
| 64 | Am attached to conventional ways. | − |

**O5: Intellect (α = .73)**

| Item # | Text | Key |
|--------|------|-----|
| 65 | Love to read challenging material. | + |
| 66 | Avoid philosophical discussions. | − |
| 67 | Have difficulty understanding abstract ideas. | − |
| 68 | Am not interested in theoretical discussions. | − |

**O6: Liberalism (α = .63)**

| Item # | Text | Key |
|--------|------|-----|
| 69 | Tend to vote for liberal political candidates. | + |
| 70 | Believe that there is no absolute right and wrong. | + |
| 71 | Tend to vote for conservative political candidates. | − |
| 72 | Believe that we should be tough on crime. | − |

### AGREEABLENESS (24 items)

**A1: Trust (α = .85)**

| Item # | Text | Key |
|--------|------|-----|
| 73 | Trust others. | + |
| 74 | Believe that others have good intentions. | + |
| 75 | Trust what people say. | + |
| 76 | Distrust people. | − |

**A2: Morality (α = .74)**

| Item # | Text | Key |
|--------|------|-----|
| 77 | Use others for my own ends. | − |
| 78 | Cheat to get ahead. | − |
| 79 | Take advantage of others. | − |
| 80 | Obstruct others' plans. | − |

**A3: Altruism (α = .73)**

| Item # | Text | Key |
|--------|------|-----|
| 81 | Am concerned about others. | + |
| 82 | Love to help others. | + |
| 83 | Am indifferent to the feelings of others. | − |
| 84 | Take no time for others. | − |

**A4: Cooperation (α = .71)**

| Item # | Text | Key |
|--------|------|-----|
| 85 | Love a good fight. | − |
| 86 | Yell at people. | − |
| 87 | Insult people. | − |
| 88 | Get back at others. | − |

**A5: Modesty (α = .73)**

| Item # | Text | Key |
|--------|------|-----|
| 89 | Believe that I am better than others. | − |
| 90 | Think highly of myself. | − |
| 91 | Have a high opinion of myself. | − |
| 92 | Boast about my virtues. | − |

**A6: Sympathy (α = .72)**

| Item # | Text | Key |
|--------|------|-----|
| 93 | Sympathize with the homeless. | + |
| 94 | Feel sympathy for those who are worse off than myself. | + |
| 95 | Am not interested in other people's problems. | − |
| 96 | Try not to think about the needy. | − |

### CONSCIENTIOUSNESS (24 items)

**C1: Self-Efficacy (α = .77)**

| Item # | Text | Key |
|--------|------|-----|
| 97 | Complete tasks successfully. | + |
| 98 | Excel in what I do. | + |
| 99 | Handle tasks smoothly. | + |
| 100 | Know how to get things done. | + |

**C2: Orderliness (α = .83)**

| Item # | Text | Key |
|--------|------|-----|
| 101 | Like to tidy up. | + |
| 102 | Often forget to put things back in their proper place. | − |
| 103 | Leave a mess in my room. | − |
| 104 | Leave my belongings around. | − |

**C3: Dutifulness (α = .67)**

| Item # | Text | Key |
|--------|------|-----|
| 105 | Keep my promises. | + |
| 106 | Tell the truth. | + |
| 107 | Break rules. | − |
| 108 | Break my promises. | − |

**C4: Achievement-Striving (α = .79)**

| Item # | Text | Key |
|--------|------|-----|
| 109 | Do more than what's expected of me. | + |
| 110 | Work hard. | + |
| 111 | Put little time and effort into my work. | − |
| 112 | Do just enough work to get by. | − |

**C5: Self-Discipline (α = .71)**

| Item # | Text | Key |
|--------|------|-----|
| 113 | Am always prepared. | + |
| 114 | Carry out my plans. | + |
| 115 | Waste my time. | − |
| 116 | Have difficulty starting tasks. | − |

**C6: Cautiousness (α = .88)**

| Item # | Text | Key |
|--------|------|-----|
| 117 | Jump into things without thinking. | − |
| 118 | Make rash decisions. | − |
| 119 | Rush into things. | − |
| 120 | Act without thinking. | − |

## Scoring Algorithm

```javascript
function scoreIPIPNEO120(responses) {
  // responses = array of 120 integers (1-5)
  // Items are numbered 1-120, array is 0-indexed
  
  // Reverse score function
  function reverseScore(score) {
    return 6 - score; // 1->5, 2->4, 3->3, 4->2, 5->1
  }
  
  // Negatively keyed items (0-based indices)
  // These are all items marked with "−" in the item list
  const negativeItems = [
    7,    // N2-4: Am not easily annoyed
    11,   // N3-4: Feel comfortable with myself
    15,   // N4-4: Am not bothered by difficult social situations
    17, 18, 19, // N5-2,3,4: Rarely overindulge, Easily resist temptations, Am able to control my cravings
    23,   // N6-4: Remain calm under pressure
    26, 27, // E1-3,4: Avoid contacts with others, Keep others at a distance
    30, 31, // E2-3,4: Prefer to be alone, Avoid crowds
    35,   // E3-4: Wait for others to lead the way
    39,   // E4-4: Like to take it easy
    54, 55, // O2-3,4: Do not like poetry, Do not enjoy going to art museums
    58, 59, // O3-3,4: Rarely notice my emotional reactions, Don't understand people who get emotional
    61, 62, 63, // O4-2,3,4: Prefer to stick with things that I know, Dislike changes, Am attached to conventional ways
    65, 66, 67, // O5-2,3,4: Avoid philosophical discussions, Have difficulty understanding abstract ideas, Am not interested in theoretical discussions
    70, 71, // O6-3,4: Tend to vote for conservative political candidates, Believe that we should be tough on crime
    75,   // A1-4: Distrust people
    76, 77, 78, 79, // A2-1,2,3,4: All negative
    82, 83, // A3-3,4: Am indifferent to the feelings of others, Take no time for others
    84, 85, 86, 87, // A4-1,2,3,4: All negative
    88, 89, 90, 91, // A5-1,2,3,4: All negative
    94, 95, // A6-3,4: Am not interested in other people's problems, Try not to think about the needy
    101, 102, 103, // C2-2,3,4: Often forget to put things back, Leave a mess, Leave my belongings around
    106, 107, // C3-3,4: Break rules, Break my promises
    110, 111, // C4-3,4: Put little time and effort into my work, Do just enough work to get by
    114, 115, // C5-3,4: Waste my time, Have difficulty starting tasks
    116, 117, 118, 119 // C6-1,2,3,4: All negative
  ];
  
  // Apply reverse scoring
  const scoredResponses = responses.map((r, i) => 
    negativeItems.includes(i) ? reverseScore(r) : r
  );
  
  // Define facet structure (0-based indices)
  const facets = {
    // Neuroticism
    N1_Anxiety: [0, 1, 2, 3],
    N2_Anger: [4, 5, 6, 7],
    N3_Depression: [8, 9, 10, 11],
    N4_SelfConsciousness: [12, 13, 14, 15],
    N5_Immoderation: [16, 17, 18, 19],
    N6_Vulnerability: [20, 21, 22, 23],
    // Extraversion
    E1_Friendliness: [24, 25, 26, 27],
    E2_Gregariousness: [28, 29, 30, 31],
    E3_Assertiveness: [32, 33, 34, 35],
    E4_ActivityLevel: [36, 37, 38, 39],
    E5_ExcitementSeeking: [40, 41, 42, 43],
    E6_Cheerfulness: [44, 45, 46, 47],
    // Openness
    O1_Imagination: [48, 49, 50, 51],
    O2_ArtisticInterests: [52, 53, 54, 55],
    O3_Emotionality: [56, 57, 58, 59],
    O4_Adventurousness: [60, 61, 62, 63],
    O5_Intellect: [64, 65, 66, 67],
    O6_Liberalism: [68, 69, 70, 71],
    // Agreeableness
    A1_Trust: [72, 73, 74, 75],
    A2_Morality: [76, 77, 78, 79],
    A3_Altruism: [80, 81, 82, 83],
    A4_Cooperation: [84, 85, 86, 87],
    A5_Modesty: [88, 89, 90, 91],
    A6_Sympathy: [92, 93, 94, 95],
    // Conscientiousness
    C1_SelfEfficacy: [96, 97, 98, 99],
    C2_Orderliness: [100, 101, 102, 103],
    C3_Dutifulness: [104, 105, 106, 107],
    C4_AchievementStriving: [108, 109, 110, 111],
    C5_SelfDiscipline: [112, 113, 114, 115],
    C6_Cautiousness: [116, 117, 118, 119]
  };
  
  // Calculate facet scores (sum of 4 items, range 4-20)
  const facetScores = {};
  for (const [facet, items] of Object.entries(facets)) {
    const sum = items.reduce((s, i) => s + scoredResponses[i], 0);
    facetScores[facet] = {
      sum: sum,
      mean: Math.round((sum / 4) * 100) / 100
    };
  }
  
  // Calculate domain scores (sum of 24 items, range 24-120)
  const domains = {
    Neuroticism: ['N1_Anxiety', 'N2_Anger', 'N3_Depression', 'N4_SelfConsciousness', 'N5_Immoderation', 'N6_Vulnerability'],
    Extraversion: ['E1_Friendliness', 'E2_Gregariousness', 'E3_Assertiveness', 'E4_ActivityLevel', 'E5_ExcitementSeeking', 'E6_Cheerfulness'],
    Openness: ['O1_Imagination', 'O2_ArtisticInterests', 'O3_Emotionality', 'O4_Adventurousness', 'O5_Intellect', 'O6_Liberalism'],
    Agreeableness: ['A1_Trust', 'A2_Morality', 'A3_Altruism', 'A4_Cooperation', 'A5_Modesty', 'A6_Sympathy'],
    Conscientiousness: ['C1_SelfEfficacy', 'C2_Orderliness', 'C3_Dutifulness', 'C4_AchievementStriving', 'C5_SelfDiscipline', 'C6_Cautiousness']
  };
  
  const domainScores = {};
  for (const [domain, facetNames] of Object.entries(domains)) {
    const sum = facetNames.reduce((s, f) => s + facetScores[f].sum, 0);
    domainScores[domain] = {
      sum: sum,
      mean: Math.round((sum / 24) * 100) / 100
    };
  }
  
  // Convert to percentiles (approximate, based on normal distribution)
  // For production, use actual normative data from Johnson (2014)
  function toPercentile(sum, min, max) {
    const range = max - min;
    const midpoint = min + (range / 2);
    const sd = range / 6; // Approximate
    const z = (sum - midpoint) / sd;
    // Convert z to percentile using normal CDF approximation
    const percentile = Math.round((1 / (1 + Math.exp(-1.7 * z))) * 100);
    return Math.max(1, Math.min(99, percentile));
  }
  
  const domainPercentiles = {};
  for (const [domain, scores] of Object.entries(domainScores)) {
    domainPercentiles[domain] = toPercentile(scores.sum, 24, 120);
  }
  
  const facetPercentiles = {};
  for (const [facet, scores] of Object.entries(facetScores)) {
    facetPercentiles[facet] = toPercentile(scores.sum, 4, 20);
  }
  
  return {
    domainScores: domainScores,
    domainPercentiles: domainPercentiles,
    facetScores: facetScores,
    facetPercentiles: facetPercentiles,
    rawResponses: responses
  };
}
```

## Interpretation Thresholds

### Domain Level

| Percentile | Interpretation |
|------------|----------------|
| 1-10 | Very Low |
| 11-25 | Low |
| 26-40 | Below Average |
| 41-60 | Average |
| 61-75 | Above Average |
| 76-90 | High |
| 91-99 | Very High |

### Domain Descriptions

| Domain | Low Score | High Score |
|--------|-----------|------------|
| **Neuroticism** | Emotionally stable, calm, resilient | Prone to negative emotions, reactive, sensitive to stress |
| **Extraversion** | Reserved, independent, prefers solitude | Sociable, energetic, seeks stimulation |
| **Openness** | Practical, conventional, prefers routine | Curious, creative, open to new experiences |
| **Agreeableness** | Competitive, skeptical, direct | Cooperative, trusting, helpful |
| **Conscientiousness** | Flexible, spontaneous, relaxed about standards | Organized, disciplined, achievement-oriented |

---

# 3. Custom Values Instrument

## Overview

- **Purpose:** Identify core values, relationship-specific values, values-action gaps
- **Items:** 29 quantitative + 3 open responses
- **Parts:** 3 (Domain Assessment, Relationship Clarification, Values in Action)
- **Source:** Custom design based on ACT principles
- **Time:** ~12-15 minutes

## Part 1: Value Domain Assessment

### Instructions

"The following questions ask about what matters most to you in your life and relationships. There are no right or wrong answers - this is about understanding your personal values."

### Value Domains (10)

| # | Domain | Description |
|---|--------|-------------|
| 1 | Intimacy & Connection | Emotional closeness, vulnerability, being deeply known and knowing your partner |
| 2 | Honesty & Authenticity | Truthfulness, being genuine, transparency, saying what you really think and feel |
| 3 | Growth & Learning | Personal development, curiosity, evolving together, becoming better people |
| 4 | Security & Stability | Safety, predictability, reliability, commitment, knowing you can count on each other |
| 5 | Adventure & Novelty | New experiences, spontaneity, excitement, trying new things together |
| 6 | Independence & Autonomy | Personal space, self-direction, maintaining your individual identity |
| 7 | Family & Legacy | Children, extended family connections, creating something lasting together |
| 8 | Service & Contribution | Giving back, helping others, making a difference in the world together |
| 9 | Playfulness & Humor | Fun, lightness, laughter, not taking things too seriously |
| 10 | Spirituality & Meaning | Transcendence, purpose, connection to something larger than yourselves |

### Response Scale for Importance (1-10)

```
1 = Not at all important
2 = Slightly important
3 = Somewhat important
4 = Moderately important
5 = Important
6 = Very important
7 = Quite important
8 = Highly important
9 = Extremely important
10 = Absolutely central to my life
```

### Response Scale for Living in Accordance (1-10)

```
1 = Not at all
2 = Very little
3 = A little
4 = Somewhat
5 = Moderately
6 = Fairly well
7 = Well
8 = Very well
9 = Extremely well
10 = Completely/Fully
```

### Items (20 scaled)

| Item # | Domain | Question Type | Text |
|--------|--------|---------------|------|
| 1 | Intimacy & Connection | Importance | How important is Intimacy & Connection to you in your life and relationships? |
| 2 | Intimacy & Connection | Accordance | How fully are you currently living this value in your relationship? |
| 3 | Honesty & Authenticity | Importance | How important is Honesty & Authenticity to you in your life and relationships? |
| 4 | Honesty & Authenticity | Accordance | How fully are you currently living this value in your relationship? |
| 5 | Growth & Learning | Importance | How important is Growth & Learning to you in your life and relationships? |
| 6 | Growth & Learning | Accordance | How fully are you currently living this value in your relationship? |
| 7 | Security & Stability | Importance | How important is Security & Stability to you in your life and relationships? |
| 8 | Security & Stability | Accordance | How fully are you currently living this value in your relationship? |
| 9 | Adventure & Novelty | Importance | How important is Adventure & Novelty to you in your life and relationships? |
| 10 | Adventure & Novelty | Accordance | How fully are you currently living this value in your relationship? |
| 11 | Independence & Autonomy | Importance | How important is Independence & Autonomy to you in your life and relationships? |
| 12 | Independence & Autonomy | Accordance | How fully are you currently living this value in your relationship? |
| 13 | Family & Legacy | Importance | How important is Family & Legacy to you in your life and relationships? |
| 14 | Family & Legacy | Accordance | How fully are you currently living this value in your relationship? |
| 15 | Service & Contribution | Importance | How important is Service & Contribution to you in your life and relationships? |
| 16 | Service & Contribution | Accordance | How fully are you currently living this value in your relationship? |
| 17 | Playfulness & Humor | Importance | How important is Playfulness & Humor to you in your life and relationships? |
| 18 | Playfulness & Humor | Accordance | How fully are you currently living this value in your relationship? |
| 19 | Spirituality & Meaning | Importance | How important is Spirituality & Meaning to you in your life and relationships? |
| 20 | Spirituality & Meaning | Accordance | How fully are you currently living this value in your relationship? |

### Ranking Exercise

**Instructions:** "Of these 10 value domains, please rank your top 5 in order of importance to who you want to be as a partner. Drag to reorder, with most important at top."

**Input:** User drags/reorders to select and rank 5 domains  
**Output:** Ordered array of 5 domain IDs

---

## Part 2: Relationship Values Clarification

### Instructions

"Please respond to each prompt in 2-4 sentences. There are no right answers - we're interested in your authentic perspective."

### Items (3 open responses)

| Item # | Prompt | Character Limit |
|--------|--------|-----------------|
| 21 | What kind of partner do you most want to be? Describe the qualities you want to embody in your relationship. | 500 |
| 22 | What matters so much to you that you wouldn't compromise on it in a relationship? | 500 |
| 23 | Imagine your relationship at its best, five years from now. What does it look like? What are you doing together? How do you treat each other? | 750 |

---

## Part 3: Values in Action

### Instructions

"The following scenarios describe common relationship situations. For each one, choose the response that best describes what you would typically do - not what you think you should do, but what you actually tend to do."

### Items (8 scenarios)

**Item 24: Honesty vs. Harmony**

"When my partner does something that bothers me but mentioning it might cause conflict, I tend to:"

| Option | Text | Coding |
|--------|------|--------|
| A | Say something right away, even if it's uncomfortable | honesty_high |
| B | Wait for the right moment, then bring it up carefully | honesty_moderate |
| C | Let it go unless it happens repeatedly | harmony_moderate |
| D | Keep it to myself to avoid tension | avoidance |

**Item 25: Autonomy vs. Connection**

"When I need alone time but my partner wants to spend time together, I tend to:"

| Option | Text | Coding |
|--------|------|--------|
| A | Take the space I need and trust they'll understand | autonomy_high |
| B | Negotiate a compromise - some together, some apart | balanced |
| C | Put aside my need and be present with them | connection_high |
| D | Go along with togetherness but feel resentful | avoidance |

**Item 26: Growth vs. Stability**

"When there's an opportunity for something new but it would disrupt our routine, I tend to:"

| Option | Text | Coding |
|--------|------|--------|
| A | Push for the new experience | growth_high |
| B | Discuss it and weigh the trade-offs together | balanced |
| C | Default to keeping things stable unless there's a strong reason to change | stability_high |
| D | Avoid the decision as long as possible | avoidance |

**Item 27: Authenticity vs. Accommodation**

"When my partner has a strong opinion that differs from mine, I tend to:"

| Option | Text | Coding |
|--------|------|--------|
| A | State my view clearly, even if we disagree | authenticity_high |
| B | Share my perspective but remain open to theirs | balanced |
| C | Listen to understand their view before sharing mine | connection_high |
| D | Go along with their opinion to keep peace | avoidance |

**Item 28: Intimacy vs. Self-Protection**

"When my partner asks me to share something vulnerable, I tend to:"

| Option | Text | Coding |
|--------|------|--------|
| A | Share openly, even if it's uncomfortable | intimacy_high |
| B | Share gradually, testing how they respond | intimacy_moderate |
| C | Share only what feels safe | protection_moderate |
| D | Deflect or change the subject | avoidance |

**Item 29: Playfulness vs. Seriousness**

"When something goes wrong in a minor way (small mishap, forgotten task), I tend to:"

| Option | Text | Coding |
|--------|------|--------|
| A | Laugh it off and find the humor | playfulness_high |
| B | Keep it light while still addressing it | balanced |
| C | Focus on fixing the problem | seriousness_high |
| D | Feel annoyed even if I don't show it | reactivity |

**Item 30: Service vs. Self-Care**

"When my partner needs support but I'm already depleted, I tend to:"

| Option | Text | Coding |
|--------|------|--------|
| A | Show up for them anyway | service_high |
| B | Offer what I can while naming my limits | balanced |
| C | Ask to help later when I have more capacity | selfcare_high |
| D | Help but feel resentful about it | avoidance |

**Item 31: Security vs. Honesty (Protective Lying)**

"When telling the full truth might hurt my partner unnecessarily, I tend to:"

| Option | Text | Coding |
|--------|------|--------|
| A | Tell the truth anyway - they deserve to know | honesty_high |
| B | Tell the truth with care for how I deliver it | balanced |
| C | Soften or omit details to protect their feelings | protection_moderate |
| D | Avoid the conversation entirely | avoidance |

## Scoring Algorithm

```javascript
function scoreValuesInstrument(responses) {
  // responses object structure:
  // {
  //   part1Scaled: [20 numbers, 1-10],
  //   part1Ranking: [5 domain IDs],
  //   part2Open: [3 strings],
  //   part3Scenarios: [8 option codes: 'A', 'B', 'C', or 'D']
  // }
  
  const domainNames = [
    'intimacy', 'honesty', 'growth', 'security', 'adventure',
    'autonomy', 'family', 'service', 'playfulness', 'spirituality'
  ];
  
  // Part 1: Domain scores
  const domainScores = {};
  domainNames.forEach((domain, index) => {
    const importanceIndex = index * 2;
    const accordanceIndex = index * 2 + 1;
    
    const importance = responses.part1Scaled[importanceIndex];
    const accordance = responses.part1Scaled[accordanceIndex];
    
    domainScores[domain] = {
      importance: importance,
      accordance: accordance,
      gap: importance - accordance
    };
  });
  
  // Top 5 ranking
  const top5Values = responses.part1Ranking;
  
  // Part 2: Qualitative responses
  const qualitativeResponses = {
    partnerIdentity: responses.part2Open[0],
    nonNegotiables: responses.part2Open[1],
    aspirationalVision: responses.part2Open[2]
  };
  
  // Part 3: Values in Action coding
  const optionCoding = {
    24: { A: 'honesty_high', B: 'honesty_moderate', C: 'harmony_moderate', D: 'avoidance' },
    25: { A: 'autonomy_high', B: 'balanced', C: 'connection_high', D: 'avoidance' },
    26: { A: 'growth_high', B: 'balanced', C: 'stability_high', D: 'avoidance' },
    27: { A: 'authenticity_high', B: 'balanced', C: 'connection_high', D: 'avoidance' },
    28: { A: 'intimacy_high', B: 'intimacy_moderate', C: 'protection_moderate', D: 'avoidance' },
    29: { A: 'playfulness_high', B: 'balanced', C: 'seriousness_high', D: 'reactivity' },
    30: { A: 'service_high', B: 'balanced', C: 'selfcare_high', D: 'avoidance' },
    31: { A: 'honesty_high', B: 'balanced', C: 'protection_moderate', D: 'avoidance' }
  };
  
  const actionResponses = {};
  responses.part3Scenarios.forEach((option, index) => {
    const itemNum = 24 + index;
    actionResponses[itemNum] = optionCoding[itemNum][option];
  });
  
  // Calculate avoidance tendency
  const avoidanceCount = Object.values(actionResponses).filter(v => 
    v === 'avoidance' || v === 'reactivity'
  ).length;
  const avoidanceTendency = avoidanceCount / 8;
  
  // Calculate balanced response tendency
  const balancedCount = Object.values(actionResponses).filter(v => 
    v === 'balanced' || v.includes('moderate')
  ).length;
  const balancedTendency = balancedCount / 8;
  
  // Identify high-gap domains
  const highGapDomains = Object.entries(domainScores)
    .filter(([domain, scores]) => scores.importance >= 7 && scores.gap >= 3)
    .map(([domain]) => domain);
  
  return {
    domainScores: domainScores,
    top5Values: top5Values,
    qualitativeResponses: qualitativeResponses,
    actionResponses: actionResponses,
    avoidanceTendency: Math.round(avoidanceTendency * 100) / 100,
    balancedTendency: Math.round(balancedTendency * 100) / 100,
    highGapDomains: highGapDomains
  };
}
```

## Interpretation Guidelines

### Gap Scores

| Gap | Interpretation |
|-----|----------------|
| 0-1 | Well-aligned |
| 2-3 | Moderate gap |
| 4-5 | Significant gap |
| 6+ | Major gap - priority target |

### Avoidance Tendency

| Score | Interpretation |
|-------|----------------|
| 0.00-0.12 | Low avoidance |
| 0.13-0.25 | Mild avoidance |
| 0.26-0.37 | Moderate avoidance |
| 0.38-0.50 | Elevated avoidance |
| 0.51+ | High avoidance |

---

# 4. SSEIT: Schutte Self-Report Emotional Intelligence Test

## Overview

- **Purpose:** Measure emotional intelligence across four domains
- **Items:** 33
- **Subscales:** 4 (Perception, Managing Own, Managing Others, Utilization)
- **Source:** Schutte et al. (1998) - Public domain for research
- **Time:** ~8-10 minutes

## Response Scale

5-point Likert scale:
```
1 = Strongly Disagree
2 = Disagree
3 = Neither Agree nor Disagree
4 = Agree
5 = Strongly Agree
```

## Instructions

"For each statement, indicate the degree to which you agree or disagree. There are no right or wrong answers. Please give the response that best describes you."

## Items

| # | Item | Subscale | Key |
|---|------|----------|-----|
| 1 | I know when to speak about my personal problems to others. | Perception | + |
| 2 | When I am faced with obstacles, I remember times I faced similar obstacles and overcame them. | Utilization | + |
| 3 | I expect that I will do well on most things I try. | Utilization | + |
| 4 | Other people find it easy to confide in me. | Managing Others | + |
| 5 | I find it hard to understand the non-verbal messages of other people. | Perception | − |
| 6 | Some of the major events of my life have led me to re-evaluate what is important and not important. | Perception | + |
| 7 | When my mood changes, I see new possibilities. | Utilization | + |
| 8 | Emotions are one of the things that make my life worth living. | Perception | + |
| 9 | I am aware of my emotions as I experience them. | Perception | + |
| 10 | I expect good things to happen. | Utilization | + |
| 11 | I like to share my emotions with others. | Managing Own | + |
| 12 | When I experience a positive emotion, I know how to make it last. | Managing Own | + |
| 13 | I arrange events others enjoy. | Managing Others | + |
| 14 | I seek out activities that make me happy. | Managing Own | + |
| 15 | I am aware of the non-verbal messages I send to others. | Perception | + |
| 16 | I present myself in a way that makes a good impression on others. | Managing Others | + |
| 17 | When I am in a positive mood, solving problems is easy for me. | Utilization | + |
| 18 | By looking at their facial expressions, I recognize the emotions people are experiencing. | Perception | + |
| 19 | I know why my emotions change. | Perception | + |
| 20 | When I am in a positive mood, I am able to come up with new ideas. | Utilization | + |
| 21 | I have control over my emotions. | Managing Own | + |
| 22 | I easily recognize my emotions as I experience them. | Perception | + |
| 23 | I motivate myself by imagining a good outcome to tasks I take on. | Utilization | + |
| 24 | I compliment others when they have done something well. | Managing Others | + |
| 25 | I am aware of the non-verbal messages other people send. | Perception | + |
| 26 | When another person tells me about an important event in his or her life, I almost feel as though I experienced this event myself. | Perception | + |
| 27 | When I feel a change in emotions, I tend to come up with new ideas. | Utilization | + |
| 28 | When I am faced with a challenge, I give up because I believe I will fail. | Utilization | − |
| 29 | I know what other people are feeling just by looking at them. | Perception | + |
| 30 | I help other people feel better when they are down. | Managing Others | + |
| 31 | I use good moods to help myself keep trying in the face of obstacles. | Utilization | + |
| 32 | I can tell how people are feeling by listening to the tone of their voice. | Perception | + |
| 33 | It is difficult for me to understand why people feel the way they do. | Perception | − |

## Subscale Composition

| Subscale | Items (1-indexed) | Item Count |
|----------|-------------------|------------|
| Perception of Emotion | 1, 5(R), 6, 8, 9, 15, 18, 19, 22, 25, 26, 29, 32, 33(R) | 14 |
| Managing Own Emotions | 11, 12, 14, 21 | 4 |
| Managing Others' Emotions | 4, 13, 16, 24, 30 | 5 |
| Utilization of Emotion | 2, 3, 7, 10, 17, 20, 23, 27, 28(R), 31 | 10 |

## Scoring Algorithm

```javascript
function scoreSSEIT(responses) {
  // responses = array of 33 integers (1-5)
  
  // Reverse-scored items (0-based indices)
  const reverseItems = [4, 27, 32]; // Items 5, 28, 33
  
  function reverseScore(score) {
    return 6 - score;
  }
  
  const scoredResponses = responses.map((r, i) => 
    reverseItems.includes(i) ? reverseScore(r) : r
  );
  
  // Define subscales (0-based indices)
  const subscales = {
    perception: [0, 4, 5, 7, 8, 14, 17, 18, 21, 24, 25, 28, 31, 32],
    managingOwn: [10, 11, 13, 20],
    managingOthers: [3, 12, 15, 23, 29],
    utilization: [1, 2, 6, 9, 16, 19, 22, 26, 27, 30]
  };
  
  const subscaleScores = {};
  for (const [scale, items] of Object.entries(subscales)) {
    const sum = items.reduce((s, i) => s + scoredResponses[i], 0);
    subscaleScores[scale] = {
      sum: sum,
      mean: Math.round((sum / items.length) * 100) / 100,
      itemCount: items.length
    };
  }
  
  const totalSum = scoredResponses.reduce((sum, r) => sum + r, 0);
  
  // Normalize to 0-100 scale
  const normalizedScores = {
    perception: Math.round((subscaleScores.perception.sum / (5 * 14)) * 100),
    managingOwn: Math.round((subscaleScores.managingOwn.sum / (5 * 4)) * 100),
    managingOthers: Math.round((subscaleScores.managingOthers.sum / (5 * 5)) * 100),
    utilization: Math.round((subscaleScores.utilization.sum / (5 * 10)) * 100),
    total: Math.round((totalSum / (5 * 33)) * 100)
  };
  
  return {
    totalScore: totalSum,
    totalMean: Math.round((totalSum / 33) * 100) / 100,
    totalNormalized: normalizedScores.total,
    subscaleScores: subscaleScores,
    subscaleNormalized: normalizedScores,
    rawResponses: responses
  };
}
```

## Interpretation Thresholds

| Normalized % | Level |
|--------------|-------|
| 20-40% | Low |
| 41-60% | Below Average |
| 61-75% | Average |
| 76-90% | Above Average |
| 91-100% | High |

---

# 5. DUTCH: Conflict Style

## Overview

- **Purpose:** Measure five conflict handling styles
- **Items:** 20
- **Subscales:** 5 (Yielding, Compromising, Forcing, Problem-Solving, Avoiding)
- **Source:** De Dreu et al. (2001) - Free for research use
- **Time:** ~5-7 minutes

## Relationship Context Framing

**Instructions Header:**
"The following statements describe different ways people handle disagreements and conflicts. Please respond thinking specifically about conflicts or disagreements with your romantic partner - not conflicts at work or with friends/family."

## Response Scale

5-point Likert scale:
```
1 = Never
2 = Rarely
3 = Sometimes
4 = Often
5 = Always
```

## Instructions

"When I have a conflict or disagreement with my partner, I typically..."

## Items

| # | Item | Subscale |
|---|------|----------|
| 1 | Give in to the wishes of my partner. | Yielding |
| 2 | Try to realize a middle-of-the-road solution. | Compromising |
| 3 | Push my own point of view. | Forcing |
| 4 | Examine issues until I find a solution that really satisfies me and my partner. | Problem-Solving |
| 5 | Avoid a confrontation about our differences. | Avoiding |
| 6 | Concur with my partner. | Yielding |
| 7 | Emphasize that we have to find a compromise solution. | Compromising |
| 8 | Search for gains. | Forcing |
| 9 | Stand for my own and the other's goals and interests. | Problem-Solving |
| 10 | Avoid differences of opinion as much as possible. | Avoiding |
| 11 | Try to accommodate my partner. | Yielding |
| 12 | Insist we both give in a little. | Compromising |
| 13 | Fight for a good outcome for myself. | Forcing |
| 14 | Examine ideas from both sides to find a mutually optimal solution. | Problem-Solving |
| 15 | Try to make differences seem less severe. | Avoiding |
| 16 | Adapt to my partner's goals and interests. | Yielding |
| 17 | Strive whenever possible towards a fifty-fifty compromise. | Compromising |
| 18 | Do everything to win. | Forcing |
| 19 | Work out a solution that serves my own as well as my partner's interests as well as possible. | Problem-Solving |
| 20 | Try to avoid a confrontation with my partner. | Avoiding |

## Subscale Composition

| Subscale | Items |
|----------|-------|
| Yielding | 1, 6, 11, 16 |
| Compromising | 2, 7, 12, 17 |
| Forcing | 3, 8, 13, 18 |
| Problem-Solving | 4, 9, 14, 19 |
| Avoiding | 5, 10, 15, 20 |

## Scoring Algorithm

```javascript
function scoreDUTCH(responses) {
  // responses = array of 20 integers (1-5)
  
  const subscales = {
    yielding: [0, 5, 10, 15],
    compromising: [1, 6, 11, 16],
    forcing: [2, 7, 12, 17],
    problemSolving: [3, 8, 13, 18],
    avoiding: [4, 9, 14, 19]
  };
  
  const subscaleScores = {};
  for (const [scale, items] of Object.entries(subscales)) {
    const sum = items.reduce((s, i) => s + responses[i], 0);
    subscaleScores[scale] = {
      sum: sum,
      mean: Math.round((sum / 4) * 100) / 100
    };
  }
  
  // Determine primary and secondary styles
  const sortedStyles = Object.entries(subscaleScores)
    .sort((a, b) => b[1].mean - a[1].mean);
  
  return {
    subscaleScores: subscaleScores,
    primaryStyle: sortedStyles[0][0],
    secondaryStyle: sortedStyles[1][0],
    rawResponses: responses
  };
}
```

## Style Descriptions

| Style | Description |
|-------|-------------|
| **Yielding** | Accommodating partner's needs; prioritizes relationship harmony over own goals |
| **Compromising** | Seeks middle ground; willing to give and take equally |
| **Forcing** | Advocates strongly for own position; competitive approach |
| **Problem-Solving** | Seeks win-win solutions; collaborative and creative |
| **Avoiding** | Sidesteps or postpones conflict; withdraws from disagreement |

---

# 6. DSI-R: Differentiation of Self Inventory - Revised

## Overview

- **Purpose:** Measure differentiation of self (Bowen family systems)
- **Items:** 46
- **Subscales:** 4 (Emotional Reactivity, I-Position, Emotional Cutoff, Fusion with Others)
- **Source:** Skowron & Schmitt (2003) - Free for research use
- **Time:** ~10-12 minutes

## Response Scale

6-point Likert scale:
```
1 = Not at all true of me
2 = Slightly true of me
3 = Somewhat true of me
4 = Moderately true of me
5 = Mostly true of me
6 = Very true of me
```

## Instructions

"These are questions concerning your thoughts and feelings about yourself and relationships with others. Please read each statement carefully and decide how much the statement is generally true of you on a 1 (not at all) to 6 (very) scale."

## Items

| # | Item | Subscale | Key |
|---|------|----------|-----|
| 1 | People have remarked that I'm overly emotional. | ER | + |
| 2 | I have difficulty expressing my feelings to people I care for. | IP | + |
| 3 | I often feel like I'm being controlled by others. | EC | + |
| 4 | I'm able to calmly listen to my partner, even when I disagree. | FO | − |
| 5 | I tend to remain pretty calm even when everyone around me is upset. | EC | − |
| 6 | At times my feelings get the best of me and I have trouble thinking clearly. | ER | + |
| 7 | When I'm with my partner, I often feel smothered. | IP | + |
| 8 | It's important for me to keep in touch with my parents regularly. | EC | + |
| 9 | When my partner criticizes me, it bothers me for days. | ER | + |
| 10 | I often agree with others just to appease them. | FO | + |
| 11 | I'm likely to be drawn into other people's problems. | EC | + |
| 12 | I usually do what I believe is right regardless of what others say. | IP | − |
| 13 | I want to live up to my parents' expectations. | EC | + |
| 14 | I'm very sensitive to being hurt by others. | ER | + |
| 15 | When I'm having an argument, I can keep focused on the issues and not let things get personal. | FO | − |
| 16 | At times, I feel as if I'm riding an emotional roller-coaster. | FO | + |
| 17 | I often feel overwhelmed. | ER | + |
| 18 | I'm good at knowing what I believe and stating my position clearly. | IP | − |
| 19 | I'm very uncomfortable when people express negative feelings toward me. | EC | + |
| 20 | Our relationship would be better if my partner would give me the space I need. | FO | + |
| 21 | I tend to react emotionally when things don't go as I've planned. | ER | + |
| 22 | I tend to distance myself when people get too close to me. | IP | + |
| 23 | I wish I weren't so emotional. | EC | + |
| 24 | It's hard for me to make decisions for myself when I know others might disapprove. | FO | + |
| 25 | I often end up taking care of others' needs at the expense of my own. | FO | + |
| 26 | I'm fairly calm even when things get chaotic around me. | ER | − |
| 27 | I'm able to say "no" to others even when I feel pressured by them. | IP | − |
| 28 | Our relationship has suffered because of my partner's unreasonable demands. | EC | + |
| 29 | When I am with others, I lose my sense of who I am. | FO | + |
| 30 | I often find myself making decisions based on what will make others happy. | ER | + |
| 31 | I often feel that my partner wants too much from me. | FO | + |
| 32 | I have a clear sense of who I am and what I believe. | IP | − |
| 33 | When one of my relationships becomes very intense, I feel the urge to run away from it. | EC | + |
| 34 | Relationships with others are usually more trouble than they're worth. | FO | + |
| 35 | When things go wrong, talking about them usually makes it worse. | ER | + |
| 36 | Sometimes I feel sick after arguing with my partner. | IP | + |
| 37 | My self-esteem really depends on how others think of me. | EC | + |
| 38 | I frequently feel threatened in close relationships. | FO | + |
| 39 | I feel things more intensely than others do. | ER | + |
| 40 | I tend to feel pretty stable under stress. | IP | − |
| 41 | I often wonder about the kind of impression I create. | EC | + |
| 42 | There's no point in getting upset about things I cannot change. | FO | − |
| 43 | I feel comfortable when people get close to me. | IP | − |
| 44 | I'm likely to smooth over or settle conflicts between two people I care about. | ER | + |
| 45 | I usually don't change my behavior simply to please another person. | IP | − |
| 46 | I'm uncomfortable being around people I don't know. | EC | + |

## Subscale Composition

| Subscale | Items | Description |
|----------|-------|-------------|
| Emotional Reactivity (ER) | 1, 6, 9, 14, 17, 21, 26(R), 30, 35, 39, 44 | Emotional flooding, reactivity to others |
| I-Position (IP) | 2, 7, 12(R), 18(R), 22, 27(R), 32(R), 36, 40(R), 43(R), 45(R) | Clear sense of self, stating beliefs |
| Emotional Cutoff (EC) | 3, 5(R), 8, 11, 13, 19, 23, 28, 33, 37, 41, 46 | Managing anxiety through distance |
| Fusion with Others (FO) | 4(R), 10, 15(R), 16, 20, 24, 25, 29, 31, 34, 38, 42(R) | Losing self in relationships |

## Scoring Algorithm

```javascript
function scoreDSIR(responses) {
  // responses = array of 46 integers (1-6)
  
  // Reverse-scored items (0-based)
  const reverseItems = [3, 4, 11, 14, 17, 25, 26, 31, 39, 41, 42, 44];
  
  function reverseScore(score) {
    return 7 - score;
  }
  
  const scoredResponses = responses.map((r, i) => 
    reverseItems.includes(i) ? reverseScore(r) : r
  );
  
  // After reverse scoring, ALL items are keyed so HIGH = LOW differentiation
  // We then reverse the subscale means so HIGH = HIGH differentiation
  
  const subscales = {
    emotionalReactivity: [0, 5, 8, 13, 16, 20, 25, 29, 34, 38, 43],
    iPosition: [1, 6, 11, 17, 21, 26, 31, 35, 39, 42, 44],
    emotionalCutoff: [2, 4, 7, 10, 12, 18, 22, 27, 32, 36, 40, 45],
    fusionWithOthers: [3, 9, 14, 15, 19, 23, 24, 28, 30, 33, 37, 41]
  };
  
  const subscaleScores = {};
  for (const [scale, items] of Object.entries(subscales)) {
    const sum = items.reduce((s, i) => s + scoredResponses[i], 0);
    // Reverse mean so higher = more differentiated
    const rawMean = sum / items.length;
    const reversedMean = 7 - rawMean;
    subscaleScores[scale] = {
      sum: sum,
      mean: Math.round(reversedMean * 100) / 100,
      itemCount: items.length
    };
  }
  
  // Total differentiation (average of subscale means)
  const totalMean = (subscaleScores.emotionalReactivity.mean + 
                     subscaleScores.iPosition.mean +
                     subscaleScores.emotionalCutoff.mean +
                     subscaleScores.fusionWithOthers.mean) / 4;
  
  // Normalize to 0-100
  function toNormalized(mean) {
    return Math.round(((mean - 1) / 5) * 100);
  }
  
  return {
    totalMean: Math.round(totalMean * 100) / 100,
    totalNormalized: toNormalized(totalMean),
    subscaleScores: subscaleScores,
    subscaleNormalized: {
      emotionalReactivity: toNormalized(subscaleScores.emotionalReactivity.mean),
      iPosition: toNormalized(subscaleScores.iPosition.mean),
      emotionalCutoff: toNormalized(subscaleScores.emotionalCutoff.mean),
      fusionWithOthers: toNormalized(subscaleScores.fusionWithOthers.mean)
    },
    rawResponses: responses
  };
}
```

## Interpretation

**After scoring, all subscales are oriented so HIGHER = MORE DIFFERENTIATED**

| Normalized Score | Level |
|------------------|-------|
| 0-25 | Low differentiation |
| 26-40 | Below average |
| 41-60 | Average |
| 61-75 | Above average |
| 76-100 | High differentiation |

---

# 7. Data Schema Summary

```typescript
interface UserAssessmentProfile {
  userId: string;
  completedAt: Date;
  
  attachment: {
    anxietyScore: number;        // 1-7
    avoidanceScore: number;      // 1-7
    attachmentStyle: string;
    rawResponses: number[];
  };
  
  personality: {
    domainScores: Record<string, { sum: number; mean: number }>;
    domainPercentiles: Record<string, number>;
    facetScores: Record<string, { sum: number; mean: number }>;
    facetPercentiles: Record<string, number>;
    rawResponses: number[];
  };
  
  values: {
    domainScores: Record<string, { importance: number; accordance: number; gap: number }>;
    top5Values: string[];
    qualitativeResponses: { partnerIdentity: string; nonNegotiables: string; aspirationalVision: string };
    actionResponses: Record<string, string>;
    avoidanceTendency: number;
    balancedTendency: number;
    highGapDomains: string[];
  };
  
  emotionalIntelligence: {
    totalScore: number;
    totalNormalized: number;
    subscaleScores: Record<string, { sum: number; mean: number }>;
    subscaleNormalized: Record<string, number>;
    rawResponses: number[];
  };
  
  conflictStyle: {
    subscaleScores: Record<string, { sum: number; mean: number }>;
    primaryStyle: string;
    secondaryStyle: string;
    rawResponses: number[];
  };
  
  differentiation: {
    totalMean: number;
    totalNormalized: number;
    subscaleScores: Record<string, { sum: number; mean: number }>;
    subscaleNormalized: Record<string, number>;
    rawResponses: number[];
  };
}
```

---

# 8. Administration Sequence

| Order | Instrument | Items | Time |
|-------|------------|-------|------|
| 1 | ECR-R | 36 | 8-10 min |
| 2 | IPIP-NEO-120 | 120 | 20-25 min |
| 3 | Values | 29+3 open | 12-15 min |
| 4 | SSEIT | 33 | 8-10 min |
| 5 | DUTCH | 20 | 5-7 min |
| 6 | DSI-R | 46 | 10-12 min |

**Total: 284 items + 3 open responses (~70-80 minutes)**

---

*Document Version 1.1 - Complete Item Specification*
*All items included - Ready for Claude Code implementation*
