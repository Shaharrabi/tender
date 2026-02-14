# TENDER V3 Integration Guide
## For Claude Code — READ THIS FIRST

**Date:** February 13, 2026  
**App:** Tender: The Science of Relationships  
**Source code:** `/Users/shaharrabi/couples-app-v0.1`

---

## WHAT ALREADY EXISTS (DO NOT REBUILD)

The Tender app is **already built and working**. This is an **enhancement sprint**, not a rebuild.

### Existing 6 Assessments (COMPLETE)
1. **ECR-R** — Attachment Style (36 items)
2. **DUTCH** — Conflict Style (20 items)
3. **SSEIT** — Emotional Intelligence (33 items)
4. **DSI-R** — Differentiation of Self (46 items)
5. **IPIP-NEO-120** — Personality/Big Five (120 items)
6. **Personal Values** — Values ranking

### Existing Features (COMPLETE)
- AI coach named **Nuance** (already renamed — no changes needed)
- Portrait/report generation
- Growth plan/healing journey
- Practice library
- User authentication
- Database (Supabase)

---

## WHAT THIS UPDATE ADDS (ENHANCEMENT LAYER)

### Phase 1: Language Layer (TEXT CHANGES ONLY)
- Enhanced Nuance system prompt with 7 coaching rules
- Field language integration ("the space between you")
- Practice card one-liners
- Step subtitles
- Rotating taglines
- **NO code logic changes — strings only**

### Phase 2: Unified Assessment Flow
- Wrap existing 6 assessments into sequenced "Tender Assessment" experience
- Add **supplement items** to existing assessments (not new assessments):
  - ECR-R supplement: 5 items
  - DSI-R supplement: 4 items
  - SSEIT supplement: 3 items
  - Values supplement: 5 items
- Add **2 NEW instruments**:
  - "The Space Between Us" — Relational Field Awareness (20 items, individual)
  - "What Lives Between You" — Couple Field Assessment (15 items, couples only)

### Phase 3: Enhanced Reports
- Cross-assessment synthesis algorithm (pattern detection across instruments)
- Two-tier report (Quick Portrait + Deep Portrait)
- Attachment-tailored communication (anxious vs. avoidant framing)
- Big Five relational reframe narratives

### Phase 4: WEARE Scoring Engine
- Meta-equation that sits ON TOP of existing assessments
- Pulls data from what's already there + behavioral data
- Creates bottleneck detection + movement phase detection
- User-facing: "the space between you" (NEVER show math)
- Nuance integration for coaching decisions

### Phase 5: Practice Database + Micro-Courses
- Centralized practice database with rich metadata
- Integration with healing journey phases
- 6 micro-courses (30 lessons) — **content already written in TENDER_MICROCOURSE_CONTENT.md**

### Phase 6-8: Gamification, Community, Polish
- Milestones, streaks (anti-shame design)
- WEARE-targeted smart nudges
- Community features
- Architecture verification

---

## DOCUMENT HIERARCHY

### 1. TENDER_MASTER_FINAL.md (PRIMARY — ARCHITECTURE)
The single source of truth for sequencing, structure, and integration logic.
- Defines WHAT to build and in WHAT ORDER
- Phases 0-8 implementation guide
- Golden rules and constraints

### 2. TENDER_NUANCE_V2_DEEP_INTEGRATION.md (CONTENT — EXACT WORDING)
Use this for exact text when building:
- All 20 items of "The Space Between Us" assessment
- All 15 items of "What Lives Between You" couple assessment
- All supplement items for existing assessments
- Big Five relational reframe narrative templates
- Portrait narrative templates by attachment × personality
- "Getting Underneath" practice (Four Steps of Relational Distillation)
- Nuance coaching examples
- Steps 7-12 enriched language

### 3. TENDER_V3_WEARE_SCORING_ENGINE.md (MATH — EXACT FORMULAS)
Use this for scoring engine implementation:
- WEARE meta-equation
- Variable mapping (which data feeds which score)
- Scoring formulas with weights
- Bottleneck detection logic
- Movement phase detection
- Conflict sub-equations
- Database schema for weare_scores and weekly_checkin

### 4. TENDER_MICROCOURSE_CONTENT.md (CONTENT — READY TO UPLOAD)
Complete lesson content for all 6 micro-courses (30 lessons):
- Already written with READ + EXERCISE + REFLECTION sections
- Attachment variants (anxious/avoidant) where needed
- Database insertion format included
- **This is implementation-ready content, not a shell**

---

## CRITICAL RULES

### DO
- Phase 0 first: Read the existing codebase before writing anything
- Start with Phase 1 (language layer) — lowest risk, immediate improvement
- Extend existing scoring logic, don't replace it
- Test after every change
- Ask before any change >2 hours or unexpected schema changes

### DON'T
- Don't rebuild existing assessments — wrap them in unified flow
- Don't show WEARE math to users — say "the space between you"
- Don't pathologize — every pattern had a protective purpose
- Don't push avoidant users faster than their system can handle
- Don't use "sacred" or "consciousness" — use "alive" and "awareness"

---

## USER-FACING LANGUAGE RULES

| Never Say | Always Say |
|-----------|------------|
| "WEARE score" | "the space between you" |
| "sacred" | "alive," "living," "present" |
| "consciousness" | "awareness," "presence" |
| "You're being defensive" | "The protective pattern activated" |
| "You need to let your guard down" | "Your guard is there for a reason" |
| "You're back to the same issue" | "This theme is back, but you're different now" |
| "Great job completing Step 5!" | "You keep showing up. That rhythm changes everything." |

---

## IMPLEMENTATION SEQUENCE

```
WEEK 1:
  Phase 0: Codebase audit (MANDATORY — report back before proceeding)
  Phase 1: Language layer (strings only, zero risk)
  Phase 2: Unified assessment flow + new instruments

WEEK 2:
  Phase 3: Cross-assessment synthesis + enhanced reports
  Phase 4: WEARE scoring engine + Nuance integration

WEEK 3:
  Phase 5: Practice database + micro-courses + healing journey integration

WEEK 4:
  Phase 6: Gamification + nudges
  Phase 7: Community
  Phase 8: Architecture verification + remaining features
```

---

## ISSUES FOUND IN DOCUMENTS (FOR SHAHAR TO REVIEW)

### 1. V3 WEARE Document Still References "Sage"
Line 29: `"Practice completion + Sage engagement + daily micro-practice"`
Line 55: `"SageDepth"`
Line 97: `"WHAT SAGE SEES: Coaching Intelligence"`

**Recommendation:** Find/replace "Sage" → "Nuance" in V3 document before uploading to Claude Code, or note in the README that Claude Code should treat all "Sage" references as "Nuance."

### 2. V2 Nuance Document Still References "Sage" 
Line 8: `"Sage coaching"`
Line 177: `"Sage can use more pattern-level language"`
Line 579: `"Update Sage system prompt"`
Line 605: `"Sage internal diagnostic layer"`

**Recommendation:** Same as above — find/replace or add note.

### 3. Microcourse Content References "Nuance" Correctly
The microcourse document correctly uses "Nuance" throughout. ✓

### 4. Master FINAL Document — Microcourse Content Status
The Master FINAL (lines 647-746) says microcourse content is "Shell only. Claude Code needs to GENERATE lesson content."

BUT the TENDER_MICROCOURSE_CONTENT.md document contains **complete, implementation-ready lesson content** for all 6 courses.

**Recommendation:** Update the Master FINAL to note that microcourse content exists in the separate document, OR ensure you upload TENDER_MICROCOURSE_CONTENT.md alongside the others so Claude Code has the actual content.

---

## QUESTIONS CLAUDE CODE SHOULD ANSWER IN PHASE 0

Before writing any code, Claude Code should report:

1. What assessments are currently defined in `constants/`?
2. How does scoring work in `services/`?
3. What does the current portrait/report show?
4. How is the growth plan structured?
5. What's in Nuance's current system prompt?
6. What database tables exist?
7. What screens exist in `app/(app)/`?

**Report format:** "Here's what exists. Here's what the documents assume. Here are the gaps."

---

## FILES TO UPLOAD TO CLAUDE CODE

Upload in this order:

1. **This README** (context/orientation)
2. **TENDER_MASTER_FINAL.md** (primary architecture)
3. **TENDER_NUANCE_V2_DEEP_INTEGRATION.md** (exact wording for assessments/narratives)
4. **TENDER_V3_WEARE_SCORING_ENGINE.md** (exact math for scoring)
5. **TENDER_MICROCOURSE_CONTENT.md** (complete lesson content)

---

*This README reflects the current state of Tender as a working app that needs enhancement, not a rebuild. The strategy is: text/language first, minimal code changes, extend what exists.*
