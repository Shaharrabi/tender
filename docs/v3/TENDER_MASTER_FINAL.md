# TENDER: The Science of Relationships
## Master Integration Document for Claude Code — FINAL
**Date:** February 13, 2026  
**Version:** Final  
**AI Coach Name:** Nuance (already implemented — no rename needed)

---

# READ THIS FIRST

Claude Code: This document is your SINGLE SOURCE OF TRUTH for the next development sprint.

**Source code location:** `/Users/shaharrabi/couples-app-v0.1`

**Reference documents (also provided):**
- **TENDER_NUANCE_V2_DEEP_INTEGRATION.md** — Contains exact assessment item text, all narrative templates, Big Five relational reframes, supplement item wording, complete "Getting Underneath" practice prompts, Steps 7-12 enriched language, and Nuance coaching examples. USE THIS for exact wording when building assessments and portraits.
- **TENDER_V3_WEARE_SCORING_ENGINE.md** — Contains complete WEARE scoring formulas, variable normalization, conflict sub-equations, and mathematical detail. USE THIS when implementing the scoring engine.

**This master doc** provides the architecture, sequencing, and integration logic. V2 and V3 provide the detailed content. All three are needed together.

**Your job:** Work through this IN ORDER. Each phase depends on the previous one. Do NOT skip ahead. Ask before each major phase.

**CRITICAL CONSTRAINTS:**
- Do NOT introduce bugs. Every change must be modular and testable.
- Do NOT overcomplicate the codebase — separate modules for separate features.
- Free tier only (Supabase free, Expo free, no paid APIs).
- If something takes more than 2 hours or changes database schema unexpectedly, STOP and ASK.

---

# PHASE 0: CODEBASE AUDIT — DO NOT WRITE CODE YET
**Time: 30-60 minutes. Read only.**

Before writing a single line, read the existing codebase at `/Users/shaharrabi/couples-app-v0.1` and map what exists.

**Report back on:**

1. **`constants/`** — What assessments are defined? What scoring logic exists?
2. **`services/`** — How does Nuance (AI coach) work? What API calls exist? How is scoring done?
3. **`components/results/`** — What do the current reports look like? What data do they display?
4. **`components/growth/`** — How is the growth plan currently structured? What practices are assigned?
5. **`components/portrait/`** — What does the portrait generate? How deep is the narrative?
6. **`components/chat/`** — How does Nuance work? What's the system prompt?
7. **`supabase/`** — What's the current database schema? What tables exist?
8. **`app/(app)/`** — What screens exist? What's the navigation structure?
9. **`components/assessment/`** — How are assessments presented? What's the flow?
10. **`components/intervention/`** — What practices/exercises already exist?

**Report format:** "Here's what exists. Here's what the documents assume. Here are the gaps."

This prevents building on assumptions and avoids introducing bugs.

---

# PHASE 1: LANGUAGE LAYER
**Estimated time: 2-3 hours. String changes only — no logic changes. Lowest risk.**

This phase changes HOW the app speaks without changing WHAT it does. Immediate improvement, zero risk of breaking anything.

## 1A. Nuance System Prompt Enhancements

The AI coach is already named "Nuance." Add these rules to its existing system prompt:

```
NUANCE COACHING RULES:

Rule 1: PATTERN BEFORE PERSON. Always name the pattern before addressing either individual.
  ❌ "It sounds like you're being defensive."
  ✅ "The protective pattern just activated. What does it need right now?"

Rule 2: FIELD LANGUAGE. Use relational field language naturally.
  ❌ "Your co-regulation capacity is developing."
  ✅ "The space between you went cold just then. Did you feel that?"

Rule 3: TENSION AS RESOURCE. Never frame differences as problems.
  ❌ "You two need to find common ground."
  ✅ "This difference between you has been there a long time. What if it's not the problem?"

Rule 4: RHYTHM OVER ACHIEVEMENT. Frame progress as rhythm.
  ❌ "Great job completing Step 5!"
  ✅ "You keep showing up. That rhythm — that's what changes everything."

Rule 5: EMBODIMENT PROMPTS. Regularly redirect to the body.
  "Where do you feel this?"
  "Notice what shifts in the space between you when you both get quiet."

Rule 6: BOUNDARY AWARENESS. Never pathologize self-protection.
  ❌ "You need to let your guard down."
  ✅ "Your guard is there for a reason. Can we understand what it's protecting?"

Rule 7: SPIRAL, NOT LINE. Revisiting themes is deepening, not regression.
  ❌ "You're back to the same issue."
  ✅ "This theme is back, but you're different now. What's different this time?"

LANGUAGE CONSTRAINTS:
- Never use "sacred" → Use "alive," "living," "present"
- Never use "consciousness" → Use "awareness," "presence"
- "Pattern" is always safe — use freely
- "Field" always needs grounding: "the field between you" or "the relational field"
- "Emerge/emergence" are good — both clinical and meaningful
- Body is always the anchor — when things get abstract, redirect to the body
```

## 1B. Nuance Internal Diagnostic Layer

Add to Nuance's system context — these are INTERNAL ONLY, never shown to users. Nuance uses them to choose coaching moves:

```javascript
const DIAGNOSTIC_OBSERVATIONS = {
  wave:  { detect: 'stuck_in_one_position', move: 'What would the other rhythm feel like?' },
  spark: { detect: 'triggered_reactive', move: 'What just awakened in you? That is data.' },
  web:   { detect: 'surface_conflict', move: 'What is this really connected to?' },
  field: { detect: 'blaming', move: 'It is in the space between you. What would warm it?' },
  leap:  { detect: 'stuck_in_old_narrative', move: 'What is happening right now?' },
  seed:  { detect: 'hopeless', move: 'What has not had the chance to grow yet?' },
  pulse: { detect: 'fear_of_disconnection', move: 'Disconnection is half the rhythm. Reconnection is the other.' },
};
```

## 1C. Five Living Questions

Add to Nuance's prompt rotation — used at contextually appropriate moments:

```javascript
const LIVING_QUESTIONS = [
  { q: "What is here right now — in you, in the space between you?", when: "session_opening" },
  { q: "What is between you right now — not the content, but the quality?", when: "couple_practice" },
  { q: "What is happening inside you right now? Where do you feel it?", when: "partner_activated" },
  { q: "What pressures outside the relationship are leaking in?", when: "external_stress" },
  { q: "What old story is running right now? Whose voice is that?", when: "fixed_narrative" },
];
```

## 1D. Practice Card Field Insights

Add a one-sentence field-language insight to each existing practice card:

| Practice | Field Insight |
|----------|--------------|
| Knowing Your Dance | "The pattern between you is not either person's fault — it is the dance itself." |
| Finding Each Other Again | "When you name what is underneath, the space between you softens." |
| Space Between Reaction and Response | "A pause gives the relational field room to breathe." |
| What Matters Most | "Your values are the compass for the space between you." |
| The Repair Conversation | "Every repair resets the field. Every bid is a fresh start." |

## 1E. Step Subtitle Updates

If the app has "Steps" (12-step integration), update subtitles:

| Step | Updated Subtitle |
|------|-----------------|
| Step 1 | "Seeing the pattern — not as personal failure, but as the dance between you" |
| Step 2 | "Trusting that the space between you can hold more than you think" |
| Step 3 | "Choosing vulnerability over protection — leading with the soft move" |
| Step 4 | "Getting underneath — what is really driving the pattern" |
| Step 5 | "Sharing your pattern with your partner — letting yourself be seen" |
| Step 6 | "Releasing the protective moves that once kept you safe but now keep you apart" |

For Steps 7-12 enriched language, see V2 document Part 7.

## 1F. Rotating Taglines

Add to existing tagline rotation:

```javascript
const V2_TAGLINES = [
  "The pattern between you is not the problem. It is the doorway.",
  "What divides you also connects you.",
  "The space between you is alive. It changes when you do.",
  "Every repair is a fresh start.",
  "You can hold two truths at once. So can your relationship.",
  "Your differences are resources, not obstacles.",
  "What is here? What is between you? What is trying to emerge?",
  "Presence is the first practice. Everything else follows.",
  "The relationship knows things that neither of you individually knows.",
  "Growth does not move in a straight line. It spirals.",
  "Strip it down. See what is singular. See your partner's version. Let it land.",
  "The body always knows before the mind catches up.",
  "Rhythm over memory. Practice over perfection.",
  "The strongest relationships are not conflict-free. They are repair-rich.",
  "You brought this pattern with you. You did not create it on purpose. And you can change it.",
  "Name it to tame it.",
  "Secure is not a type. It is a practice.",
  "The reach and the retreat are both asking for the same thing.",
  "Rupture is inevitable. Repair is a choice.",
  "Regulate before you reason.",
  "Between stimulus and response, there is a space.",
  "Small, consistent practice changes everything.",
  "What kind of partner do you want to be?",
  "Love is not a feeling. It is a series of choices.",
  "Both of you are doing the best you can with what you have.",
  "Healing is not linear. Rest is part of the process.",
  "Safety is not the absence of danger. It is the presence of connection.",
  "Co-regulation is not weakness. It is biology.",
  "Vulnerability is not weakness. It is the birthplace of connection.",
  "Conflict is not the enemy. Contempt is.",
];
```

---

# PHASE 2: UNIFIED ASSESSMENT SYSTEM — "The Tender Assessment"
**Estimated time: 6-8 hours. Schema changes required.**

## 2A. The Concept

Currently the app has separate assessments. Unify them into a single sequenced experience called **"The Tender Assessment"** with sections, breaks, save-and-exit, and progressive unlock.

**DO NOT rebuild existing assessments.** Build a unified FLOW on top of them.

### Assessment Flow

```javascript
const TENDER_ASSESSMENT_SECTIONS = [
  {
    section: 1,
    name: 'How You Connect',
    description: 'Understanding your attachment patterns',
    instruments: ['ecr-r'], // existing 36 items
    supplements: ['ecr-r-supplement'], // 5 new items — see V2 Part 2C for exact wording
    estimatedTime: '12 min',
    breakAfter: true,
  },
  {
    section: 2,
    name: 'Who You Are',
    description: 'Your personality and how it shapes your relationships',
    instruments: ['ipip-neo-120'],
    supplements: [],
    estimatedTime: '20 min',
    breakAfter: true,
    breakMessage: 'Great work. Take a stretch. You are building something important.',
  },
  {
    section: 3,
    name: 'How You Feel',
    description: 'Your emotional world and how you navigate it',
    instruments: ['sseit'], // 33 items
    supplements: ['ei-supplement'], // 3 new items — see V2 Part 2D
    estimatedTime: '10 min',
    breakAfter: false,
  },
  {
    section: 4,
    name: 'How You Hold Your Ground',
    description: 'Your boundaries, autonomy, and differentiation',
    instruments: ['dsi-r'], // 46 items
    supplements: ['dsi-r-supplement'], // 4 new items — see V2 Part 2C
    estimatedTime: '15 min',
    breakAfter: true,
  },
  {
    section: 5,
    name: 'How You Fight',
    description: 'Your approach to conflict and disagreement',
    instruments: ['dutch'], // 20 items
    supplements: [],
    estimatedTime: '5 min',
    breakAfter: false,
  },
  {
    section: 6,
    name: 'What Matters to You',
    description: 'Your values and what you want to move toward',
    instruments: ['values'],
    supplements: ['values-supplement'], // 5 new items — see V2 Part 2C
    estimatedTime: '8 min',
    breakAfter: true,
  },
  {
    section: 7,
    name: 'The Space Between',
    description: 'How you sense and tend to your relational field',
    instruments: ['relational-field-awareness'], // NEW 20 items — see V2 Part 2A for full item text
    supplements: [],
    estimatedTime: '8 min',
    breakAfter: false,
    isNew: true,
  },
];

// COUPLE-ONLY (unlocks after partner connection + both complete individual):
const COUPLE_ASSESSMENT = {
  section: 8,
  name: 'Your Shared Field',
  description: 'How the space between you lives and breathes',
  instruments: ['couple-field-assessment'], // NEW 15 items — see V2 Part 2B for full item text
  estimatedTime: '5 min',
  requiresPartner: true,
};
```

### UX Features

- Save and exit at any break point, resume where left off
- Progressive unlock: each completed section immediately shows its results
- Time estimate per section
- Encouraging messaging at breaks
- Progress bar showing sections complete

### New Assessment Tables

```sql
-- "The Space Between Us" — 20 items, individual
CREATE TABLE relational_field_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  item_1 INTEGER CHECK (item_1 BETWEEN 1 AND 7),
  item_2 INTEGER CHECK (item_2 BETWEEN 1 AND 7),
  item_3 INTEGER CHECK (item_3 BETWEEN 1 AND 7),
  item_4 INTEGER CHECK (item_4 BETWEEN 1 AND 7),
  item_5 INTEGER CHECK (item_5 BETWEEN 1 AND 7),
  item_6 INTEGER CHECK (item_6 BETWEEN 1 AND 7),
  item_7 INTEGER CHECK (item_7 BETWEEN 1 AND 7),
  item_8 INTEGER CHECK (item_8 BETWEEN 1 AND 7),
  item_9 INTEGER CHECK (item_9 BETWEEN 1 AND 7),
  item_10 INTEGER CHECK (item_10 BETWEEN 1 AND 7),
  item_11 INTEGER CHECK (item_11 BETWEEN 1 AND 7),
  item_12 INTEGER CHECK (item_12 BETWEEN 1 AND 7),
  item_13 INTEGER CHECK (item_13 BETWEEN 1 AND 7),
  item_14 INTEGER CHECK (item_14 BETWEEN 1 AND 7),
  item_15 INTEGER CHECK (item_15 BETWEEN 1 AND 7),
  item_16 INTEGER CHECK (item_16 BETWEEN 1 AND 7),
  item_17 INTEGER CHECK (item_17 BETWEEN 1 AND 7),
  item_18 INTEGER CHECK (item_18 BETWEEN 1 AND 7),
  item_19 INTEGER CHECK (item_19 BETWEEN 1 AND 7),
  item_20 INTEGER CHECK (item_20 BETWEEN 1 AND 7),
  field_recognition DECIMAL(4,2),
  creative_tension DECIMAL(4,2),
  presence_attunement DECIMAL(4,2),
  emergent_orientation DECIMAL(4,2),
  total_score DECIMAL(5,2)
);

-- "What Lives Between You" — 15 items, couple-level
CREATE TABLE couple_field_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id),
  respondent_id UUID REFERENCES users(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  -- Items 1-5: Our Pattern (mix of free text, multiple choice, Likert)
  item_1_text TEXT, -- free text: describe your pattern
  item_2 VARCHAR(1), -- a/b/c/d: move toward/away/freeze/fight
  item_3 VARCHAR(1), -- a/b/c/d: what you believe partner is doing
  item_4 INTEGER CHECK (item_4 BETWEEN 1 AND 7),
  item_5 INTEGER CHECK (item_5 BETWEEN 1 AND 7),
  -- Items 6-10: Our Resources (mix of free text and Likert)
  item_6_text TEXT,
  item_7_text TEXT,
  item_8 INTEGER CHECK (item_8 BETWEEN 1 AND 7),
  item_9 INTEGER CHECK (item_9 BETWEEN 1 AND 7),
  item_10_text TEXT,
  -- Items 11-15: Our Growing Edge
  item_11_text TEXT,
  item_12 INTEGER CHECK (item_12 BETWEEN 1 AND 7),
  item_13_text TEXT, -- fear identification
  item_14 INTEGER CHECK (item_14 BETWEEN 1 AND 7),
  item_15_text TEXT, -- certainty release
  -- Computed
  shared_field_awareness DECIMAL(4,2),
  couple_bubble_strength DECIMAL(4,2),
  creative_tension_score DECIMAL(4,2),
  repair_confidence DECIMAL(4,2)
);
```

**For exact item wording and all scoring logic, reference V2 document Parts 2A-2E.**

---

# PHASE 3: CROSS-ASSESSMENT SYNTHESIS + ENHANCED REPORTS
**Estimated time: 5-7 hours.**

## 3A. Review Existing Scoring First

**IMPORTANT:** Before building new synthesis logic, Claude Code must review what already exists in `services/` and `constants/`. Extend what's there. Don't replace it.

## 3B. The Synthesis Algorithm

Takes data from ALL assessments and produces unified insights by detecting convergent patterns across instruments.

```javascript
// src/services/assessmentSynthesis.js

const synthesizePortrait = (allAssessmentData) => {
  const patterns = [];
  
  // PATTERN: Heightened Sensitivity to Relational Threat
  // Convergence: ECR-R anxiety + Big Five neuroticism + DSI-R emotional reactivity
  if (ecrr.anxiety > 4.0 && bigFive.neuroticism > 60 && dsir.emotionalReactivity > 3.5) {
    patterns.push({
      id: 'heightened-sensitivity',
      label: 'Heightened Sensitivity to Relational Threat',
      sources: ['ECR-R anxiety', 'Big Five neuroticism', 'DSI-R emotional reactivity'],
      growthEdge: 'Learning to sense the field without being flooded by it',
      practices: ['practice-02', 'grounding-for-hyperarousal', 'window-of-tolerance-mapping'],
    });
  }
  
  // PATTERN: Protective Distancing
  // Convergence: ECR-R avoidance + low EI expression + high DSI-R emotional cutoff
  if (ecrr.avoidance > 4.0 && sseit.emotionalExpression < 3.0 && dsir.emotionalCutoff > 3.5) {
    patterns.push({
      id: 'protective-distancing',
      label: 'Protective Distancing from Emotional Intensity',
      growthEdge: 'Building field awareness while keeping your groundedness',
      practices: ['practice-01', 'vulnerability-sharing-ladder', 'co-regulation-breathing'],
    });
  }
  
  // PATTERN: Values-Behavior Gap
  // Contradiction: values intimacy high + avoidance high
  if (values.intimacyRanking <= 3 && ecrr.avoidance > 3.5) {
    patterns.push({
      id: 'values-behavior-gap',
      label: 'Values Pull Toward Closeness, Patterns Pull Away',
      growthEdge: 'The relationship you want requires the risks you are avoiding',
      practices: ['practice-03', 'act-values-committed-action'],
    });
  }
  
  // PATTERN: Self-Loss Through Accommodation
  // Convergence: low DSI-R differentiation + high agreeableness + avoiding conflict style
  if (dsir.totalDifferentiation < 3.0 && bigFive.agreeableness > 70 && dutch.avoiding > dutch.collaborating) {
    patterns.push({
      id: 'self-loss-accommodation',
      label: 'Losing Yourself to Keep the Peace',
      growthEdge: 'Developing the I-position — knowing what you feel without losing connection',
      practices: ['i-position-practice', 'boundaries-without-guilt'],
    });
  }
  
  // PATTERN: Sensing Without Grounding
  // Relational Field: high recognition + low presence/attunement
  if (relationalField && relationalField.fieldRecognition > 25 && relationalField.presenceAttunement < 20) {
    patterns.push({
      id: 'sensing-without-grounding',
      label: 'Strong Sensing, Weak Grounding',
      growthEdge: 'Turning detection into discernment',
      practices: ['window-of-tolerance-mapping', 'body-scan-relational'],
    });
  }
  
  // Additional patterns from V2 cross-instrument logic (see V2 Parts 2C-2E)
  
  return {
    patterns,
    primaryPattern: patterns[0],
    strengths: identifyStrengths(allAssessmentData),
    growthEdges: patterns.map(p => p.growthEdge),
    recommendedPractices: deduplicate(patterns.flatMap(p => p.practices)),
    healingPhaseRecommendation: determineStartingPhase(patterns),
  };
};
```

## 3C. Two-Tier Report — Attachment-Tailored

### Tier 1: Quick Portrait (1-2 screens, always visible)
- Primary dynamic (one sentence)
- Top 3 strengths
- Top 2 growth edges
- "Go deeper" button

### Tier 2: Deep Portrait (expandable sections)
1. Your Attachment World
2. Your Personality in Relationships (Big Five relational reframes — see V2 Part 2C for all templates)
3. Your Emotional Landscape
4. Your Autonomy and Boundaries
5. How You Navigate Conflict
6. What Drives You
7. How You Show Up in the Relational Field (NEW — from V2)
8. Your Patterns: How It All Connects (cross-assessment synthesis)
9. Your Growth Edges (with practice links)
10. Your Relational Field Profile (couples only — from V2)

**Attachment-tailored communication:**

For anxious users: Lead with validation ("Your sensitivity is a gift"). Acknowledge fear. Growth = "feel with more discernment, not feel less."

For avoidant users: Lead with respect for autonomy. Growth = "build a window, not demolish the wall." Never push faster than their system can handle. Small structured steps.

**For exact narrative templates by attachment × personality combination, reference V2 Part 10.**

### PDF Export + Therapist Sharing

```bash
npx expo install expo-print expo-sharing
```

Generate report as HTML → PDF → share. Include: all portrait sections, growth edges, recommended practices. Exclude: raw scores, clinical jargon.

---

# PHASE 4: WEARE SCORING ENGINE
**Estimated time: 4-6 hours. Backend.**

## 4A. Implementation

Build the WEARE meta-equation as the app's intelligence layer. **Reference V3 document for complete formulas.**

Core equation:
```
Couple_WEARE = (A + C + Tr) × S × T × (I_avg + CE) / (1 + e^(-(Δ - R)))
```

Key components:
- Calculate each variable from assessment data + behavioral data (see V3 for exact formulas)
- Resonance = A + C + Tr
- Emergence Direction = Δ - R
- Normalize to 0-100
- Detect bottleneck (lowest variable)
- Detect movement phase (from trend data)

## 4B. Database

```sql
CREATE TABLE weare_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id),
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  attunement_p1 DECIMAL(4,2), attunement_p2 DECIMAL(4,2), attunement_combined DECIMAL(4,2),
  co_creation DECIMAL(4,2), transmission DECIMAL(4,2),
  space DECIMAL(4,2), time_investment DECIMAL(4,2),
  individual_p1 DECIMAL(4,2), individual_p2 DECIMAL(4,2), individual_avg DECIMAL(4,2),
  contextual_env DECIMAL(4,2), change_delta DECIMAL(4,2), resistance DECIMAL(4,2),
  resonance DECIMAL(4,2), emergence_direction DECIMAL(4,2),
  weare_score DECIMAL(6,2), weare_normalized INTEGER,
  bottleneck VARCHAR(20), current_movement VARCHAR(20), attunement_gap DECIMAL(4,2),
  data_sources JSONB
);

CREATE TABLE weekly_checkin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  couple_id UUID REFERENCES couples(id),
  checked_at TIMESTAMPTZ DEFAULT NOW(),
  external_stress INTEGER CHECK (external_stress BETWEEN 1 AND 10),
  support_system INTEGER CHECK (support_system BETWEEN 1 AND 10),
  relationship_temperature VARCHAR(20)
);
```

## 4C. What Users See

**RULE: Never say "WEARE score." Never show math. Say "the space between you."**

Three-layer dashboard (couples only):
1. **Resonance Pulse** — warm visual (glow, color) + text: "Your relational field is alive"
2. **Direction** — arrow + text: "You are moving — new possibilities are opening"
3. **Overall** — 0-100 bar + text: "Generative. You are creating conditions for growth."
4. **Bottleneck** — what needs attention + recommended practice

## 4D. Nuance Integration

Feed WEARE profile into Nuance's context for coaching decisions. Bottleneck drives coaching strategy (see V3 for full mapping). Movement phase drives tone.

---

# PHASE 5: PRACTICES + MICRO-COURSES + HEALING JOURNEY
**Estimated time: 8-10 hours.**

## 5A. Practice Database

Every practice stored centrally with rich metadata:

```sql
CREATE TABLE practices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  subtitle VARCHAR(300),
  description TEXT,
  instructions TEXT,
  duration_minutes INTEGER,
  format VARCHAR(20) CHECK (format IN ('solo', 'couple', 'either')),
  type VARCHAR(30) CHECK (type IN ('audio', 'exercise', 'journal', 'conversation', 'psychoeducation', 'micro-course-lesson')),
  healing_phase VARCHAR(20)[],
  phase_position INTEGER,
  prerequisites UUID[],
  vulnerability_level INTEGER CHECK (vulnerability_level BETWEEN 1 AND 5),
  primary_modality VARCHAR(30),
  assessment_triggers JSONB,
  best_for_state VARCHAR(20),
  weare_variable VARCHAR(20),
  bottleneck_target VARCHAR(20),
  has_audio BOOLEAN DEFAULT false,
  audio_file_path VARCHAR(500),
  category VARCHAR(50),
  tags VARCHAR(50)[],
  field_insight VARCHAR(300), -- one-line V2 field-language insight
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);
```

## 5B. Practices Integrated INTO the Healing Journey

Practices are NOT a standalone library. They live inside the growth plan:

1. Assessment → synthesis identifies patterns + growth edges
2. System generates personalized Growth Plan with PHASES
3. Each phase has WEEKS, each week has DAYS
4. Each day assigns a specific practice matched to: assessment profile, healing phase, nervous system state, WEARE bottleneck, prerequisites completed
5. Vulnerability progresses: level 1 → 2 → 3 → 4 → 5

### Healing Journey Phases

```
Phase 1: SEEING (Weeks 1-2) — "Understanding what is here"
  Practices: Knowing Your Dance, Window of Tolerance mapping, parts identification, nervous system 101
  
Phase 2: FEELING (Weeks 3-4) — "Making contact with what is underneath"
  Practices: Finding Each Other Again, Space Between Reaction and Response, grounding, emotion naming, self-compassion
  
Phase 3: SHIFTING (Weeks 5-8) — "Trying new moves"
  Practices: What Matters Most, The Repair Conversation, softened startup, vulnerability ladder, Getting Underneath
  
Phase 4: INTEGRATING (Weeks 9-12) — "Making it stick"
  Practices: Reassessment, relapse prevention, co-regulation rituals, shared meaning, 12 principles
  
Phase 5: SUSTAINING (Ongoing) — "Living it"
  Practices: Weekly check-ins, monthly relationship weather, gratitude, quarterly reassessment
```

### Every Practice Follows This Template (from V2 Part 5):

```
1. OPENING: Window of Tolerance check → partner check-in
   "Where are you right now? Inside your window?"

2. FRAMING: Nuance sets context (phase-specific, field-specific)
   "This practice is about [clinical purpose]. Right now in your journey, this matters because [phase context]."

3. THE WORK: The practice itself
   Structured enough to hold meaning. Flexible enough to surprise.

4. CLOSING: Reflection
   "What surprised you?"
   "What did you notice in the space between you?"

5. INTEGRATION: 1-sentence capture
   "In one sentence, what happened between you?" → feeds into Nuance's understanding
```

## 5C. Micro-Courses — STRUCTURE (Content Needs Generating)

**NOTE FOR CLAUDE CODE:** The micro-course STRUCTURE is defined here — titles, lesson flow, placement in healing journey, attachment-tailored variants. The actual LESSON CONTENT (the text users read, exercises they do, reflection prompts) needs to be generated. Use the V2 document's theoretical frameworks and narrative templates as the source material to write the lesson content.

```javascript
const MICRO_COURSES = [
  {
    id: 'mc-attachment-101',
    title: 'Understanding Your Attachment Pattern',
    totalDuration: '25 min (5 lessons × 5 min)',
    placement: 'end_of_seeing_phase',
    // ATTACHMENT-TAILORED VARIANTS:
    variants: {
      anxious: {
        title: 'The Reach: Understanding Anxious Attachment',
        emphasis: 'validation, sensitivity as strength, pattern without pathology',
        tone: 'warm, normalizing, builds capacity before asking for change',
      },
      avoidant: {
        title: 'The Retreat: Understanding Avoidant Attachment',
        emphasis: 'respect for autonomy, walls as protection, small windows not demolished walls',
        tone: 'respectful of space, never pushes, emphasizes choice',
      },
    },
    lessons: [
      { lesson: 1, title: 'Where Your Pattern Came From', type: 'psychoeducation' },
      { lesson: 2, title: 'How It Shows Up Now', type: 'reflection + exercise' },
      { lesson: 3, title: 'What Your Partner Experiences', type: 'perspective-taking' },
      { lesson: 4, title: 'Your First Small Shift', type: 'behavioral experiment' },
      { lesson: 5, title: 'Making It Stick', type: 'practice plan + commitment' },
    ],
    // CONTENT STATUS: Shell only. Claude Code needs to GENERATE lesson content
    // using V2 narrative templates and clinical frameworks as source material.
  },
  {
    id: 'mc-regulation',
    title: 'Your Nervous System in Love',
    placement: 'start_of_feeling_phase',
    lessons: [
      { lesson: 1, title: 'Window of Tolerance 101', type: 'psychoeducation' },
      { lesson: 2, title: 'Your Activation Signature', type: 'self-identification' },
      { lesson: 3, title: 'Grounding When Hyperaroused', type: 'practice (with audio)' },
      { lesson: 4, title: 'Waking Up When Shut Down', type: 'practice (with audio)' },
      { lesson: 5, title: 'Co-Regulation: Your Partner as Home Base', type: 'couple exercise' },
    ],
    // CONTENT STATUS: Shell only. Generate content.
  },
  {
    id: 'mc-conflict-repair',
    title: 'From Rupture to Repair',
    placement: 'mid_shifting_phase',
    lessons: [
      { lesson: 1, title: 'Why Conflict Is Not the Enemy', type: 'psychoeducation' },
      { lesson: 2, title: 'The Four Horsemen and Their Antidotes', type: 'identification + practice' },
      { lesson: 3, title: 'The Anatomy of a Repair Attempt', type: 'skill-building' },
      { lesson: 4, title: 'Practicing Repair (Guided)', type: 'couple exercise' },
      { lesson: 5, title: 'Building a Repair Culture', type: 'ritual design' },
    ],
    // CONTENT STATUS: Shell only. Generate content.
  },
  {
    id: 'mc-boundaries',
    title: 'Boundaries That Connect (Not Just Protect)',
    placement: 'mid_shifting_phase',
    lessons: [
      { lesson: 1, title: 'What Boundaries Actually Are', type: 'psychoeducation' },
      { lesson: 2, title: 'Fusion vs. Connection vs. Distance', type: 'identification' },
      { lesson: 3, title: 'The I-Position Practice', type: 'skill-building' },
      { lesson: 4, title: 'Holding a Boundary Without Guilt', type: 'behavioral experiment' },
      { lesson: 5, title: 'Boundaries as Care, Not Rejection', type: 'reframe + practice' },
    ],
    // CONTENT STATUS: Shell only. Generate content.
  },
  {
    id: 'mc-act-defusion',
    title: 'Unhooking from the Story',
    placement: 'mid_feeling_phase',
    lessons: [
      { lesson: 1, title: 'The Story You Tell About Your Partner', type: 'identification' },
      { lesson: 2, title: 'Thoughts as Thoughts, Not Facts', type: 'ACT defusion' },
      { lesson: 3, title: 'The Observer Self in Conflict', type: 'mindfulness exercise' },
      { lesson: 4, title: 'Willingness: Showing Up Even When Hard', type: 'ACT acceptance' },
      { lesson: 5, title: 'Committed Action: Doing What Matters', type: 'behavioral experiment' },
    ],
    // CONTENT STATUS: Shell only. Generate content.
  },
  {
    id: 'mc-values-alignment',
    title: 'What Matters Most (Together)',
    placement: 'start_of_shifting_phase',
    lessons: [
      { lesson: 1, title: 'Your Values, Their Values', type: 'comparison exercise' },
      { lesson: 2, title: 'Where Values Clash — and What That Means', type: 'ACT reframe' },
      { lesson: 3, title: 'Shared Values as Compass', type: 'couple exercise' },
      { lesson: 4, title: 'Living Your Values This Week', type: 'committed action' },
      { lesson: 5, title: 'Values Review: Walking Toward or Away?', type: 'reflection' },
    ],
    // CONTENT STATUS: Shell only. Generate content.
  },
];
```

## 5D. Technique Library — Organized by Modality

All techniques added to the practice database with activation logic:

**Grounding (Polyvagal/DBT):** Bilateral tapping, 5-4-3-2-1 sensory, physiological sigh, cold water vagal brake, progressive muscle relaxation, body scan, orienting, gentle movement activation.
→ *Triggered by:* Window of Tolerance check-in state (hyperarousal → calming; hypoarousal → activation)

**ACT:** Defusion from relationship story, values-based committed action, acceptance of unchangeable, willingness stance, observer self, thoughts-as-weather.
→ *Triggered by:* ECR-R Items 38/40 high (fixed stories), WEARE Resistance bottleneck

**Boundaries/DSI:** I-Position practice, boundary conversation template, fusion vs. connection identification, differentiation under pressure drill, holding boundaries without guilt.
→ *Triggered by:* Low DSI-R differentiation, high Agreeableness + low differentiation

**EFT:** Hold Me Tight conversation, accessing primary emotions, vulnerability sharing ladder, emotion coaching partner, Finding Each Other Again (audio).
→ *Triggered by:* High ECR-R anxiety or avoidance, Nuance detecting secondary emotion

**Gottman:** Love Maps, Four Horsemen + antidotes, Repair Conversation (audio), turning toward bids, softened startup, dreams within conflict.
→ *Triggered by:* DUTCH conflict patterns, Nuance detecting Four Horsemen

**V2/Nuance:** "Getting Underneath" — Four Steps of Relational Distillation (full practice in V2 Part 4), Couple Bubble maintenance, field awareness meditation, Seven Principles daily micro-practices.
→ *Triggered by:* WEARE bottleneck targeting (see V3 smart nudge system)

## 5E. Content Upload Mechanism

New practices added via Supabase dashboard without code changes. Metadata tags (healing_phase, modality, assessment_triggers, weare_variable, bottleneck_target) ensure auto-integration with growth plan engine, WEARE targeting, and Nuance recommendations.

---

# PHASE 6: GAMIFICATION + NUDGES
**Estimated time: 3-4 hours.**

## 6A. Gamification

```javascript
const MILESTONES = [
  { id: 'first-step', label: 'First Step', trigger: 'first_practice_completed' },
  { id: 'self-aware', label: 'Self-Aware', trigger: 'one_assessment_section_complete' },
  { id: 'portrait-unlocked', label: 'Portrait Unlocked', trigger: 'all_assessments_complete' },
  { id: 'bridge-builder', label: 'Bridge Builder', trigger: 'repair_conversation_completed' },
  { id: 'rhythm-keeper', label: 'Rhythm Keeper', trigger: 'seven_day_streak' },
  { id: 'going-deeper', label: 'Going Deeper', trigger: 'entered_feeling_phase' },
  { id: 'together', label: 'Together', trigger: 'partner_connected' },
  { id: 'field-alive', label: 'The Field is Alive', trigger: 'weare_above_50' },
  { id: 'spiral-deeper', label: 'Spiraling Deeper', trigger: 'reassessment_completed' },
  { id: 'committed', label: 'Committed', trigger: 'thirty_day_streak' },
];

// ANTI-SHAME RULES (NON-NEGOTIABLE):
// - Never punish missed days
// - "Welcome back" not guilt
// - Streaks reset quietly
// - No comparison to other users EVER
// - Rest days are PART of the plan
```

## 6B. Dynamic Score Updates

After each practice, recalculate relevant WEARE variables. Show in warm language:
- "Your insights are becoming action" (Transmission improved)
- "You and your partner are getting more in sync" (Attunement gap decreased)
- "Something is softening" (Resistance decreased)

## 6C. Nudge System

**Tier 1: Push Notifications (free)**
```bash
npx expo install expo-notifications expo-device
```
- Assessment incomplete: 24h, 72h
- Practice due today
- Re-engagement after 14 days inactive
- Milestone earned

**Tier 2: WEARE-Targeted Smart Nudges (free, uses Seven Principles)**

| Bottleneck | Principle | Nudge |
|-----------|-----------|-------|
| Attunement | Presence | "2 minutes of seeing. Put everything else down." |
| Co-Creation | Play | "Absurdity is medicine. Be ridiculous together." |
| Transmission | Embodied Joy | "Bodies before words. Touch, do not talk." |
| Space | Sacred Attention | "Ask the relationship what it needs today." |
| Resistance | Patience | "Not everything needs solving today." |
| Context | Peace | "Before you work on what is broken, notice what is whole." |
| Balanced | Perspective | "Try on your partner's view for 2 minutes." |

**Tier 3: Nuance-Powered (tokens — sparingly)** — Only for key moments: post-assessment, post-practice, milestones.

**Notification Settings:** User controls toggles, quiet hours, frequency.

---

# PHASE 7: COMMUNITY
**Estimated time: 3-4 hours.**

**Access gating:** Unlocks after completing at least one assessment section.

**v1 features:**
- Curated content filtered by attachment style and growth phase
- Anonymous story sharing with "resonated" reaction (not "like")
- Weekly themes tied to growth plan phases
- Research insights
- AI pre-screening for safety (flag self-harm, IPV, crisis)
- No usernames, no profiles, no DMs
- "Report" button on every post

```sql
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  content TEXT NOT NULL,
  category VARCHAR(50),
  is_approved BOOLEAN DEFAULT false,
  resonated_count INTEGER DEFAULT 0,
  is_flagged BOOLEAN DEFAULT false
);

CREATE TABLE community_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id),
  user_id UUID REFERENCES users(id),
  reaction_type VARCHAR(20) DEFAULT 'resonated',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id, reaction_type)
);
```

**Integration:** Nuance can reference community themes. Growth plan can include "read this week's theme" as a step. Content recommendations based on assessment data.

---

# PHASE 8: ARCHITECTURE VERIFICATION + REMAINING FEATURES
**Estimated time: 4-6 hours.**

## 8A. Data Flow Integrity Check

Verify the full pipeline works end-to-end:

```
Assessment → Synthesis Algorithm → Portrait/Report → Growth Plan → Practices
     ↓                                    ↓                ↓
  WEARE Engine ────────────────→ Nuance Coach ←──── Practice Completion
     ↓                                    ↓                ↓
  Dashboard ←─────────────────── Smart Nudges ←──── Gamification
     ↓                                    ↓
  Reassessment ──────────────→ Delta Tracking → Updated Portrait
     ↓
  Community (filtered by profile)
```

Checklist:
- [ ] Assessment data flows into synthesis
- [ ] Synthesis feeds portrait generation
- [ ] Portrait insights inform growth plan practice selection
- [ ] Practice completion updates WEARE variables
- [ ] WEARE bottleneck drives Nuance coaching + nudge selection
- [ ] Gamification tracks across all systems
- [ ] Reassessment shows deltas
- [ ] Community filtered by profile
- [ ] PDF export pulls from all sources
- [ ] All text uses V2 language rules

## 8B. Remaining Features

After core architecture is verified:
1. Progressive unlock homepage
2. Emoji/icon system migration (see EMOJI_ICON_UPGRADE_GUIDE.md)
3. Window of Tolerance interactive graph
4. Find Your Therapist page
5. Therapist sharing + PDF report
6. Incognito/Guest mode
7. Security audit (RLS, real data deletion, JWT, encrypted storage)
8. App name: "Tender: The Science of Relationships" everywhere

## 8C. Content Upload

Practice database handles ongoing additions via Supabase dashboard. Metadata tags auto-integrate with growth plan, WEARE targeting, and Nuance. No code changes for new content.

---

# IMPLEMENTATION TIMELINE

```
WEEK 1:
  Phase 0: Codebase audit (report back before proceeding)
  Phase 1: Language layer (strings only)
  Phase 2: Unified assessment flow + new instruments

WEEK 2:
  Phase 3: Cross-assessment synthesis + enhanced reports
  Phase 4: WEARE scoring engine + dashboard + Nuance integration

WEEK 3:
  Phase 5: Practice database + healing journey integration + micro-courses + techniques

WEEK 4:
  Phase 6: Gamification + nudges
  Phase 7: Community
  Phase 8: Architecture verification + remaining features + security
```

**Total estimated: 40-55 hours across 4 weeks.**

---

# GOLDEN RULES

1. **Read the code first.** Phase 0 is mandatory.
2. **Modular.** Every feature is a separate module.
3. **Test after every change.**
4. **Language first, logic second.**
5. **The AI coach is Nuance.** Already renamed — just maintain it.
6. **Never show WEARE math.** Say "the space between you."
7. **Never pathologize.** Every pattern had a protective purpose.
8. **Body first.** Abstract → "Where do you feel this?"
9. **Tailor for attachment style.** Anxious gets validation. Avoidant gets respect for autonomy.
10. **Progressive unlock.** Nothing overwhelms.
11. **The healing journey IS the organizing principle.** Seeing → Feeling → Shifting → Integrating → Sustaining.
12. **Free tier only.**
13. **Ask before big decisions.** >2 hours or unexpected schema changes → STOP.
14. **Spiral, not line.** Revisiting = deepening.
15. **Rhythm over achievement.** "You keep showing up" > "Great job."
16. **V2 for exact wording.** V3 for exact math. This doc for architecture.
