# TENDER: V3 ADDENDUM — The WEARE Meta-Equation as Couples Scoring Engine

**Author:** Shahar Rabi + Claude | **Date:** February 13, 2026 | **Version:** 3.0 Addendum

---

## THE BIG IDEA

The WEARE Meta-Equation from your source document provides a mathematical model for measuring relational emergence. V2 gave us assessments, language, and practice enhancements. V3 turns those into a **real-time scoring engine** — the algorithm that powers the entire app's intelligence.

**The Core Equation (Logistic Couples Version):**

```
Couple_WEARE = (A + C + Tr) × S × T × (I_avg + CE)
               ─────────────────────────────────────
                      1 + e^(-(Δ - R))
```

Where Resonance = A + C + Tr, and the logistic denominator creates a threshold effect: when Change exceeds Resistance, emergence potential rises sharply. When Resistance dominates, it drops.

---

## VARIABLE MAPPING: What Each WEARE Variable Means for Couples

| WEARE Variable | Couples Meaning | Data Sources in Tender |
|----------------|----------------|----------------------|
| **Attunement (A)** | Sensing and responding to the relational field | Field Recognition subscale (1-5) + Presence subscale (11-15) + ECR-R item 37 + EI items E1-E2 |
| **Co-Creation (C)** | Generating shared meaning through difference | Creative Tension subscale (6-10) + Values V1-V2 + Couple Assessment items 11-12 |
| **Transmission (Tr)** | Understanding becoming embodied action | Practice completion + Nuance engagement + daily micro-practice + Couple item 14 + pre-post deltas |
| **Space (S)** | Relational openness — room for vulnerability | DSI-R differentiation + boundary items D1-D4 + Couple Bubble practice score |
| **Time (T)** | Quality relational time invested | App engagement frequency + practice regularity + session consistency |
| **Individual (I)** | Personal capacity for self-awareness | EQ total + Window of Tolerance width + DSI-R emotional reactivity (inv) + Big Five composite |
| **Context (CE)** | External support vs stress | Weekly check-in: external stress (inv) + support system rating |
| **Change (Δ)** | Willingness and evidence of growth | Emergent Orientation subscale (16-20) + Step progression + reassessment deltas + items 14, V5 |
| **Resistance (R)** | Rigidity, defensiveness, fixed stories | ECR-R items 38, 40 + Couple item 4 (inv) + item 15 (inv) + low Openness + conflict rigidity |

---

## SCORING FORMULAS

**Attunement (per partner, then averaged):**
```
A = 0.3(FieldRecog) + 0.3(PresenceAttune) + 0.15(Item37) + 0.15(E1) + 0.1(E2)
A_couple = (A_p1 + A_p2) / 2
A_gap = |A_p1 - A_p2|  → Flag if gap > 3
```

**Co-Creation:**
```
C = 0.35(CreativeTension) + 0.15(V1) + 0.15(V2) + 0.15(CoupleItem11) + 0.2(CoupleItem12)
```

**Transmission (behavioral, not just self-report):**
```
Tr = 0.25(PracticeCompletion) + 0.15(PracticeRepetition) + 0.15(NuanceDepth) + 0.15(MicroPractice) + 0.15(Item14) + 0.15(PrePostDelta)
```

**Resistance (high = bad):**
```
R = 0.2(Item38) + 0.2(Item40) + 0.15(Item4_inv) + 0.15(Item15_inv) + 0.15(LowOpenness) + 0.15(ConflictRigidity)
```

**Change:**
```
Delta = 0.25(EmergentOrientation) + 0.25(StepProgression) + 0.2(ReassessmentDelta) + 0.15(Item14) + 0.15(V5)
```

All variables normalized to 1-10 scale before equation.

---

## WHAT USERS SEE: The Three-Layer Dashboard

### Layer 1: Resonance Pulse (A + C + Tr)
A warm visual indicator — heartbeat, glow, color temperature.
- 3-10: "Your relational field is quiet — it needs tending"
- 11-20: "Your relational field is alive — keep feeding it"
- 21-30: "Your relational field is strong"

### Layer 2: Emergence Direction (Δ - R)
A simple directional arrow.
- Negative: "More resistance than movement right now"
- Near zero: "You're at a threshold — a tipping point"
- Positive: "You're moving — new possibilities are opening"

### Layer 3: Full WEARE (normalized 0-100)
The comprehensive relational emergence score.
- 0-25: "Conditions are constrained. Let's look at what's holding."
- 26-50: "There's potential. Something needs attention."
- 51-75: "Generative. You're creating conditions for growth."
- 76-100: "Deeply resonant. The space between you is alive."

**Never show the math. Never say "WEARE score." Say "the space between you."**

---

## WHAT SAGE SEES: Coaching Intelligence

Nuance receives the full variable profile and uses it to determine coaching strategy:

**Bottleneck Detection → Coaching Focus:**
- Bottleneck is A (Attunement): → Presence practices, "What is here?"
- Bottleneck is C (Co-Creation): → Perspective-taking, exploring difference
- Bottleneck is Tr (Transmission): → Behavioral commitment, practice completion
- Bottleneck is S (Space): → Differentiation, boundaries, Couple Bubble
- R is highest variable: → Defusion, releasing certainty, Step 3/Step 6
- Emergence Direction < -3: → Priority override: address resistance first
- Attunement Gap > 3: → Coach toward symmetry without shaming

**Movement Detection (from trend data):**
- A rising + R still high + Δ low → **Recognition** phase: "You're seeing it. Don't fix yet."
- R dropping + A stable → **Release** phase: "Something is softening."
- A+C+Tr all rising + R moderate → **Resonance** phase: "Something is alive between you."
- Tr highest + Δ > R consistently → **Embodiment** phase: "This is becoming who you are together."

---

## SMART NUDGE SYSTEM: Principles Target Bottlenecks

Instead of random daily rotation, the Seven Principles target whatever variable is lagging:

| If Bottleneck Is... | Send This Principle | Why |
|---------------------|-------------------|-----|
| Attunement (A) | **Presence** | Increases somatic awareness, bid recognition |
| Co-Creation (C) | **Play** | Generates novelty, breaks fixed patterns |
| Transmission (Tr) | **Embodied Joy** | Moves understanding into the body |
| Space (S) | **Sacred Attention** | Creates relational openness |
| Resistance (R) high | **Patience** | Softens urgency to resolve, softens rigidity |
| Context (CE) low | **Peace** | Reduces external stress impact |
| Balanced | **Perspective** | Broadens viewpoint |

---

## CONFLICT SUB-EQUATIONS (from source document)

When a couple is processing conflict, Nuance uses simplified sub-equations:

```
Step 1: Recognition = Presence + Field Awareness
  → "Before resolving: Where are you in your body? What's the temperature between you?"

Step 2: Deepening = Attunement - Fixed Forms  
  → "Strip away 'you always.' What are you actually hearing underneath?"

Step 3: Creation = Resonance × Emergence
  → "Something is trying to emerge. What happens when you both drop the rope?"

Step 4: Transmission = (Emergence × Integration) / Resistance
  → "What will you do differently? Not a promise — a pattern change."
```

---

## DATABASE SCHEMA

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
  user_id UUID REFERENCES users(id), couple_id UUID REFERENCES couples(id),
  checked_at TIMESTAMPTZ DEFAULT NOW(),
  external_stress INTEGER CHECK (external_stress BETWEEN 1 AND 10),
  support_system INTEGER CHECK (support_system BETWEEN 1 AND 10),
  relationship_temperature VARCHAR(20)
);
```

---

## REASSESSMENT SCHEDULE

| Assessment | Frequency | Updates Which Variables |
|------------|-----------|----------------------|
| Relational Field Awareness (20 items) | Every 4 weeks | A, C, Δ |
| Couple Field Assessment (15 items) | Every Step transition | C, R, Δ |
| ECR-R supplement (5 items) | Every 8 weeks | A, R |
| Values supplement (5 items) | Every 8 weeks | C, Δ |
| External stress check-in | Weekly | CE |
| Behavioral data | Continuous | Tr, T |
| Full ECR-R (36 items) | Every 12 weeks | A, R, I |

---

## SELF-REFLECTION QUESTIONS FOR PERIODIC CHECK-IN

### Attunement
- "How connected and responsive do you feel to your partner right now?" (1-10)
- "Can you sense what your partner is feeling without them telling you?" (1-10)

### Co-Creation  
- "Are your differences generating something new, or just friction?" (1-10)
- "When was the last time you created something together that surprised you both?" (1-10)

### Transmission
- "How well are your insights translating into changed behavior?" (1-10)
- "Are you understanding more than you're embodying?" (1-10)

### Space
- "Does the space between you feel expansive or constricted?" (1-10)

### Resistance
- "How much are you holding onto being right about your partner?" (1-10)
- "What story about your relationship are you clinging to that might not be true?" (free text)

### Change
- "How much are you allowing yourself to be changed by this relationship?" (1-10)
- "What's different about how you show up compared to a month ago?" (free text)

---

## IMPLEMENTATION PHASES

**Phase 1 — Scoring Engine (Backend):** Build WEARE calculation, bottleneck detection, movement detection, weekly check-in table

**Phase 2 — Nuance Integration:** Add WEARE profile to Nuance context, implement coaching decision tree, build smart nudge selection

**Phase 3 — User Dashboard:** Build 3-layer visualization (Resonance Pulse, Emergence Direction, WEARE normalized), trend view with spiral metaphor

**Phase 4 — Reassessment:** Build periodic triggers, delta calculations, narrative trend summaries

---

*This V3 Addendum is the authoritative source for the WEARE scoring engine. It supplements V2 (assessments, language, practices) and the Twelve Steps Integration Architecture.*
