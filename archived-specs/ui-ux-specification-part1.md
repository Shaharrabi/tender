# UI/UX Specification
## Couples Relationship App - User Experience Design

**Purpose:** Define complete user experience, flows, screens, and interaction patterns  
**Version:** 1.0  
**Platform:** Mobile-first (iOS/Android), responsive web

---

# TABLE OF CONTENTS

1. [Design Philosophy](#1-design-philosophy)
2. [User Journey Map](#2-user-journey-map)
3. [Information Architecture](#3-information-architecture)
4. [Onboarding Flow](#4-onboarding-flow)
5. [Assessment Experience](#5-assessment-experience)
6. [Portrait Experience](#6-portrait-experience)
7. [Agent Chat Experience](#7-agent-chat-experience)
8. [Partner Integration](#8-partner-integration)
9. [Progress & Growth](#9-progress--growth)
10. [Settings & Profile](#10-settings--profile)

*See Part 2 for: Design System, Interaction Patterns, Accessibility, Empty & Error States, Appendices*

---

# 1. Design Philosophy

## Core Principles

### 1.1 Psychological Safety First

The app handles vulnerable content. Every design decision should ask: "Does this feel safe?"

```
PRINCIPLES:
- Private by default (explicit consent for any sharing)
- No judgment in visual language
- Warm, not clinical
- Exit always available
- Progress saved automatically
- No surprise reveals
```

### 1.2 Depth Without Overwhelm

The content is deep. The experience should pace revelation appropriately.

```
PRINCIPLES:
- Progressive disclosure
- Bite-sized insights
- User controls the pace
- "More" is always optional
- Complexity hidden until ready
```

### 1.3 Agency & Ownership

Users own their journey. The app supports, not directs.

```
PRINCIPLES:
- User chooses what to explore
- Partner sharing is always opt-in
- Agent suggests, never demands
- Portrait is "yours," not "about you"
- Growth is self-defined
```

### 1.4 Relationship-Aware

This is ultimately about two people. Design should honor that.

```
PRINCIPLES:
- Individual work first, relational later
- Partner never sees without consent
- No comparison or competition
- "We" language when appropriate
- Celebrate repair, not perfection
```

## Design Mood

| Attribute | Expression |
|-----------|------------|
| **Warm** | Soft edges, approachable typography, natural colors |
| **Calm** | Generous whitespace, gentle animations, no urgency |
| **Trustworthy** | Consistent patterns, clear labels, honest copy |
| **Hopeful** | Growth metaphors, forward motion, light in darkness |
| **Grounded** | Substantial feel, not floaty or ethereal |

---

# 2. User Journey Map

## 2.1 High-Level Journey

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER JOURNEY                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PHASE 1: DISCOVERY & ENTRY                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │ Download │ -> │ Welcome  │ -> │  Brief   │ -> │  Create  │              │
│  │   App    │    │  Screen  │    │ Explain  │    │ Account  │              │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘              │
│                                                                              │
│  PHASE 2: ASSESSMENT                                                        │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │Assessment│ -> │ Complete │ -> │ Complete │ -> │Assessment│              │
│  │  Intro   │    │Session 1 │    │Session 2 │    │ Complete │              │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘              │
│                                                                              │
│  PHASE 3: PORTRAIT                                                          │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │ Portrait │ -> │ Explore  │ -> │  Digest  │ -> │  Save    │              │
│  │ Reveal   │    │ Sections │    │  & Sit   │    │ Anchors  │              │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘              │
│                                                                              │
│  PHASE 4: LIVING SUPPORT                                                    │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │   Meet   │ -> │  Ongoing │ -> │  In-the- │ -> │  Track   │              │
│  │  Agent   │    │  Support │    │  Moment  │    │ Progress │              │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘              │
│                                                                              │
│  PHASE 5: PARTNER INTEGRATION (Optional)                                    │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │  Invite  │ -> │ Partner  │ -> │ Mutual   │ -> │ Shared   │              │
│  │ Partner  │    │ Portrait │    │ Sharing  │    │ Journey  │              │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 2.2 Emotional Journey

```
EMOTIONAL ARC:

Curious → Nervous → Engaged → Exhausted → Hopeful → Seen → Supported → Growing
   │         │          │          │          │        │         │          │
   ▼         ▼          ▼          ▼          ▼        ▼         ▼          ▼
Download  Start     Mid-way    Complete    View    Read     Use      Track
         Assess    Assess     Assess    Portrait  Depth   Agent   Progress

DESIGN IMPLICATIONS:
- "Curious": Show value, reduce friction
- "Nervous": Normalize, ensure safety
- "Engaged": Keep flow, show progress
- "Exhausted": Allow breaks, celebrate effort
- "Hopeful": Build anticipation for insights
- "Seen": Validate accuracy, honor complexity
- "Supported": Reliable presence, personalized
- "Growing": Celebrate wins, maintain momentum
```

---

# 3. Information Architecture

## 3.1 App Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                          APP STRUCTURE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                      BOTTOM NAV                              ││
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           ││
│  │  │  Home   │ │Portrait │ │  Chat   │ │Progress │           ││
│  │  │   🏠    │ │   📋    │ │   💬    │ │   📈    │           ││
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘           ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  HOME                                                            │
│  ├── Daily Check-in (optional)                                  │
│  ├── Quick Access to Agent                                      │
│  ├── Current Growth Edge                                        │
│  ├── Partner Status (if connected)                              │
│  └── Suggested Action                                           │
│                                                                  │
│  PORTRAIT                                                        │
│  ├── Snapshot (visual summary)                                  │
│  ├── Four Lenses                                                │
│  │   ├── Attachment & Protection                                │
│  │   ├── Parts & Polarities                                     │
│  │   ├── Regulation & Window                                    │
│  │   └── Values & Becoming                                      │
│  ├── Negative Cycle                                             │
│  ├── Growth Edges                                               │
│  ├── Anchor Points                                              │
│  ├── Partner Guide                                              │
│  └── Deepening Questions                                        │
│                                                                  │
│  CHAT (Agent)                                                    │
│  ├── Conversation Thread                                        │
│  ├── Quick Actions                                              │
│  │   ├── "I'm struggling right now"                            │
│  │   ├── "I want to process something"                         │
│  │   ├── "Help me prepare for a conversation"                  │
│  │   └── "Teach me a skill"                                    │
│  └── Conversation History                                       │
│                                                                  │
│  PROGRESS                                                        │
│  ├── Growth Edge Tracker                                        │
│  ├── Pattern Frequency                                          │
│  ├── Milestones                                                 │
│  ├── Session History                                            │
│  └── Insights Over Time                                         │
│                                                                  │
│  SETTINGS (via profile icon)                                    │
│  ├── Account                                                    │
│  ├── Partner Connection                                         │
│  ├── Notifications                                              │
│  ├── Privacy & Data                                             │
│  ├── Retake Assessment                                          │
│  └── Support & Feedback                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 3.2 Navigation Model

**Primary:** Bottom tab navigation (4 tabs)
**Secondary:** In-section navigation (Portrait sections, Progress views)
**Tertiary:** Modal overlays (quick actions, anchors, settings)

```
NAVIGATION RULES:
- Bottom nav always visible except during assessment and immersive states
- Back button follows standard platform conventions
- Deep links supported to any Portrait section
- Chat accessible via FAB from any screen (optional pattern)
- Settings via profile icon in header
```

---

# 4. Onboarding Flow

## 4.1 Welcome Sequence

### Screen 1: Welcome

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│              [Illustration]             │
│          (warm, abstract, human)        │
│                                         │
│                                         │
│        Understand yourself.             │
│        Strengthen your relationship.    │
│                                         │
│        This app helps you discover      │
│        your patterns, find your         │
│        growth edges, and get support    │
│        when you need it.                │
│                                         │
│                                         │
│         ┌─────────────────────┐         │
│         │    Get Started      │         │
│         └─────────────────────┘         │
│                                         │
│           Already have account?         │
│                Sign in                  │
│                                         │
└─────────────────────────────────────────┘
```

### Screen 2: How It Works

```
┌─────────────────────────────────────────┐
│                                         │
│            How it works                 │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  1. Take the Assessment             ││
│  │     About 70 minutes total.         ││
│  │     You can split across sessions.  ││
│  │     [Icon: clipboard]               ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  2. Receive Your Portrait           ││
│  │     A deep look at your patterns,   ││
│  │     protective strategies, and      ││
│  │     growth edges.                   ││
│  │     [Icon: mirror/portrait]         ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  3. Get Personalized Support        ││
│  │     An AI companion who knows you   ││
│  │     and can help in difficult       ││
│  │     moments.                        ││
│  │     [Icon: chat bubble]             ││
│  └─────────────────────────────────────┘│
│                                         │
│         ┌─────────────────────┐         │
│         │      Continue       │         │
│         └─────────────────────┘         │
│                                         │
│               ○ ● ○ ○                   │
└─────────────────────────────────────────┘
```

### Screen 3: Privacy Promise

```
┌─────────────────────────────────────────┐
│                                         │
│            Your data is yours           │
│                                         │
│                                         │
│           [Shield/Lock Icon]            │
│                                         │
│                                         │
│  ✓  Your Portrait is private by        │
│     default. You choose what to share. │
│                                         │
│  ✓  Your partner will never see your   │
│     data without your explicit consent.│
│                                         │
│  ✓  We don't sell your data. Ever.     │
│                                         │
│  ✓  You can export or delete your      │
│     data at any time.                  │
│                                         │
│                                         │
│         ┌─────────────────────┐         │
│         │      Continue       │         │
│         └─────────────────────┘         │
│                                         │
│        Read our Privacy Policy →        │
│                                         │
│               ○ ○ ● ○                   │
└─────────────────────────────────────────┘
```

### Screen 4: Create Account

```
┌─────────────────────────────────────────┐
│                                         │
│           Create your account           │
│                                         │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  First name                         ││
│  │  ┌─────────────────────────────────┐││
│  │  │                                 │││
│  │  └─────────────────────────────────┘││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Email                              ││
│  │  ┌─────────────────────────────────┐││
│  │  │                                 │││
│  │  └─────────────────────────────────┘││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Password                           ││
│  │  ┌─────────────────────────────────┐││
│  │  │                                 │││
│  │  └─────────────────────────────────┘││
│  └─────────────────────────────────────┘│
│                                         │
│         ┌─────────────────────┐         │
│         │   Create Account    │         │
│         └─────────────────────┘         │
│                                         │
│       ─────── or continue with ───────  │
│                                         │
│        [Google]    [Apple]              │
│                                         │
│               ○ ○ ○ ●                   │
└─────────────────────────────────────────┘
```

---

# 5. Assessment Experience

## 5.1 Assessment Introduction

```
┌─────────────────────────────────────────┐
│                                    [X]  │
│                                         │
│        Ready to begin your              │
│           assessment?                   │
│                                         │
│                                         │
│  The assessment includes 6 sections:    │
│                                         │
│  ┌──────┐ Attachment          ~10 min  │
│  ├──────┤ Personality         ~20 min  │
│  ├──────┤ Values              ~15 min  │
│  ├──────┤ Emotional Intel.    ~10 min  │
│  ├──────┤ Conflict Style       ~7 min  │
│  └──────┘ Differentiation     ~12 min  │
│                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│            Total: ~70 minutes           │
│                                         │
│                                         │
│  💡 You can pause and return anytime.   │
│     Your progress is saved.             │
│                                         │
│                                         │
│  ⚙️ Find a quiet space where you can    │
│     reflect honestly without            │
│     interruption.                       │
│                                         │
│                                         │
│         ┌─────────────────────┐         │
│         │   Begin Assessment  │         │
│         └─────────────────────┘         │
│                                         │
│           I'll do this later            │
│                                         │
└─────────────────────────────────────────┘
```

## 5.2 Section Introduction

Before each of the 6 instruments:

```
┌─────────────────────────────────────────┐
│  ←                             1 of 6   │
│                                         │
│                                         │
│              [Section Icon]             │
│                                         │
│          Attachment Patterns            │
│                                         │
│                                         │
│  This section explores how you relate   │
│  to closeness and intimacy in           │
│  relationships.                         │
│                                         │
│                                         │
│  36 questions · About 10 minutes        │
│                                         │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  These statements are about how     ││
│  │  you generally feel in romantic     ││
│  │  relationships, not just your       ││
│  │  current one.                       ││
│  └─────────────────────────────────────┘│
│                                         │
│                                         │
│         ┌─────────────────────┐         │
│         │       Begin         │         │
│         └─────────────────────┘         │
│                                         │
└─────────────────────────────────────────┘
```

## 5.3 Question Display - Likert Scale

```
┌─────────────────────────────────────────┐
│  ←  Attachment                   5/36   │
│  ━━━━━━━━░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │
│                                         │
│                                         │
│                                         │
│   I often worry that my partner         │
│   doesn't really love me.               │
│                                         │
│                                         │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │  Strongly      ○ ○ ○ ○ ○ ○ ○      ││
│  │  Disagree  1   2 3 4 5 6   7  Agree ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
│         ┌─────────────────────┐         │
│         │        Next         │         │
│         └─────────────────────┘         │
│                                         │
└─────────────────────────────────────────┘
```

**Interaction:**
- Tap number or drag along scale
- Selection highlights and animates subtly
- "Next" button activates once selection made
- Swipe right for next question (optional gesture)
- Back arrow to previous question

## 5.4 Question Display - Alternative (Card Style)

```
┌─────────────────────────────────────────┐
│  ←  Attachment                   5/36   │
│  ━━━━━━━━░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │
│                                         │
│                                         │
│   I often worry that my partner         │
│   doesn't really love me.               │
│                                         │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  1  Strongly Disagree               ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  2  Disagree                        ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  3  Slightly Disagree               ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  4  Neutral                     ✓   ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  5  Slightly Agree                  ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  6  Agree                           ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  7  Strongly Agree                  ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

## 5.5 Open Response Question

```
┌─────────────────────────────────────────┐
│  ←  Values                      21/32   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━░░░░░░░░░░░░   │
│                                         │
│                                         │
│   What kind of partner do you           │
│   most want to be?                      │
│                                         │
│   Describe the qualities you want       │
│   to embody in your relationship.       │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │                                     ││
│  │                                     ││
│  │                                     ││
│  │                                     ││
│  │                                     ││
│  │                                     ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                              0/500      │
│                                         │
│  💡 2-4 sentences is plenty             │
│                                         │
│         ┌─────────────────────┐         │
│         │        Next         │         │
│         └─────────────────────┘         │
│                                         │
└─────────────────────────────────────────┘
```

## 5.6 Values Ranking Exercise

```
┌─────────────────────────────────────────┐
│  ←  Values                      24/32   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━░░░░░░░░░░   │
│                                         │
│   Rank your top 5 values                │
│   as a partner                          │
│                                         │
│   Drag to reorder. Most important       │
│   at top.                               │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  ≡  1. Honesty & Authenticity       ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  ≡  2. Intimacy & Connection        ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  ≡  3. Growth & Learning            ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  ≡  4. Security & Stability         ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  ≡  5. Playfulness & Humor          ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   │
│                                         │
│  Not in top 5:                          │
│  Adventure · Autonomy · Family ·        │
│  Service · Spirituality                 │
│                                         │
│         ┌─────────────────────┐         │
│         │      Confirm        │         │
│         └─────────────────────┘         │
└─────────────────────────────────────────┘
```

## 5.7 Scenario Question (Values in Action)

```
┌─────────────────────────────────────────┐
│  ←  Values                      27/32   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━░░░░░░   │
│                                         │
│   When my partner does something        │
│   that bothers me but mentioning it     │
│   might cause conflict, I tend to:      │
│                                         │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │  A. Say something right away,       ││
│  │     even if it's uncomfortable      ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │  B. Wait for the right moment,      ││
│  │     then bring it up carefully      ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │  C. Let it go unless it happens     ││
│  │     repeatedly                      ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │  D. Keep it to myself to avoid      ││
│  │     tension                         ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

## 5.8 Section Complete

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│               [Checkmark]               │
│                                         │
│        Attachment section complete      │
│                                         │
│                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Section 1 of 6                         │
│                                         │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  ✓  Attachment          Complete    ││
│  │  ○  Personality          ~20 min    ││
│  │  ○  Values               ~15 min    ││
│  │  ○  Emotional Intel.     ~10 min    ││
│  │  ○  Conflict Style        ~7 min    ││
│  │  ○  Differentiation      ~12 min    ││
│  └─────────────────────────────────────┘│
│                                         │
│                                         │
│         ┌─────────────────────┐         │
│         │  Continue to next   │         │
│         └─────────────────────┘         │
│                                         │
│           Save and exit                 │
│                                         │
└─────────────────────────────────────────┘
```

## 5.9 Break Point (After Session 1)

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│        Nice work. You're halfway        │
│              through.                   │
│                                         │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │     ██████████████░░░░░░░░░░        ││
│  │           50% complete              ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
│                                         │
│  You've completed:                      │
│  ✓  Attachment                         │
│  ✓  Personality                        │
│                                         │
│  Remaining:                             │
│  ○  Values, EQ, Conflict, Self (~40m)  │
│                                         │
│                                         │
│  💡 Taking a break? Your progress       │
│     is saved. Come back anytime.        │
│                                         │
│                                         │
│         ┌─────────────────────┐         │
│         │  Continue now       │         │
│         └─────────────────────┘         │
│                                         │
│         ┌─────────────────────┐         │
│         │  Take a break       │         │
│         └─────────────────────┘         │
│                                         │
└─────────────────────────────────────────┘
```

## 5.10 Assessment Complete

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│            [Celebration Icon]           │
│                                         │
│                                         │
│            Assessment complete          │
│                                         │
│   You answered 284 questions with       │
│   honesty and reflection. That takes    │
│   real effort.                          │
│                                         │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │   Your Portrait is being created.  ││
│  │   This takes about 30 seconds.     ││
│  │                                     ││
│  │        [Loading animation]         ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

---

# 6. Portrait Experience

## 6.1 Portrait Reveal

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│                                         │
│            [Gentle animation]           │
│                                         │
│                                         │
│             Your Portrait               │
│                                         │
│                                         │
│  This is a map of your patterns,        │
│  protective strategies, and growth      │
│  edges in relationships.                │
│                                         │
│                                         │
│  Take your time exploring. There's      │
│  no rush. These insights are here       │
│  whenever you need them.                │
│                                         │
│                                         │
│                                         │
│                                         │
│         ┌─────────────────────┐         │
│         │   Open Portrait     │         │
│         └─────────────────────┘         │
│                                         │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

## 6.2 Portrait Home (Snapshot)

```
┌─────────────────────────────────────────┐
│  Your Portrait                     [⚙]  │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │         ATTACHMENT                  ││
│  │  ┌───────────────────────────────┐  ││
│  │  │           Anxiety              │  ││
│  │  │              ↑                 │  ││
│  │  │   Fearful  │●│  Anxious       │  ││
│  │  │  ─────────+───+─────────      │  ││
│  │  │  Avoidant │   │  Secure       │  ││
│  │  │              ↓                 │  ││
│  │  │         Avoidance →            │  ││
│  │  └───────────────────────────────┘  ││
│  │     Anxious-Preoccupied             ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  TOP VALUES                         ││
│  │  1. Honesty · 2. Intimacy · 3. ...  ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  CONFLICT STYLE                     ││
│  │  Primary: Problem-Solving           ││
│  │  Secondary: Avoiding                ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌──────────────────┐┌─────────────────┐│
│  │ CYCLE: Pursuer   ││ WINDOW: Narrow  ││
│  └──────────────────┘└─────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  EXPLORE                                │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ 🔒 Attachment & Protection     →    ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │ 🧩 Parts & Polarities          →    ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │ 🌊 Regulation & Window         →    ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │ 💎 Values & Becoming           →    ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │ 🔄 Your Negative Cycle         →    ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │ 🌱 Growth Edges                →    ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │ ⚓ Anchor Points               →    ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │ 💝 Partner Guide               →    ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│  🏠    📋    💬    📈                   │
└─────────────────────────────────────────┘
```

## 6.3 Lens Detail View (Example: Attachment)

```
┌─────────────────────────────────────────┐
│  ←  Attachment & Protection             │
│                                         │
│                                         │
│  Your attachment style is               │
│  Anxious-Preoccupied                    │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │   Anxiety: 5.2/7  ████████████░░    ││
│  │   Avoidance: 2.1/7  ████░░░░░░░░    ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  WHAT THIS MEANS                        │
│                                         │
│  You carry a deep capacity for          │
│  connection and a keen attunement to    │
│  relationship dynamics. Your heart is   │
│  oriented toward closeness.             │
│                                         │
│  At the same time, your pattern         │
│  suggests that early experiences        │
│  taught you to be vigilant about        │
│  connection—to monitor for signs of     │
│  distance, to worry about whether       │
│  you matter.                            │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  YOUR PROTECTIVE STRATEGY               │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  When you sense distance, you       ││
│  │  pursue. You move toward, seeking   ││
│  │  reassurance, wanting to talk it    ││
│  │  through, trying to resolve.        ││
│  │                                     ││
│  │  This strategy makes sense—it's     ││
│  │  trying to secure the connection.   ││
│  │  The cost is that it can feel like  ││
│  │  pressure to your partner.          ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  PRIMARY & SECONDARY EMOTIONS           │
│                                         │
│  When you react, there's often a        │
│  secondary emotion on the surface       │
│  and a primary emotion underneath.      │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Secondary (visible):               ││
│  │  Frustration, criticism, urgency    ││
│  │                                     ││
│  │  Primary (underneath):              ││
│  │  Fear of abandonment, longing       ││
│  │  to know you matter                 ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  YOUR TRIGGERS                          │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  • Partner seems distant or         ││
│  │    preoccupied                      ││
│  │  • Ambiguous communication          ││
│  │  • Perceived rejection              ││
│  │  • Partner paying attention to      ││
│  │    others                           ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  WHAT YOU'RE REALLY SEEKING             │
│                                         │
│  Reassurance that you matter.           │
│  Confirmation that the connection       │
│  is secure.                             │
│                                         │
│                                         │
│         ┌─────────────────────┐         │
│         │  Discuss with Agent │         │
│         └─────────────────────┘         │
│                                         │
│  ─────────────────────────────────────  │
│  🏠    📋    💬    📈                   │
└─────────────────────────────────────────┘
```

## 6.4 Growth Edge Detail

```
┌─────────────────────────────────────────┐
│  ←  Growth Edges                        │
│                                         │
│  GROWTH EDGE 1 OF 2                     │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │  Express needs directly before      ││
│  │  they become resentments            ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  THE PATTERN                            │
│                                         │
│  You want connection deeply, but when   │
│  the moment comes to express a need,    │
│  something stops you. You assess it     │
│  as "not worth it" and swallow it.      │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  WHAT IT PROTECTS                       │
│                                         │
│  This pattern developed to protect      │
│  you from rejection. If you don't       │
│  ask, you can't be told no.             │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  WHAT IT COSTS                          │
│                                         │
│  • Resentments build silently           │
│  • Partner doesn't know what you need   │
│  • You feel unseen, but haven't let     │
│    yourself be seen                     │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  THE INVITATION                         │
│                                         │
│  Learn to treat your needs as           │
│  legitimate information, not            │
│  impositions. Share wants before        │
│  deciding if they're reasonable.        │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  DAILY PRACTICE                         │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Once today, express one small      ││
│  │  want, need, or preference—before   ││
│  │  you've decided whether it's        ││
│  │  reasonable.                        ││
│  │                                     ││
│  │        [ Start Practice ]           ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  YOUR ANCHOR                            │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │  "My needs are information,         ││
│  │   not imposition."                  ││
│  │                                     ││
│  │        [ Save to Home ]             ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│  🏠    📋    💬    📈                   │
└─────────────────────────────────────────┘
```

## 6.5 Anchor Points View

```
┌─────────────────────────────────────────┐
│  ←  Anchor Points                       │
│                                         │
│  These are reminders for difficult      │
│  moments. Save the ones that resonate.  │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  WHEN YOU'RE ACTIVATED                  │
│  (heart racing, urgent, flooded)        │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  REMEMBER:                          ││
│  │  • This feeling is your nervous     ││
│  │    system's alarm                   ││
│  │  • Underneath the frustration is    ││
│  │    fear of abandonment              ││
│  │  • What you're really seeking is    ││
│  │    reassurance that you matter      ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  DO:                                ││
│  │  • Slow breath                      ││
│  │  • Say "I'm activated. I need a     ││
│  │    moment."                         ││
│  │  • Feel your feet on the floor      ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  DON'T:                             ││
│  │  • Demand resolution now            ││
│  │  • Make permanent decisions         ││
│  │  • Send the text in your head       ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  WHEN YOU'RE SHUT DOWN                  │
│  (numb, checked out, nothing left)      │
│                                         │
│  [Similar structure...]                 │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  PATTERN INTERRUPTS                     │
│  Quick phrases to create choice         │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  "This is our cycle."               ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  "What am I really feeling?"        ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  "What would Honesty have me do?"   ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│  🏠    📋    💬    📈                   │
└─────────────────────────────────────────┘
```

## 6.6 Partner Guide

```
┌─────────────────────────────────────────┐
│  ←  Partner Guide                       │
│                                         │
│  This is a guide you can share with     │
│  your partner to help them support      │
│  you. Share only if you choose to.      │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  HOW I WORK                             │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  "I need more reassurance than      ││
│  │   might seem logical."              ││
│  │                                     ││
│  │  When I seem clingy or checking in  ││
│  │  a lot, I'm not trying to control   ││
│  │  you. I'm managing anxiety about    ││
│  │  whether we're okay.                ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  "Criticism hits me hard."          ││
│  │                                     ││
│  │  When you're frustrated with me,    ││
│  │  soft startup helps: start with     ││
│  │  what you feel and need, not what   ││
│  │  I did wrong.                       ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  WHEN I'M ACTIVATED                     │
│                                         │
│  What helps:                            │
│  • Reassurance that we're okay          │
│  • A calm tone                          │
│  • Physical closeness (if I want it)    │
│                                         │
│  What to say:                           │
│  • "I hear you. I'm not going anywhere."│
│  • "Let's slow down."                   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  WHEN I'M SHUT DOWN                     │
│                                         │
│  What helps:                            │
│  • Give me time without disappearing    │
│  • Gentle presence, not demands         │
│  • Agree on when we'll reconnect        │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  WHAT I WANT YOU TO REMEMBER            │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  When I'm at my most difficult,     ││
│  │  I'm usually most scared that I     ││
│  │  don't matter to you.               ││
│  └─────────────────────────────────────┘│
│                                         │
│         ┌─────────────────────┐         │
│         │  Share with Partner │         │
│         └─────────────────────┘         │
│                                         │
│  ─────────────────────────────────────  │
│  🏠    📋    💬    📈                   │
└─────────────────────────────────────────┘
```

---

# 7. Agent Chat Experience

## 7.1 Chat Home

```
┌─────────────────────────────────────────┐
│  Chat                              [⋮]  │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │   Hi [Name]. I'm here whenever     ││
│  │   you need to talk or think        ││
│  │   something through.               ││
│  │                                     ││
│  │   I know your Portrait, so I can   ││
│  │   offer personalized perspective.   ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
│  QUICK STARTS                           │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  🆘 I'm struggling right now        ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  💭 I want to process something     ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  🎯 Help me prepare for a convo     ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  📚 Teach me a skill                ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  RECENT CONVERSATIONS                   │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  "The fight about the dishes"       ││
│  │  Yesterday · Processing             ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  "Preparing for the money talk"     ││
│  │  3 days ago · Skill-building        ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Type a message...                  ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│  🏠    📋    💬    📈                   │
└─────────────────────────────────────────┘
```

## 7.2 Active Conversation

```
┌─────────────────────────────────────────┐
│  ←  Chat                           [⋮]  │
│                                         │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  I just had another fight with     ││
│  │  my partner about the same thing.  ││
│  │  I'm so frustrated.                ││
│  │                        You · 2:34p ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  That sounds really frustrating—   ││
│  │  especially when it's the same     ││
│  │  issue coming up again.            ││
│  │                                     ││
│  │  Before we dive in, how activated  ││
│  │  are you feeling right now? Scale  ││
│  │  of 1-10?                          ││
│  │                        Agent · 2:34p││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Like a 7. My heart is still       ││
│  │  racing.                           ││
│  │                        You · 2:35p ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Okay, 7 is high. Let's slow down  ││
│  │  for a second before processing.   ││
│  │                                     ││
│  │  Can you take one slow breath      ││
│  │  with me? Feel your feet on the    ││
│  │  floor?                            ││
│  │                                     ││
│  │  We don't have to figure anything  ││
│  │  out right now.                    ││
│  │                        Agent · 2:35p││
│  └─────────────────────────────────────┘│
│                                         │
│                                         │
│                                         │
│                                         │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Type a message...              [→]││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│  🏠    📋    💬    📈                   │
└─────────────────────────────────────────┘
```

## 7.3 Agent References Portrait

```
┌─────────────────────────────────────────┐
│  ←  Chat                           [⋮]  │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  She said I'm "too much" and       ││
│  │  walked away. I hate when she      ││
│  │  does that.                        ││
│  │                        You · 2:41p ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  I can hear how painful that is.   ││
│  │  Being called "too much" and then  ││
│  │  having her walk away—that's a     ││
│  │  double hit.                       ││
│  │                                     ││
│  │  This sounds like it might be      ││
│  │  touching your cycle. When you     ││
│  │  sense distance, you pursue. She   ││
│  │  withdraws. You pursue harder.     ││
│  │  She shuts down.                   ││
│  │                                     ││
│  │  Does that resonate?               ││
│  │                        Agent · 2:41p││
│  │                                     ││
│  │  ┌──────────────────────────────┐  ││
│  │  │ 📋 View: Your Cycle Pattern  │  ││
│  │  └──────────────────────────────┘  ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Yeah... that's exactly what       ││
│  │  happened.                         ││
│  │                        You · 2:42p ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  So here's the thing: underneath   ││
│  │  your pursuit is fear of           ││
│  │  abandonment. You're not trying    ││
│  │  to be "too much"—you're trying    ││
│  │  to secure the connection.         ││
│  │                                     ││
│  │  And underneath her withdrawal is  ││
│  │  probably overwhelm. She's not     ││
│  │  trying to reject you—she's        ││
│  │  trying to regulate.               ││
│  │                                     ││
│  │  Both valid. Both caught in the    ││
│  │  cycle.                            ││
│  │                        Agent · 2:42p││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Type a message...              [→]││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

## 7.4 Quick Anchor Access

When user says "I'm struggling" or similar, agent can surface anchors:

```
┌─────────────────────────────────────────┐
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  I can see you're activated.       ││
│  │  Here's your anchor for this       ││
│  │  moment:                           ││
│  │                        Agent · 3:15p││
│  │                                     ││
│  │  ┌──────────────────────────────┐  ││
│  │  │ ⚓ WHEN ACTIVATED             │  ││
│  │  │                               │  ││
│  │  │ Remember:                     │  ││
│  │  │ This feeling is your nervous  │  ││
│  │  │ system's alarm. Underneath    │  ││
│  │  │ is fear of abandonment.       │  ││
│  │  │                               │  ││
│  │  │ Do:                           │  ││
│  │  │ • Slow breath                 │  ││
│  │  │ • "I need a moment."          │  ││
│  │  │                               │  ││
│  │  │ Don't:                        │  ││
│  │  │ • Demand resolution now       │  ││
│  │  │                               │  ││
│  │  └──────────────────────────────┘  ││
│  │                                     ││
│  │  Can you try one slow breath?      ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

## 7.5 Skill Practice Mode

```
┌─────────────────────────────────────────┐
│  ←  Chat                           [⋮]  │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  I want to tell her I need more    ││
│  │  quality time but I don't know     ││
│  │  how to say it without sounding    ││
│  │  needy.                            ││
│  │                        You · 4:22p ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Great—let's practice a soft       ││
│  │  startup. This is about stating    ││
│  │  your feeling and need without     ││
│  │  criticism.                        ││
│  │                                     ││
│  │  Formula:                          ││
│  │  "I feel [emotion] about [specific ││
│  │  situation]. I need [request]."    ││
│  │                                     ││
│  │  Give it a try. What's the         ││
│  │  specific situation?               ││
│  │                        Agent · 4:22p││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  I feel lonely when we spend       ││
│  │  evenings on our phones instead    ││
│  │  of talking.                       ││
│  │                        You · 4:23p ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  That's a great start! You named   ││
│  │  the feeling (lonely) and the      ││
│  │  specific situation (phones in     ││
│  │  evening).                         ││
│  │                                     ││
│  │  Now add what you need. What       ││
│  │  would you want instead?           ││
│  │                        Agent · 4:23p││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  I feel lonely when we spend       ││
│  │  evenings on our phones. I need    ││
│  │  us to have at least 30 minutes    ││
│  │  of phone-free time together.      ││
│  │                        You · 4:24p ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  ✨ That's a solid soft startup.   ││
│  │                                     ││
│  │  Notice: no blame, no "you never," ││
│  │  no criticism. Just feeling +      ││
│  │  situation + need.                 ││
│  │                                     ││
│  │  How does it feel to say it that   ││
│  │  way?                              ││
│  │                        Agent · 4:24p││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Type a message...              [→]││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

---

# 8. Partner Integration

## 8.1 Invite Partner

```
┌─────────────────────────────────────────┐
│  ←  Partner Connection                  │
│                                         │
│                                         │
│         Invite Your Partner             │
│                                         │
│  When your partner completes their      │
│  own assessment, you can both           │
│  optionally share insights and          │
│  work on your relationship together.    │
│                                         │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │  HOW IT WORKS                       ││
│  │                                     ││
│  │  1. Send an invite link             ││
│  │  2. Partner downloads app           ││
│  │  3. Partner completes assessment    ││
│  │  4. You each choose what to share   ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
│                                         │
│  ⚠️  Your partner will NEVER see your   │
│     Portrait without your explicit      │
│     consent. You control sharing.       │
│                                         │
│                                         │
│         ┌─────────────────────┐         │
│         │  Send Invite Link   │         │
│         └─────────────────────┘         │
│                                         │
│            Not ready yet                │
│                                         │
│  ─────────────────────────────────────  │
│  🏠    📋    💬    📈                   │
└─────────────────────────────────────────┘
```

## 8.2 Partner Connected - Pre-Sharing

```
┌─────────────────────────────────────────┐
│  ←  Partner Connection                  │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │      [Partner Avatar]               ││
│  │                                     ││
│  │      [Partner Name]                 ││
│  │      Connected · Portrait complete  ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  SHARING STATUS                         │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Your sharing with [Partner]:       ││
│  │                                     ││
│  │  ○ Nothing shared yet               ││
│  │                                     ││
│  │  [ Choose What to Share ]           ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  [Partner]'s sharing with you:      ││
│  │                                     ││
│  │  ○ Nothing shared yet               ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  💡 We recommend sharing your           │
│     Partner Guide as a starting point.  │
│     It's designed to help your partner  │
│     support you better.                 │
│                                         │
│  ─────────────────────────────────────  │
│  🏠    📋    💬    📈                   │
└─────────────────────────────────────────┘
```

## 8.3 Sharing Selection

```
┌─────────────────────────────────────────┐
│  ←  What to Share                       │
│                                         │
│  Choose what [Partner] can see.         │
│  You can change this anytime.           │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  RECOMMENDED                            │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  [●] Partner Guide                  ││
│  │      How they can support you       ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  OPTIONAL                               │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  [ ] Attachment Style               ││
│  │      Your attachment pattern        ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  [ ] Cycle Position                 ││
│  │      Your role in negative cycles   ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  [ ] Growth Edges                   ││
│  │      What you're working on         ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  [ ] Anchor Points                  ││
│  │      Your anchors for hard moments  ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  [ ] Full Portrait                  ││
│  │      Everything (deep access)       ││
│  └─────────────────────────────────────┘│
│                                         │
│         ┌─────────────────────┐         │
│         │    Save Choices     │         │
│         └─────────────────────┘         │
│                                         │
└─────────────────────────────────────────┘
```

## 8.4 Viewing Partner's Shared Content

```
┌─────────────────────────────────────────┐
│  ←  [Partner]'s Sharing                 │
│                                         │
│  [Partner] has shared the following     │
│  with you:                              │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  💝 Partner Guide                   ││
│  │                                     ││
│  │  How to support [Partner]           ││
│  │                               →     ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  🔒 Attachment Style                ││
│  │                                     ││
│  │  [Partner] is Dismissive-Avoidant   ││
│  │                               →     ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  🔄 Cycle Position                  ││
│  │                                     ││
│  │  [Partner] tends to withdraw        ││
│  │                               →     ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  💡 This information is meant to help   │
│     you understand and support each     │
│     other—not to win arguments.         │
│                                         │
│  ─────────────────────────────────────  │
│  🏠    📋    💬    📈                   │
└─────────────────────────────────────────┘
```

---

# 9. Progress & Growth

## 9.1 Progress Home

```
┌─────────────────────────────────────────┐
│  Progress                          [⚙]  │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  GROWTH EDGES                           │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │  Express needs directly             ││
│  │  ████████████░░░░░░░░  Practicing   ││
│  │                                     ││
│  │  3 success moments this month       ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │  Tolerate closeness                 ││
│  │  ██████░░░░░░░░░░░░░░  Emerging     ││
│  │                                     ││
│  │  Mentioned in 2 sessions            ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  PATTERN TRENDS                         │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Pursue-Withdraw Cycle              ││
│  │  ▼ Decreasing   Last: 3 days ago   ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Activation Episodes                ││
│  │  ─ Stable       ~2/week            ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  MILESTONES                             │
│                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐│
│  │ 🎯       │ │ 🌊       │ │ 🔓       ││
│  │ Pattern  │ │ Back to  │ │          ││
│  │ Spotter  │ │ Center   │ │ Locked   ││
│  │ Earned   │ │ Earned   │ │          ││
│  └──────────┘ └──────────┘ └──────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  SESSION HISTORY                   →    │
│                                         │
│  INSIGHTS OVER TIME                →    │
│                                         │
│  ─────────────────────────────────────  │
│  🏠    📋    💬    📈                   │
└─────────────────────────────────────────┘
```

## 9.2 Growth Edge Detail (Progress View)

```
┌─────────────────────────────────────────┐
│  ←  Express needs directly              │
│                                         │
│  Status: Practicing                     │
│  ████████████░░░░░░░░                   │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  SUCCESS MOMENTS                        │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Feb 3                              ││
│  │  "Told partner I needed alone       ││
│  │  time without apologizing"          ││
│  │                         from session││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Jan 28                             ││
│  │  "Asked for what I wanted for       ││
│  │  dinner instead of deferring"       ││
│  │                         from session││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Jan 22                             ││
│  │  "Said I was hurt instead of        ││
│  │  pretending I was fine"             ││
│  │                         from session││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  STRUGGLE MOMENTS                       │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Feb 1                              ││
│  │  "Swallowed my frustration again"   ││
│  │                         from session││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  DAILY PRACTICE                         │
│                                         │
│  Once today, express one small want,    │
│  need, or preference—before you've      │
│  decided whether it's reasonable.       │
│                                         │
│         ┌─────────────────────┐         │
│         │   Log a Practice    │         │
│         └─────────────────────┘         │
│                                         │
│  ─────────────────────────────────────  │
│  🏠    📋    💬    📈                   │
└─────────────────────────────────────────┘
```

## 9.3 Milestone Celebration

```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│                                         │
│               [Animation]               │
│                 🎯                      │
│                                         │
│                                         │
│            Pattern Spotter              │
│                                         │
│    You recognized your own pattern      │
│          in the moment.                 │
│                                         │
│                                         │
│    This is huge. Awareness is the       │
│    first step to choosing something     │
│    different.                           │
│                                         │
│                                         │
│                                         │
│         ┌─────────────────────┐         │
│         │      Continue       │         │
│         └─────────────────────┘         │
│                                         │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

---

# 10. Settings & Profile

## 10.1 Settings Home

```
┌─────────────────────────────────────────┐
│  ←  Settings                            │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │      [Avatar]                       ││
│  │                                     ││
│  │      [Name]                         ││
│  │      [email]                        ││
│  │                                     ││
│  │      [ Edit Profile ]               ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  PARTNER                                │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Partner Connection             →   ││
│  │  Connected to [Partner]             ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  NOTIFICATIONS                          │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Push Notifications             →   ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  Daily Check-in Reminder    [○━━]   ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  PRIVACY & DATA                         │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Privacy Settings               →   ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  Export My Data                 →   ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  Delete My Data                 →   ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  ASSESSMENT                             │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Retake Assessment              →   ││
│  │  Creates new Portrait               ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  SUPPORT                                │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Help & FAQ                     →   ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  Send Feedback                  →   ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  Find a Therapist               →   ││
│  └─────────────────────────────────────┘│
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  [ Sign Out ]                           │
│                                         │
│  ─────────────────────────────────────  │
│  🏠    📋    💬    📈                   │
└─────────────────────────────────────────┘
```

---

*End of Part 1 - See Part 2 for Design System, Interaction Patterns, Accessibility, and Appendices*

*Document Version 1.0*  
*UI/UX Specification Part 1 - Couples Relationship App*
