# TENDER V3 Integration Guide

## What This Update Contains

This is a major architectural update to Tender, introducing:

1. **WEARE Scoring Engine** — A mathematical model for measuring relational emergence in real-time
2. **Enhanced Assessment Framework** — Four integrated assessments with sophisticated variable mapping
3. **Nuanced AI Coaching** — Deep contextual sensitivity for Sage's communication
4. **Complete Microcourse Curriculum** — All 12 steps with practices, reflections, and educational content

---

## Document Hierarchy (Read in This Order)

### 1. TENDER_MASTER_V2_UPDATED.md (PRIMARY SOURCE)
The canonical architecture document. Establishes:
- Twelve Steps of Relational Healing (structure and sequence)
- Four-assessment framework (EI, Differentiation, Attachment, Relational Field)
- Sage's identity and coaching principles
- Seven Principles of Loving Attention
- Database schemas and app structure

**When in conflict, this document takes precedence.**

### 2. TENDER_V3_WEARE_SCORING_ENGINE.md (ADDENDUM)
Builds the intelligence layer on top of Master V2:
- WEARE meta-equation adapted for couples
- Variable mapping (what data feeds each score)
- Bottleneck detection and movement phase detection
- Three-layer user dashboard (Resonance Pulse, Emergence Direction, Full Score)
- Smart nudge system targeting specific bottlenecks

**Key principle: Never show users the math. Say "the space between you," not "WEARE score."**

### 3. TENDER_NUANCE_V2_DEEP_INTEGRATION.md (ENHANCEMENT)
Refines Sage's communication intelligence:
- Step-specific language patterns and tone
- Emotional context sensitivity
- Anti-patterns to avoid (toxic positivity, premature solutions, etc.)
- Practice facilitation guidelines
- Crisis and repair protocols

### 4. TENDER_MICROCOURSE_CONTENT.md (CONTENT)
The actual curriculum for all 12 steps:
- Educational content and daily drops
- Practice instructions with timing
- Reflection prompts
- Sage conversation starters
- Step transition criteria

---

## Key Architectural Decisions

### Assessment Strategy
- Onboarding: Short versions of all four assessments
- In-app: Full assessments unlocked progressively
- Reassessment: Scheduled based on variable type (see V3 Addendum)

### Scoring Philosophy
- All variables normalized to 1-10 scale
- Bottleneck = lowest contributing variable
- Movement phases: Recognition → Release → Resonance → Embodiment
- Attunement gaps between partners flagged if >3 points

### Sage Behavior
- Never diagnostic or clinical
- Uses "noticing" language, not "analyzing"
- Targets coaching based on bottleneck detection
- Adjusts tone based on user's Window of Tolerance state

### User-Facing Language
- "The space between you" (not "your score")
- "What's alive here" (not "what's the problem")
- "Growing edges" (not "weaknesses")
- Spiral imagery for progress (not linear)

---

## Implementation Phases (Suggested)

### Phase 1: Core Structure
- Database schemas from Master V2
- Basic user/couple/step models
- Assessment delivery system

### Phase 2: Scoring Engine
- WEARE calculation backend
- Bottleneck and movement detection
- Weekly check-in system

### Phase 3: Sage Intelligence
- Context injection from WEARE profile
- Coaching decision tree
- Smart nudge selection

### Phase 4: Content & UI
- Microcourse content delivery
- Three-layer dashboard visualization
- Practice tracking and completion

---

## Questions to Confirm Before Building

1. **Tech stack?** (React Native? Flutter? Backend language?)
2. **AI integration?** (OpenAI? Anthropic? Which model for Sage?)
3. **Starting scope?** (MVP = Steps 1-3? Or full 12?)
4. **Partner pairing?** (How do two users link as a couple?)

---

## Anti-Patterns to Avoid

- Don't gamify with points/badges (use spiral/emergence metaphors)
- Don't show raw assessment scores to users
- Don't let Sage give advice before establishing presence
- Don't rush through steps (minimum 5 days per step)
- Don't treat partners asymmetrically based on scores

---

*This README accompanies the four Tender V3 specification documents. When building, reference specific documents for implementation details.*
