# TENDER: Master Integration Document — UPDATED
## V2 Nuance Philosophy + V3 WEARE Scoring Engine + Full App Sprint
**Date:** February 13, 2026  
**Version:** Master v2 (supersedes previous Master Integration)

---

# CRITICAL UPDATES FROM PREVIOUS VERSION

1. **AI Coach name changed: "Sage" → "Nuance"** — All references to the AI coach throughout the app must use "Nuance" not "Sage." This aligns the AI coach's name with the philosophical framework.
2. **Source code access:** This document now includes explicit instructions for Claude Code to audit the existing codebase BEFORE building.
3. **Four features now explicitly scheduled:** Gamification, Micro-Courses, Community, and Architecture/Integration are woven into specific phases.

---

# READ THIS FIRST

Claude Code: This document is your SINGLE SOURCE OF TRUTH. It synthesizes:
- **V2:** The Nuance/Testament philosophy integration (language, assessments, practices, coaching rules)
- **V3:** The WEARE meta-equation as couples scoring engine
- **Previous sprints:** Bug fixes, healing journey, emoji system, practices, UI/homepage

**Your job:** Work through this IN ORDER. Each section depends on the one before it. Do NOT skip ahead. Ask before each major phase.

**CRITICAL CONSTRAINTS:**
- Do NOT introduce bugs. Every change must be modular and testable.
- Do NOT overcomplicate the codebase. Separate modules for separate features.
- Free tier only (Supabase free, Expo free, no paid APIs).
- If something takes more than 2 hours or changes database schema unexpectedly, STOP and ASK.

---

# PHASE 0: CODEBASE AUDIT — DO NOT WRITE CODE YET
**Time: 30-60 minutes. Read only.**

## 0A. Access and Map the Source Code

The source code is in Google Drive:
https://drive.google.com/drive/folders/197Zx5JYbV7vPKqVRb65cdbW4LvFSDaq9

**Folder structure (confirmed):**
```
Tender/
├── app/
│   ├── (auth)/          ← auth screens (login, signup)
│   └── (app)/           ← main app screens
├── components/
│   ├── assessment/      ← assessment question/flow components
│   ├── results/         ← results display components
│   ├── growth/          ← growth plan components
│   ├── portrait/        ← portrait generation/display
│   ├── intervention/    ← practices/exercises
│   ├── chat/            ← AI coach ("Nuance") chat interface
│   └── ui/              ← shared UI components
├── constants/           ← assessment definitions, scoring rules, config
├── services/            ← API calls, Supabase, AI service
├── context/             ← React context (auth, user data, etc.)
├── hooks/               ← custom hooks
├── utils/               ← utility/helper functions
├── types/               ← TypeScript types
├── supabase/            ← database config, migrations
├── assets/              ← images, fonts, icons
├── scripts/             ← build/utility scripts
├── docs/transcripts/    ← documentation
├── archived-specs/      ← old specification files
└── dist/                ← build output
```

## 0B. What to Report Back

Read the following files and report what exists:

1. **`constants/`** — What assessments are defined? What scoring logic exists? What are the assessment question sets?
2. **`services/`** — How does the AI coach work? What API calls exist? How is scoring done?
3. **`components/results/`** — What do the current reports look like? What data do they display?
4. **`components/growth/`** — How is the growth plan currently built? What practices are assigned?
5. **`components/portrait/`** — What does the portrait generate? How deep is the narrative?
6. **`components/chat/`** — How does the AI coach (currently "Sage", renaming to "Nuance") work?
7. **`supabase/`** — What's the current database schema? What tables exist?
8. **`app/(app)/`** — What screens exist? What's the navigation structure?

**Report format:** "Here's what exists. Here's what the documents assume. Here are the gaps."

This prevents building something that conflicts with what's already working.

---

# PHASE 1: BUG FIXES + LANGUAGE LAYER + RENAME
**Estimated time: 3-4 hours. Minimal risk.**

## 1A. Bug Fixes (Do First)

| Bug | Fix |
|-----|-----|
| Sharing Controls Back Button | Missing `onPress` → add `navigation.goBack()` or `setModalVisible(false)` |
| DSI-R Results Cut Off | Needs `<ScrollView>` wrapper or replace fixed `height` with `flex: 1` |
| Firefighter Parts Text Overflow | Add `flexShrink: 1`, `flexWrap: 'wrap'` to text container |

Test all three before proceeding.

## 1B. Rename: Sage → Nuance

Global find-and-replace across the entire codebase:

```bash
# Find all references to "Sage" (case-sensitive variations)
grep -rn "Sage" src/ app/ components/ constants/ services/
grep -rn "sage" src/ app/ components/ constants/ services/
grep -rn "SAGE" src/ app/ components/ constants/ services/
```

Replace:
- `"Sage"` → `"Nuance"` (user-facing display name)
- `sage` → `nuance` (variable names, file names)
- `SAGE` → `NUANCE` (constants)

**Places to check:**
- AI coach system prompt
- Chat interface header
- Homepage "Talk to Nuance" button
- Practice recommendations ("Nuance suggests...")
- Nudge messages
- All documentation strings

## 1C. Language Layer (String Changes Only — No Logic)

### Nuance System Prompt Updates

Add these rules to Nuance's system prompt:

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
- "Pattern" is always safe
- "Field" always needs grounding: "the field between you"
- "Emerge/emergence" are good
- Body is always the anchor
```

### Nuance Internal Diagnostic Layer (Seven Observations)

Add to Nuance's system context — these are INTERNAL ONLY, never shown to users:

```javascript
// Nuance uses these to choose coaching moves:
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

### Five Living Questions (Add to Nuance's Prompt Rotation)

```javascript
const LIVING_QUESTIONS = [
  { q: "What is here right now?", when: "session_opening" },
  { q: "What is between you right now?", when: "couple_practice" },
  { q: "What is happening inside you?", when: "partner_activated" },
  { q: "What pressures outside the relationship are leaking in?", when: "external_stress" },
  { q: "What old story is running right now?", when: "fixed_narrative" },
];
```

### Practice Card Field Insights + Step Subtitles + Rotating Taglines

See previous Master Integration document (these are unchanged). Add all V2 taglines to the rotation.

---

# PHASE 2: UNIFIED ASSESSMENT SYSTEM — "The Tender Assessment"
**Estimated time: 6-8 hours. Schema changes required.**

*No changes from previous Master Integration.* The unified assessment wraps existing instruments + adds V2 supplements + adds the new 20-item "Space Between Us" scale.

Key addition after codebase audit: **Review what scoring logic already exists** in `constants/` and `services/` before building new scoring. Extend what's there, don't replace it.

See previous Master Integration, Phase 2, for full implementation spec.

---

# PHASE 3: CROSS-ASSESSMENT SYNTHESIS + ENHANCED REPORTS
**Estimated time: 5-7 hours.**

## 3A. The Synthesis Algorithm ("Secret Sauce")

**After the Phase 0 audit, Claude Code must answer:** What does the current report/portrait already do? How deep is it? What cross-references exist?

Then ENHANCE it, don't replace it. The synthesis algorithm from the previous Master Integration (pattern detection across instruments) is the target. But adapt it to work with whatever scoring infrastructure already exists.

**Key patterns to detect (from V2):**
- High anxiety + high neuroticism + high field recognition = "Heightened sensitivity — detects everything, floods easily"
- High avoidance + low expression + high cutoff = "Protective distancing"  
- High values intimacy + high avoidance = "Values-behavior gap"
- Low differentiation + high agreeableness = "Self-loss through accommodation"
- High field recognition + low creative tension = "Senses everything, can't hold tension"

**V2 narrative templates** (from Part 10) provide the exact language. Use them:
- Anxious + High Neuroticism + High Field Recognition + Low Creative Tension → "You sense shifts quickly... your nervous system translates shifts into alarm rather than information"
- Avoidant + Low Openness + Low Field Recognition + High Differentiation → "You've achieved differentiation partly through distance... you can sense the 'we' without losing the 'I'"
- Secure + High Openness + High Field Recognition + High Creative Tension → "Your growing edge is deepening existing capacity and helping your partner meet you"

## 3B. Two-Tier Report — Tailored for Anxious/Avoidant

**CRITICAL:** Reports must be tailored to attachment style. This is not just data — it's how the data is COMMUNICATED.

**For anxious users:**
- Lead with validation: "Your sensitivity is a gift, not a flaw"
- Acknowledge the fear: "Your system scans for disconnection — that makes sense given your history"
- Growth framing: "The work is not to feel less, but to feel with more discernment"
- Practice recommendations: Regulation before closeness, grounding before reaching

**For avoidant users:**
- Lead with respect for autonomy: "Your independence is a genuine strength"
- Acknowledge the cost: "The walls that protect you also keep you alone"
- Growth framing: "The invitation is to build a window, not demolish the wall"
- Practice recommendations: Small, structured vulnerability; capacity-building not exposure therapy
- NEVER push faster than their system can handle

**For both:** Include the Big Five relational reframe narratives from V2 (Part 2C) that fire based on specific personality combinations.

---

# PHASE 4: WEARE SCORING ENGINE (V3)
**Estimated time: 4-6 hours. Backend.**

*No changes from previous Master Integration.* Build the WEARE scoring engine per V3 spec.

**Reminder: User-facing language says "the space between you" — NEVER "WEARE score."**
**Reminder: AI coach is now "Nuance" — update all references in the scoring engine's Nuance integration.**

---

# PHASE 5: MICRO-COURSES + PRACTICE DATABASE
**Estimated time: 6-8 hours.**

## 5A. Practice Database

*Same as previous Master Integration* — centralized database with rich metadata per practice.

## 5B. Integrate Practices INTO the Healing Journey

This is the key structural decision: practices are NOT a standalone library. They live INSIDE the growth plan as assigned steps.

**How it works:**
1. User completes assessments → synthesis algorithm identifies patterns + growth edges
2. System generates personalized Growth Plan (healing journey) with PHASES
3. Each phase has WEEKS, each week has DAYS
4. Each day assigns a specific practice, matched to:
   - The user's assessment profile
   - Their current healing phase
   - Their nervous system state (if they did a Window of Tolerance check-in)
   - The WEARE bottleneck (from V3)
   - Prerequisites completed
5. Practices get progressively deeper (vulnerability level 1 → 2 → 3 → 4 → 5)

## 5C. Micro-Courses — Deep Dives

Micro-courses are structured 3-5 lesson sequences on specific topics. They sit INSIDE the growth plan, typically at phase transitions.

```javascript
const MICRO_COURSES = [
  {
    id: 'mc-attachment-101',
    title: 'Understanding Your Attachment Pattern',
    lessons: 5,
    totalDuration: '25 min',
    placement: 'end_of_seeing_phase', // gateway to Feeling phase
    targetProfiles: {
      anxious: {
        title: 'The Reach: Understanding Anxious Attachment',
        emphasis: 'validation, pattern without pathology, your sensitivity as strength',
        tone: 'warm, normalizing, builds capacity before asking for change',
      },
      avoidant: {
        title: 'The Retreat: Understanding Avoidant Attachment',
        emphasis: 'respect for autonomy, walls as protection, small windows',
        tone: 'respectful of space, never pushes, emphasizes choice',
      },
    },
    lessons: [
      { lesson: 1, title: 'Where Your Pattern Came From', type: 'psychoeducation', duration: '5 min' },
      { lesson: 2, title: 'How It Shows Up Now', type: 'reflection + exercise', duration: '5 min' },
      { lesson: 3, title: 'What Your Partner Experiences', type: 'perspective-taking', duration: '5 min' },
      { lesson: 4, title: 'Your First Small Shift', type: 'behavioral experiment', duration: '5 min' },
      { lesson: 5, title: 'Making It Stick', type: 'practice plan + commitment', duration: '5 min' },
    ],
  },
  {
    id: 'mc-conflict-repair',
    title: 'From Rupture to Repair',
    placement: 'mid_shifting_phase',
    lessons: [
      { lesson: 1, title: 'Why Conflict Isn\'t the Enemy', type: 'psychoeducation' },
      { lesson: 2, title: 'The Four Horsemen and Their Antidotes', type: 'identification + practice' },
      { lesson: 3, title: 'The Anatomy of a Repair Attempt', type: 'skill-building' },
      { lesson: 4, title: 'Practicing Repair (Guided)', type: 'couple exercise' },
      { lesson: 5, title: 'Building a Repair Culture', type: 'ritual design' },
    ],
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
      { lesson: 5, title: 'Co-Regulation: Using Your Partner as Home Base', type: 'couple exercise' },
    ],
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
  },
  {
    id: 'mc-act-defusion',
    title: 'Unhooking from the Story',
    placement: 'mid_feeling_phase',
    lessons: [
      { lesson: 1, title: 'The Story You Tell About Your Partner', type: 'identification' },
      { lesson: 2, title: 'Thoughts as Thoughts, Not Facts', type: 'ACT defusion' },
      { lesson: 3, title: 'The Observer Self in Conflict', type: 'mindfulness exercise' },
      { lesson: 4, title: 'Willingness: Showing Up Even When It\'s Hard', type: 'ACT acceptance' },
      { lesson: 5, title: 'Committed Action: Doing What Matters', type: 'behavioral experiment' },
    ],
  },
];
```

## 5D. Technique Integration — Organized by Modality

All techniques added to the practice database, categorized and connected to the growth plan:

### Grounding Techniques (Polyvagal/DBT)
- Bilateral tapping
- 5-4-3-2-1 sensory grounding
- Physiological sigh
- Cold water vagal brake
- Progressive muscle relaxation (abbreviated)
- Body scan for relational holding
- Orienting (look around, name what you see)
- Gentle movement activation (for hypoarousal)

**Activation logic:** Triggered by Window of Tolerance check-in state. If hyperaroused → calming practices. If hypoaroused → activation practices. If in window → proceed with scheduled practice.

### ACT Techniques
- Defusion from the relationship story
- Values-based committed action
- Acceptance of what you cannot change in partner
- Willingness stance for vulnerability
- The Observer Self in conflict
- "Thoughts as weather" — watching thoughts pass

**Activation logic:** Triggered when ECR-R Item 38 or 40 are high (fixed stories, certainty), or when WEARE Resistance is the bottleneck.

### Boundaries Expansion (DSI/Bowen)
- The I-Position practice
- Boundary setting conversation template
- Recognizing fusion vs. connection
- Differentiation under pressure drill
- "Where do I end and you begin" awareness
- Holding boundaries without guilt

**Activation logic:** Triggered when DSI-R differentiation is low, or when Agreeableness is high + Differentiation is low (accommodation pattern).

### EFT Practices
- Hold Me Tight conversation (structured)
- Accessing primary emotions
- Vulnerability sharing ladder (graduated)
- Emotion coaching your partner
- "Finding Each Other Again" (audio)

### Gottman Practices
- Love Maps update
- Four Horsemen identification + antidotes
- The Repair Conversation (audio)
- Turning Toward bids
- Softened startup
- Dreams within conflict

### V2/Nuance-Specific Practices
- "Getting Underneath" — Four Steps of Relational Distillation (from V2 Part 4)
- Couple Bubble creation/maintenance
- Relational Distillation journaling
- Field awareness meditation
- Seven Principles daily micro-practices (Presence, Patience, Sacred Attention, Play, Embodied Joy, Peace, Perspective)

**Every practice follows the V2 template:**
```
1. OPENING: Window of Tolerance check → partner check-in
2. FRAMING: Nuance sets context (phase-specific, field-specific)
3. THE WORK: The practice itself
4. CLOSING: "What surprised you?" + "What did you notice in the space between you?"
5. INTEGRATION: 1-sentence capture → feeds into Nuance's understanding
```

## 5E. Content Upload Mechanism

Build so new practices can be added WITHOUT code changes:

```sql
-- Practices table serves as centralized content database
-- New practices added via Supabase dashboard or admin screen
-- App pulls dynamically from this table
-- Metadata tags (healing_phase, modality, assessment_triggers, weare_variable)
--   ensure new content auto-integrates with growth plan engine
```

---

# PHASE 6: GAMIFICATION + REMINDERS + DYNAMIC SCORING
**Estimated time: 3-4 hours.**

## 6A. Gamification System

```javascript
const GAMIFICATION = {
  // MILESTONES (growth-oriented, not competitive)
  milestones: [
    { id: 'first-step', label: 'First Step', icon: 'seedling', 
      trigger: 'first_practice_completed' },
    { id: 'self-aware', label: 'Self-Aware', icon: 'eyes',
      trigger: 'assessment_section_complete', count: 1 },
    { id: 'portrait-unlocked', label: 'Portrait Unlocked', icon: 'sparkles',
      trigger: 'all_assessments_complete' },
    { id: 'bridge-builder', label: 'Bridge Builder', icon: 'handshake',
      trigger: 'repair_conversation_completed' },
    { id: 'rhythm-keeper', label: 'Rhythm Keeper', icon: 'pulse_icon',
      trigger: 'seven_day_practice_streak' },
    { id: 'going-deeper', label: 'Going Deeper', icon: 'compass',
      trigger: 'entered_feeling_phase' },
    { id: 'together', label: 'Together', icon: 'couple',
      trigger: 'partner_connected' },
    { id: 'field-alive', label: 'The Field is Alive', icon: 'blossom',
      trigger: 'weare_score_above_50' },
    { id: 'spiral-deeper', label: 'Spiraling Deeper', icon: 'cyclone',
      trigger: 'reassessment_completed' },
    { id: 'committed', label: 'Committed', icon: 'star',
      trigger: 'thirty_day_practice_streak' },
  ],
  
  // PROGRESS TRACKING
  progressMetrics: {
    practicesCompleted: 'total count',
    currentStreak: 'consecutive days',
    assessmentProgress: 'sections done / total',
    healingPhase: 'which phase, week within phase',
    growthPlanCompletion: 'steps done / total this week',
    weareScore: 'current normalized score (couples only)',
    weeklyCheckIns: 'how many completed',
  },
  
  // DYNAMIC SCORE UPDATES
  // After each practice, recalculate relevant WEARE variables
  // Show user warm, human language:
  // "Your Transmission score improved" → "Your insights are becoming action"
  // "Attunement gap decreased" → "You and your partner are getting more in sync"
  // "Resistance decreased" → "Something is softening"
  
  // ANTI-SHAME RULES (NON-NEGOTIABLE):
  // - Never punish missed days
  // - "Welcome back" messaging, NEVER guilt
  // - Streaks reset quietly, not dramatically
  // - No comparison to other users EVER
  // - Celebrate effort and courage, not perfection
  // - Rest days are PART of the plan, not missed days
};
```

## 6B. Reminder/Nudge System

### Tier 1: Push Notifications (Zero Token Cost)

```bash
npx expo install expo-notifications expo-device
```

```javascript
const NUDGE_SCHEDULE = [
  // Assessment nudges
  { trigger: 'assessment_incomplete_24h', title: 'Your journey continues', 
    body: 'You have [X] more sections to unlock your full portrait.' },
  { trigger: 'assessment_incomplete_72h', title: 'Quick check-in',
    body: 'The next section takes about [X] minutes. Worth it for the insights.' },
  
  // Growth plan nudges  
  { trigger: 'practice_due_today', title: 'You have a practice today',
    body: '[Practice name] — [duration]. Ready when you are.' },
  { trigger: 'practice_streak_at_risk', title: 'Keep the rhythm going?',
    body: 'A quick check-in takes just 2 minutes.' },
  
  // Re-engagement
  { trigger: 'inactive_14_days', title: 'We are here when you are ready',
    body: 'No pressure. Your progress is saved.' },
  
  // Milestone celebration
  { trigger: 'milestone_earned', title: '✨ New milestone!',
    body: 'You earned: [milestone name]. Tap to see what you unlocked.' },
];
```

### Tier 2: Smart Nudges (V3 WEARE-Informed, Low Token)

Use the Seven Principles to target whichever WEARE variable is the bottleneck:

| WEARE Bottleneck | Principle | Nudge |
|-----------------|-----------|-------|
| Attunement | Presence | "2 minutes of seeing. Put everything else down." |
| Co-Creation | Play | "Absurdity is medicine. Be ridiculous together." |
| Transmission | Embodied Joy | "Bodies before words. Touch, don't talk." |
| Space | Sacred Attention | "Ask the relationship what it needs today." |
| Resistance high | Patience | "Not everything needs solving today." |
| Context low | Peace | "Before you work on what is broken, notice what is whole." |
| Balanced | Perspective | "Try on your partner's view for 2 minutes." |

### Tier 3: Nuance-Powered Nudges (Token Cost — Use Sparingly)

Only for HIGH-VALUE moments:
- After completing an assessment section (personalized insight)
- After a practice (brief reflection)
- After milestone (what it means for their journey)

### Notification Settings Screen

Users MUST control their nudges:
- Toggle: Assessment / Practice / Growth Plan / Nuance Check-ins / Community
- Quiet hours: From [time] to [time]
- Frequency: Daily / A few times a week / Weekly / Minimal

---

# PHASE 7: COMMUNITY FEATURES
**Estimated time: 3-4 hours.**

## 7A. Community Design (v1 — Simple, Safe)

**Access gating:** Unlocks after completing at least one assessment section.

**v1 Approach: Curated Content + Anonymous Sharing**

```
┌─────────────────────────────────────┐
│  ← Community                        │
│                                     │
│  FOR YOUR PATTERN                   │
│  (content filtered by assessment)   │
│  ┌─────────────────────────────┐   │
│  │ "Understanding the Anxious  │   │
│  │  Reach: Why You Chase       │   │
│  │  Connection"                │   │
│  │  5 min read                  │   │
│  └─────────────────────────────┘   │
│                                     │
│  STORIES LIKE YOURS                 │
│  (anonymous, moderated)             │
│  ┌─────────────────────────────┐   │
│  │ "I realized my shutdown     │   │
│  │  wasn't about not caring —  │   │
│  │  it was about drowning."    │   │
│  │  ♡ 23 resonated             │   │
│  └─────────────────────────────┘   │
│                                     │
│  WEEKLY THEME                       │
│  ┌─────────────────────────────┐   │
│  │ This week: "The space       │   │
│  │  between reaching and       │   │
│  │  retreating"                │   │
│  │                             │   │
│  │ Share your experience →     │   │
│  └─────────────────────────────┘   │
│                                     │
│  RESEARCH INSIGHT                   │
│  ┌─────────────────────────────┐   │
│  │ "Couples who repair after   │   │
│  │  conflict are 3x more       │   │
│  │  likely to report long-term │   │
│  │  satisfaction."             │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Key features:**
- Content filtered by user's assessment profile (attachment style, growth phase)
- Anonymous story sharing with "resonated" (not "like") reaction
- AI pre-screening for safety (flag self-harm, intimate partner violence, crisis)
- Weekly themes tied to growth plan phases
- No usernames, no profiles, no DMs (too risky without moderation)
- "Report" button on every post

**Integration with growth plan:**
- Nuance can say: "Other people with your pattern have found [X practice] helpful. Want to try it?"
- Community content recommendations based on assessment data
- Growth plan can include "Read this week's community theme" as a step

## 7B. Database

```sql
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES users(id), -- not displayed to other users
  created_at TIMESTAMPTZ DEFAULT NOW(),
  content TEXT NOT NULL,
  category VARCHAR(50), -- attachment_style, growth_phase, weekly_theme
  is_approved BOOLEAN DEFAULT false, -- moderation queue
  resonated_count INTEGER DEFAULT 0,
  is_flagged BOOLEAN DEFAULT false,
  flag_reason VARCHAR(200)
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

---

# PHASE 8: OVERALL ARCHITECTURE + INTEGRATION + REMAINING FEATURES
**Estimated time: 4-6 hours.**

## 8A. Architecture Integrity Check

After all phases are built, verify the HOLISTIC CONNECTION:

```
DATA FLOW:
Assessment → Synthesis Algorithm → Portrait/Report → Growth Plan → Practices
     ↓                                    ↓                ↓
  WEARE Engine ─────────────────→ Nuance Coach ←──── Practice Completion
     ↓                                    ↓                ↓
  Dashboard ←──────────────────── Smart Nudges ←──── Gamification Tracker
     ↓                                    ↓
  Reassessment ───────────────→ Delta Tracking → Updated Portrait
     ↓
  Community (filtered by profile)
```

Verify:
- [ ] Assessment data flows into synthesis algorithm
- [ ] Synthesis algorithm feeds portrait/report generation
- [ ] Portrait insights inform growth plan practice selection
- [ ] Growth plan practices link to audio/exercises
- [ ] Practice completion updates WEARE variables
- [ ] WEARE bottleneck detection drives Nuance's coaching strategy
- [ ] WEARE bottleneck drives smart nudge selection (Seven Principles)
- [ ] Gamification tracks progress across all systems
- [ ] Reassessment shows deltas and updates portrait
- [ ] Community content is filtered by user profile
- [ ] PDF export pulls from all data sources
- [ ] Therapist sharing includes all relevant data
- [ ] All user-facing text uses V2 language rules

## 8B. Remaining Features (From Previous Sprints)

These should be built after the core architecture is verified:

1. **Progressive Unlock Homepage** — Features unlock as assessments are completed
2. **Emoji/Icon System Migration** — Replace all Unicode emoji with Microsoft Fluent Emoji + Lucide Icons via `<AppIcon>` component (see EMOJI_ICON_UPGRADE_GUIDE.md)
3. **Window of Tolerance Interactive Graph** — Draggable self-location, zone-matched practice recommendations
4. **Find Your Therapist Page** — Assessment-informed modality recommendations with external directory links
5. **Therapist Sharing + PDF Report** — Permission-based sharing links, PDF export via `expo-print`
6. **Incognito/Guest Mode** — Local-only data option for maximum privacy
7. **Security Audit** — RLS on all tables, real data deletion, JWT expiration, encrypted storage
8. **App Name Change** — "Tender: The Science of Relationships" everywhere

## 8C. Long-Term Content Upload

The practice database (Phase 5E) handles this. New content added via Supabase dashboard. Metadata tags ensure auto-integration with:
- Growth plan recommendations
- WEARE bottleneck targeting
- Assessment-triggered suggestions
- Phase-appropriate sequencing
- Nuance's coaching library

No code changes needed for new content — just database entries with proper tags.

---

# IMPLEMENTATION TIMELINE

```
WEEK 1:
  Session 1: Phase 0 (codebase audit — report back)
  Session 2: Phase 1A (bug fixes) + 1B (Sage→Nuance rename)
  Session 3: Phase 1C (language layer)
  Session 4: Phase 2 (unified assessment flow + new V2 instruments)

WEEK 2:
  Session 5: Phase 3A (synthesis algorithm — reviewing/extending existing scoring)
  Session 6: Phase 3B (two-tier report with attachment-tailored language)
  Session 7: Phase 4 (WEARE scoring engine)
  Session 8: Phase 4 continued (WEARE dashboard + Nuance integration)

WEEK 3:
  Session 9: Phase 5A-5B (practice database + growth plan integration)
  Session 10: Phase 5C (micro-courses)
  Session 11: Phase 5D (technique integration — grounding, ACT, boundaries)
  Session 12: Phase 5E (content upload mechanism)

WEEK 4:
  Session 13: Phase 6 (gamification + reminders)
  Session 14: Phase 7 (community)
  Session 15: Phase 8A (architecture integrity check)
  Session 16: Phase 8B (remaining features) + Phase 8C (security audit)
```

**Total estimated: 40-55 hours across 4 weeks.**

---

# GOLDEN RULES FOR CLAUDE CODE

1. **Read the code first.** Phase 0 is mandatory. Don't build on assumptions.
2. **Modular.** Every feature is a separate module that plugs in.
3. **Test constantly.** Verify existing features still work after every change.
4. **Language first, logic second.** Phase 1 changes strings, not code logic.
5. **The AI coach is "Nuance."** Not Sage. Global rename.
6. **Never show WEARE math to users.** Say "the space between you."
7. **Never pathologize.** Every pattern had an original protective purpose.
8. **Body first.** When things get abstract, redirect: "Where do you feel this?"
9. **Tailor for attachment style.** Reports, practices, and Nuance's tone all adapt.
10. **Progressive unlock.** Nothing overwhelms. Everything reveals at the right time.
11. **The healing journey IS the organizing principle.** Seeing → Feeling → Shifting → Integrating → Sustaining.
12. **Free tier only.** Supabase free, Expo free, no paid APIs.
13. **Ask before big decisions.** If >2 hours or unexpected schema changes, STOP.
14. **Spiral, not line.** Revisiting is deepening, not regression.
15. **Rhythm over achievement.** "You keep showing up" > "Great job completing Step 5."
