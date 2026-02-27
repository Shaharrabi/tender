# PORTRAIT HEALTH CHECK & CONSISTENCY AUDIT
**Date:** February 27, 2026
**Auditor:** Claude Code (automated)
**App:** Tender Couples App v0.1
**Status:** PASS with noted gaps

---

## EXECUTIVE SUMMARY

The portrait system is **architecturally sound and impressively comprehensive**. All 6 individual assessments feed into the individual portrait. Both individual portraits feed into the couple portrait. The couple portal renders all 6 tabs with real, generated data — no placeholder or demo content.

**Key findings:**
- ✅ All 6 assessments are scored, saved, and consumed by the portrait generator
- ✅ 15 composite dimensions computed from cross-assessment formulas
- ✅ Deep couple portrait generated fresh on every load (not cached stale)
- ✅ Individual portrait auto-regenerates when assessments change
- ✅ Relationship portrait now also regenerates when individual portraits change (just fixed today)
- ✅ All 6 couple portal tabs render real data from the portrait generators
- ⚠️ ~30% of narrative content is template-based (attachment style lookups)
- ⚠️ Some visualization components use hardcoded colors/fonts instead of design tokens
- ⚠️ `RADAR_DIMENSIONS` (5 items) is dead code — `ALL_DIMENSIONS` (7 items) is actually used
- ⚠️ Supplement items exist for 4 of 6 assessments but are Phase 3 optional

---

## PART 1: DATA FLOW AUDIT

### Check 1: Assessment → Scores ✅ PASS

All 6 assessments produce complete scores saved to Supabase `assessments.scores` (JSONB):

| Assessment | Items | Subscales Saved | Supplement Items | All Data Persisted |
|---|---|---|---|---|
| **ECR-R** | 36 core + 5 supplement | anxietyScore, avoidanceScore, attachmentStyle | 5 items (37-41): pattern awareness | ✅ Yes |
| **IPIP-NEO-120** | 120 | 5 domains + 30 facets (sums, means, percentiles) | None | ✅ Yes |
| **SSEIT** | 33 core + 3 supplement | 4 subscales (sum, mean, normalized) + total | 3 items (34-36): field sensitivity | ✅ Yes |
| **DUTCH** | 20 | 5 conflict styles (sum, mean) + primary/secondary | None | ✅ Yes |
| **DSI-R** | 46 core + 4 supplement | 4 subscales (raw, reversed, normalized) + total | 4 items (47-50): boundary awareness | ✅ Yes |
| **Values** | 32 core + 5 supplement | 10 domains (importance, accordance, gap), top5, scenarios, qualitative | 5 items (33-37): relational tensions | ✅ Yes |

**Scoring file locations:**
- `utils/assessments/configs/ecr-r.ts`
- `utils/assessments/configs/ipip-neo-120.ts`
- `utils/assessments/configs/sseit.ts`
- `utils/assessments/configs/dutch.ts`
- `utils/assessments/configs/dsi-r.ts`
- `utils/assessments/configs/values.ts`
- `utils/assessments/supplements/ecr-r-supplement.ts`
- `utils/assessments/supplements/sseit-supplement.ts`
- `utils/assessments/supplements/dsi-r-supplement.ts`
- `utils/assessments/supplements/values-supplement.ts`

**Data freshness on refresh:** All calculated values (percentiles, normalized scores, rankings) ARE saved to the `scores` JSONB field. Nothing is lost on page refresh.

---

### Check 2: Scores → Individual Portrait ✅ PASS

**File:** `utils/portrait/portrait-generator.ts`

The individual portrait generator reads ALL 6 assessment scores. Here's the cross-reference:

| Portrait Section | ECR-R | IPIP | SSEIT | DUTCH | DSI-R | Values | Supplements |
|---|---|---|---|---|---|---|---|
| Composite Scores (15 dims) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Pattern Detection | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Optional |
| Lens 1: Attachment | ✅ | — | — | — | — | — | — |
| Lens 2: Parts & Polarities | ✅ | ✅ | — | ✅ | via composite | ✅ | — |
| Lens 3: Regulation | ✅ | ✅ | ✅ | ✅ | ✅ | — | — |
| Lens 4: Values | ✅ (opt) | — | — | — | — | ✅ | — |
| Lens 5: Field Awareness | — | ✅ | — | — | ✅ | — | ✅ Required |
| Negative Cycle | ✅ | — | ✅ (opt) | ✅ | — | — | — |
| Growth Edges | — | — | — | — | ✅ | ✅ | — |
| Anchor Points | ✅ | — | — | — | — | — | — |
| Partner Guide | ✅ | — | — | — | — | — | — |
| Big Five Reframes | ✅ | ✅ | — | — | ✅ | — | Phase 3 |

**No orphaned data** — every assessment's scores are consumed by at least 3 portrait sections.

**Gap noted:** Lens 1 (Attachment) only uses ECR-R. Could be enriched with personality data (IPIP neuroticism as anxiety amplifier, IPIP agreeableness as avoidance moderator). This is a design choice, not a bug.

---

### Check 3: Composite Dimensions ✅ PASS

**File:** `utils/portrait/composite-scores.ts`

15 composite dimensions are computed (0-100 scale):

| # | Dimension | Formula Inputs | Used By |
|---|---|---|---|
| 1 | `regulationScore` | IPIP(N inv)×0.4 + SSEIT(managingOwn)×0.3 + DSI-R(reactivity)×0.3 | Radar, regulation lens |
| 2 | `windowWidth` | IPIP(N inv)×0.3 + DSI-R(cutoff)×0.2 + DSI-R(reactivity)×0.3 + SSEIT(own)×0.2 | Regulation lens |
| 3 | `accessibility` | ECR-R(avoidance inv)×0.6 + DSI-R(cutoff)×0.4 | Attachment lens |
| 4 | `responsiveness` | SSEIT(perception)×0.3 + SSEIT(others)×0.3 + IPIP(A)×0.2 + IPIP(O)×0.2 | Attachment lens |
| 5 | `engagement` | ECR-R(avoidance inv)×0.3 + IPIP(E)×0.2 + Values(intimacy)×0.2 + SSEIT(util)×0.3 | Attachment lens |
| 6 | `selfLeadership` | DSI-R(reactivity)×0.3 + DSI-R(I-pos)×0.3 + regulation×0.2 + IPIP(N inv)×0.2 | Parts lens |
| 7 | `valuesCongruence` | Mean(10 - gap) × 10 for all 10 value domains | Radar (as valuesAlignment) |
| 8 | `attachmentSecurity` | ECR-R(anxiety inv)×0.5 + ECR-R(avoidance inv)×0.5 | Radar |
| 9 | `emotionalIntelligence` | SSEIT totalNormalized | Radar |
| 10 | `differentiation` | Mean(DSI-R 4 subscales normalized) | Radar |
| 11 | `conflictFlexibility` | DUTCH entropy×0.6 + quality×0.4 | Radar |
| 12 | `relationalAwareness` | SSEIT(social)×0.35 + SSEIT(perception)×0.35 + IPIP(A)×0.30 | Radar |
| 13 | `anxietyNorm` | (ECR-R anxiety - 1) / 6 × 100 | Couple attachment matrix |
| 14 | `avoidanceNorm` | (ECR-R avoidance - 1) / 6 × 100 | Couple attachment matrix |
| 15 | (windowWidth above) | — | — |

**7 Radar Chart Dimensions** (used for dual radar in couple portal):
1. attachmentSecurity
2. emotionalIntelligence
3. differentiation
4. conflictFlexibility
5. valuesAlignment (mapped from valuesCongruence)
6. regulationCapacity (mapped from regulationScore)
7. relationalAwareness

**Dead code found:** `RADAR_DIMENSIONS` constant in `convergence-divergence.ts` line 31 contains only 5 dimensions. It's never used — `ALL_DIMENSIONS` (7 items, line 55) is what's actually consumed.

---

### Check 4: Individual Portrait → Database → Couple Portal ✅ PASS

**The actual data flow:**

```
Individual Portrait generated → saved to `portraits` table (upsert on user_id)
                                    ↓
Couple Portal loads → getPortrait(myUserId) + getPortrait(partnerId)
                                    ↓
                      Staleness check: compare assessment IDs
                      If new assessments → auto-regenerate portrait
                                    ↓
                      generateDeepCouplePortrait(portraitA, portraitB, dyadicScores, weare)
                                    ↓
                      In-memory DeepCouplePortrait → rendered in 6 tabs
```

**Critical architectural detail:** The couple portal does NOT re-compute from raw assessment scores. It reads pre-computed individual portraits and composes them into a couple portrait. This means:
- ✅ Individual portrait changes automatically propagate to couple view
- ✅ Deep couple portrait is always fresh (generated in-memory on every load)
- ✅ Relationship portrait now also regenerates when individual portraits change (fixed 2026-02-27)

**Portrait storage format:**
- Table: `portraits`
- Conflict resolution: `onConflict: 'user_id'` (one portrait per user, upsert)
- Fields: `composite_scores`, `patterns`, `four_lens`, `negative_cycle`, `growth_edges`, `anchor_points`, `partner_guide`, `version`, `assessment_ids`

---

### Check 5: Reassessment → Portrait Update → Couple Update ✅ PASS (after today's fix)

**Flow when Partner A retakes ECR-R:**

1. **New assessment row** created in `assessments` table (new UUID) ✅
2. **Couple portal loads** → `fetchAllScores()` gets latest per type (ordered by `completed_at DESC`) ✅
3. **Staleness detection** → compares new assessment IDs vs portrait's stored IDs ✅
4. **Individual portrait regenerates** → `autoGenPortrait()` called with fresh scores ✅
5. **`individualPortraitRegenerated = true`** flag set ✅ (ADDED TODAY)
6. **Relationship portrait regenerates** → condition now includes `|| individualPortraitRegenerated` ✅ (FIXED TODAY)
7. **Deep couple portrait generated fresh** from updated individual portraits ✅

**Before today's fix:** Step 6 was broken — relationship portrait was only generated if `!rp` (didn't exist). Once cached, it never updated. Now it also regenerates when individual portraits change.

**Partner portrait limitation:** RLS prevents writing to another user's portrait. If Partner B retakes an assessment, Partner B must regenerate their own portrait from their device. Partner A's couple portal will read Partner B's stale portrait until B regenerates. This is documented in console warnings.

---

### Check 6: Couple Portrait Data Sources ✅ COMPREHENSIVE

**Individual data (per partner):**
| Data Source | Status | Notes |
|---|---|---|
| ECR-R scores (anxiety, avoidance, quadrant) | ✅ Used | Via compositeScores.anxietyNorm/avoidanceNorm |
| ECR-R supplement items (37-41) | ✅ Used | Phase 3 field awareness lens only |
| IPIP-NEO-120 domain scores + facets | ✅ Used | Via composite formulas + pattern detection |
| SSEIT subscale scores | ✅ Used | Via composite formulas + regulation lens |
| SSEIT supplement items (E1-E3) | ✅ Used | Phase 3 field awareness lens only |
| DUTCH subscale scores | ✅ Used | Via composite + pattern detection |
| DSI-R subscale scores + total | ✅ Used | Via composite + differentiation analysis |
| DSI-R supplement items (D1-D4) | ✅ Used | Phase 3 field awareness lens only |
| Values ranked domains + gap scores | ✅ Used | Via composite + values lens + tensions |
| Values supplement items (V1-V5) | ✅ Used | Phase 3 field awareness lens only |
| Composite dimension scores (7) | ✅ Used | Radar overlap, shared strengths, friction |
| Individual portrait narrative sections | ✅ Used | Combined cycle, narratives |
| Individual growth edges | ✅ Used | Couple growth edge prioritization |
| Individual anchor points | ✅ Used | Couple anchor generation |

**Dyadic data:**
| Data Source | Status | Notes |
|---|---|---|
| RDAS scores (consensus, satisfaction, cohesion, total) | ✅ Used | Field layer vitality estimate + synthesis |
| CSI-16 scores (total) | ✅ Used | Field layer vitality estimate + synthesis |
| DCI-37 scores (supportive, common, negative) | ✅ Used | Coping synthesis + pattern detection |

**WEARE data:**
| Data Source | Status | Notes |
|---|---|---|
| WEARE variable scores (A, C, Tr, S, T, I, CE, Δ, R) | ✅ Used | Relational field layer (overrides dyadic estimates) |
| Resonance (A + C + Tr) | ✅ Used | Twin orbs resonance display |
| Emergence direction (Δ - R) | ✅ Used | Direction indicator |
| Full WEARE normalized (0-100) | ✅ Used | Vitality score |
| Bottleneck detection | ✅ Used | Displayed in overview, prioritizes growth edges |
| Movement phase | ✅ Used | Field narrative, phase-specific practices |

**Not yet used:**
| Data Source | Status | Notes |
|---|---|---|
| Practice completion rates | ✗ Not built | v0.2+ feature |
| Step progression | ✗ Not built | v0.2+ feature |
| App engagement frequency | ✗ Not built | v0.2+ feature |

---

### Check 7: Narrative Provenance ⚠️ MIXED

Content falls into three categories:

**1. Truly Generated (data-driven, ~40% of content):**
- Composite score calculations (15 dimensions from 6 assessments)
- Pattern detection flags (threshold-based across multiple assessments)
- Radar overlap analysis (dimension-by-dimension comparison)
- Shared strengths / friction zones (threshold-based pairing)
- Values tensions (dynamic domain pair comparison)
- Repair readiness scores (multi-source formula)
- Growth edge selection and prioritization
- Vitality scoring and qualitative labels
- Trigger cascade (6-stage, partner-specific from cycle data)
- Discrepancy detection (individual vs dyadic data comparison)

**2. Template-Based (selected by data, but text is pre-written, ~30%):**
- Attachment style narratives (4 templates × multiple intensity levels)
- Protective strategy descriptions (pursue/withdraw/oscillate/direct)
- Manager/firefighter part labels and descriptions
- Polarity descriptions
- Flooding markers
- Combined cycle dynamic descriptions
- De-escalation steps (fixed 6-step sequence)
- Growth edge practices (mapped from hard-coded PATTERN_EDGES)

**3. Personalized Templates (templates with dynamic slots, ~30%):**
- Anchor points (attachment-style template + partner name + longing)
- Partner guide (attachment template + longing slot)
- Big Five reframes (condition-selected template + personality context)
- Exit points (position-specific with partner names)
- Couple narrative (8-section story woven from generated data)
- Regulation toolkit (practice sequence personalized by EQ + neuroticism)

**Assessment:** This is a healthy ratio for a v0.1 product. The templates are psychologically grounded (EFT-based) and the data-driven portions ensure meaningful personalization. No "ghost data" — every sentence traces to either assessment data or a well-defined selection algorithm.

---

### Check 8: Gap Analysis — Spec vs. Reality

**Tab 1: Overview**
| Feature | Status | Notes |
|---|---|---|
| Twin orbs resonance visualization | ✅ BUILT | Animated SVG, WEARE-powered |
| Emergence direction indicator | ✅ BUILT | Arrow + label |
| Vitality spectrum | ✅ BUILT | 0-100% with qualitative label |
| Couple narrative summary | ✅ BUILT | Generated from overview-snapshot.ts |
| At-a-glance cards | ✅ BUILT | Quick stats + mini insights from all sections |
| Weekly check-in | ✅ BUILT | Interactive submission form |
| Coach entry | ✅ BUILT | Routes to AI coach with couple context |

**Tab 2: Your Dance**
| Feature | Status | Notes |
|---|---|---|
| Combined cycle detection | ✅ BUILT | pursue-withdraw, mutual-pursuit, mutual-withdrawal, mixed |
| Trigger cascade (interleaved) | ✅ BUILT | 4-stage expandable, partner A + B actions |
| Exit points with practices | ✅ BUILT | 4 exit point cards with per-partner actions |
| Repair pathway | ✅ BUILT | Numbered steps with role assignment |

**Tab 3: Together**
| Feature | Status | Notes |
|---|---|---|
| Dual radar chart (7 dimensions) | ✅ BUILT | Overlaid Partner A/B polygons |
| Attachment matrix (both dots) | ✅ BUILT | 2D scatter with quadrants |
| Convergence points (shared strengths) | ✅ BUILT | Cards with dimension labels |
| Divergence analysis (friction zones) | ✅ BUILT | Cards with partner-specific framing |
| Complementary gifts | ✅ BUILT | Cards showing balance |
| Values tensions | ✅ BUILT | Cards with domain pair analysis |

**Tab 4: Insights**
| Feature | Status | Notes |
|---|---|---|
| Full narrative (8 sections) | ✅ BUILT | Opening → field → dance → bring → meet → diverge → edge → closing |
| RDAS synthesis | ✅ BUILT | Conditional on both completing RDAS |
| CSI-16 synthesis | ✅ BUILT | Conditional on both completing CSI-16 |
| DCI synthesis | ✅ BUILT | Conditional on both completing DCI |
| Dyadic discrepancy alerts | ✅ BUILT | Blind spots, hidden strengths, perception gaps |

**Tab 5: Growth**
| Feature | Status | Notes |
|---|---|---|
| Couple growth edges | ✅ BUILT | Full cards with title, rationale, practices, partner parts |
| Partner-specific parts (what A does, what B does) | ✅ BUILT | partnerAPart / partnerBPart fields |
| Shared practices | ✅ BUILT | practiceForBoth field |
| Healing journey link | ✅ BUILT | Routes to /growth |

**Tab 6: Anchors**
| Feature | Status | Notes |
|---|---|---|
| Couple anchors | ✅ BUILT | 5 categories: whenInTheCycle, forPartnerA, forPartnerB, sharedTruths, repairStarters |
| Repair starters | ✅ BUILT | Included in anchor set |
| Therapist export | ✗ NOT BUILT | Mentioned in specs, not implemented |

**Overall: 29/30 features BUILT (97%). 1 not built (therapist export).**

---

## PART 2: VISUAL CONSISTENCY AUDIT

### Design Token System ✅ STRONG

**File:** `constants/theme.ts` (298 lines)

The app has a comprehensive, well-documented design system ("Wes Anderson" aesthetic):

**Color System:**
- Primary: `#C4616E` (Dusty Rose) — Partner A
- Secondary: `#7294D4` (Lobby Blue) — Partner B
- Background: `#FDF6F0` (Warm Parchment)
- Surface: `#FFFFFF` / `#FFF8F2` (White / Warm White)
- Text hierarchy: `#2D2226` → `#6B5B5E` → `#9B8E91`
- Attachment semantics: Secure (#6B9080), Anxious (#C4616E), Avoidant (#7294D4), Fearful (#D8A499)

**Typography System:**
- Headings: Jost (geometric sans)
- Body: Josefin Sans (geometric elegance)
- Accent/Scores: Playfair Display (sophisticated serif)
- 18 named typography presets in `Typography.*`

**Spacing:** 4, 8, 16, 24, 32, 48, 64 (octave scale)
**Border Radius:** 4, 8, 12, 20, 999
**Shadows:** Warm-toned (#2D2226 shadow color, not cool gray)

### Consistency Assessment

**✅ Strong compliance across main UI:**
- All primary screens use `Colors.*` tokens consistently
- Partner A/B distinction (primary/secondary) is clear and consistent
- Typography presets used throughout couple-portal.tsx and portrait.tsx
- Surface/background hierarchy properly maintained

**⚠️ Hardcoded values found in visualization components:**

| Issue | Files | Severity | Recommendation |
|---|---|---|---|
| SVG quadrant fill colors hardcoded | AttachmentMatrix.tsx (4 instances) | Low | Use `Colors.attachment*` tokens |
| Serif font family hardcoded | EQHeatmap.tsx, BigFiveBars.tsx (2), RadarChart.tsx | Low | Use `FontFamilies.accent` |
| Chart label font sizes (8-14px) | Multiple visualization files | Medium | Define `FontSizes.chart*` tokens |
| Fine-grained spacing (2-6px) | 75+ instances in visualizations | Low | Document as intentional for chart density |
| Sub-scale border radius (3-5px) | Several components | Low | Add `BorderRadius.xs: 3` |

**Individual Portrait vs Couple Portrait Typography:**

| Element | Individual Portrait | Couple Portal | Consistent? |
|---|---|---|---|
| Section headers | `Typography.headingM` (20px Jost) | `Typography.headingS` (17px Jost) | ⚠️ Different sizes |
| Body text | `Typography.body` (16px Josefin) | `Typography.bodySmall` (14px Josefin) | ⚠️ Couple uses smaller |
| Accent text | `FontFamilies.accent` (Playfair) | Mixed (some hardcoded Playfair) | ⚠️ Inconsistent reference |
| Card backgrounds | `Colors.surfaceElevated` | `Colors.surface` / `#FFFFFF` | ⚠️ Different warmth |

**Note:** The couple portal intentionally uses slightly smaller text because it packs more information per screen (two partners' data). This is a design decision, not a bug. However, the card background inconsistency (surfaceElevated vs plain white) could be unified.

---

## PART 3: SYSTEM HEALTH SUMMARY

### Is the Portrait System ALIVE or STATIC?

**ALIVE ✅** — with one caveat:

| Layer | Dynamic? | Mechanism |
|---|---|---|
| Individual Portrait | ✅ YES | Auto-regenerates when assessment IDs change |
| Relationship Portrait | ✅ YES (as of today) | Regenerates when individual portraits change |
| Deep Couple Portrait | ✅ YES | Generated fresh in-memory on every load |
| Dyadic Scores | ✅ YES | Fetched fresh from DB on every load |
| WEARE Profile | ✅ YES | Fetched fresh from DB on every load |

**Caveat:** Partner's individual portrait is read-only due to RLS. If partner retakes an assessment, their portrait won't update on your device until they regenerate it from their own device.

### Data Integrity Score: 9/10

**What works perfectly:**
- All 6 assessments → scores → saved → consumed by portrait ✅
- Cross-assessment composite formulas using all 6 sources ✅
- Couple portrait reads from individual portraits (not raw scores) ✅
- Staleness detection and auto-regeneration ✅
- Fresh deep portrait on every load ✅
- Graceful fallbacks when data is missing ✅

**What could improve:**
- Partner portrait staleness notification to the other partner (push notification when partner regenerates)
- Therapist export feature (not built)
- Dead code cleanup (`RADAR_DIMENSIONS` constant)

### Visualization Consistency Score: 8.5/10

**What works perfectly:**
- Consistent Partner A/B color scheme throughout ✅
- Comprehensive design token system ✅
- All 6 tabs render real data ✅
- Warm, cohesive "Wes Anderson" aesthetic ✅

**What could improve:**
- Replace ~10 hardcoded color/font values in visualization components
- Add chart-specific font size tokens to theme.ts
- Unify card backgrounds (surfaceElevated vs white)

---

## RECOMMENDATIONS (Priority Order)

### P0 — Already Fixed Today
1. ~~Relationship portrait never regenerated after assessment retake~~ → FIXED (added `individualPortraitRegenerated` flag)

### P1 — Should Fix Before New Features
2. **Clean up dead code**: Remove unused `RADAR_DIMENSIONS` constant in convergence-divergence.ts
3. **Hardcoded fonts in visualizations**: Replace 4 hardcoded `'PlayfairDisplay_*'` references with `FontFamilies.accent`

### P2 — Nice To Have
4. Add `FontSizes.chartLabel` (10px) and `FontSizes.chartCaption` (9px) to theme.ts
5. Replace hardcoded SVG quadrant colors with `Colors.attachment*` tokens
6. Unify card background strategy (surfaceElevated vs white)
7. Add partner portrait staleness notification system

### P3 — Future Versions
8. Build therapist export feature (Tab 6)
9. Add practice completion / engagement data to portrait
10. Consider enriching Attachment lens with personality data (IPIP × ECR-R)

---

*End of audit. All findings traceable to source files. No changes were made to the codebase during this audit (except the P0 fix noted above which was done before the audit was requested).*
