# Tender Illustration Library
## Drop this entire folder into: `assets/graphics/illustrations/`

---

## Folder Structure

```
assets/graphics/illustrations/
├── index.ts                    ← master barrel export (import everything from here)
│
├── hero/                       ← 4 full-screen heroes
│   ├── IllustrationHomeHero.tsx          → app/(app)/home.tsx
│   ├── IllustrationJournalHero.tsx       → app/(app)/journal.tsx
│   ├── IllustrationCommunityHero.tsx     → app/(app)/community.tsx
│   ├── IllustrationPortalHero.tsx        → app/(app)/couple-portal.tsx
│   └── index.ts
│
├── steps/                      ← 12 step headers
│   ├── IllustrationStep01.tsx            → step-detail.tsx (stepNumber === 1)
│   ├── IllustrationStep02.tsx            → step-detail.tsx (stepNumber === 2)
│   ... through IllustrationStep12.tsx
│   └── index.ts
│
├── assessment/                 ← 14 assessment illustrations
│   ├── IllustrationChapter01.tsx         → tender-assessment.tsx chapter 1 intro
│   ├── IllustrationChapter02.tsx         → tender-assessment.tsx chapter 2 intro
│   ├── IllustrationChapter03.tsx         → tender-assessment.tsx chapter 3 intro
│   ├── IllustrationChapter04.tsx         → tender-assessment.tsx chapter 4 intro
│   ├── IllustrationChapter05.tsx         → tender-assessment.tsx chapter 5 intro
│   ├── IllustrationChapter06.tsx         → tender-assessment.tsx chapters 6+7 intro
│   ├── IllustrationChapter07.tsx         → tender-assessment.tsx values chapter
│   ├── IllustrationAssessCloseness.tsx   → results.tsx chapter 1 result
│   ├── IllustrationAssessPersonality.tsx → results.tsx chapter 2 result
│   ├── IllustrationAssessEI.tsx          → results.tsx chapter 3 result
│   ├── IllustrationAssessDiff.tsx        → results.tsx chapter 4 result
│   ├── IllustrationAssessConflict.tsx    → results.tsx chapter 5 result
│   ├── IllustrationAssessValues.tsx      → results.tsx chapter 6 result
│   ├── IllustrationAssessField.tsx       → results.tsx chapter 7 result
│   └── index.ts
│
├── attachment/                 ← 4 attachment style explanatory scenes
│   ├── IllustrationAttachSecure.tsx      → portrait.tsx + microcourse secure lesson
│   ├── IllustrationAttachAnxious.tsx     → portrait.tsx + microcourse anxious lesson
│   ├── IllustrationAttachDismissive.tsx  → portrait.tsx + microcourse dismissive lesson
│   ├── IllustrationAttachFearful.tsx     → portrait.tsx + microcourse fearful lesson
│   └── index.ts
│
├── ifs/                        ← 3 IFS parts scenes
│   ├── IllustrationIFSSelf.tsx           → microcourse IFS Self lesson
│   ├── IllustrationIFSManager.tsx        → microcourse IFS Manager/Protector lesson
│   ├── IllustrationIFSFirefighter.tsx    → microcourse IFS Firefighter/Exile lesson
│   └── index.ts
│
├── wot/                        ← 3 Window of Tolerance states
│   ├── IllustrationWoTHyper.tsx          → microcourse WoT above window
│   ├── IllustrationWoTRegulated.tsx      → microcourse WoT inside window
│   ├── IllustrationWoTHypo.tsx           → microcourse WoT below window
│   └── index.ts
│
├── portrait/                   ← 2 portrait screen illustrations
│   ├── IllustrationPortraitAttachment.tsx → portrait.tsx Overview tab
│   ├── IllustrationPortraitRadar.tsx      → portrait.tsx Scores tab
│   └── index.ts
│
├── portal/                     ← 5 couple portal illustrations
│   ├── IllustrationPairing01.tsx         → couple-portal.tsx secure+secure
│   ├── IllustrationPairing06.tsx         → couple-portal.tsx anxious+dismissive
│   ├── IllustrationPairing10.tsx         → couple-portal.tsx fearful+fearful
│   ├── IllustrationPortalSnapshot.tsx    → couple-portal.tsx 60-second view
│   ├── IllustrationPortalConflict.tsx    → couple-portal.tsx conflict section
│   └── index.ts
│
└── full20/                     ← 16 full-size scene illustrations
    ├── IllustrationF20Home.tsx           → home.tsx (full-size alt)
    ├── IllustrationF20Onboarding.tsx     → welcome.tsx spiral
    ├── IllustrationF20Journal.tsx        → journal.tsx (full-size alt)
    ├── IllustrationF20Community.tsx      → community.tsx (full-size alt)
    ├── IllustrationF20Portal.tsx         → couple-portal.tsx (full-size)
    ├── IllustrationWoTDiagram.tsx        → microcourse WoT full diagram
    ├── IllustrationF20WoTHyper.tsx       → microcourse WoT hyperarousal
    ├── IllustrationF20CoRegulate.tsx     → exercise.tsx breathing
    ├── IllustrationF20Grounding.tsx      → exercise.tsx 5-4-3-2-1
    ├── IllustrationF20PartsMap.tsx       → microcourse IFS parts map
    ├── IllustrationF20Protector.tsx      → microcourse IFS protector
    ├── IllustrationF20Step01.tsx         → step-detail.tsx step 1 (alt)
    ├── IllustrationF20Step02.tsx         → step-detail.tsx step 2 (alt)
    ├── IllustrationF20Step05.tsx         → step-detail.tsx step 5 (alt)
    ├── IllustrationF20Step12.tsx         → step-detail.tsx step 12 (alt)
    ├── IllustrationECRResult.tsx         → results.tsx DYNAMIC dot
    └── index.ts
```

---

## How to Use (Claude Code)

### Each file contains:
1. A header comment with the illustration ID, screen destination, and full conversion checklist
2. The raw SVG source preserved as a comment
3. A stub React component ready to fill in

### To convert one illustration:
```
1. Open the .tsx file
2. Read the header comment (screen destination + conversion checklist)
3. Copy the SVG from the comment block
4. Convert tags: svg→Svg, path→Path, ellipse→Ellipse, etc.
5. Convert CSS animations using hooks/useIllustrationAnimation.ts
6. Replace the stub <Svg> with the converted component
7. Place in the correct screen file (listed in header)
```

### Import pattern:
```tsx
import { IllustrationStep01 } from '@/assets/graphics/illustrations';
// or specific:
import { IllustrationStep01 } from '@/assets/graphics/illustrations/steps/IllustrationStep01';
```

---

## Animation Hooks

See: `hooks/useIllustrationAnimation.ts` (copy to your hooks/ directory)

| CSS animation | Hook | Use on |
|---|---|---|
| breathe | useBreathe(5000) | Main body paths |
| float | useFloat(3500, 4) | Leaf, vine, symbols |
| pulse | usePulse(0.35, 0.95) | Threads, rings, dots |
| flicker | useFlicker() | Flames only |
| sway | useSway(4, 4000) | Fearful body, awkward poses |
| unfurl | useUnfurl(pathLength) | Vine arc on mount (once) |
| glow | useGlow() | Vesica, garden center |
| drift | useDrift() | Compass, birds |

---

## Critical Rules

- **NO hands or arm paths** — all illustrations are hands-free
- **NO official test names** — use chapter names only
- **animated={false}** for list/thumbnail use
- **Clinical screens** (support-groups, emergency): double all animation durations
- The attachment bubble labels in CommunityHero must be **tappable** (room filters)
- The IllustrationECRResult dot position must be **dynamic** from actual scores

