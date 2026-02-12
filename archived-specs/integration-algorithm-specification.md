# Integration Algorithm Specification
## Couples Relationship App - Portrait Generation System

**Purpose:** Transform raw assessment data into clinical-grade integrated portrait  
**Version:** 1.0  
**Input:** UserAssessmentProfile (from Assessment Instruments Specification)  
**Output:** IntegratedPortrait

---

# TABLE OF CONTENTS

1. [Overview](#1-overview)
2. [Integration Pipeline](#2-integration-pipeline)
3. [Pattern Detection Engine](#3-pattern-detection-engine)
4. [Four-Lens Analysis](#4-four-lens-analysis)
5. [Negative Cycle Prediction](#5-negative-cycle-prediction)
6. [Growth Edge Identification](#6-growth-edge-identification)
7. [Anchor Point Generation](#7-anchor-point-generation)
8. [Partner Support Guide Generation](#8-partner-support-guide-generation)
9. [Narrative Synthesis](#9-narrative-synthesis)
10. [Output Schema](#10-output-schema)
11. [Quality Assurance Rules](#11-quality-assurance-rules)

---

# 1. Overview

## Integration Philosophy

The integration algorithm does not simply summarize six assessments. It performs **clinical synthesis** - finding patterns that only emerge when data is read together, surfacing tensions between stated values and behavioral patterns, and generating insight that is genuinely useful in moments of difficulty.

## Core Principles

1. **Convergent findings are high-confidence** - When multiple assessments point to the same pattern, weight it heavily
2. **Divergent findings are interesting** - When assessments seem contradictory, explore the tension
3. **Values-behavior gaps are growth edges** - Where what someone wants conflicts with what they do
4. **Everything connects to attachment** - Attachment is the foundational lens; other patterns are read through it
5. **Compassion is embedded** - Patterns are described as protective strategies, not deficits

## Integration Layers

```
Layer 1: SCORING
Raw responses → Subscale scores → Domain scores → Percentiles

Layer 2: PATTERN DETECTION
Cross-assessment correlations → Pattern flags → Confidence scores

Layer 3: LENS ANALYSIS
Assessment data + Patterns → Four theoretical interpretations

Layer 4: SYNTHESIS
Lens outputs → Unified narrative → Growth edges → Anchors

Layer 5: PERSONALIZATION
Synthesis → Partner guide → Deepening questions → Agent instructions
```

---

# 2. Integration Pipeline

## Pipeline Steps

```javascript
async function generatePortrait(assessmentProfile) {
  // Step 1: Validate input
  validateAssessmentProfile(assessmentProfile);
  
  // Step 2: Detect patterns across assessments
  const patterns = detectPatterns(assessmentProfile);
  
  // Step 3: Generate four-lens analysis
  const lensAnalysis = {
    attachmentProtection: analyzeAttachmentProtection(assessmentProfile, patterns),
    partsPolarities: analyzePartsPolarities(assessmentProfile, patterns),
    regulationWindow: analyzeRegulationWindow(assessmentProfile, patterns),
    valuesBecoming: analyzeValuesBecoming(assessmentProfile, patterns)
  };
  
  // Step 4: Predict negative cycle position
  const negativeCycle = predictNegativeCycle(assessmentProfile, patterns);
  
  // Step 5: Identify growth edges
  const growthEdges = identifyGrowthEdges(assessmentProfile, patterns, lensAnalysis);
  
  // Step 6: Generate anchor points
  const anchorPoints = generateAnchorPoints(assessmentProfile, patterns, lensAnalysis);
  
  // Step 7: Generate partner support guide
  const partnerGuide = generatePartnerGuide(assessmentProfile, patterns, lensAnalysis);
  
  // Step 8: Synthesize narrative
  const narrative = synthesizeNarrative(assessmentProfile, patterns, lensAnalysis);
  
  // Step 9: Generate deepening questions
  const deepeningQuestions = generateDeepeningQuestions(assessmentProfile, growthEdges);
  
  // Step 10: Compile portrait
  return compilePortrait({
    snapshot: generateSnapshot(assessmentProfile),
    patterns: patterns,
    lensAnalysis: lensAnalysis,
    negativeCycle: negativeCycle,
    growthEdges: growthEdges,
    anchorPoints: anchorPoints,
    partnerGuide: partnerGuide,
    narrative: narrative,
    deepeningQuestions: deepeningQuestions,
    agentInstructions: generateAgentInstructions(assessmentProfile, patterns, growthEdges)
  });
}
```

---

# 3. Pattern Detection Engine

## Purpose

Identify cross-assessment patterns that reveal deeper dynamics than any single assessment shows.

## Pattern Detection Rules

### 3.1 Core Pattern: Attachment-Conflict Alignment

**Logic:** Attachment style should predict conflict style. Check for alignment.

```javascript
function detectAttachmentConflictPattern(profile) {
  const { attachment, conflictStyle } = profile;
  
  const patterns = [];
  
  // Anxious attachment typically correlates with:
  // - Higher yielding (to maintain connection)
  // - Lower avoiding (wants to engage)
  // - Can show forcing when escalated
  
  if (attachment.anxietyScore > 4.0) {
    if (conflictStyle.subscaleScores.avoiding.mean > 3.5) {
      patterns.push({
        id: 'anxious_but_avoiding',
        description: 'High attachment anxiety combined with conflict avoidance',
        interpretation: 'Wants connection desperately but fears conflict will destroy it. Likely suppresses needs until they explode.',
        confidence: 'high',
        flags: ['pursue_withdraw_risk', 'resentment_accumulation']
      });
    }
    
    if (conflictStyle.subscaleScores.yielding.mean > 3.5) {
      patterns.push({
        id: 'anxious_yielding',
        description: 'High attachment anxiety with high yielding',
        interpretation: 'Accommodates to maintain connection. May lose self in relationship.',
        confidence: 'high',
        flags: ['self_abandonment_risk', 'resentment_accumulation']
      });
    }
  }
  
  // Avoidant attachment typically correlates with:
  // - Higher avoiding (withdraws from conflict)
  // - Lower yielding (maintains independence)
  // - Can show forcing (when cornered)
  
  if (attachment.avoidanceScore > 4.0) {
    if (conflictStyle.subscaleScores.avoiding.mean > 3.5) {
      patterns.push({
        id: 'avoidant_avoiding',
        description: 'High attachment avoidance with conflict avoidance',
        interpretation: 'Double withdrawal pattern. Distances emotionally AND from conflict. Partner likely feels shut out.',
        confidence: 'high',
        flags: ['stonewalling_risk', 'emotional_distance']
      });
    }
    
    if (conflictStyle.subscaleScores.problemSolving.mean > 3.5) {
      // Interesting divergence
      patterns.push({
        id: 'avoidant_but_collaborative',
        description: 'High attachment avoidance but collaborative in conflict',
        interpretation: 'Can engage intellectually with problems but may struggle with emotional content. Prefers logical solutions.',
        confidence: 'medium',
        flags: ['intellectual_bypass_risk']
      });
    }
  }
  
  return patterns;
}
```

### 3.2 Core Pattern: Regulation Capacity

**Logic:** Multiple assessments inform regulation capacity. Synthesize them.

```javascript
function detectRegulationPattern(profile) {
  const { personality, emotionalIntelligence, differentiation } = profile;
  
  // Regulation indicators:
  // - Neuroticism (inverse) - high N = low regulation
  // - EQ Managing Own subscale
  // - DSI Emotional Reactivity subscale (after reversal, high = good)
  
  const neuroticism = personality.domainPercentiles.Neuroticism;
  const eqRegulation = emotionalIntelligence.subscaleNormalized.managingOwn;
  const dsiReactivity = differentiation.subscaleNormalized.emotionalReactivity;
  
  // Calculate composite regulation score
  const regulationScore = (
    (100 - neuroticism) * 0.4 +  // Invert neuroticism
    eqRegulation * 0.3 +
    dsiReactivity * 0.3
  );
  
  const patterns = [];
  
  if (regulationScore < 35) {
    patterns.push({
      id: 'low_regulation_capacity',
      description: 'Limited self-regulation capacity across multiple measures',
      interpretation: 'Narrow window of tolerance. Easily flooded. Needs significant regulation support.',
      confidence: 'high',
      regulationScore: regulationScore,
      flags: ['flooding_risk', 'narrow_window', 'regulation_priority']
    });
  } else if (regulationScore < 50) {
    patterns.push({
      id: 'moderate_regulation_capacity',
      description: 'Moderate self-regulation capacity',
      interpretation: 'Can regulate under normal circumstances but struggles under pressure.',
      confidence: 'high',
      regulationScore: regulationScore,
      flags: ['stress_vulnerability']
    });
  } else {
    patterns.push({
      id: 'adequate_regulation_capacity',
      description: 'Adequate to good self-regulation capacity',
      interpretation: 'Generally able to manage emotional responses. Can stay in window longer.',
      confidence: 'high',
      regulationScore: regulationScore,
      flags: []
    });
  }
  
  // Check for split between awareness and regulation
  const eqPerception = emotionalIntelligence.subscaleNormalized.perception;
  if (eqPerception > 70 && eqRegulation < 50) {
    patterns.push({
      id: 'aware_but_cant_regulate',
      description: 'High emotional awareness but low regulation capacity',
      interpretation: 'Knows what they\'re feeling but struggles to manage it. "I know I\'m doing it but can\'t stop."',
      confidence: 'high',
      flags: ['insight_action_gap']
    });
  }
  
  return patterns;
}
```

### 3.3 Core Pattern: Values-Behavior Congruence

**Logic:** Compare stated values with behavioral patterns from other assessments.

```javascript
function detectValuesBehaviorPattern(profile) {
  const { values, conflictStyle, attachment, differentiation } = profile;
  
  const patterns = [];
  
  // Check: Values honesty but avoids conflict
  if (values.domainScores.honesty.importance >= 8) {
    if (conflictStyle.subscaleScores.avoiding.mean > 3.0 || 
        values.avoidanceTendency > 0.25) {
      patterns.push({
        id: 'values_honesty_avoids_conflict',
        description: 'High value on honesty/authenticity but avoids difficult conversations',
        interpretation: 'Wants to be authentic but protective system prioritizes safety over truth. Key growth edge.',
        confidence: 'high',
        flags: ['core_values_conflict', 'growth_edge_candidate']
      });
    }
  }
  
  // Check: Values intimacy but avoidant attachment
  if (values.domainScores.intimacy.importance >= 8) {
    if (attachment.avoidanceScore > 4.0) {
      patterns.push({
        id: 'values_intimacy_avoids_closeness',
        description: 'High value on intimacy but avoidant attachment pattern',
        interpretation: 'Longs for deep connection but nervous system reads closeness as danger. Approach-avoidance dynamic.',
        confidence: 'high',
        flags: ['core_values_conflict', 'growth_edge_candidate']
      });
    }
  }
  
  // Check: Values autonomy but fused
  if (values.domainScores.autonomy.importance >= 7) {
    if (differentiation.subscaleNormalized.fusionWithOthers < 40) {
      patterns.push({
        id: 'values_autonomy_but_fused',
        description: 'Values independence but tends to lose self in relationships',
        interpretation: 'Wants to maintain identity but pattern is to accommodate and merge. May resent partner for "making" them lose themselves.',
        confidence: 'high',
        flags: ['core_values_conflict', 'growth_edge_candidate']
      });
    }
  }
  
  // Check: Values growth but resists change (low Openness)
  if (values.domainScores.growth.importance >= 8) {
    if (personality.domainPercentiles.Openness < 40) {
      patterns.push({
        id: 'values_growth_resists_change',
        description: 'Values growth but personality shows preference for stability',
        interpretation: 'Aspires to growth but may resist the actual discomfort of change. Needs gentle pacing.',
        confidence: 'medium',
        flags: ['pacing_consideration']
      });
    }
  }
  
  return patterns;
}
```

### 3.4 Core Pattern: Differentiation Profile

**Logic:** Synthesize differentiation subscales into actionable profile.

```javascript
function detectDifferentiationPattern(profile) {
  const { differentiation } = profile;
  const { subscaleNormalized } = differentiation;
  
  const patterns = [];
  
  // Low I-Position + High Fusion = Self-abandonment risk
  if (subscaleNormalized.iPosition < 40 && subscaleNormalized.fusionWithOthers < 40) {
    patterns.push({
      id: 'low_differentiation_fused',
      description: 'Weak sense of self combined with fusion tendency',
      interpretation: 'Difficulty knowing own beliefs, tends to merge with partner. Core differentiation work needed.',
      confidence: 'high',
      flags: ['differentiation_priority', 'self_abandonment_risk']
    });
  }
  
  // High Cutoff = False differentiation
  if (subscaleNormalized.emotionalCutoff < 35) {
    patterns.push({
      id: 'high_cutoff',
      description: 'High emotional cutoff pattern',
      interpretation: 'Manages relationship anxiety through distance rather than true differentiation. Appears independent but is reactive.',
      confidence: 'high',
      flags: ['false_differentiation', 'intimacy_block']
    });
  }
  
  // High Reactivity + Low I-Position = Volatile pattern
  if (subscaleNormalized.emotionalReactivity < 35 && subscaleNormalized.iPosition < 40) {
    patterns.push({
      id: 'reactive_undefined',
      description: 'High emotional reactivity with weak self-definition',
      interpretation: 'Reacts strongly but without clear sense of what they actually need or believe. Chaotic relationship pattern likely.',
      confidence: 'high',
      flags: ['volatility_risk', 'regulation_priority']
    });
  }
  
  return patterns;
}
```

### 3.5 Pattern Aggregation

```javascript
function detectPatterns(profile) {
  const allPatterns = [
    ...detectAttachmentConflictPattern(profile),
    ...detectRegulationPattern(profile),
    ...detectValuesBehaviorPattern(profile),
    ...detectDifferentiationPattern(profile),
    ...detectPersonalityInteractions(profile),
    ...detectEmotionalIntelligenceGaps(profile)
  ];
  
  // Aggregate flags
  const allFlags = allPatterns.flatMap(p => p.flags || []);
  const flagCounts = {};
  allFlags.forEach(flag => {
    flagCounts[flag] = (flagCounts[flag] || 0) + 1;
  });
  
  // Identify high-priority flags (appear in multiple patterns)
  const priorityFlags = Object.entries(flagCounts)
    .filter(([flag, count]) => count >= 2)
    .map(([flag]) => flag);
  
  return {
    patterns: allPatterns,
    flagCounts: flagCounts,
    priorityFlags: priorityFlags,
    hasRegulationPriority: priorityFlags.includes('regulation_priority'),
    hasGrowthEdgeCandidates: allPatterns.some(p => p.flags?.includes('growth_edge_candidate')),
    hasSafetyFlags: allPatterns.some(p => 
      p.flags?.includes('self_abandonment_risk') || 
      p.flags?.includes('volatility_risk')
    )
  };
}
```

---

# 4. Four-Lens Analysis

## Lens 1: Attachment & Protection

**Theoretical Foundation:** EFT, Attachment Theory, PACT

```javascript
function analyzeAttachmentProtection(profile, patterns) {
  const { attachment, conflictStyle, differentiation, values } = profile;
  
  // Determine primary attachment narrative
  let attachmentNarrative;
  let protectiveStrategy;
  let primaryEmotion;
  let secondaryEmotion;
  let longing;
  
  if (attachment.attachmentStyle === 'secure') {
    attachmentNarrative = 'secure_earned_or_natural';
    protectiveStrategy = 'direct_communication';
    primaryEmotion = 'trust';
    secondaryEmotion = 'openness';
    longing = 'continued_connection';
  } else if (attachment.attachmentStyle === 'anxious-preoccupied') {
    attachmentNarrative = 'learned_love_is_precarious';
    protectiveStrategy = 'pursue_seek_reassurance';
    primaryEmotion = 'fear_of_abandonment';
    secondaryEmotion = 'anger_or_criticism';
    longing = 'reassurance_that_they_matter';
  } else if (attachment.attachmentStyle === 'dismissive-avoidant') {
    attachmentNarrative = 'learned_self_reliance_is_safer';
    protectiveStrategy = 'withdraw_minimize_needs';
    primaryEmotion = 'fear_of_engulfment';
    secondaryEmotion = 'numbness_or_dismissiveness';
    longing = 'acceptance_without_demands';
  } else {
    attachmentNarrative = 'learned_love_is_both_needed_and_dangerous';
    protectiveStrategy = 'approach_then_withdraw';
    primaryEmotion = 'fear_of_both_abandonment_and_engulfment';
    secondaryEmotion = 'confusion_or_dysregulation';
    longing = 'safe_connection_that_wont_hurt';
  }
  
  // Calculate A.R.E. profile (Accessible, Responsive, Engaged)
  const areProfile = {
    accessible: calculateAccessibility(attachment, differentiation),
    responsive: calculateResponsiveness(profile),
    engaged: calculateEngagement(profile)
  };
  
  // Identify attachment triggers
  const triggers = identifyAttachmentTriggers(attachment, patterns);
  
  return {
    attachmentStyle: attachment.attachmentStyle,
    anxietyScore: attachment.anxietyScore,
    avoidanceScore: attachment.avoidanceScore,
    narrative: attachmentNarrative,
    protectiveStrategy: protectiveStrategy,
    emotionalStructure: {
      primary: primaryEmotion,
      secondary: secondaryEmotion,
      longing: longing
    },
    areProfile: areProfile,
    triggers: triggers,
    relatedPatterns: patterns.patterns.filter(p => 
      p.id.includes('attachment') || 
      p.id.includes('anxious') || 
      p.id.includes('avoidant')
    )
  };
}

function calculateAccessibility(attachment, differentiation) {
  // Accessibility = how easy to reach emotionally
  // Low avoidance + low cutoff = high accessibility
  const avoidanceContrib = (7 - attachment.avoidanceScore) / 6; // 0-1, higher is more accessible
  const cutoffContrib = differentiation.subscaleNormalized.emotionalCutoff / 100;
  return Math.round(((avoidanceContrib * 0.6) + (cutoffContrib * 0.4)) * 100);
}

function calculateResponsiveness(profile) {
  // Responsiveness = how well they respond to partner's needs
  // High empathy + high altruism + low self-focus
  const empathy = profile.emotionalIntelligence.subscaleNormalized.perception;
  const altruism = profile.personality.facetPercentiles.A3_Altruism || 50;
  return Math.round((empathy * 0.5 + altruism * 0.5));
}

function calculateEngagement(profile) {
  // Engagement = presence and attention in connection
  // Low avoidance + high extraversion friendliness facet + low cutoff
  const avoidanceContrib = (7 - profile.attachment.avoidanceScore) / 6 * 100;
  const friendliness = profile.personality.facetPercentiles.E1_Friendliness || 50;
  return Math.round((avoidanceContrib * 0.5 + friendliness * 0.5));
}

function identifyAttachmentTriggers(attachment, patterns) {
  const triggers = [];
  
  if (attachment.anxietyScore > 4.0) {
    triggers.push({
      trigger: 'partner_unavailability',
      description: 'Partner being busy, distracted, or emotionally distant',
      response: 'Anxiety rises, may pursue or seek reassurance'
    });
    triggers.push({
      trigger: 'ambiguous_communication',
      description: 'Unclear messages, delayed responses, vague plans',
      response: 'Mind fills in negative interpretations'
    });
    triggers.push({
      trigger: 'perceived_rejection',
      description: 'Criticism, disinterest, attention to others',
      response: 'Activation, protest behaviors, or collapse'
    });
  }
  
  if (attachment.avoidanceScore > 4.0) {
    triggers.push({
      trigger: 'demands_for_closeness',
      description: 'Partner wanting more time, more talk, more intimacy',
      response: 'Feels engulfed, withdraws, needs space'
    });
    triggers.push({
      trigger: 'emotional_intensity',
      description: 'Partner expressing strong emotions or needs',
      response: 'Shuts down, goes logical, or distances'
    });
    triggers.push({
      trigger: 'conflict_escalation',
      description: 'Arguments becoming heated or repetitive',
      response: 'Stonewalls or exits to self-regulate'
    });
  }
  
  return triggers;
}
```

## Lens 2: Parts & Polarities

**Theoretical Foundation:** IFS, Internal Systems Thinking

```javascript
function analyzePartsPolarities(profile, patterns) {
  const { personality, values, attachment, differentiation } = profile;
  
  // Identify likely parts based on assessment data
  const parts = [];
  
  // Manager Parts (proactive protection)
  if (personality.domainPercentiles.Conscientiousness > 70) {
    parts.push({
      type: 'manager',
      name: 'The Achiever/Perfectionist',
      function: 'Maintains standards, prevents failure and criticism',
      showsUpAs: 'High standards, self-criticism, difficulty relaxing',
      protects: 'Vulnerable part that fears not being good enough'
    });
  }
  
  if (personality.domainPercentiles.Neuroticism > 65 && 
      personality.facetPercentiles.N1_Anxiety > 60) {
    parts.push({
      type: 'manager',
      name: 'The Worrier/Scanner',
      function: 'Scans for threats, anticipates problems',
      showsUpAs: 'Hypervigilance, worst-case thinking, difficulty trusting',
      protects: 'Young part that was blindsided or hurt unexpectedly'
    });
  }
  
  if (attachment.avoidanceScore > 4.5) {
    parts.push({
      type: 'manager',
      name: 'The Self-Reliant One',
      function: 'Maintains independence, avoids dependence',
      showsUpAs: 'Not asking for help, minimizing needs, emotional distance',
      protects: 'Part that learned needing others leads to disappointment'
    });
  }
  
  if (personality.facetPercentiles.A4_Cooperation > 75 || 
      profile.conflictStyle.primaryStyle === 'yielding') {
    parts.push({
      type: 'manager',
      name: 'The Peacekeeper',
      function: 'Maintains harmony, avoids conflict',
      showsUpAs: 'Accommodating, not expressing needs, reading the room',
      protects: 'Part that learned conflict means danger or abandonment'
    });
  }
  
  // Firefighter Parts (reactive protection)
  if (personality.facetPercentiles.N2_Anger > 65) {
    parts.push({
      type: 'firefighter',
      name: 'The Defender/Reactor',
      function: 'Protects through anger when threatened',
      showsUpAs: 'Quick to anger, defensive, counterattacks',
      protects: 'Hurt or scared part underneath the anger'
    });
  }
  
  if (personality.facetPercentiles.N5_Immoderation > 60) {
    parts.push({
      type: 'firefighter',
      name: 'The Escape Artist',
      function: 'Numbs or distracts from overwhelming feelings',
      showsUpAs: 'Overindulgence, checking out, avoidance behaviors',
      protects: 'Part carrying unbearable emotions'
    });
  }
  
  // Identify Polarities (parts in conflict)
  const polarities = [];
  
  // Check for intimacy vs. protection polarity
  if (values.domainScores.intimacy.importance >= 7 && attachment.avoidanceScore > 3.5) {
    polarities.push({
      pole1: 'Part that wants deep connection',
      pole2: 'Part that fears being hurt/engulfed',
      tension: 'Approach-avoidance in intimacy',
      showsUpAs: 'Moving toward partner then pulling back; wanting closeness but feeling trapped'
    });
  }
  
  // Check for authenticity vs. harmony polarity
  if (values.domainScores.honesty.importance >= 7 && 
      (profile.conflictStyle.primaryStyle === 'avoiding' || 
       profile.conflictStyle.primaryStyle === 'yielding')) {
    polarities.push({
      pole1: 'Part that values truth and authenticity',
      pole2: 'Part that fears conflict and rejection',
      tension: 'Speaking up vs. keeping peace',
      showsUpAs: 'Knowing what you want to say but swallowing it; resentment building'
    });
  }
  
  // Check for autonomy vs. connection polarity
  if (values.domainScores.autonomy.importance >= 6 && 
      values.domainScores.intimacy.importance >= 6 &&
      Math.abs(values.domainScores.autonomy.importance - values.domainScores.intimacy.importance) <= 2) {
    polarities.push({
      pole1: 'Part that needs independence and self-direction',
      pole2: 'Part that needs closeness and togetherness',
      tension: 'Me vs. Us',
      showsUpAs: 'Feeling torn between alone time and couple time; guilt either way'
    });
  }
  
  // Calculate Self-leadership capacity
  const selfLeadership = calculateSelfLeadership(profile);
  
  return {
    parts: parts,
    polarities: polarities,
    selfLeadership: selfLeadership,
    uTurnCapacity: calculateUTurnCapacity(profile),
    relatedPatterns: patterns.patterns.filter(p => 
      p.id.includes('values') || 
      p.id.includes('differentiation')
    )
  };
}

function calculateSelfLeadership(profile) {
  // Self-leadership = ability to respond from centered Self vs. reactive parts
  // Indicators: low reactivity, high I-position, moderate neuroticism, good regulation
  
  const reactivity = profile.differentiation.subscaleNormalized.emotionalReactivity;
  const iPosition = profile.differentiation.subscaleNormalized.iPosition;
  const regulation = profile.emotionalIntelligence.subscaleNormalized.managingOwn;
  const neuroticism = 100 - profile.personality.domainPercentiles.Neuroticism;
  
  const score = Math.round((reactivity * 0.3 + iPosition * 0.3 + regulation * 0.2 + neuroticism * 0.2));
  
  let level;
  if (score >= 70) level = 'high';
  else if (score >= 50) level = 'moderate';
  else if (score >= 35) level = 'developing';
  else level = 'low';
  
  return { score, level };
}

function calculateUTurnCapacity(profile) {
  // U-Turn = ability to turn attention inward during conflict
  // Requires: self-awareness, pause capacity, willingness to look at self
  
  const selfAwareness = profile.emotionalIntelligence.subscaleNormalized.perception;
  const iPosition = profile.differentiation.subscaleNormalized.iPosition;
  const openness = profile.personality.domainPercentiles.Openness;
  
  return Math.round((selfAwareness * 0.4 + iPosition * 0.3 + openness * 0.3));
}
```

## Lens 3: Regulation & Window

**Theoretical Foundation:** Polyvagal Theory, DBT, Neuroscience

```javascript
function analyzeRegulationWindow(profile, patterns) {
  const { personality, emotionalIntelligence, differentiation, attachment } = profile;
  
  // Calculate window of tolerance width
  const windowWidth = calculateWindowWidth(profile);
  
  // Determine activation pattern (sympathetic response)
  const activationPattern = {
    triggers: [],
    physicalSigns: [],
    behavioralSigns: [],
    cognitiveSigns: [],
    typicalDuration: null
  };
  
  // High neuroticism = more easily activated
  if (personality.domainPercentiles.Neuroticism > 60) {
    activationPattern.triggers.push('criticism', 'perceived rejection', 'uncertainty');
    activationPattern.physicalSigns.push('racing heart', 'tension', 'restlessness');
    
    if (personality.facetPercentiles.N2_Anger > 60) {
      activationPattern.behavioralSigns.push('sharp tone', 'defensiveness', 'attacking');
    }
    if (personality.facetPercentiles.N1_Anxiety > 60) {
      activationPattern.behavioralSigns.push('pursuing', 'seeking reassurance', 'talking faster');
    }
    activationPattern.cognitiveSigns.push('black-and-white thinking', 'worst-case scenarios');
  }
  
  // Determine shutdown pattern (dorsal vagal response)
  const shutdownPattern = {
    triggers: [],
    physicalSigns: ['heaviness', 'numbness', 'fatigue', 'brain fog'],
    behavioralSigns: [],
    cognitiveSigns: ['hopelessness', 'going blank', 'what\'s the point'],
    typicalDuration: null
  };
  
  if (attachment.avoidanceScore > 4.0) {
    shutdownPattern.triggers.push('emotional intensity', 'demands for closeness', 'prolonged conflict');
    shutdownPattern.behavioralSigns.push('going silent', 'leaving the room', 'checking out');
  }
  
  if (profile.conflictStyle.subscaleScores.avoiding.mean > 3.5) {
    shutdownPattern.behavioralSigns.push('topic changing', 'withdrawing', 'stonewalling');
  }
  
  // Determine flooding markers
  const floodingMarkers = generateFloodingMarkers(profile);
  
  // Determine regulation toolkit
  const regulationToolkit = assessRegulationToolkit(profile);
  
  // Co-regulation pattern
  const coRegulationPattern = assessCoRegulationPattern(profile);
  
  return {
    windowWidth: windowWidth,
    activationPattern: activationPattern,
    shutdownPattern: shutdownPattern,
    floodingMarkers: floodingMarkers,
    regulationToolkit: regulationToolkit,
    coRegulationPattern: coRegulationPattern,
    regulationPriority: patterns.hasRegulationPriority,
    relatedPatterns: patterns.patterns.filter(p => 
      p.id.includes('regulation') || 
      p.id.includes('reactive')
    )
  };
}

function calculateWindowWidth(profile) {
  const neuroticism = profile.personality.domainPercentiles.Neuroticism;
  const regulation = profile.emotionalIntelligence.subscaleNormalized.managingOwn;
  const reactivity = profile.differentiation.subscaleNormalized.emotionalReactivity;
  const vulnerability = profile.personality.facetPercentiles.N6_Vulnerability || 50;
  
  // Lower neuroticism, higher regulation, higher reactivity (reversed), lower vulnerability = wider window
  const score = Math.round(
    ((100 - neuroticism) * 0.3) +
    (regulation * 0.25) +
    (reactivity * 0.25) +
    ((100 - vulnerability) * 0.2)
  );
  
  let width, description;
  if (score >= 70) {
    width = 'wide';
    description = 'Generally able to stay regulated under pressure. Can tolerate significant stress before leaving window.';
  } else if (score >= 55) {
    width = 'moderate';
    description = 'Adequate window under normal circumstances. Stress and conflict can narrow it.';
  } else if (score >= 40) {
    width = 'narrow';
    description = 'Leaves window relatively easily. Needs careful attention to regulation.';
  } else {
    width = 'very_narrow';
    description = 'Very easily dysregulated. Regulation work is top priority.';
  }
  
  return { score, width, description };
}

function generateFloodingMarkers(profile) {
  const markers = {
    physical: [],
    cognitive: [],
    behavioral: [],
    recoveryTime: null
  };
  
  // Everyone has some common flooding markers
  markers.physical.push('heart rate elevated', 'difficulty breathing deeply');
  markers.cognitive.push('can\'t hear partner\'s words', 'all-or-nothing thinking');
  
  // Personalize based on profile
  if (profile.personality.facetPercentiles.N2_Anger > 60) {
    markers.behavioral.push('raised voice', 'saying things you regret');
  }
  
  if (profile.attachment.avoidanceScore > 4.0) {
    markers.behavioral.push('sudden silence', 'walking away mid-conversation');
  }
  
  if (profile.attachment.anxietyScore > 4.0) {
    markers.behavioral.push('escalating pursuit', 'desperate attempts to resolve NOW');
  }
  
  // Estimate recovery time based on regulation capacity
  const regScore = profile.emotionalIntelligence.subscaleNormalized.managingOwn;
  if (regScore >= 70) markers.recoveryTime = '10-15 minutes';
  else if (regScore >= 50) markers.recoveryTime = '20-30 minutes';
  else markers.recoveryTime = '30+ minutes';
  
  return markers;
}

function assessRegulationToolkit(profile) {
  const toolkit = {
    strengths: [],
    gaps: [],
    recommendations: []
  };
  
  const eq = profile.emotionalIntelligence.subscaleNormalized;
  
  if (eq.perception >= 65) {
    toolkit.strengths.push('Good emotional awareness - can notice when dysregulating');
  } else {
    toolkit.gaps.push('Limited emotional awareness - may not notice dysregulation until flooded');
    toolkit.recommendations.push('Practice regular emotional check-ins');
  }
  
  if (eq.managingOwn >= 65) {
    toolkit.strengths.push('Can generally self-soothe effectively');
  } else {
    toolkit.gaps.push('Self-soothing capacity is limited');
    toolkit.recommendations.push('Build repertoire of regulation strategies');
  }
  
  if (profile.differentiation.subscaleNormalized.emotionalReactivity >= 60) {
    toolkit.strengths.push('Can maintain some calm under pressure');
  } else {
    toolkit.gaps.push('Highly reactive - quickly swept up in emotion');
    toolkit.recommendations.push('Practice pause-before-responding');
  }
  
  return toolkit;
}

function assessCoRegulationPattern(profile) {
  // Does this person reach for partner when distressed, or isolate?
  
  if (profile.attachment.avoidanceScore > 4.5) {
    return {
      pattern: 'isolates',
      description: 'Tends to self-regulate alone. May reject partner\'s attempts to soothe.',
      implication: 'Partner may feel shut out. Need to build tolerance for co-regulation.'
    };
  } else if (profile.attachment.anxietyScore > 4.5) {
    return {
      pattern: 'reaches_intensely',
      description: 'Strongly reaches for partner when distressed. May overwhelm partner.',
      implication: 'Needs to build individual regulation capacity alongside co-regulation.'
    };
  } else {
    return {
      pattern: 'balanced',
      description: 'Can use both self-regulation and partner support.',
      implication: 'Healthy flexibility in regulation strategies.'
    };
  }
}
```

## Lens 4: Values & Becoming

**Theoretical Foundation:** ACT, Developmental Theory, IBCT

```javascript
function analyzeValuesBecoming(profile, patterns) {
  const { values, personality, differentiation } = profile;
  
  // Extract core values
  const coreValues = values.top5Values.map(domainId => ({
    domain: domainId,
    importance: values.domainScores[domainId].importance,
    accordance: values.domainScores[domainId].accordance,
    gap: values.domainScores[domainId].gap
  }));
  
  // Identify values-pattern conflicts
  const valuesPatternConflicts = patterns.patterns
    .filter(p => p.flags?.includes('core_values_conflict'))
    .map(p => ({
      pattern: p.id,
      description: p.description,
      interpretation: p.interpretation
    }));
  
  // Calculate values-behavior congruence
  const congruenceScore = calculateValuesCongruence(profile);
  
  // Identify developmental invitation
  const developmentalInvitation = generateDevelopmentalInvitation(profile, patterns);
  
  // Identify willingness requirements
  const willingnessRequirements = identifyWillingnessRequirements(profile, patterns);
  
  // Partner identity from qualitative
  const partnerIdentity = values.qualitativeResponses.partnerIdentity;
  const nonNegotiables = values.qualitativeResponses.nonNegotiables;
  const aspirationalVision = values.qualitativeResponses.aspirationalVision;
  
  return {
    coreValues: coreValues,
    valuesPatternConflicts: valuesPatternConflicts,
    congruenceScore: congruenceScore,
    highGapDomains: values.highGapDomains,
    developmentalInvitation: developmentalInvitation,
    willingnessRequirements: willingnessRequirements,
    qualitativeInsights: {
      partnerIdentity: partnerIdentity,
      nonNegotiables: nonNegotiables,
      aspirationalVision: aspirationalVision
    },
    avoidanceTendency: values.avoidanceTendency,
    relatedPatterns: patterns.patterns.filter(p => 
      p.id.includes('values') || 
      p.flags?.includes('growth_edge_candidate')
    )
  };
}

function calculateValuesCongruence(profile) {
  // How well do behavioral patterns align with stated values?
  
  let alignmentScore = 100;
  let conflicts = [];
  
  // Check each major values-behavior alignment
  const { values, attachment, conflictStyle, differentiation } = profile;
  
  // Honesty + avoidance = conflict
  if (values.domainScores.honesty.importance >= 7) {
    if (conflictStyle.subscaleScores.avoiding.mean > 3.0) {
      alignmentScore -= 15;
      conflicts.push('honesty vs. conflict avoidance');
    }
    if (values.avoidanceTendency > 0.25) {
      alignmentScore -= 10;
      conflicts.push('honesty vs. avoidance in scenarios');
    }
  }
  
  // Intimacy + avoidant attachment = conflict
  if (values.domainScores.intimacy.importance >= 7) {
    if (attachment.avoidanceScore > 4.0) {
      alignmentScore -= 15;
      conflicts.push('intimacy value vs. avoidant pattern');
    }
  }
  
  // Autonomy + fusion = conflict
  if (values.domainScores.autonomy.importance >= 7) {
    if (differentiation.subscaleNormalized.fusionWithOthers < 40) {
      alignmentScore -= 12;
      conflicts.push('autonomy value vs. fusion pattern');
    }
  }
  
  return {
    score: Math.max(0, alignmentScore),
    conflicts: conflicts,
    level: alignmentScore >= 80 ? 'high' : alignmentScore >= 60 ? 'moderate' : 'low'
  };
}

function generateDevelopmentalInvitation(profile, patterns) {
  // What is this person's primary growth edge?
  
  const invitations = [];
  
  // Check for common developmental invitations
  if (profile.attachment.anxietyScore > 4.0 && 
      profile.conflictStyle.subscaleScores.avoiding.mean > 3.0) {
    invitations.push({
      invitation: 'Express needs directly before they become resentments',
      description: 'Learn to treat your needs as legitimate information, not impositions. Share wants before deciding if they\'re reasonable.',
      difficulty: 'high',
      discomfort: 'Fear of rejection, vulnerability of direct ask'
    });
  }
  
  if (profile.attachment.avoidanceScore > 4.0) {
    invitations.push({
      invitation: 'Tolerate closeness without fleeing',
      description: 'Practice staying present when intimacy feels overwhelming. Notice the urge to withdraw without acting on it.',
      difficulty: 'high',
      discomfort: 'Fear of engulfment, vulnerability of being known'
    });
  }
  
  if (profile.differentiation.subscaleNormalized.iPosition < 45) {
    invitations.push({
      invitation: 'Define and express what you actually believe',
      description: 'Practice knowing your own position before automatically deferring to your partner. "I think..." before "What do you think?"',
      difficulty: 'medium',
      discomfort: 'Fear of disagreement, uncertainty about own views'
    });
  }
  
  if (profile.differentiation.subscaleNormalized.fusionWithOthers < 40) {
    invitations.push({
      invitation: 'Maintain self while staying connected',
      description: 'Keep your own activities, opinions, and identity even as you build "us." Both/and, not either/or.',
      difficulty: 'medium',
      discomfort: 'Fear that separateness means disconnection'
    });
  }
  
  return invitations.slice(0, 2); // Return top 2 most relevant
}

function identifyWillingnessRequirements(profile, patterns) {
  // What discomfort would this person need to be willing to feel?
  
  const requirements = [];
  
  if (profile.attachment.anxietyScore > 3.5) {
    requirements.push('The fear of rejection when expressing needs directly');
    requirements.push('The uncertainty of not knowing if you\'re "too much"');
  }
  
  if (profile.attachment.avoidanceScore > 3.5) {
    requirements.push('The vulnerability of being truly seen');
    requirements.push('The discomfort of staying present when you want to flee');
  }
  
  if (profile.conflictStyle.subscaleScores.avoiding.mean > 3.0) {
    requirements.push('The tension of disagreement');
    requirements.push('The anxiety of not knowing how conflict will resolve');
  }
  
  return requirements;
}
```

---

# 5. Negative Cycle Prediction

```javascript
function predictNegativeCycle(profile, patterns) {
  const { attachment, conflictStyle, differentiation } = profile;
  
  // Determine likely cycle position
  let position;
  let positionConfidence;
  
  // Classic pursue-withdraw mapping
  if (attachment.anxietyScore > attachment.avoidanceScore + 0.5) {
    position = 'pursuer';
    positionConfidence = 'high';
  } else if (attachment.avoidanceScore > attachment.anxietyScore + 0.5) {
    position = 'withdrawer';
    positionConfidence = 'high';
  } else if (attachment.attachmentStyle === 'fearful-avoidant') {
    position = 'mixed';
    positionConfidence = 'high';
  } else {
    // Check conflict style for additional signal
    if (conflictStyle.subscaleScores.forcing.mean > conflictStyle.subscaleScores.avoiding.mean) {
      position = 'pursuer';
      positionConfidence = 'medium';
    } else if (conflictStyle.subscaleScores.avoiding.mean > conflictStyle.subscaleScores.forcing.mean) {
      position = 'withdrawer';
      positionConfidence = 'medium';
    } else {
      position = 'flexible';
      positionConfidence = 'medium';
    }
  }
  
  // Generate cycle description
  let cycleDescription;
  if (position === 'pursuer') {
    cycleDescription = {
      yourMove: 'When you sense distance or disconnection, you move toward your partner - seeking reassurance, wanting to talk it through, pursuing resolution.',
      underneathYourMove: 'Fear of abandonment, need to know you matter, anxiety about the relationship',
      partnerExperiences: 'Pressure, criticism, not being enough, being chased',
      escalationRisk: 'If pursuit isn\'t met, you may escalate (more intense pursuit) or flip to withdrawal'
    };
  } else if (position === 'withdrawer') {
    cycleDescription = {
      yourMove: 'When conflict arises or emotions intensify, you pull back - needing space, going quiet, shutting down.',
      underneathYourMove: 'Fear of overwhelm, need for safety, self-protection from flooding',
      partnerExperiences: 'Abandonment, rejection, being shut out, not mattering',
      escalationRisk: 'Partner\'s pursuit in response to your withdrawal may trigger more withdrawal'
    };
  } else {
    cycleDescription = {
      yourMove: 'Your position shifts depending on context - sometimes pursuing, sometimes withdrawing.',
      underneathYourMove: 'Both fear of abandonment AND fear of engulfment; approach-avoidance conflict',
      partnerExperiences: 'Confusion, unpredictability, not knowing which "you" will show up',
      escalationRisk: 'Pattern may be disorganized and harder to predict or interrupt'
    };
  }
  
  // Identify cycle triggers
  const cycleTriggers = identifyCycleTriggers(profile, position);
  
  // Identify cycle de-escalators
  const deEscalators = identifyDeEscalators(profile, position);
  
  return {
    position: position,
    positionConfidence: positionConfidence,
    cycleDescription: cycleDescription,
    triggers: cycleTriggers,
    deEscalators: deEscalators,
    repairReadiness: assessRepairReadiness(profile)
  };
}

function identifyCycleTriggers(profile, position) {
  const triggers = [];
  
  if (position === 'pursuer' || position === 'mixed') {
    triggers.push({
      trigger: 'Partner seems distant or preoccupied',
      yourResponse: 'Anxiety rises, move toward to check connection'
    });
    triggers.push({
      trigger: 'Partner doesn\'t respond as expected',
      yourResponse: 'Interpret as rejection, intensify pursuit'
    });
    triggers.push({
      trigger: 'Unresolved issue lingering',
      yourResponse: 'Need to resolve it NOW, can\'t let it go'
    });
  }
  
  if (position === 'withdrawer' || position === 'mixed') {
    triggers.push({
      trigger: 'Conversation becoming emotionally intense',
      yourResponse: 'Feel flooded, need to escape'
    });
    triggers.push({
      trigger: 'Partner expressing criticism or complaints',
      yourResponse: 'Shut down, stop engaging'
    });
    triggers.push({
      trigger: 'Feeling like nothing you do is right',
      yourResponse: 'Give up, withdraw completely'
    });
  }
  
  return triggers;
}

function identifyDeEscalators(profile, position) {
  const deEscalators = [];
  
  if (position === 'pursuer') {
    deEscalators.push('Partner offering reassurance without you having to ask');
    deEscalators.push('Clear commitment to returning to the conversation');
    deEscalators.push('Physical affection or proximity');
  }
  
  if (position === 'withdrawer') {
    deEscalators.push('Permission to take a break with agreed return time');
    deEscalators.push('Lowered emotional intensity');
    deEscalators.push('Feeling like you won\'t be attacked when you do engage');
  }
  
  deEscalators.push('Acknowledgment of the cycle itself: "We\'re doing our thing again"');
  deEscalators.push('Repair attempt from either partner');
  
  return deEscalators;
}

function assessRepairReadiness(profile) {
  // How ready is this person to make/receive repair attempts?
  
  const factors = {
    canMakeRepair: profile.emotionalIntelligence.subscaleNormalized.managingOthers > 50,
    canReceiveRepair: profile.differentiation.subscaleNormalized.emotionalReactivity > 40,
    repairStyle: null
  };
  
  if (profile.personality.facetPercentiles.A3_Altruism > 60) {
    factors.repairStyle = 'tends to repair through caring actions';
  } else if (profile.personality.facetPercentiles.E6_Cheerfulness > 60) {
    factors.repairStyle = 'tends to repair through humor and lightness';
  } else if (profile.conflictStyle.subscaleScores.compromising.mean > 3.5) {
    factors.repairStyle = 'tends to repair through compromise offers';
  }
  
  return factors;
}
```

---

# 6. Growth Edge Identification

```javascript
function identifyGrowthEdges(profile, patterns, lensAnalysis) {
  const candidates = [];
  
  // Source 1: Values-pattern conflicts
  lensAnalysis.valuesBecoming.valuesPatternConflicts.forEach(conflict => {
    candidates.push({
      source: 'values_conflict',
      id: conflict.pattern,
      description: conflict.description,
      interpretation: conflict.interpretation,
      priority: 'high'
    });
  });
  
  // Source 2: Developmental invitations
  lensAnalysis.valuesBecoming.developmentalInvitation.forEach(inv => {
    candidates.push({
      source: 'developmental',
      id: inv.invitation.toLowerCase().replace(/\s+/g, '_'),
      description: inv.invitation,
      interpretation: inv.description,
      discomfort: inv.discomfort,
      priority: inv.difficulty === 'high' ? 'high' : 'medium'
    });
  });
  
  // Source 3: High-gap value domains
  profile.values.highGapDomains.forEach(domain => {
    candidates.push({
      source: 'values_gap',
      id: `gap_${domain}`,
      description: `Living more fully into ${domain}`,
      interpretation: `High importance but low current accordance in ${domain}`,
      priority: 'medium'
    });
  });
  
  // Source 4: Regulation deficits (if flagged)
  if (patterns.hasRegulationPriority) {
    candidates.push({
      source: 'regulation',
      id: 'regulation_capacity',
      description: 'Building self-regulation capacity',
      interpretation: 'Multiple indicators suggest regulation is a foundational growth area',
      priority: 'high'
    });
  }
  
  // Source 5: Differentiation needs
  if (profile.differentiation.totalNormalized < 45) {
    candidates.push({
      source: 'differentiation',
      id: 'differentiation_self',
      description: 'Developing a clearer, more stable sense of self',
      interpretation: 'Building differentiation will support all other relationship work',
      priority: 'high'
    });
  }
  
  // Deduplicate and prioritize
  const uniqueCandidates = deduplicateGrowthEdges(candidates);
  const prioritized = prioritizeGrowthEdges(uniqueCandidates, profile, patterns);
  
  // Select top 2-3
  const selected = prioritized.slice(0, 3);
  
  // Generate full growth edge objects
  return selected.map(edge => generateFullGrowthEdge(edge, profile, patterns, lensAnalysis));
}

function generateFullGrowthEdge(edge, profile, patterns, lensAnalysis) {
  return {
    id: edge.id,
    title: edge.description,
    
    pattern: {
      description: generatePatternDescription(edge, profile),
      behavioral: generateBehavioralDescription(edge, profile)
    },
    
    protection: {
      function: generateProtectionFunction(edge, profile),
      origin: generateProtectionOrigin(edge, profile)
    },
    
    cost: {
      toSelf: generateCostToSelf(edge, profile),
      toRelationship: generateCostToRelationship(edge, profile),
      toPartner: generateCostToPartner(edge, profile)
    },
    
    invitation: {
      description: edge.interpretation,
      whatGrowthLooksLike: generateGrowthDescription(edge, profile),
      notAbout: generateNotAbout(edge)
    },
    
    practice: {
      daily: generateDailyPractice(edge, profile),
      weekly: generateWeeklyPractice(edge, profile),
      inMoment: generateInMomentPractice(edge, profile)
    },
    
    anchor: generateAnchorPhrase(edge, profile),
    
    relatedLens: edge.source
  };
}

function generatePatternDescription(edge, profile) {
  // Generate natural language description of the pattern
  // This would use template strings based on edge type and profile data
  
  const templates = {
    'anxious_but_avoiding': 'You want connection deeply, but when the moment comes to express a need or address an issue, something stops you. You assess it as "not worth it" or "not the right time" and swallow it.',
    
    'values_honesty_avoids_conflict': 'You value authenticity and truth-telling, but your protective system has learned that speaking up risks conflict, rejection, or being "too much." So you edit. You soften. You hold back.',
    
    'values_intimacy_avoids_closeness': 'You long for deep connection - it\'s one of your highest values. But when intimacy is actually offered, when someone moves close, a part of you gets nervous and creates distance.',
    
    'regulation_capacity': 'Your nervous system is sensitive. You leave your window of tolerance relatively quickly, and when you\'re outside it, you lose access to your best thinking and your most connected self.',
    
    'differentiation_self': 'In relationships, you tend to lose track of what you actually think, feel, want, and believe. Your sense of self becomes porous, shaped more by your partner than by your own inner compass.'
  };
  
  return templates[edge.id] || edge.interpretation;
}

function generateDailyPractice(edge, profile) {
  const practices = {
    'anxious_but_avoiding': 'Once today, express one small want, need, or preference to your partner - before you\'ve decided whether it\'s reasonable.',
    
    'values_honesty_avoids_conflict': 'Once today, say something true that you would normally edit or soften. Start small.',
    
    'values_intimacy_avoids_closeness': 'Once today, stay present in a moment of closeness 10% longer than is comfortable. Notice the urge to pull away. Stay anyway.',
    
    'regulation_capacity': 'Three times today, pause and notice your nervous system state. Not to change it - just to notice.',
    
    'differentiation_self': 'Once today, when asked what you want or think, pause before answering. Check inside rather than scanning your partner\'s face for the "right" answer.'
  };
  
  return practices[edge.id] || 'Practice noticing when this pattern shows up, without trying to change it yet.';
}

function generateAnchorPhrase(edge, profile) {
  const anchors = {
    'anxious_but_avoiding': 'My needs are information, not imposition. Expressing them is an act of intimacy, not aggression.',
    
    'values_honesty_avoids_conflict': 'Truth-telling in service of connection is not the same as conflict. My partner deserves to know who I really am.',
    
    'values_intimacy_avoids_closeness': 'Closeness feels dangerous because it was dangerous once. It doesn\'t have to be dangerous now.',
    
    'regulation_capacity': 'When I\'m flooded, I\'ve lost access to myself. Regulation comes first, everything else comes second.',
    
    'differentiation_self': 'I can be connected AND have my own self. Both/and, not either/or.'
  };
  
  return anchors[edge.id] || 'This pattern protected me once. I can honor it while choosing something new.';
}
```

---

# 7. Anchor Point Generation

```javascript
function generateAnchorPoints(profile, patterns, lensAnalysis) {
  return {
    whenActivated: generateActivatedAnchors(profile, lensAnalysis),
    whenShutdown: generateShutdownAnchors(profile, lensAnalysis),
    patternInterrupts: generatePatternInterrupts(profile, patterns, lensAnalysis),
    repairReadiness: generateRepairReadinessAnchors(profile, lensAnalysis),
    selfCompassion: generateSelfCompassionAnchors(profile, lensAnalysis)
  };
}

function generateActivatedAnchors(profile, lensAnalysis) {
  const { regulationWindow, attachmentProtection } = lensAnalysis;
  
  return {
    whatToRemember: [
      'This feeling is your nervous system\'s alarm - it\'s trying to protect you.',
      `Underneath the ${attachmentProtection.emotionalStructure.secondary}, there\'s ${attachmentProtection.emotionalStructure.primary}.`,
      `What you\'re actually seeking right now is ${formatLonging(attachmentProtection.emotionalStructure.longing)}.`,
      'Anything you say or decide while flooded isn\'t your best thinking.'
    ],
    
    whatToDo: [
      regulationWindow.regulationToolkit.strengths.length > 0 
        ? `Use what works for you: ${regulationWindow.regulationToolkit.recommendations[0] || 'slow breathing, physical grounding'}`
        : 'Try: feet on floor, slow exhale, cold water on wrists',
      'Tell your partner: "I\'m activated. I need a moment before I can think clearly."',
      'If possible, move your body - even briefly'
    ],
    
    whatNotToDo: [
      profile.attachment.anxietyScore > 4 
        ? 'Don\'t demand resolution right now - it will escalate'
        : 'Don\'t withdraw completely - say you\'re stepping back',
      'Don\'t make permanent decisions from this state',
      'Don\'t send the text you\'re composing in your head'
    ]
  };
}

function generateShutdownAnchors(profile, lensAnalysis) {
  return {
    whatToRemember: [
      'Shutdown is a protective response - your system is trying to keep you safe.',
      'You haven\'t stopped caring. You\'re overwhelmed.',
      'This isn\'t permanent. You can come back when you\'re ready.'
    ],
    
    whatToDo: [
      'Name it to your partner: "I\'ve gone quiet. I\'m not abandoning you - I\'m overwhelmed."',
      'Give a return time: "I need 20 minutes and then I\'ll come back."',
      'Gentle movement can help: walking, stretching, splashing water on face'
    ],
    
    whatNotToDo: [
      'Don\'t disappear without explanation',
      'Don\'t let hours pass without checking in',
      'Don\'t assume the issue is resolved just because the conversation stopped'
    ]
  };
}

function generatePatternInterrupts(profile, patterns, lensAnalysis) {
  const interrupts = [
    '"This is our cycle. I\'m doing my move right now."',
    '"What am I really feeling underneath this?"',
    `"What would ${profile.values.top5Values[0]} have me do right now?"`,
    '"What does my partner actually need to hear from me?"'
  ];
  
  // Add attachment-specific interrupts
  if (profile.attachment.anxietyScore > 4) {
    interrupts.push('"Is this fear talking, or is there a real problem?"');
    interrupts.push('"What if I asked directly instead of trying to figure it out?"');
  }
  
  if (profile.attachment.avoidanceScore > 4) {
    interrupts.push('"What if I stayed 2 more minutes instead of leaving?"');
    interrupts.push('"What would happen if I let them see this?"');
  }
  
  // Add parts language
  interrupts.push(`"A part of me wants to ${lensAnalysis.partsPolarities.parts[0]?.showsUpAs || 'protect'} - what does that part need?"`)
  
  return interrupts;
}

function generateRepairReadinessAnchors(profile, lensAnalysis) {
  return {
    signsYoureReady: [
      'Your breathing has slowed',
      'You can imagine your partner\'s perspective (even if you disagree)',
      'You feel some care or softness alongside the hurt',
      'You want connection more than you want to be right'
    ],
    
    signsYoureNotReady: [
      'You\'re still composing arguments in your head',
      'You can\'t imagine anything good about your partner right now',
      'Your body still feels activated or numb',
      'You need them to apologize first'
    ],
    
    repairStarters: generateRepairStarters(profile)
  };
}

function generateRepairStarters(profile) {
  const starters = [
    '"I don\'t want to fight. I want to understand."',
    '"Can we start over? I don\'t like how that went."',
    '"I\'m sorry for my part in this."'
  ];
  
  if (profile.personality.facetPercentiles.E6_Cheerfulness > 60) {
    starters.push('"Well, that was a mess. Hug?"');
  }
  
  if (profile.attachment.anxietyScore > 4) {
    starters.push('"I got scared. I need to know we\'re okay."');
  }
  
  if (profile.attachment.avoidanceScore > 4) {
    starters.push('"I shut down. I\'m back now. I\'m sorry."');
  }
  
  return starters;
}

function generateSelfCompassionAnchors(profile, lensAnalysis) {
  return {
    reminders: [
      'Your protective parts developed for good reasons.',
      'You\'re learning. This is what learning looks like.',
      'You can do better next time. This time is data.',
      'Your partner chose you knowing you\'re imperfect. You can be imperfect.'
    ],
    
    personalizedMessage: generatePersonalizedCompassionMessage(profile, lensAnalysis)
  };
}

function generatePersonalizedCompassionMessage(profile, lensAnalysis) {
  if (profile.attachment.attachmentStyle === 'anxious-preoccupied') {
    return 'Your need for closeness isn\'t too much - it\'s human. The work is learning to trust that you can be loved without constant proof.';
  } else if (profile.attachment.attachmentStyle === 'dismissive-avoidant') {
    return 'Your independence isn\'t cold - it\'s how you learned to survive. The work is discovering that needing someone won\'t destroy you.';
  } else if (profile.attachment.attachmentStyle === 'fearful-avoidant') {
    return 'Your confusion about closeness makes complete sense given what you learned. Both the longing and the fear are valid. You don\'t have to choose.';
  } else {
    return 'You\'re doing the work of growing. That takes courage. Be patient with yourself.';
  }
}
```

---

# 8. Partner Support Guide Generation

```javascript
function generatePartnerGuide(profile, patterns, lensAnalysis) {
  const { attachmentProtection, regulationWindow, negativeCycle } = lensAnalysis;
  
  return {
    howIWork: generateHowIWork(profile, attachmentProtection),
    whenImActivated: generateWhenActivatedGuide(profile, regulationWindow),
    whenImShutdown: generateWhenShutdownGuide(profile, regulationWindow),
    repairAttempts: generateRepairGuide(profile),
    whatIWantYouToRemember: generateCoreMessage(profile, attachmentProtection)
  };
}

function generateHowIWork(profile, attachmentProtection) {
  const insights = [];
  
  // Attachment insight
  if (profile.attachment.attachmentStyle === 'anxious-preoccupied') {
    insights.push({
      insight: 'I need more reassurance than might seem logical',
      explanation: 'When I seem clingy or checking in a lot, I\'m not trying to control you. I\'m managing anxiety about whether we\'re okay.'
    });
  } else if (profile.attachment.attachmentStyle === 'dismissive-avoidant') {
    insights.push({
      insight: 'My need for space isn\'t about you',
      explanation: 'When I withdraw, I\'m not rejecting you. I\'m managing overwhelm. I come back faster when I\'m not chased.'
    });
  } else if (profile.attachment.attachmentStyle === 'fearful-avoidant') {
    insights.push({
      insight: 'I may seem confusing because I\'m confused',
      explanation: 'I both want closeness and fear it. If I pull you close then push you away, it\'s my internal conflict - not mixed messages about you.'
    });
  }
  
  // Conflict insight
  if (profile.conflictStyle.primaryStyle === 'avoiding') {
    insights.push({
      insight: 'I avoid conflict because it overwhelms me, not because I don\'t care',
      explanation: 'When I go quiet in a fight, I haven\'t stopped caring. I\'ve hit capacity. I need a break, not abandonment.'
    });
  }
  
  // Triggers summary
  insights.push({
    insight: 'What tends to trigger me',
    explanation: attachmentProtection.triggers.map(t => t.trigger).join('; ')
  });
  
  return insights;
}

function generateWhenActivatedGuide(profile, regulationWindow) {
  return {
    whatHelps: [
      profile.attachment.anxietyScore > 4 
        ? 'Reassurance that we\'re okay and you\'re not leaving'
        : 'Space to process without pressure',
      'A calm, non-defensive tone',
      'Acknowledgment of my feelings before problem-solving',
      regulationWindow.coRegulationPattern.pattern === 'reaches_intensely'
        ? 'Physical proximity if I want it'
        : 'Giving me room to self-regulate first'
    ],
    
    whatDoesntHelp: [
      profile.attachment.anxietyScore > 4
        ? 'Dismissing my concerns as irrational'
        : 'Pursuing me for immediate resolution',
      'Matching my intensity',
      'Telling me to calm down',
      'Walking away without explanation'
    ],
    
    whatToSay: [
      '"I hear you. I\'m not going anywhere."',
      '"Let\'s slow down. We can figure this out."',
      '"What do you need right now?"'
    ]
  };
}

function generateWhenShutdownGuide(profile, regulationWindow) {
  return {
    whatHelps: [
      'Giving me time without disappearing yourself',
      'Gentle presence without demands',
      'Agreeing on a time to reconnect',
      'Lower-intensity connection (sitting together, not talking)'
    ],
    
    whatDoesntHelp: [
      'Demanding I engage immediately',
      'Escalating to get a response',
      'Interpreting my silence as not caring',
      'Leaving without saying anything'
    ],
    
    whatToSay: [
      '"I can see you\'re overwhelmed. I\'ll be here when you\'re ready."',
      '"Take the time you need. Just let me know you\'re coming back."',
      '"I love you even when we\'re struggling."'
    ]
  };
}

function generateCoreMessage(profile, attachmentProtection) {
  const messages = [];
  
  messages.push({
    message: `What I\'m usually seeking underneath my reactions is ${formatLonging(attachmentProtection.emotionalStructure.longing)}.`
  });
  
  if (profile.attachment.anxietyScore > 4) {
    messages.push({
      message: 'When I\'m at my most difficult, I\'m usually most scared that I don\'t matter to you.'
    });
  }
  
  if (profile.attachment.avoidanceScore > 4) {
    messages.push({
      message: 'When I pull away, it\'s not that I don\'t love you. It\'s that I\'m trying to protect something - usually myself from overwhelm, or us from my worst reactions.'
    });
  }
  
  messages.push({
    message: 'I\'m working on this. Your patience helps more than you know.'
  });
  
  return messages;
}
```

---

# 9. Narrative Synthesis

```javascript
function synthesizeNarrative(profile, patterns, lensAnalysis) {
  // Generate the unified narrative portrait
  // This is the "Section B" narrative that weaves all lenses together
  
  return {
    openingParagraph: generateOpeningParagraph(profile, lensAnalysis),
    attachmentStory: generateAttachmentStory(profile, lensAnalysis),
    protectiveStrategies: generateProtectiveStrategiesNarrative(profile, lensAnalysis),
    strengthsAndCapacities: generateStrengthsNarrative(profile, lensAnalysis),
    tensionsAndConflicts: generateTensionsNarrative(profile, patterns, lensAnalysis),
    developmentalDirection: generateDevelopmentalNarrative(profile, lensAnalysis),
    closingParagraph: generateClosingParagraph(profile, lensAnalysis)
  };
}

function generateOpeningParagraph(profile, lensAnalysis) {
  // Template-based generation with personalization
  
  const attachment = profile.attachment.attachmentStyle;
  const topValue = profile.values.top5Values[0];
  const regulationWidth = lensAnalysis.regulationWindow.windowWidth.width;
  
  let opening;
  
  if (attachment === 'anxious-preoccupied') {
    opening = `You carry a deep capacity for connection and a keen attunement to relationship dynamics. Your heart is oriented toward closeness - ${topValue} ranks among your highest values, and you bring genuine investment to your relationships. `;
    opening += `At the same time, your attachment pattern suggests that early experiences taught you to be vigilant about connection - to monitor for signs of distance, to worry about whether you matter, to feel the precariousness of love.`;
  } else if (attachment === 'dismissive-avoidant') {
    opening = `You bring a quality of independence and self-sufficiency to your relationships. You've developed the capacity to manage your own emotional landscape, and you don't easily get pulled into drama or reactivity. `;
    opening += `This self-reliance, however, came at a cost. Somewhere you learned that depending on others leads to disappointment, that needs are best kept to yourself, that closeness beyond a certain point becomes uncomfortable.`;
  } else if (attachment === 'fearful-avoidant') {
    opening = `You live with a fundamental tension that shapes your relational world: a deep longing for connection paired with an equally deep wariness about its costs. This isn't confusion or inconsistency - it's the logical outcome of learning that love is both necessary and dangerous.`;
  } else {
    opening = `You bring a relatively secure foundation to your relationships - a basic trust that connection is possible and that you're worthy of it. This doesn't mean you're without challenges, but it does mean you have a stable base to work from.`;
  }
  
  return opening;
}

function generateAttachmentStory(profile, lensAnalysis) {
  // Narrative about attachment pattern
  return lensAnalysis.attachmentProtection.narrative;
}

function generateProtectiveStrategiesNarrative(profile, lensAnalysis) {
  const strategies = [];
  
  // From attachment
  strategies.push({
    strategy: lensAnalysis.attachmentProtection.protectiveStrategy,
    function: 'Manages attachment anxiety',
    cost: 'May create distance or overwhelm partner'
  });
  
  // From parts
  lensAnalysis.partsPolarities.parts.forEach(part => {
    strategies.push({
      strategy: part.name,
      function: part.function,
      cost: part.showsUpAs
    });
  });
  
  return strategies;
}

function generateTensionsNarrative(profile, patterns, lensAnalysis) {
  // Describe the core tensions/polarities
  const tensions = [];
  
  lensAnalysis.partsPolarities.polarities.forEach(polarity => {
    tensions.push({
      between: `${polarity.pole1} and ${polarity.pole2}`,
      showsUpAs: polarity.showsUpAs
    });
  });
  
  lensAnalysis.valuesBecoming.valuesPatternConflicts.forEach(conflict => {
    tensions.push({
      between: conflict.description,
      showsUpAs: conflict.interpretation
    });
  });
  
  return tensions;
}

function generateDevelopmentalNarrative(profile, lensAnalysis) {
  // The growth direction
  const invitations = lensAnalysis.valuesBecoming.developmentalInvitation;
  
  return {
    primaryInvitation: invitations[0]?.invitation || 'Continued growth in self-awareness and relational skill',
    whatGrowthLooksLike: invitations[0]?.description || 'Expanding your capacity to stay present and connected',
    whatItRequires: lensAnalysis.valuesBecoming.willingnessRequirements.slice(0, 2)
  };
}
```

---

# 10. Output Schema

```typescript
interface IntegratedPortrait {
  // Metadata
  userId: string;
  generatedAt: Date;
  assessmentProfileId: string;
  version: string;
  
  // Section A: Snapshot
  snapshot: {
    attachment: {
      anxietyScore: number;
      avoidanceScore: number;
      style: string;
      quadrantPosition: { x: number; y: number };
    };
    personality: {
      domainPercentiles: Record<string, number>;
      topFacets: Array<{ name: string; percentile: number }>;
      bottomFacets: Array<{ name: string; percentile: number }>;
    };
    values: {
      top5: string[];
      highGapDomains: string[];
    };
    emotionalIntelligence: {
      totalNormalized: number;
      subscaleNormalized: Record<string, number>;
    };
    conflictStyle: {
      primaryStyle: string;
      secondaryStyle: string;
    };
    differentiation: {
      totalNormalized: number;
      subscaleNormalized: Record<string, number>;
    };
  };
  
  // Section B: Four-Lens Analysis
  lensAnalysis: {
    attachmentProtection: AttachmentProtectionAnalysis;
    partsPolarities: PartsAnalysis;
    regulationWindow: RegulationAnalysis;
    valuesBecoming: ValuesAnalysis;
  };
  
  // Section C: Negative Cycle
  negativeCycle: {
    position: 'pursuer' | 'withdrawer' | 'mixed' | 'flexible';
    positionConfidence: 'high' | 'medium' | 'low';
    cycleDescription: {
      yourMove: string;
      underneathYourMove: string;
      partnerExperiences: string;
      escalationRisk: string;
    };
    triggers: Array<{ trigger: string; yourResponse: string }>;
    deEscalators: string[];
  };
  
  // Section D: Growth Edges
  growthEdges: Array<{
    id: string;
    title: string;
    pattern: { description: string; behavioral: string };
    protection: { function: string; origin: string };
    cost: { toSelf: string; toRelationship: string; toPartner: string };
    invitation: { description: string; whatGrowthLooksLike: string; notAbout: string };
    practice: { daily: string; weekly: string; inMoment: string };
    anchor: string;
  }>;
  
  // Section E: Anchor Points
  anchorPoints: {
    whenActivated: {
      whatToRemember: string[];
      whatToDo: string[];
      whatNotToDo: string[];
    };
    whenShutdown: {
      whatToRemember: string[];
      whatToDo: string[];
      whatNotToDo: string[];
    };
    patternInterrupts: string[];
    repairReadiness: {
      signsYoureReady: string[];
      signsYoureNotReady: string[];
      repairStarters: string[];
    };
    selfCompassion: {
      reminders: string[];
      personalizedMessage: string;
    };
  };
  
  // Section F: Partner Guide
  partnerGuide: {
    howIWork: Array<{ insight: string; explanation: string }>;
    whenImActivated: {
      whatHelps: string[];
      whatDoesntHelp: string[];
      whatToSay: string[];
    };
    whenImShutdown: {
      whatHelps: string[];
      whatDoesntHelp: string[];
      whatToSay: string[];
    };
    repairAttempts: string[];
    whatIWantYouToRemember: Array<{ message: string }>;
  };
  
  // Section G: Deepening Questions
  deepeningQuestions: {
    forReflection: string[];
    forPartnerConversation: string[];
    forAgentExploration: string[];
  };
  
  // Narrative Synthesis
  narrative: {
    openingParagraph: string;
    attachmentStory: string;
    protectiveStrategies: Array<{ strategy: string; function: string; cost: string }>;
    strengthsAndCapacities: string[];
    tensionsAndConflicts: Array<{ between: string; showsUpAs: string }>;
    developmentalDirection: {
      primaryInvitation: string;
      whatGrowthLooksLike: string;
      whatItRequires: string[];
    };
    closingParagraph: string;
  };
  
  // Agent Instructions (internal use)
  agentInstructions: {
    priorityPatterns: string[];
    regulationFirst: boolean;
    activationTriggers: string[];
    shutdownTriggers: string[];
    effectiveInterventions: string[];
    avoidInterventions: string[];
    growthEdgeTracking: Array<{ edgeId: string; indicators: string[] }>;
  };
  
  // Detected Patterns (internal use)
  patterns: {
    patterns: Array<{
      id: string;
      description: string;
      interpretation: string;
      confidence: string;
      flags: string[];
    }>;
    priorityFlags: string[];
  };
}
```

---

# 11. Quality Assurance Rules

## Validation Rules

```javascript
function validatePortrait(portrait) {
  const errors = [];
  const warnings = [];
  
  // Rule 1: Must have at least 2 growth edges
  if (portrait.growthEdges.length < 2) {
    errors.push('Insufficient growth edges identified');
  }
  
  // Rule 2: Narrative must be present
  if (!portrait.narrative.openingParagraph) {
    errors.push('Missing narrative synthesis');
  }
  
  // Rule 3: Anchor points must be populated
  if (portrait.anchorPoints.whenActivated.whatToRemember.length < 2) {
    warnings.push('Sparse activation anchors');
  }
  
  // Rule 4: Partner guide must be actionable
  if (portrait.partnerGuide.whenImActivated.whatHelps.length < 3) {
    warnings.push('Partner guide may be insufficiently specific');
  }
  
  // Rule 5: Growth edge practices must be concrete
  portrait.growthEdges.forEach(edge => {
    if (edge.practice.daily.length < 20) {
      warnings.push(`Growth edge "${edge.id}" has vague daily practice`);
    }
  });
  
  // Rule 6: Consistency check - attachment should align with cycle position
  const attachment = portrait.snapshot.attachment.style;
  const position = portrait.negativeCycle.position;
  if (attachment === 'anxious-preoccupied' && position === 'withdrawer') {
    warnings.push('Unusual: anxious attachment with withdrawer position - verify');
  }
  
  return { valid: errors.length === 0, errors, warnings };
}
```

## Compassion Guidelines

The portrait must:

1. **Describe patterns as protective, not pathological**
   - "Your withdrawing pattern developed to protect you from overwhelm"
   - NOT "You have an avoidant pattern that damages relationships"

2. **Honor the function before naming the cost**
   - First: What this pattern was trying to do
   - Then: What it costs now

3. **Frame growth as expansion, not fixing**
   - "Expanding your repertoire to include..."
   - NOT "Fixing your tendency to..."

4. **Use second person for connection**
   - "You tend to..." not "This person tends to..."

5. **Include strength recognition**
   - Every lens analysis should note what's working, not just what's challenging

## Readability Guidelines

1. **Avoid jargon without explanation**
   - If using "differentiation," explain it
   - If using "parts," introduce the concept

2. **Use concrete examples**
   - Not just "You avoid conflict"
   - But "When something bothers you, you might assess it as 'not worth mentioning' and swallow it"

3. **Keep anchor phrases memorable**
   - Short enough to recall in the moment
   - Personally meaningful based on profile

---

*Document Version 1.0*  
*Integration Algorithm Specification for Claude Code Implementation*
