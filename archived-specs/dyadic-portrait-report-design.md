# Dyadic Portrait Report Design
## Combined Couples Portrait & Relational Dynamics

**Purpose:** Define the combined Portrait experience when two partners have both completed assessments  
**Version:** 1.0  
**Prerequisite:** Both partners have individual Portraits + mutual sharing consent

---

# TABLE OF CONTENTS

1. [Dyadic Portrait Philosophy](#1-dyadic-portrait-philosophy)
2. [Prerequisites & Consent](#2-prerequisites--consent)
3. [Report Structure](#3-report-structure)
4. [Integration Algorithm](#4-integration-algorithm)
5. [Section-by-Section Design](#5-section-by-section-design)
6. [Interactive Features](#6-interactive-features)
7. [Shared Agent Experience](#7-shared-agent-experience)

---

# 1. Dyadic Portrait Philosophy

## 1.1 Core Principles

### Both/And, Not Either/Or

The Dyadic Portrait never takes sides. Both partners' experiences are valid.

```
NOT THIS:
"Sarah's anxious attachment causes problems for Marcus."

THIS:
"Sarah's pursuit and Marcus's withdrawal interlock in a 
predictable cycle. Both moves make sense. Both have costs."
```

### The Relationship as Third Entity

The couple is more than two individuals.

```
Partner A (Individual Portrait)
        +
Partner B (Individual Portrait)
        ↓
The Relationship (Dyadic Portrait)
- Shared patterns
- Interlocking triggers
- Mutual growth edges
- Relational strengths
```

### Compassionate Understanding, Not Ammunition

Every insight is framed to increase understanding, not to provide evidence in arguments.

```
WARNING THROUGHOUT:
"This information is meant to help you understand and 
support each other—not to win arguments or prove points."
```

---

# 2. Prerequisites & Consent

## 2.1 Requirements

1. Both partners complete individual Portraits
2. Partnership connected in app
3. Both consent to Dyadic Portrait creation
4. Both understand it's shared (no hidden sections)

## 2.2 Consent Screen

```
┌─────────────────────────────────────────┐
│                                         │
│       Create Your Couples Portrait      │
│                                         │
│  You and [Partner] have both completed  │
│  your individual Portraits. Create a    │
│  Dyadic Portrait showing how your       │
│  patterns interact.                     │
│                                         │
│  ⚠️ IMPORTANT                           │
│  Both of you will see the same report.  │
│  This is about mutual understanding—    │
│  not proving points.                    │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  [ ] I understand this is shared    ││
│  │  [ ] I'm doing this to understand   ││
│  │  [ ] I can disconnect at any time   ││
│  └─────────────────────────────────────┘│
│                                         │
│         ┌─────────────────────┐         │
│         │  Request Consent    │         │
│         └─────────────────────┘         │
│                                         │
└─────────────────────────────────────────┘
```

---

# 3. Report Structure

```
DYADIC PORTRAIT SECTIONS:

1. COVER
   Both names, date, "Your Couples Portrait"

2. INTRODUCTION
   Ground rules, how to read together

3. YOUR ATTACHMENT DYNAMIC
   How attachment styles interact
   - Attachment map with both positions
   - The core dynamic explained
   - What each partner is seeking

4. YOUR NEGATIVE CYCLE
   The dance you fall into
   - Full cycle visualization
   - Each partner's moves and underneath
   - Trigger interactions
   - De-escalation map

5. COMPATIBILITY INSIGHTS
   Where you align, where you differ
   - Values alignment
   - Conflict style interaction
   - Personality complementarity
   - Regulation compatibility

6. YOUR RELATIONAL STRENGTHS
   What you do well together

7. SHARED GROWTH EDGES
   What you're both invited to work on
   - Cycle-breaking edges
   - Complementary individual edges

8. COUPLE ANCHORS
   Reminders for difficult moments

9. REPAIR TOOLKIT
   Scripts, rituals, practices

10. CLOSING
    How to use together, when to seek therapy
```

---

# 4. Integration Algorithm

## 4.1 Attachment Dynamic Classification

```javascript
function classifyAttachmentDynamic(partnerA, partnerB) {
  const dynamics = {
    'anxious-avoidant': {
      name: 'The Pursue-Withdraw Dance',
      description: 'One moves toward, one moves away',
      intensity: 'high'
    },
    'anxious-anxious': {
      name: 'The Intensity Spiral',
      description: 'Both move toward with intensity',
      intensity: 'very high'
    },
    'avoidant-avoidant': {
      name: 'The Distance Dance',
      description: 'Both move away when threatened',
      intensity: 'low surface, high underneath'
    },
    'secure-anxious': {
      name: 'The Anchor Dynamic',
      description: 'One provides stability, one seeks reassurance',
      intensity: 'moderate'
    },
    'secure-avoidant': {
      name: 'The Patience Dynamic',
      description: 'One pursues gently, one needs space',
      intensity: 'moderate'
    },
    'secure-secure': {
      name: 'The Collaborative Dynamic',
      description: 'Both can regulate and repair',
      intensity: 'low'
    }
  };
  
  return matchDynamic(partnerA.attachment, partnerB.attachment);
}
```

## 4.2 Trigger Interaction Mapping

```javascript
function mapTriggerInteractions(triggersA, triggersB, positionA, positionB) {
  const interactions = [];
  
  // Find where A's triggers are activated by B's moves
  for (const triggerA of triggersA) {
    const activatedBy = findActivatingMoves(triggerA, positionB);
    if (activatedBy.length > 0) {
      interactions.push({
        triggered: 'A',
        trigger: triggerA,
        activatedBy: activatedBy,
        responseFromA: positionA,
        impactOnB: findImpact(positionA, triggersB)
      });
    }
  }
  
  // Reciprocal for B
  // ...
  
  return interactions;
}
```

---

# 5. Section-by-Section Design

## 5.1 Cover

```
┌─────────────────────────────────────────┐
│                                         │
│         [Interlocking pattern]          │
│                                         │
│         Your Couples Portrait           │
│                                         │
│        [Partner A] & [Partner B]        │
│                                         │
│            February 5, 2026             │
│                                         │
│              ↓ Read together            │
│                                         │
└─────────────────────────────────────────┘
```

## 5.2 Introduction

```
┌─────────────────────────────────────────┐
│                                         │
│  Before You Begin                       │
│                                         │
│  GROUND RULES                           │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │  1. THIS IS FOR UNDERSTANDING       ││
│  │     Not for winning arguments       ││
│  │                                     ││
│  │  2. BOTH PATTERNS ARE VALID         ││
│  │     Your strategies both developed  ││
│  │     for good reasons                ││
│  │                                     ││
│  │  3. THE CYCLE IS THE ENEMY          ││
│  │     Not each other                  ││
│  │                                     ││
│  │  4. PAUSE WHEN ACTIVATED            ││
│  │     If this triggers you, stop      ││
│  │                                     ││
│  │  5. READ TOGETHER                   ││
│  │     This is designed to be shared   ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

## 5.3 Attachment Dynamic

```
┌─────────────────────────────────────────┐
│                                         │
│  Your Attachment Dynamic                │
│                                         │
│  THE PURSUE-WITHDRAW DANCE              │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │           ATTACHMENT MAP            ││
│  │                                     ││
│  │              Anxiety                ││
│  │                 ↑                   ││
│  │   Fearful      │      Anxious      ││
│  │                │        ●S         ││
│  │   ────────────+────────────        ││
│  │                │   ●M              ││
│  │   Avoidant    │      Secure       ││
│  │                ↓                   ││
│  │            Avoidance →             ││
│  │                                     ││
│  │   S = Sarah   M = Marcus           ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
│  THE CORE DYNAMIC                       │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │  When Sarah senses distance, she    ││
│  │  moves toward—seeking connection.   ││
│  │                                     ││
│  │  When Marcus feels pressure, he     ││
│  │  moves away—seeking space.          ││
│  │                                     ││
│  │  Sarah's pursuit triggers Marcus's  ││
│  │  withdrawal. Marcus's withdrawal    ││
│  │  triggers Sarah's pursuit.          ││
│  │                                     ││
│  │  Neither is wrong. Both are         ││
│  │  protecting themselves. The cycle   ││
│  │  is the problem.                    ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
│  WHAT YOU'RE EACH SEEKING               │
│                                         │
│  ┌──────────────────┐┌─────────────────┐│
│  │ SARAH            ││ MARCUS          ││
│  │                  ││                 ││
│  │ Reassurance      ││ Space to        ││
│  │ that she matters ││ regulate        ││
│  │                  ││                 ││
│  │ Confirmation     ││ Time to think   ││
│  │ you're not       ││ without         ││
│  │ leaving          ││ pressure        ││
│  └──────────────────┘└─────────────────┘│
│                                         │
│  Both needs are valid. The challenge    │
│  is that your strategies for meeting    │
│  them inadvertently threaten each       │
│  other's needs.                         │
│                                         │
└─────────────────────────────────────────┘
```

## 5.4 Negative Cycle Visualization

```
┌─────────────────────────────────────────┐
│                                         │
│  Your Negative Cycle                    │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │         ┌─────────────┐             ││
│  │         │   TRIGGER   │             ││
│  │         │  Distance   │             ││
│  │         │  detected   │             ││
│  │         └──────┬──────┘             ││
│  │                │                    ││
│  │                ▼                    ││
│  │  ┌─────────────────────────────┐    ││
│  │  │         SARAH               │    ││
│  │  │  FEELS: Fear, anxiety       │    ││
│  │  │  DOES:  Pursues, questions  │    ││
│  │  └─────────────┬───────────────┘    ││
│  │                │                    ││
│  │                ▼                    ││
│  │  ┌─────────────────────────────┐    ││
│  │  │        MARCUS               │    ││
│  │  │  FEELS: Overwhelmed         │    ││
│  │  │  DOES:  Withdraws, shuts    │    ││
│  │  └─────────────┬───────────────┘    ││
│  │                │                    ││
│  │                ▼                    ││
│  │  ┌─────────────────────────────┐    ││
│  │  │         SARAH               │    ││
│  │  │  FEELS: Abandoned           │    ││
│  │  │  DOES:  Pursues harder      │    ││
│  │  └─────────────┬───────────────┘    ││
│  │                │                    ││
│  │                ▼                    ││
│  │         ┌─────────────┐             ││
│  │         │  ESCALATES  │             ││
│  │         └─────────────┘             ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
│  SARAH'S EXPERIENCE                     │
│                                         │
│  YOUR MOVE: When you sense distance,    │
│  you move toward—wanting to talk,       │
│  get clarity, feel connected.           │
│                                         │
│  UNDERNEATH: "I'm terrified you're      │
│  pulling away. That I don't matter."    │
│                                         │
│  MARCUS'S EXPERIENCE                    │
│                                         │
│  YOUR MOVE: When you feel pressure,     │
│  you move away—needing space,           │
│  time to think.                         │
│                                         │
│  UNDERNEATH: "I can never do it right.  │
│  I just need a minute to think."        │
│                                         │
│  DE-ESCALATION                          │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  SARAH'S OFF-RAMP:                  ││
│  │                                     ││
│  │  "I'm feeling disconnected and I    ││
│  │  want to talk, but I can see        ││
│  │  you're overwhelmed. Can we find    ││
│  │  a time that works for both?"       ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  MARCUS'S OFF-RAMP:                 ││
│  │                                     ││
│  │  "I'm overwhelmed and need space,   ││
│  │  but we're okay. Can we talk        ││
│  │  in an hour?"                       ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

## 5.5 Compatibility Insights

```
┌─────────────────────────────────────────┐
│                                         │
│  Compatibility Insights                 │
│                                         │
│  VALUES ALIGNMENT                       │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  SHARED CORE VALUES                 ││
│  │  ✓ Honesty & Authenticity           ││
│  │  ✓ Growth & Learning                ││
│  │                                     ││
│  │  COMPLEMENTARY VALUES               ││
│  │  Sarah: Intimacy  Marcus: Security  ││
│  │  Can complement if balanced         ││
│  │                                     ││
│  │  POTENTIAL TENSION                  ││
│  │  Sarah: Adventure  Marcus: Security ││
│  │  May need negotiation               ││
│  └─────────────────────────────────────┘│
│                                         │
│  CONFLICT STYLE INTERACTION             │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Sarah: Problem-Solving → Avoiding  ││
│  │  Marcus: Avoiding → Withdrawing     ││
│  │                                     ││
│  │  THE CHALLENGE:                     ││
│  │  Sarah's drive to resolve can feel  ││
│  │  like pursuit. Marcus's avoidance   ││
│  │  can feel like stonewalling.        ││
│  │                                     ││
│  │  THE OPPORTUNITY:                   ││
│  │  Together, you can have better-     ││
│  │  timed, calmer conversations.       ││
│  └─────────────────────────────────────┘│
│                                         │
│  REGULATION COMPATIBILITY               │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Sarah: Activation-prone            ││
│  │  Marcus: Shutdown-prone             ││
│  │                                     ││
│  │  Your nervous systems move in       ││
│  │  opposite directions under stress.  ││
│  │                                     ││
│  │  THE OPPORTUNITY:                   ││
│  │  Marcus's calm can anchor Sarah.    ││
│  │  Sarah's energy can re-engage       ││
│  │  Marcus. You can be each other's    ││
│  │  anchors—if you offer what helps    ││
│  │  them, not what you'd want.         ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

## 5.6 Relational Strengths

```
┌─────────────────────────────────────────┐
│                                         │
│  Your Relational Strengths              │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  ✓ SHARED COMMITMENT TO GROWTH      ││
│  │    You both value learning and      ││
│  │    evolution.                       ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  ✓ HONESTY AS FOUNDATION            ││
│  │    Authenticity matters to both.    ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  ✓ COMPLEMENTARY ENERGIES           ││
│  │    Sarah's attunement + Marcus's    ││
│  │    stability = access to both.      ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  ✓ REPAIR POTENTIAL                 ││
│  │    Sarah's drive to reconnect and   ││
│  │    Marcus's eventual willingness    ││
│  │    mean you don't stay stuck.       ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

## 5.7 Shared Growth Edges

```
┌─────────────────────────────────────────┐
│                                         │
│  Shared Growth Edge #1                  │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │   Breaking the Pursue-Withdraw      ││
│  │   Cycle Together                    ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
│  SARAH'S PART                           │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  • Express vulnerability, not       ││
│  │    frustration                      ││
│  │  • Give Marcus time before          ││
│  │    demanding resolution             ││
│  │  • Trust that space doesn't mean    ││
│  │    abandonment                      ││
│  └─────────────────────────────────────┘│
│                                         │
│  MARCUS'S PART                          │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  • Say you're overwhelmed, not      ││
│  │    that she's too much              ││
│  │  • Name when you'll come back       ││
│  │  • Re-engage even when you'd        ││
│  │    rather avoid                     ││
│  └─────────────────────────────────────┘│
│                                         │
│  TOGETHER                               │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Either can say:                    ││
│  │  "I think we're in our cycle.       ││
│  │   Can we slow down?"                ││
│  │                                     ││
│  │  Then:                              ││
│  │  - Take 20 minutes apart            ││
│  │  - Come back and share what you     ││
│  │    were feeling UNDERNEATH          ││
│  │  - Listen without defending         ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

## 5.8 Couple Anchors

```
┌─────────────────────────────────────────┐
│                                         │
│  Your Couple Anchors                    │
│                                         │
│  FOR BOTH OF YOU                        │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  "The cycle is the enemy,           ││
│  │   not each other."                  ││
│  │           [ Save for Both ]         ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  "What are you feeling              ││
│  │   underneath right now?"            ││
│  │           [ Save for Both ]         ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  "I think we're in our cycle.       ││
│  │   Can we pause?"                    ││
│  │           [ Save for Both ]         ││
│  └─────────────────────────────────────┘│
│                                         │
│  FOR SARAH                              │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  "His withdrawal isn't rejection.   ││
│  │   It's overwhelm."                  ││
│  └─────────────────────────────────────┘│
│                                         │
│  FOR MARCUS                             │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  "Her pursuit isn't attack.         ││
│  │   It's fear of losing me."          ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

## 5.9 Repair Toolkit

```
┌─────────────────────────────────────────┐
│                                         │
│  Repair Toolkit                         │
│                                         │
│  REPAIR SCRIPTS                         │
│                                         │
│  SARAH INITIATING:                      │
│  ┌─────────────────────────────────────┐│
│  │  "I know I came on strong. I was    ││
│  │  scared we were disconnecting.      ││
│  │  I'm sorry. Can we try again?"      ││
│  └─────────────────────────────────────┘│
│                                         │
│  MARCUS INITIATING:                     │
│  ┌─────────────────────────────────────┐│
│  │  "I know I shut down. I was         ││
│  │  overwhelmed. That wasn't fair.     ││
│  │  I'm here now. What do you need?"   ││
│  └─────────────────────────────────────┘│
│                                         │
│  REPAIR RITUAL                          │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  1. WAIT UNTIL BOTH REGULATED       ││
│  │                                     ││
│  │  2. EACH SHARE:                     ││
│  │     "What I was feeling underneath  ││
│  │     was..."                         ││
│  │                                     ││
│  │  3. EACH OWN:                       ││
│  │     "My part in the cycle was..."   ││
│  │                                     ││
│  │  4. EACH ASK:                       ││
│  │     "What would have helped you?"   ││
│  │                                     ││
│  │  5. RECONNECT:                      ││
│  │     Physical touch, eye contact     ││
│  └─────────────────────────────────────┘│
│                                         │
│  WEEKLY CHECK-IN                        │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Once a week, ask each other:       ││
│  │                                     ││
│  │  • "How are we doing?"              ││
│  │  • "Is there anything between us?"  ││
│  │  • "What do you need from me?"      ││
│  │                                     ││
│  │        [ Set Weekly Reminder ]      ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

## 5.10 Closing

```
┌─────────────────────────────────────────┐
│                                         │
│  What Now                               │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  1. SAVE YOUR ANCHORS               ││
│  │  2. TRY THE 10% MOVES               ││
│  │  3. USE THE REPAIR RITUAL           ││
│  │  4. CHECK IN WEEKLY                 ││
│  │  5. USE YOUR SHARED AGENT           ││
│  └─────────────────────────────────────┘│
│                                         │
│  WHEN TO SEEK THERAPY                   │
│                                         │
│  • The cycle keeps repeating            │
│  • There's contempt or stonewalling     │
│  • Trust has been broken                │
│  • You're considering separation        │
│  • There's any violence or abuse        │
│                                         │
│         [ Find a Couples Therapist ]    │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  You both showed up to do this.     ││
│  │  The goal isn't to never conflict.  ││
│  │  It's to repair faster, understand  ││
│  │  deeper, and remember you're on     ││
│  │  the same team.                     ││
│  └─────────────────────────────────────┘│
│                                         │
│         ┌─────────────────────┐         │
│         │   Shared Agent Chat │         │
│         └─────────────────────┘         │
│                                         │
└─────────────────────────────────────────┘
```

---

# 6. Interactive Features

## 6.1 Shared Reading Mode

Both partners viewing simultaneously see:

```
┌─────────────────────────────────────────┐
│  📖 READING TOGETHER                    │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Sarah is viewing ●                 ││
│  │  Marcus is viewing ●                ││
│  └─────────────────────────────────────┘│
│                                         │
│  [ Pause and Discuss ]                  │
└─────────────────────────────────────────┘
```

## 6.2 Discussion Prompts

After major sections:

```
┌─────────────────────────────────────────┐
│  💬 PAUSE AND DISCUSS                   │
│                                         │
│  • "Does this resonate with you?"       │
│  • "How does it feel to read this?"     │
│  • "What do you want me to understand?" │
│                                         │
│  [ ] We've discussed this               │
│                                         │
│         [ Continue ]                    │
└─────────────────────────────────────────┘
```

---

# 7. Shared Agent Experience

## 7.1 Couple Agent Mode

```
┌─────────────────────────────────────────┐
│  Couple Chat                            │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  You're in Couple Mode. I can see   ││
│  │  both Portraits and your Dyadic     ││
│  │  Portrait. I can help you:          ││
│  │                                     ││
│  │  • Process a recent conflict        ││
│  │  • Practice repair                  ││
│  │  • Understand your cycle            ││
│  │                                     ││
│  │  Both of you will see this chat.    ││
│  └─────────────────────────────────────┘│
│                                         │
│  QUICK STARTS                           │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  🔄 We just had a cycle episode     ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  🛠️ Help us practice repair         ││
│  └─────────────────────────────────────┘│
│  ┌─────────────────────────────────────┐│
│  │  💬 We need to talk about something ││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

## 7.2 Agent Directives in Couple Mode

```javascript
const coupleAgentDirectives = [
  'Never take sides',
  'Frame patterns as systemic, not individual',
  'Remind both partners of their part in cycles',
  'Use "you both" language when possible',
  'If one partner seems activated, help both regulate',
  'Never reveal individual Portrait content not in Dyadic',
  'Encourage direct communication over agent mediation'
];
```

---

*Document Version 1.0*  
*Dyadic Portrait Report Design - Couples Relationship App*
