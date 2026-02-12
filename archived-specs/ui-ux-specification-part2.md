# UI/UX Specification - Part 2
## Design System, Interactions, Accessibility & Appendices

---

# 11. Design System (Continued)

## 11.5 Progress Indicators

```
LINEAR PROGRESS
┌─────────────────────────────────────────┐
│  Track: Border color                    │
│  Fill: Brand Primary                    │
│  Height: 4px                            │
│  Radius: 2px                            │
│  Animation: Smooth ease-out             │
└─────────────────────────────────────────┘

STEP INDICATOR
┌─────────────────────────────────────────┐
│  ●───●───○───○───○                      │
│  Complete: Brand Primary fill           │
│  Current: Brand Primary ring            │
│  Upcoming: Border color                 │
│  Connector: 2px line                    │
└─────────────────────────────────────────┘
```

## 11.6 Iconography

```
STYLE
- Line icons, 1.5px stroke
- Rounded caps and joins
- 24x24 default size
- 20x20 for compact contexts
- 32x32 for emphasis

ICON SET (Recommended: Phosphor, Lucide, or custom)

Navigation:
- home, portrait, chat, progress
- back, forward, close, menu
- settings, profile

Actions:
- edit, delete, share, save
- add, remove, search
- refresh, download, upload

Status:
- check, warning, error, info
- lock, unlock
- visible, hidden

Content:
- heart, star, bookmark
- calendar, clock, timer
- person, people, partner

Emotional:
- calm, activated, shutdown
- growth, anchor, cycle
```

## 11.7 Motion & Animation

```
TIMING

Fast:        150ms    Micro-interactions (button press, toggle)
Normal:      250ms    Standard transitions (page elements)
Slow:        400ms    Larger movements (modals, drawers)
Deliberate:  600ms    Emphasis (celebrations, reveals)

EASING

ease-out:    cubic-bezier(0.0, 0.0, 0.2, 1)   - Elements entering
ease-in:     cubic-bezier(0.4, 0.0, 1, 1)     - Elements exiting
ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1)   - Moving elements

PRINCIPLES

- Motion should feel calm, not urgent
- Avoid bounce effects (too playful for content)
- Reveal animations should feel like "unfolding"
- Celebration animations can be more expressive
- Loading states should feel patient, not anxious
```

---

# 12. Interaction Patterns

## 12.1 Assessment Interactions

```
QUESTION SELECTION (Likert)
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Tap target: 44px minimum                                  │
│  Selection feedback: Immediate color fill + subtle scale   │
│  Haptic: Light tap on selection                            │
│                                                             │
│  ○ ○ ○ ○ ○ ○ ○   Before selection                         │
│  ○ ○ ○ ● ○ ○ ○   After selection (filled + scale 1.1)     │
│                                                             │
│  Next button: Activates immediately on selection           │
│  Auto-advance: Optional setting (off by default)           │
│                                                             │
└─────────────────────────────────────────────────────────────┘

DRAG TO RANK (Values)
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Grab handle: Left side (≡ icon)                           │
│  Drag feedback: Item lifts (shadow + scale 1.02)           │
│  Drop zones: Highlighted as item hovers                    │
│  Haptic: Medium on pickup, light on reorder                │
│                                                             │
│  Accessibility: Also support tap-to-select + move buttons  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

TEXT INPUT (Open Response)
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Character count: Bottom right, subtle                     │
│  Limit approach: Count changes color at 80%, 90%, 100%     │
│  Over limit: Prevent additional input, not truncate        │
│  Save: Continuous autosave (debounced 1s)                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 12.2 Chat Interactions

```
MESSAGE INPUT
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Multiline: Expands to 4 lines max, then scrolls           │
│  Send: Tap send button or Enter (mobile) / Cmd+Enter (web) │
│  Empty state: Send button disabled/hidden                  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Type a message...                              [→]  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘

MESSAGE DISPLAY
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  User messages: Right-aligned, Brand Primary background    │
│  Agent messages: Left-aligned, Surface background          │
│                                                             │
│  Typing indicator: Three animated dots                     │
│  Streaming: Text appears word-by-word (not character)      │
│                                                             │
│  Embedded cards: Portrait references, anchors              │
│  - Tappable to expand/navigate                             │
│  - Subtle elevation to distinguish from text               │
│                                                             │
└─────────────────────────────────────────────────────────────┘

QUICK ACTIONS
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Displayed as tappable pills above input                   │
│  Tap: Sends as message (user sees it as their message)     │
│  Scroll horizontal if more than fit                        │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐           │
│  │ I'm upset   │ │ Help me     │ │ Teach me    │           │
│  │ right now   │ │ process     │ │ something   │           │
│  └─────────────┘ └─────────────┘ └─────────────┘           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 12.3 Navigation Patterns

```
BOTTOM TAB BAR
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  4 tabs: Home, Portrait, Chat, Progress                    │
│  Active: Filled icon + label + Brand Primary               │
│  Inactive: Outline icon + Text Secondary                   │
│  Tap: Switch immediately, no animation                     │
│  Badge: Small dot for notifications (rare use)             │
│                                                             │
│  Height: 56px (iOS), 64px with safe area                   │
│  Shadow: Subtle top shadow                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘

BACK NAVIGATION
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Header back arrow: Returns to previous screen             │
│  Swipe from edge: iOS standard gesture                     │
│  Hardware back: Android standard                           │
│                                                             │
│  Within modal: X closes, back within modal content         │
│                                                             │
└─────────────────────────────────────────────────────────────┘

PULL TO REFRESH
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Used on: Home, Progress                                   │
│  Not used on: Portrait (static), Chat (streaming)          │
│  Indicator: Subtle spinner, Brand Primary                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 12.4 Feedback Patterns

```
SUCCESS FEEDBACK
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Checkmark animation: Quick draw-in                        │
│  Color: Success green                                      │
│  Haptic: Success pattern                                   │
│  Duration: 1.5s visible, then transition                   │
│                                                             │
│  Examples:                                                 │
│  - Assessment section complete                             │
│  - Settings saved                                          │
│  - Practice logged                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘

ERROR FEEDBACK
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Inline errors: Below field, Error color                   │
│  Toast errors: Bottom of screen, dismissable               │
│  Haptic: Error pattern                                     │
│                                                             │
│  Copy: Specific, not generic                               │
│  - "That email is already registered" ✓                    │
│  - "Something went wrong" ✗                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘

LOADING STATES
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Button loading: Spinner replaces text, button disabled    │
│  Screen loading: Skeleton screens, not spinners            │
│  Portrait generation: Progress message + percentage        │
│                                                             │
│  Never: Full-screen blocking spinner                       │
│  Always: Something visible within 100ms                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘

CELEBRATION (Milestones)
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Full-screen modal with animation                          │
│  Confetti or subtle particle effect                        │
│  Haptic: Celebration pattern                               │
│  Sound: Optional (respect system settings)                 │
│                                                             │
│  Tone: Warm, not over-the-top                              │
│  Dismiss: Tap anywhere or button                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 13. Accessibility

## 13.1 Standards

```
TARGET: WCAG 2.1 AA Compliance

REQUIREMENTS:
- All interactive elements: 44x44px minimum touch target
- Color contrast: 4.5:1 for normal text, 3:1 for large text
- All images: Alt text or decorative role
- All forms: Labels, error states, focus indicators
- All modals: Focus trap, escape to close
- Screen reader: Full VoiceOver/TalkBack support
```

## 13.2 Specific Accommodations

```
VISUAL
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Text sizing: Support Dynamic Type (iOS) / Font scaling    │
│  High contrast mode: Tested and functional                 │
│  Color blindness: Don't rely on color alone for meaning    │
│  Reduce motion: Respect system setting, minimize animation │
│                                                             │
└─────────────────────────────────────────────────────────────┘

MOTOR
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Touch targets: 44px minimum                               │
│  Gesture alternatives: All swipes have tap alternatives    │
│  Drag and drop: Provide button-based reordering            │
│  Time limits: None, or generous with extension             │
│                                                             │
└─────────────────────────────────────────────────────────────┘

COGNITIVE
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Clear language: Avoid jargon, explain concepts            │
│  Consistent navigation: Same patterns throughout           │
│  Progress visibility: Always show where user is            │
│  Save state: Never lose work unexpectedly                  │
│  Undo: Provide where possible                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘

SCREEN READERS
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Semantic HTML: Proper heading hierarchy                   │
│  ARIA labels: All interactive elements                     │
│  Live regions: For dynamic content (chat messages)         │
│  Focus management: Logical order, visible indicator        │
│                                                             │
│  Testing: Regular VoiceOver/TalkBack QA                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 13.3 Emotional Accessibility

```
TRAUMA-INFORMED DESIGN
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Exit always visible: Can leave any screen immediately     │
│  Progress saved: Never lose work if need to step away      │
│  No surprise content: Prepare user before heavy material   │
│  Opt-in depth: User chooses to go deeper                   │
│  Skip options: Can skip questions if too activating        │
│                                                             │
└─────────────────────────────────────────────────────────────┘

CRISIS SUPPORT
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Help always accessible: Via settings and chat             │
│  Crisis resources: One tap away from any screen            │
│  Agent recognition: Detects crisis language, responds      │
│  External links: To hotlines, therapist finders            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

# 14. Empty & Error States

## 14.1 Empty States

```
NO PORTRAIT YET
┌─────────────────────────────────────────┐
│                                         │
│           [Illustration]                │
│                                         │
│      Your Portrait is waiting           │
│                                         │
│  Complete the assessment to unlock      │
│  deep insights about your patterns      │
│  and growth edges.                      │
│                                         │
│     ┌─────────────────────┐             │
│     │ Start Assessment    │             │
│     └─────────────────────┘             │
│                                         │
└─────────────────────────────────────────┘

NO CHAT HISTORY
┌─────────────────────────────────────────┐
│                                         │
│           [Illustration]                │
│                                         │
│       Start a conversation              │
│                                         │
│  I'm here whenever you need to talk,    │
│  process, or prepare for something      │
│  difficult.                             │
│                                         │
│  Try: "I had a hard conversation        │
│  today" or use a quick start below.     │
│                                         │
└─────────────────────────────────────────┘

NO PARTNER CONNECTED
┌─────────────────────────────────────────┐
│                                         │
│           [Illustration]                │
│                                         │
│      Better together (optional)         │
│                                         │
│  When your partner joins, you can       │
│  choose to share insights and work      │
│  on your relationship together.         │
│                                         │
│     ┌─────────────────────┐             │
│     │  Invite Partner     │             │
│     └─────────────────────┘             │
│                                         │
│       Not ready yet? That's fine.       │
│                                         │
└─────────────────────────────────────────┘

NO PROGRESS YET
┌─────────────────────────────────────────┐
│                                         │
│           [Illustration]                │
│                                         │
│      Your growth journey starts here    │
│                                         │
│  As you chat with the agent and work    │
│  on your growth edges, your progress    │
│  will appear here.                      │
│                                         │
│     ┌─────────────────────┐             │
│     │  Start a Chat       │             │
│     └─────────────────────┘             │
│                                         │
└─────────────────────────────────────────┘
```

## 14.2 Error States

```
NETWORK ERROR
┌─────────────────────────────────────────┐
│                                         │
│           [Offline icon]                │
│                                         │
│      Can't connect right now            │
│                                         │
│  Check your internet connection         │
│  and try again.                         │
│                                         │
│     ┌─────────────────────┐             │
│     │     Try Again       │             │
│     └─────────────────────┘             │
│                                         │
└─────────────────────────────────────────┘

ASSESSMENT LOAD ERROR
┌─────────────────────────────────────────┐
│                                         │
│           [Error icon]                  │
│                                         │
│      Couldn't load your progress        │
│                                         │
│  Don't worry—your answers are saved.    │
│  Let's try loading again.               │
│                                         │
│     ┌─────────────────────┐             │
│     │     Try Again       │             │
│     └─────────────────────┘             │
│                                         │
│        Contact Support                  │
│                                         │
└─────────────────────────────────────────┘

PORTRAIT GENERATION ERROR
┌─────────────────────────────────────────┐
│                                         │
│           [Error icon]                  │
│                                         │
│   Something went wrong creating         │
│   your Portrait                         │
│                                         │
│  Your assessment is safe. We're         │
│  looking into it. Try again in a        │
│  few minutes.                           │
│                                         │
│     ┌─────────────────────┐             │
│     │     Try Again       │             │
│     └─────────────────────┘             │
│                                         │
│        Contact Support                  │
│                                         │
└─────────────────────────────────────────┘

CHAT ERROR (Message failed)
┌─────────────────────────────────────────┐
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  I'm feeling really frustrated     ││
│  │  with...                           ││
│  │                                 ⚠️ ││
│  │  Couldn't send. Tap to retry.      ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

## 14.3 Maintenance & Unavailable

```
SCHEDULED MAINTENANCE
┌─────────────────────────────────────────┐
│                                         │
│           [Maintenance icon]            │
│                                         │
│      We'll be back shortly              │
│                                         │
│  We're doing some maintenance to        │
│  make things better. Check back         │
│  in about 30 minutes.                   │
│                                         │
│  Your data is safe.                     │
│                                         │
└─────────────────────────────────────────┘

FEATURE UNAVAILABLE
┌─────────────────────────────────────────┐
│                                         │
│           [Lock icon]                   │
│                                         │
│      Coming soon                        │
│                                         │
│  This feature isn't available yet,      │
│  but it's on our roadmap.               │
│                                         │
│     ┌─────────────────────┐             │
│     │  Notify Me          │             │
│     └─────────────────────┘             │
│                                         │
└─────────────────────────────────────────┘
```

---

# APPENDIX A: Screen Inventory

| Section | Screen | Priority |
|---------|--------|----------|
| Onboarding | Welcome | P0 |
| Onboarding | How It Works | P0 |
| Onboarding | Privacy Promise | P0 |
| Onboarding | Create Account | P0 |
| Onboarding | Sign In | P0 |
| Assessment | Assessment Intro | P0 |
| Assessment | Section Intro | P0 |
| Assessment | Likert Question | P0 |
| Assessment | Open Response | P0 |
| Assessment | Ranking Exercise | P1 |
| Assessment | Scenario Question | P1 |
| Assessment | Section Complete | P0 |
| Assessment | Break Point | P1 |
| Assessment | Assessment Complete | P0 |
| Portrait | Reveal | P0 |
| Portrait | Snapshot (Home) | P0 |
| Portrait | Lens Detail (x4) | P0 |
| Portrait | Negative Cycle | P0 |
| Portrait | Growth Edge Detail | P0 |
| Portrait | Anchor Points | P0 |
| Portrait | Partner Guide | P1 |
| Portrait | Deepening Questions | P2 |
| Chat | Chat Home | P0 |
| Chat | Active Conversation | P0 |
| Chat | Conversation History | P1 |
| Progress | Progress Home | P1 |
| Progress | Growth Edge Progress | P1 |
| Progress | Milestone Celebration | P1 |
| Progress | Session History | P2 |
| Partner | Invite Partner | P2 |
| Partner | Partner Connected | P2 |
| Partner | Sharing Selection | P2 |
| Partner | View Partner's Sharing | P2 |
| Settings | Settings Home | P1 |
| Settings | Partner Connection | P2 |
| Settings | Privacy Settings | P1 |
| Settings | Notifications | P2 |
| Settings | Help & FAQ | P1 |

---

# APPENDIX B: Responsive Breakpoints

```
MOBILE (Primary)
320px - 428px     Small phones to large phones
                  Single column, full-width components
                  Bottom tab navigation

TABLET
768px - 1024px    iPad, Android tablets
                  Two-column layouts where appropriate
                  Portrait sections as cards in grid
                  Side navigation option

DESKTOP
1024px+           Web app
                  Max content width: 1200px
                  Three-column layouts possible
                  Chat in persistent sidebar option
                  Portrait as multi-pane layout
```

---

# APPENDIX C: Platform-Specific Notes

```
iOS
- Follow Human Interface Guidelines
- SF Symbols for icons where possible
- Native share sheet for sharing
- Haptic feedback patterns per Apple spec
- Face ID / Touch ID for sensitive actions

ANDROID
- Follow Material Design 3 guidelines
- Use system font (Roboto)
- Native share intent
- Haptic feedback per Android spec
- Biometric prompt for sensitive actions

WEB
- Progressive Web App capable
- Keyboard navigation full support
- Responsive from 320px up
- Print styles for Portrait export
- Deep linking support
```

---

# APPENDIX D: User Flow Diagrams

## Assessment Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Start   │────▶│  Intro   │────▶│ Section  │
│Assessment│     │  Screen  │     │  Intro   │
└──────────┘     └──────────┘     └────┬─────┘
                                       │
                                       ▼
                                 ┌──────────┐
                              ┌──│ Question │──┐
                              │  │   Loop   │  │
                              │  └────┬─────┘  │
                              │       │        │
                              │  (next question)
                              │       │        │
                              └───────┘        │
                                       (section complete)
                                               │
                                               ▼
                                        ┌──────────┐
                                        │ Section  │
                                        │ Complete │
                                        └────┬─────┘
                                             │
                        ┌────────────────────┼────────────────────┐
                        │                    │                    │
                        ▼                    ▼                    ▼
                  ┌──────────┐        ┌──────────┐        ┌──────────┐
                  │  Next    │        │  Break   │        │Assessment│
                  │ Section  │        │  Point   │        │ Complete │
                  └──────────┘        └──────────┘        └────┬─────┘
                        │                    │                 │
                        └──────────┬─────────┘                 │
                                   │                           │
                                   ▼                           ▼
                            ┌──────────┐               ┌──────────┐
                            │  Resume  │               │ Portrait │
                            │  Later   │               │ Generate │
                            └──────────┘               └──────────┘
```

## Partner Integration Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Invite  │────▶│  Send    │────▶│  Wait    │
│  Partner │     │  Link    │     │  Accept  │
└──────────┘     └──────────┘     └────┬─────┘
                                       │
                                       ▼
                                 ┌──────────┐
                                 │ Partner  │
                                 │ Accepted │
                                 └────┬─────┘
                                       │
                                       ▼
                                 ┌──────────┐
                                 │ Partner  │
                                 │ Assesses │
                                 └────┬─────┘
                                       │
                                       ▼
                                 ┌──────────┐
                                 │  Both    │
                                 │ Complete │
                                 └────┬─────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              │                        │                        │
              ▼                        ▼                        ▼
        ┌──────────┐            ┌──────────┐            ┌──────────┐
        │  Choose  │            │  View    │            │  Shared  │
        │  Share   │            │ Partner's│            │  Space   │
        └──────────┘            │ Sharing  │            │ (Future) │
                                └──────────┘            └──────────┘
```

---

*Document Version 1.0*  
*UI/UX Specification Part 2 - Couples Relationship App*
