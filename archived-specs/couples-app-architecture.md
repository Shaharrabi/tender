# Couples Relationship App: Architectural Manual
## "Know Ourselves, Communicate Better, Thrive"

**Version:** 1.0  
**Focus:** Individual Understanding Phase (Self-Knowledge Foundation)

---

# OVERVIEW

This document defines the complete architecture for the individual assessment and integration system. The app is built on a core principle: **understand yourself first, then understand the relationship**.

The system moves through three interconnected phases:

```
PHASE 1: ASSESSMENT → PHASE 2: DEEP INTEGRATION → PHASE 3: AGENT LAYER
     (Data)              (The Portrait)            (Living Support)
```

Each phase builds on the previous. The assessments generate raw data. The integration transforms that data into clinical-grade insight. The agent holds that insight and uses it to support ongoing growth.

---

# PHASE 1: ASSESSMENT

## Purpose

To gather comprehensive, empirically-grounded data about who you are as a relational being—your traits, tendencies, capacities, vulnerabilities, values, and developmental edges.

## Assessment Battery (6 Instruments)

### 1. Attachment Style Assessment (ECR-R)

**What It Measures**

Two orthogonal dimensions of adult attachment:

- **Attachment Anxiety:** Fear of abandonment, hypervigilance about partner availability, need for reassurance, sensitivity to signs of rejection or distance
- **Attachment Avoidance:** Discomfort with closeness, preference for emotional distance, self-reliance as defense, difficulty depending on others

**Format**

- 36 items (or ECR-12 short form)
- 7-point Likert scale (Strongly Disagree to Strongly Agree)
- Self-report

**Scoring Output**

- Anxiety score (continuous)
- Avoidance score (continuous)
- Quadrant placement: Secure (low/low), Anxious-Preoccupied (high anxiety/low avoidance), Dismissive-Avoidant (low anxiety/high avoidance), Fearful-Avoidant (high/high)

**What It Feeds Into**

- Lens 1 (Attachment & Protection): Primary data source
- Lens 3 (Regulation & Window): Predicts activation triggers
- Negative Cycle Pattern: Determines likely position (pursuer vs. withdrawer)
- Growth Edges: Core developmental work often centers here

**Key Interpretive Notes**

- Attachment is dimensional, not categorical—someone can be "mostly secure with anxious activation under specific stress"
- Scores should be interpreted in context of relationship history and current stressors
- High scores on both dimensions (fearful-avoidant) indicate the most complex protective strategies

---

### 2. Personality Assessment (Big Five / OCEAN)

**What It Measures**

Five broad trait dimensions:

- **Openness to Experience:** Intellectual curiosity, creativity, preference for novelty vs. convention
- **Conscientiousness:** Organization, dependability, self-discipline, goal-directed behavior
- **Extraversion:** Sociability, assertiveness, positive emotionality, energy from external engagement
- **Agreeableness:** Cooperation, trust, empathy, concern for social harmony
- **Neuroticism (or Emotional Stability):** Tendency toward negative emotions, reactivity to stress, emotional volatility

**Format**

- 44-60 items (depending on instrument: BFI, NEO-PI-R, IPIP)
- 5-point Likert scale
- Self-report

**Scoring Output**

- Five continuous scores (typically percentile or T-score)
- Facet scores available in longer versions (e.g., six facets per domain in NEO-PI-R)

**What It Feeds Into**

- Lens 2 (Parts & Polarities): High neuroticism may indicate active protective parts
- Lens 3 (Regulation & Window): Neuroticism predicts window of tolerance width
- Lens 4 (Values & Becoming): Openness relates to growth orientation
- Partner Support Section: Helps partner understand baseline tendencies

**Key Interpretive Notes**

- Big Five describes tendencies, not fixed destinies—awareness creates choice
- Low agreeableness is not "bad"—it may indicate healthy boundaries or direct communication style
- High neuroticism combined with high conscientiousness often indicates an achiever who runs anxious
- Couples often differ significantly on extraversion—this is a common perpetual problem area

---

### 3. Values Clarification Assessment (ACT-Based)

**What It Measures**

- Core life values (what matters most deeply)
- Relationship-specific values (what kind of partner you want to be)
- Values-behavior alignment (how well current actions match stated values)
- Values clarity (how well-defined vs. vague your values are)

**Format**

- Card sort or ranking exercise for value domains
- Narrative prompts for relationship values
- Gap analysis between "importance" and "living in accordance with"
- 30-50 items plus open response

**Value Domains Assessed**

- Intimacy & Connection
- Honesty & Authenticity
- Growth & Learning
- Family & Parenting
- Adventure & Novelty
- Security & Stability
- Independence & Autonomy
- Service & Contribution
- Spirituality & Meaning
- Pleasure & Enjoyment

**Scoring Output**

- Ranked value hierarchy (top 5-7 core values)
- Relationship values statement (qualitative)
- Values-action gap scores per domain
- Clarity score

**What It Feeds Into**

- Lens 4 (Values & Becoming): Primary data source
- Lens 2 (Parts & Polarities): Values conflicts reveal part polarization
- Growth Edges: Where values and patterns conflict
- Anchor Points: Values become touchstones in difficult moments

**Key Interpretive Notes**

- Values are chosen directions, not feelings—they guide action even when it's hard
- High importance + low living-in-accordance = key intervention target
- Conflicting values (e.g., security vs. adventure) create internal tension that often plays out relationally
- Partner value comparison happens in Phase 2 relational work

---

### 4. Emotional Intelligence Assessment

**What It Measures**

Four domains of emotional capacity:

- **Self-Awareness:** Recognizing own emotions as they occur, understanding their sources and impact
- **Self-Regulation:** Managing emotional responses, impulse control, adaptability, maintaining standards
- **Social Awareness (Empathy):** Reading others' emotions, understanding perspectives, attunement to social dynamics
- **Relationship Management:** Influencing others effectively, conflict management, collaboration, inspiring/guiding

**Format**

- 40-60 items (depending on instrument: EQ-i 2.0, MSCEIT, or similar)
- Mixed format: self-report + ability-based items
- Some instruments include 360-degree feedback option

**Scoring Output**

- Total EQ score
- Four domain scores
- 15 subscale scores (in EQ-i 2.0: emotional self-awareness, self-regard, self-actualization, emotional expression, independence, interpersonal relationships, empathy, social responsibility, problem-solving, reality testing, impulse control, flexibility, stress tolerance, optimism)

**What It Feeds Into**

- Lens 3 (Regulation & Window): Self-regulation directly maps to window capacity
- Lens 1 (Attachment & Protection): Low empathy may indicate avoidant protection
- Growth Edges: EQ gaps become specific skill-building targets
- Agent Layer: Calibrates how much scaffolding to provide

**Key Interpretive Notes**

- EQ is learnable—unlike personality, these are capacities that can develop
- High self-awareness + low self-regulation = "I know I'm doing it but can't stop" pattern
- High empathy + low self-awareness = tendency to absorb partner's emotions without recognizing own
- Stress tolerance subscale predicts behavior under relational pressure

---

### 5. Conflict Style Assessment

**What It Measures**

Default approach to conflict and disagreement across five modes:

- **Competing:** High assertiveness, low cooperation. Win-lose orientation. "My way."
- **Collaborating:** High assertiveness, high cooperation. Win-win seeking. "Let's find a solution that works for both."
- **Compromising:** Moderate assertiveness, moderate cooperation. Split the difference. "Let's each give a little."
- **Avoiding:** Low assertiveness, low cooperation. Sidestep or postpone. "Let's not go there."
- **Accommodating:** Low assertiveness, high cooperation. Yield to other. "Whatever you want."

**Format**

- 30 forced-choice items (Thomas-Kilmann Conflict Mode Instrument or similar)
- Scenario-based responses
- Context variations possible (conflict with partner vs. conflict at work)

**Scoring Output**

- Percentile score for each of five modes
- Primary mode (highest score)
- Secondary mode
- Underutilized modes
- Context-specific variations if assessed

**What It Feeds Into**

- Lens 1 (Attachment & Protection): Avoiding often correlates with avoidant attachment; accommodating with anxious
- Negative Cycle Pattern: Critical for identifying pursue-withdraw dynamics
- Lens 3 (Regulation & Window): Competing under stress vs. avoiding under stress
- Partner Support Section: Helps partner understand your conflict approach

**Key Interpretive Notes**

- No mode is inherently "good" or "bad"—effectiveness depends on context
- Most people overuse 1-2 modes and underuse others
- The goal is flexibility—accessing different modes strategically
- Couples often polarize (one competes, one avoids) creating escalating cycles
- Default mode under stress often differs from stated preference

---

### 6. Differentiation of Self Assessment

**What It Measures**

From Bowen Family Systems Theory—the capacity to maintain a solid sense of self while remaining emotionally connected to significant others:

- **Emotional Reactivity:** How much you react emotionally to the emotional climate of others (inverse scoring—high reactivity = low differentiation)
- **I-Position:** Ability to define self clearly, state beliefs, take stands based on principle rather than emotion
- **Emotional Cutoff:** Tendency to manage unresolved attachment issues through distance (inverse scoring)
- **Fusion with Others:** Tendency to lose self in relationships, emotional enmeshment, seeking validation through others (inverse scoring)

**Format**

- Differentiation of Self Inventory (DSI or DSI-R)
- 46 items
- 6-point Likert scale
- Self-report

**Scoring Output**

- Total differentiation score
- Four subscale scores
- Composite "Self in Relationship" profile

**What It Feeds Into**

- Lens 4 (Values & Becoming): Differentiation is developmental—higher is more mature
- Lens 2 (Parts & Polarities): Fusion and cutoff represent opposite protective strategies
- Lens 3 (Regulation & Window): Emotional reactivity directly affects window
- Growth Edges: This is often THE core developmental edge in early relationships
- Negative Cycle Pattern: Low differentiation predicts cycle intensity

**Key Interpretive Notes**

- Differentiation is the master variable for relationship health in Bowen theory
- Most people have moderate differentiation—truly high differentiation is relatively rare
- Differentiation is multigenerational—patterns trace back through family of origin
- The goal in early relationship: develop "self" while building "us" (not losing self in us)
- High cutoff is NOT the same as healthy differentiation—it's avoidance masquerading as independence

---

## Assessment Administration

### Sequence

Assessments should be administered in this order:

1. Attachment (ECR-R) — Start with the most fundamental
2. Big Five — Broad personality context
3. Values Clarification — Shift to meaning and aspiration
4. Emotional Intelligence — Capacities and skills
5. Conflict Style — Behavioral patterns
6. Differentiation of Self — Integrative developmental lens

This sequence moves from foundational → descriptive → aspirational → capacity → behavioral → developmental.

### Timing

- Allow 60-90 minutes for full battery
- Can be split across 2-3 sessions
- Recommend completing within one week to maintain consistency

### Environment

- Private, unhurried setting
- Not while activated or in conflict
- Ideally not immediately after a difficult relational experience

### Individual Administration

Each partner completes assessments independently. No sharing of responses until integration is complete. This prevents contamination and ensures authentic self-report.

---

## Assessment Data Structure

For each user, the system stores:

```
UserAssessmentProfile {
  userId: string
  completedAt: timestamp
  
  attachment: {
    anxietyScore: number (1-7 scale)
    avoidanceScore: number (1-7 scale)
    quadrant: "secure" | "anxious" | "avoidant" | "fearful"
    itemResponses: array
  }
  
  bigFive: {
    openness: number (percentile)
    conscientiousness: number (percentile)
    extraversion: number (percentile)
    agreeableness: number (percentile)
    neuroticism: number (percentile)
    facetScores: object (if available)
    itemResponses: array
  }
  
  values: {
    rankedValues: array (top 7)
    relationshipValuesStatement: string
    gapScores: object (by domain)
    clarityScore: number
    itemResponses: array
  }
  
  emotionalIntelligence: {
    totalEQ: number
    selfAwareness: number
    selfRegulation: number
    socialAwareness: number
    relationshipManagement: number
    subscaleScores: object (15 subscales)
    itemResponses: array
  }
  
  conflictStyle: {
    competing: number (percentile)
    collaborating: number (percentile)
    compromising: number (percentile)
    avoiding: number (percentile)
    accommodating: number (percentile)
    primaryMode: string
    secondaryMode: string
    itemResponses: array
  }
  
  differentiation: {
    totalScore: number
    emotionalReactivity: number
    iPosition: number
    emotionalCutoff: number
    fusionWithOthers: number
    itemResponses: array
  }
}
```

---

# PHASE 2: DEEP INTEGRATION (THE PORTRAIT)

## Purpose

To transform raw assessment data into a **clinical-grade formulation**—a unified portrait that sees the person whole, integrates all data through multiple theoretical lenses, and produces insight that is genuinely useful in moments of difficulty.

This is not a report that summarizes six assessments. It is a **synthesis** that reveals patterns, connections, and developmental edges that only become visible when the data is read together.

## Integration Methodology

The assessment data is processed through four interpretive lenses. Each lens asks a different question and draws from different theoretical traditions. Together, they create a multi-dimensional understanding.

---

## Section A: Your Snapshot

### Purpose

Provide immediate visual access to assessment results. This is the "stats" view—clean, clear, at-a-glance.

### Content

**Attachment Map**
- 2x2 quadrant visualization
- User's position plotted on anxiety (y-axis) and avoidance (x-axis)
- Quadrant labels: Secure, Anxious-Preoccupied, Dismissive-Avoidant, Fearful-Avoidant

**Big Five Profile**
- Radar chart or horizontal bar display
- Five dimensions with percentile markers
- Visual indication of "average range" (25th-75th percentile)

**Core Values**
- Top 5 values displayed prominently
- Visual indicator of values-action alignment (gap score)

**Emotional Intelligence**
- Four-quadrant display (self/other × awareness/management)
- Total EQ with domain breakouts

**Conflict Style**
- Five modes displayed with relative strength
- Primary and secondary modes highlighted

**Differentiation Profile**
- Single-axis spectrum from "Fused/Reactive" to "Differentiated/Grounded"
- Four component scores displayed

### Design Principles

- Clean, uncluttered
- No interpretation in this section—just the data
- Color-coded for quick pattern recognition
- Printable as single-page summary

---

## Section B: Four-Lens Analysis

This is the heart of the integration. Each lens reads the assessment data through a specific theoretical framework, surfacing different dimensions of the person's relational self.

### Lens 1: Attachment & Protection
*Theoretical Foundation: EFT, Attachment Theory, PACT*

**Core Question:** What did you learn about closeness, and how do you protect yourself now?

**Integration Process:**

This lens reads:
- ECR-R attachment scores (primary data)
- Conflict style (behavioral expression of attachment)
- Differentiation subscales (emotional reactivity, fusion, cutoff)
- EQ self-regulation (capacity to manage attachment activation)

**Output Narrative Elements:**

1. **Your Attachment Story**
   - What your scores suggest about early relational learning
   - The implicit beliefs about relationships you carry (e.g., "If I need too much, I'll be abandoned" or "If I get too close, I'll lose myself")
   
2. **Your Protective Strategy**
   - How you protect yourself when attachment needs feel threatened
   - The specific moves you make (pursue, withdraw, attack, accommodate, shut down)
   - What you're actually trying to achieve with these moves (usually: safety, connection, or both)

3. **Primary vs. Secondary Emotions**
   - The emotions you show (anger, frustration, numbness, criticism)
   - The emotions underneath (fear, longing, shame, grief)
   - How to access the deeper layer

4. **Your A.R.E. Profile**
   - Accessible: How easy is it for your partner to reach you emotionally?
   - Responsive: When reached, how do you respond to their needs?
   - Engaged: How present are you in moments of connection?

**Sample Output (Illustrative):**

> Your attachment pattern shows elevated anxiety with moderate avoidance—a configuration sometimes called "fearful" or "disorganized." This suggests you learned early that relationships are both desperately needed and potentially dangerous. You long for closeness but anticipate hurt.
>
> Your protective strategy is complex: you tend to pursue connection when you feel distance, but if that pursuit isn't met, you can quickly shift to withdrawal or shutdown. Your conflict style (high avoiding, moderate accommodating) suggests that when direct pursuit feels too risky, you go silent—not because you don't care, but because you've learned that expressing need directly can lead to rejection.
>
> Underneath your surface emotions (frustration when your partner is busy, resentment when you feel dismissed), there's almost always a primary emotion of fear: fear of not mattering, fear of being too much, fear of being left. The work here is learning to access and express that fear directly, rather than letting it drive protective behaviors that push your partner away.

---

### Lens 2: Parts & Polarities
*Theoretical Foundation: IFS, Internal Systems Thinking*

**Core Question:** What parts of you show up in relationship, and what are they protecting?

**Integration Process:**

This lens reads:
- Big Five neuroticism (part activation intensity)
- Values conflicts (polarized parts)
- Differentiation fusion/cutoff subscales (part extremes)
- Conflict style variations (different parts have different styles)
- Attachment pattern (parts organized around attachment wounds)

**Output Narrative Elements:**

1. **Parts Map**
   - Identifying the key parts that show up in your relational life
   - Managers (proactive protectors): the planner, the critic, the caretaker, the perfectionist
   - Firefighters (reactive protectors): the rager, the numbing part, the escape artist
   - Exiles (protected vulnerabilities): the young one who felt abandoned, the one who carries shame

2. **Your Internal Polarization**
   - Parts that pull in opposite directions
   - How this shows up in relationship (e.g., a part that wants deep intimacy while another part is terrified of being known)

3. **Self vs. Part Leadership**
   - Signs you're in Self (curious, calm, compassionate, clear)
   - Signs a part has taken over (reactive, rigid, extreme, urgent)
   - Your typical part-to-Self ratio in relational moments

4. **The U-Turn Opportunity**
   - How to redirect attention inward when triggered
   - Recognizing "this is a part" rather than "this is truth"

**Sample Output (Illustrative):**

> Several distinct parts emerge from your assessment profile:
>
> A **Manager Part** that values competence and fears being seen as needy. This part shows up in your high conscientiousness and low accommodating conflict style—it would rather handle things alone than ask for help and risk being a burden. When this part is running the show, you appear self-sufficient, capable, and somewhat distant.
>
> A **Critic Part** that monitors for signs of inadequacy, both in yourself and sometimes in your partner. This connects to your elevated neuroticism and your attachment anxiety—the critic is trying to prevent rejection by catching problems before they become reasons to leave. The cost: constant vigilance, difficulty relaxing into "good enough."
>
> Underneath these managers, there appears to be an **Exile** carrying old fears of abandonment. When your partner is unavailable or you sense withdrawal, this young part gets activated, flooding you with the urgency of a much earlier wound. Your managers then scramble to contain this—either by pursuing connection urgently or by shutting down entirely.
>
> The polarization here is between **the part that wants to be truly seen** (connected to your value of authenticity) and **the part that believes being truly seen will lead to rejection** (connected to your attachment anxiety). This internal conflict plays out in relationship as approach-avoidance: moving toward intimacy, then pulling back when it feels too vulnerable.

---

### Lens 3: Regulation & Window
*Theoretical Foundation: Polyvagal Theory, DBT, Neuroscience*

**Core Question:** What's your nervous system's capacity, and what happens when you leave your window of tolerance?

**Integration Process:**

This lens reads:
- EQ self-regulation and stress tolerance subscales (primary capacity data)
- Big Five neuroticism (baseline reactivity)
- Differentiation emotional reactivity subscale
- Attachment style (predicts activation triggers)
- Conflict style (behavioral response to dysregulation)

**Output Narrative Elements:**

1. **Your Window of Tolerance**
   - How wide is your optimal arousal zone?
   - What does "in window" look like for you (thinking clearly, staying connected, accessing compassion)?
   - Relative stability vs. variability of your window

2. **Your Activation Pattern (Sympathetic Nervous System)**
   - What triggers you into fight/flight?
   - Physical signs of activation (heart racing, tension, restlessness)
   - Behavioral signs (talking faster, defending, attacking, pursuing)
   - Cognitive signs (black-and-white thinking, worst-case scenarios)

3. **Your Shutdown Pattern (Dorsal Vagal)**
   - What triggers you into freeze/collapse?
   - Physical signs (heaviness, numbness, fatigue, brain fog)
   - Behavioral signs (going silent, withdrawing, dissociating)
   - Cognitive signs (hopelessness, "what's the point," going blank)

4. **Your Regulation Toolkit**
   - Current self-regulation capacities (from EQ data)
   - Co-regulation patterns (do you reach for partner or isolate?)
   - What helps you return to window

5. **Flooding Markers**
   - Your specific signs that you've exceeded capacity
   - The point at which productive conversation is no longer possible
   - Recovery time needed

**Sample Output (Illustrative):**

> Your window of tolerance is narrower than average, particularly around relational threat. Your elevated neuroticism combined with moderate self-regulation capacity means you're more easily activated and need more deliberate effort to return to baseline.
>
> **When you move into activation (sympathetic):**
> Your body likely signals first—chest tightness, quicker breathing, a surge of energy that feels urgent. Your thinking narrows, focusing on what's wrong. You might become more talkative, more intense, more insistent. Your conflict style data suggests you'll initially try to engage (that moderate collaborating score), but if that fails, you'll shift to avoiding—not because you've calmed down, but because you've concluded talking is useless.
>
> **When you move into shutdown (dorsal vagal):**
> This appears to be your secondary response—what happens when activation doesn't resolve the threat. Your high avoiding score and moderate cutoff score suggest you can go very quiet, very distant. You might describe this as "needing space" but it's often more than that: you've left the building emotionally. Your partner likely experiences this as a wall coming down.
>
> **Flooding markers specific to you:**
> Given your profile, flooding probably looks like: feeling misunderstood despite repeated attempts to explain, a sense that nothing you say matters, physical exhaustion mid-conflict, sudden shift from hot (activated) to cold (shutdown). When you're flooded, your capacity for empathy drops significantly—not because you don't care, but because your nervous system has gone into survival mode.
>
> **Return to window:**
> Your EQ data suggests you have moderate capacity for self-soothing but may rely heavily on partner co-regulation. The risk: when partner is the source of activation, your primary regulation strategy is unavailable. Building individual regulation capacity is a key growth edge.

---

### Lens 4: Values & Becoming
*Theoretical Foundation: ACT, Developmental Theory, IBCT*

**Core Question:** Who do you want to be in relationship, and what's the gap between your patterns and your values?

**Integration Process:**

This lens reads:
- Values assessment (primary data)
- Differentiation I-position subscale (capacity to act from values under pressure)
- Big Five openness (growth orientation)
- Conflict style (values in action)
- All other lenses (patterns that obstruct values)

**Output Narrative Elements:**

1. **Your Relationship Values**
   - The kind of partner you want to be
   - What matters most to you in how you show up
   - Values stated in behavioral terms (not just "I value honesty" but "I want to speak truth even when it's uncomfortable")

2. **Values-Pattern Integration**
   - Where your current patterns SERVE your values
   - Where your current patterns OBSTRUCT your values
   - The specific gap between who you want to be and how you're currently showing up

3. **The Developmental Invitation**
   - What growth looks like for you specifically
   - The direction of travel—not fixing deficits but becoming more fully yourself
   - The "growing edge" where you're being invited to stretch

4. **Willingness & Committed Action**
   - What discomfort you'd need to be willing to feel to live your values
   - Small, concrete actions aligned with values
   - How to use values as compass in difficult moments

**Sample Output (Illustrative):**

> Your core relationship values center on **authenticity, intimacy, and growth**. You want to be a partner who shows up honestly, who creates deep connection, and who keeps evolving. You don't want a comfortable, stagnant relationship—you want one that challenges both of you to become more.
>
> **Where your patterns serve these values:**
> Your high openness means you're genuinely curious about your partner's inner world. Your values-action gap on "growth" is low—you're actually living this one. Your willingness to do this assessment work at all reflects the authenticity value in action.
>
> **Where your patterns obstruct these values:**
> Your attachment anxiety and avoiding conflict style create a significant gap around authenticity. You VALUE speaking truth, but your protective system often chooses peace-keeping over honesty. You hold back needs, edit complaints, soften requests until they're unrecognizable. The short-term payoff (avoiding conflict) comes at the long-term cost (resentment builds, intimacy erodes, you don't feel known).
>
> Your intimacy value is similarly obstructed by your avoidant tendencies. You want closeness, but when it's offered, a part of you pulls back. The fearful-avoidant pattern creates an approach-avoidance dance that keeps intimacy always almost-there but never quite landing.
>
> **The developmental invitation:**
> Your growth edge is learning to tolerate the vulnerability of being truly known. This means: expressing needs before they become resentments, staying present when intimacy feels overwhelming, allowing yourself to be "too much" and discovering you're not abandoned for it.
>
> The discomfort you'd need to be willing to feel: the fear of rejection, the vulnerability of direct need-expression, the anxiety of letting your partner really see you. ACT would call this "willingness"—choosing to feel the hard feeling in service of what matters.

---

## Section C: Your Negative Cycle Pattern

### Purpose

Name the specific relational dance you're likely to co-create with your partner. This is the pursue-withdraw, attack-defend, or other cyclical pattern that couples get stuck in.

**Note:** This section is partially predictive until actual relationship data is gathered. It describes your likely position and tendencies based on individual assessment data.

### Content

**Your Position in the Cycle**

Based on your assessment profile, you most likely occupy the [PURSUER / WITHDRAWER / MIXED] position:

- **Pursuer characteristics:** Moves toward partner when sensing distance, escalates to get response, protest behaviors, criticism as connection attempt
- **Withdrawer characteristics:** Moves away when sensing conflict, shuts down to manage overwhelm, stonewalls, "I need space"
- **Mixed characteristics:** Oscillates based on context—pursues in some domains, withdraws in others; or pursues initially then withdraws when pursuit fails

**Your Cycle Triggers**

What activates your side of the cycle:
- Specific partner behaviors (distance, criticism, lack of response, flooding)
- Internal states (accumulated stress, feeling dismissed, perceiving rejection)
- Context factors (certain topics, certain times, certain places)

**What You're Actually Seeking**

Underneath your cycle moves, you're usually trying to get:
- Reassurance that you matter
- Evidence that your partner is accessible
- Protection from overwhelm
- Resolution of the unbearable uncertainty
- A return to felt security

**What Your Partner Experiences**

When you do your cycle moves, your partner likely experiences:
- [If pursuing:] Pressure, criticism, not being enough, can't get it right
- [If withdrawing:] Abandonment, rejection, shut out, doesn't care
- The very thing that makes your move feel necessary is often what makes it backfire

**Breaking the Cycle**

- Recognizing "we're in the cycle" (unified detachment)
- The "U-turn": turning attention to your own reactivity before responding
- Accessing and expressing the softer emotion underneath
- Making repair attempts—and recognizing your partner's

---

## Section D: Your Growth Edges

### Purpose

Identify 2-3 specific areas where your assessment profile points toward meaningful developmental work. These are not problems to fix but invitations to grow.

### Structure (for each growth edge)

**The Pattern**
What you tend to do—described behaviorally and compassionately.

**The Protection**
What this pattern was originally trying to protect you from. Honoring its function.

**The Cost**
What this pattern costs you now, in your current relationship context.

**The Invitation**
What growth looks like here—not eliminating the pattern but expanding your repertoire.

**The Practice**
One concrete, repeatable practice that builds new capacity.

**The Anchor**
A phrase or insight to return to when you notice this pattern arising.

### Sample Growth Edge

> **Growth Edge #1: Voicing Needs Before They Become Resentments**
>
> **The Pattern:** You notice something bothering you—a need unmet, a desire unexpressed, a frustration accumulating. You assess it as "not a big deal," "not worth the conflict," or "they should just know." You swallow it. This happens repeatedly, with small things and medium things, until finally something tips you over—often something relatively small—and the accumulated weight comes out sideways: sharp, critical, or explosively overwhelming.
>
> **The Protection:** This pattern learned to protect you from rejection. Somewhere you learned that having needs is dangerous—that expressing them leads to being seen as demanding, too much, high-maintenance. Swallowing needs felt safer than risking that rejection.
>
> **The Cost:** Your partner experiences you as unpredictable: fine, fine, fine, then suddenly not fine. They can't respond to needs they don't know about. Intimacy erodes because you're not actually letting yourself be known. Resentment accumulates underground and poisons goodwill.
>
> **The Invitation:** Learn to treat small needs as legitimate and worth expressing. This doesn't mean demanding or complaining—it means offering your partner the gift of knowing what you actually want. "I'd love it if..." "It would mean a lot to me if..." "I'm noticing I need..."
>
> **The Practice:** Once daily, express one small want, need, or preference to your partner—before you've decided whether it's reasonable. Notice the impulse to swallow it. Say it anyway.
>
> **The Anchor:** "My needs are information, not imposition. Expressing them is an act of intimacy, not aggression."

---

## Section E: Anchor Points for Difficult Moments

### Purpose

Create specific, personalized touchstones that you can reach for when you're activated, shut down, or caught in the cycle. These are not generic affirmations but insights drawn from your specific assessment profile.

### When Activated (Sympathetic State)

When you're in fight/flight—heart racing, thinking narrowing, urgency rising:

**What to remember:**
- [Personalized insight about what activation means for this person]
- [The primary emotion underneath the secondary one]
- [What you're actually seeking right now]

**What to do:**
- [Specific regulation strategy that works for this profile]
- [Physical grounding action]
- [Phrase to say to partner: "I'm getting activated. I need [X]."]

**What NOT to do:**
- [Specific pitfall this person falls into when activated]
- [The move that feels right but makes it worse]

### When Shut Down (Dorsal Vagal State)

When you're in freeze/collapse—numb, distant, checked out:

**What to remember:**
- [Personalized insight about what shutdown protects against]
- [That this is a physiological state, not a character flaw]
- [What would help you feel safe enough to return]

**What to do:**
- [Specific re-engagement strategy for this profile]
- [Gentle movement or sensation]
- [Phrase to say to partner: "I've gone quiet. I need [X] to come back."]

**What NOT to do:**
- [Specific pitfall when shut down]
- [How the protective strategy backfires]

### Pattern Interrupts

Brief phrases designed to catch you mid-cycle and create a choice point:

- "This is the cycle. I'm doing my move right now."
- "[Name of pattern] is here."
- "What would [specific value] have me do right now?"
- "What am I really feeling underneath this?"
- "What does my partner actually need to hear?"
- [Additional personalized interrupts based on profile]

### Repair Readiness Signals

How to know you're ready to reconnect:

- Physiological signs (breathing normal, body relaxed)
- Cognitive signs (can see partner's perspective, not in black/white)
- Emotional signs (can access caring, not just grievance)
- A repair attempt might sound like: [personalized example]

### Self-Compassion Reminders

When you're in shame about how you showed up:

- "My protective parts were trying to help."
- "I'm learning. This is what learning looks like."
- [Personalized compassion message based on profile]

---

## Section F: How Your Partner Can Support You

### Purpose

A short section written *for* your partner—a "user manual" for how you work, what helps, and what inadvertently makes things worse.

### Content

**What I need you to know about how I work:**
- [Key attachment insight in partner-accessible language]
- [Key trigger summary]
- [What my behaviors actually mean]

**When I'm activated, what helps:**
- [Specific supportive actions]
- [What to say]
- [What NOT to do]

**When I'm shut down, what helps:**
- [Specific re-engagement approaches]
- [Patience requirements]
- [What NOT to do]

**Repair attempts I respond well to:**
- [Specific repair moves]
- [Phrases that land well]

**What I want you to remember about me:**
- [Deepest truth this person wants their partner to hold]
- [The longing underneath the pattern]

---

## Section G: Deepening Questions

### Purpose

Questions for ongoing reflection and conversation—designed to support continued self-discovery and to give the agent material for future exploration.

### Individual Reflection Questions

- When did you last feel truly free to be yourself with your partner? What allowed that?
- What's a need you've been minimizing lately?
- Where are you currently accommodating in ways that cost you?
- When you imagine being fully known by your partner, what comes up?
- What would it look like to be 10% more [core value] in your relationship this week?

### Questions to Explore with Partner (when both have completed assessments)

- What did you learn about yourself that you want me to understand?
- Where do our patterns fit together well? Where do they create friction?
- What do you need from me when you're activated that you haven't directly asked for?
- What repair attempts work best for you?
- What's one thing we could practice together this week?

### Questions for the Agent to Return To

These become fodder for ongoing check-ins:

- How is [Growth Edge #1] showing up this week?
- Have you noticed the cycle recently? What happened?
- What values-aligned action did you take this week?
- Where do you need support right now?

---

## Portrait Generation Logic

### Integration Algorithm

The portrait is not simply generated—it's synthesized through a multi-pass process:

**Pass 1: Score Mapping**
- Map raw scores to interpretive categories
- Flag notable patterns (high/low extremes, unusual combinations)

**Pass 2: Cross-Assessment Correlation**
- Identify convergent findings (multiple assessments pointing to same pattern)
- Identify divergent findings (assessments that seem contradictory—these are interesting)

**Pass 3: Theoretical Lens Application**
- Apply each of four lenses to full assessment data
- Generate lens-specific insights

**Pass 4: Integration & Synthesis**
- Identify core themes across lenses
- Build narrative that weaves insights together
- Surface growth edges from pattern-value conflicts

**Pass 5: Personalization & Humanization**
- Convert clinical insights to accessible language
- Add warmth, compassion, validation
- Generate anchor points, partner guidance, deepening questions

### Quality Standards

The portrait must:
- Feel recognizable ("Yes, that's me")
- Offer genuine insight (not just restating obvious patterns)
- Be compassionate without being saccharine
- Name hard things honestly
- Point toward hope without toxic positivity
- Be actionable (clear practices, not just understanding)
- Be reference-worthy (something you'd return to)

---

# PHASE 3: AGENT LAYER

## Purpose

The agent holds the portrait as a living reference and uses it to provide personalized, theory-informed support across the user's relational journey. The agent is not a replacement for therapy but a knowledgeable companion who knows you deeply.

## Core Capabilities

### 1. Holds the Portrait

The agent has complete access to:
- All assessment data
- The full integrated portrait
- Previous conversations and patterns discussed
- Growth edge progress over time

This allows the agent to:
- Reference your specific patterns ("This sounds like your pursue-then-withdraw pattern showing up")
- Remind you of your anchors ("Remember what we identified about what you're really seeking when you feel dismissed?")
- Track your language for activation/shutdown signs
- Notice when current material connects to portrait insights

### 2. Recognizes Patterns in Real-Time

When a user describes a relational situation, the agent:
- Listens for cycle dynamics
- Identifies which lens is most relevant
- Connects the current moment to established patterns
- Notices when user is in vs. out of window

**Pattern Recognition Triggers:**
- Language indicating activation ("I can't believe she..." "He always..." urgency, absolutes)
- Language indicating shutdown ("I don't know" "Whatever" "It doesn't matter" flatness)
- Cycle markers (pursuing behaviors, withdrawing behaviors, repair attempts)
- Values-behavior conflicts ("I know I should but...")

### 3. Offers Calibrated Interventions

Based on user's specific profile, the agent:
- Selects interventions from appropriate modalities
- Calibrates intensity to user's window
- Adjusts language to user's style
- Sequences support appropriately (regulate before problem-solve)

**Intervention Selection Logic:**

```
IF user appears activated:
  → Validate, regulate, THEN explore
  → Offer specific grounding practices from their toolkit
  → Don't push for insight until window is restored

IF user appears shutdown:
  → Go slow, don't demand engagement
  → Offer gentle, non-threatening prompts
  → Give permission to not figure it out right now

IF user is in window and seeking understanding:
  → Connect current situation to portrait patterns
  → Offer relevant theoretical framing
  → Explore primary emotions
  → Surface growth edge if appropriate

IF user is in window and seeking action:
  → Reference values ("What would [value] have you do?")
  → Offer concrete options
  → Support committed action
  → Anticipate obstacles using pattern knowledge

IF user is in the cycle:
  → Name it ("This sounds like your cycle might be active")
  → Offer unified detachment ("Can we step back and look at this together?")
  → Support U-turn if appropriate
  → Guide toward repair if ready
```

### 4. Tracks Growth Over Time

The agent maintains awareness of:
- Growth edge progress (improving, stuck, regressing)
- Pattern frequency (how often certain cycles arise)
- Intervention effectiveness (what helps, what doesn't land)
- Values-behavior alignment over time

**Progress Indicators:**
- Faster recovery from activation
- Longer time in window
- More successful repair attempts
- Increased needs-expression
- Reduced cycle intensity/frequency
- More Self-led (vs. part-led) responses

### 5. Supports Difficult Moments

When a user reaches out in distress, the agent follows a structured support protocol:

**Step 1: Assess State**
"Before we dive in—where are you right now? Activated? Shut down? Somewhere else?"
[Uses state check to calibrate response]

**Step 2: Regulate First (if needed)**
"Let's get you grounded before we figure this out."
[Offers personalized regulation strategy from portrait]

**Step 3: Understand the Situation**
"What happened?" [Facts]
"What came up for you?" [Emotions, thoughts]
"What do you need right now?" [Immediate vs. long-term]

**Step 4: Reflect the Pattern**
"This sounds connected to [specific pattern from portrait]."
"When [trigger] happens, you tend to [response], and underneath that is usually [primary emotion]."

**Step 5: Offer Options**
Based on state and need:
- Self-soothing (if still flooded)
- Perspective-taking (if in window)
- Repair script (if ready to reconnect)
- Journaling prompt (if processing needed)
- Values check (if action is needed)

**Step 6: Close the Loop**
"How did that land?"
"What's one thing you might do in the next hour?"
"Want to check in again later?"

---

## Agent Voice & Principles

### Tone

- Warm but honest
- Knowledgeable but not condescending
- Compassionate but not enabling
- Curious rather than assuming
- Boundaried (knows its limits, refers to therapy when appropriate)

### Core Principles

**1. Regulate Before Reason**
Never push for insight or action when user is outside window. Meet them in their state first.

**2. Validate Without Colluding**
Honor the person's experience without agreeing with distortions. "I can see why you felt that way" doesn't mean "Your partner was definitely wrong."

**3. Name Patterns, Don't Shame Them**
Patterns developed for good reasons. Name them with compassion. "Your withdrawing part is trying to protect you from overwhelm."

**4. Both/And Over Either/Or**
Hold complexity. Both people can be hurt. Both people can be right. Both people can need something different.

**5. Point Toward Agency**
The user is the expert on their life. The agent offers perspective, not answers. "What do YOU think would help here?"

**6. Know Your Limits**
The agent is not therapy. If safety concerns arise, if trauma material emerges that needs professional support, if the user is stuck in ways that suggest deeper work is needed—refer out.

### Safety Protocols

**If safety concerns arise:**
- Direct language about concern
- Resources provided (hotlines, local services)
- Encourage professional support
- Do not attempt to manage crisis beyond immediate stabilization

**If intimate partner violence indicators emerge:**
- Do not recommend couples work
- Provide individualized resources
- Safety planning over relationship repair
- Clear referral pathway

---

## Agent-Portrait Integration

The agent's effectiveness depends entirely on the quality of the portrait. The portrait provides:

**For pattern recognition:**
- Known triggers
- Typical responses
- Cycle position
- Flooding markers

**For intervention selection:**
- What works for this person
- What to avoid
- Preferred modalities
- Regulation toolkit

**For ongoing conversation:**
- Reference points to return to
- Language the user resonates with
- Values to invoke
- Growth edges to track

**For relationship context (once partner completes):**
- Combined cycle dynamics
- Complementary and conflicting patterns
- Mutual support strategies
- Repair approaches that work for both

---

# APPENDIX A: Theoretical Integration Map

| Modality | Key Concepts Used | Where in Portrait |
|----------|-------------------|-------------------|
| **EFT** | Attachment injuries, negative cycles, primary vs. secondary emotions, A.R.E. | Lens 1, Section C, Anchor Points |
| **Gottman** | Four Horsemen, repair attempts, flooding, soft start-up | Lens 3, Section C, Agent protocols |
| **IBCT** | DEEP framework, unified detachment, acceptance vs. change | Lens 4, Growth Edges, Section C |
| **ACT** | Values, defusion, willingness, committed action | Lens 4, Growth Edges, Anchor Points |
| **IFS** | Parts, Self, U-turn, managers/firefighters/exiles | Lens 2, Section E, Agent language |
| **PACT** | Arousal regulation, couple bubble, secure functioning | Lens 3, Section F, Agent protocols |
| **Polyvagal** | Window of tolerance, sympathetic/dorsal, co-regulation | Lens 3, Section E, Agent state assessment |
| **Bowen** | Differentiation of self, fusion, cutoff, I-position | Lens 4, Assessment #6, Growth Edges |
| **DBT** | Emotion regulation, distress tolerance, interpersonal effectiveness | Lens 3, Section E, Agent interventions |

---

# APPENDIX B: Assessment Sources & Validation

| Assessment | Instrument | Primary Sources |
|------------|------------|-----------------|
| Attachment | ECR-R | Fraley et al.; Wei et al. (2007); Lafontaine et al. (2016) |
| Big Five | BFI / NEO-PI-R / IPIP | Costa & McCrae; John et al. |
| Values | ACT-based custom | Hayes et al.; Wilson & DuFrene |
| Emotional Intelligence | EQ-i 2.0 / MSCEIT | Bar-On; Mayer & Salovey |
| Conflict Style | TKI | Thomas & Kilmann |
| Differentiation | DSI-R | Skowron & Friedlander |

---

# APPENDIX C: Sample Portrait Excerpt (Illustrative)

The following is an illustrative excerpt showing how integrated narrative might read. This is not generated from real assessment data.

---

## Narrative Portrait: Synthesis

You carry a deep longing for intimate connection paired with an equally deep fear that such connection will ultimately lead to abandonment or loss of self. This fundamental tension—wanting closeness while fearing its costs—runs through nearly every aspect of your relational life.

Your attachment pattern suggests you learned early that love was both precious and precarious. Perhaps there were moments of wonderful attunement followed by unpredictable distance. Perhaps you learned that expressing need directly led to disappointment, while suffering in silence preserved at least the illusion of connection. Whatever the specific history, your nervous system absorbed a core lesson: closeness is dangerous, but aloneness is unbearable.

Your protective strategy developed in response to this impossible bind. You became skilled at reading emotional atmospheres—your high empathy serves as an early warning system for relational threat. You learned to accommodate, to read what others need and provide it, to be "easy" rather than "difficult." Your conflict-avoidant style is not weakness—it's a sophisticated survival strategy that minimized exposure to rejection.

The cost of this strategy, now that you're in a relationship where you want more, is that you're rarely fully known. You edit your needs before expressing them. You swallow frustrations until they become resentments. You keep a part of yourself in reserve, protected but lonely. Your partner likely experiences a kind of mystery about you—they sense there's more, but can't quite reach it.

Your Big Five profile adds another layer: you're genuinely open to experience, curious, growth-oriented. This is the part of you that chose this assessment work, that wants to understand yourself more deeply, that believes change is possible. But your elevated neuroticism means your nervous system runs hot—you're easily activated, quick to perceive threat, and slower to return to baseline than some. This isn't a flaw; it's a sensitivity. But it means your window of tolerance is narrower than average, and you need to build regulation capacity to stay present when things get hard.

The path forward is not to eliminate your protective strategies—they've served you well. It's to expand your repertoire. To learn that expressing need directly doesn't necessarily lead to rejection. That staying present in the face of discomfort can actually deepen intimacy rather than destroy it. That you can be fully known—messy needs and all—and still be loved.

This is not easy work. It requires willingness to feel the very feelings your system has spent years avoiding: the vulnerability of direct need-expression, the fear of being "too much," the grief of what you've missed by staying protected. But your values point this direction—toward authenticity, toward deep connection, toward growth. The question is not whether you *want* this but whether you're willing to feel what it costs.

Your partner can help, but they can't do this for you. What they can do: offer consistent reassurance without you having to ask, stay present when you're activated without taking it personally, make repair attempts that acknowledge your reality, and hold the faith that the person underneath your protection is worth knowing.

What you can do: practice expressing small needs before they become big resentments, stay in conversations 10% longer than is comfortable, let yourself be seen in your fear rather than just your competence, and remember—when you feel the urge to withdraw—that this is your system trying to protect you from an old wound, not evidence that withdrawal is the right move now.

---

# APPENDIX D: Glossary of Key Terms

**A.R.E.** - Accessible, Responsive, Engaged. EFT's markers of a secure attachment bond.

**Differentiation** - The capacity to maintain a clear sense of self while remaining emotionally connected to others. Higher differentiation = more relational maturity.

**Flooding** - When physiological arousal exceeds the capacity for productive engagement. Signs include HR >100, inability to take in partner's perspective, all-or-nothing thinking.

**Four Horsemen** - Gottman's predictors of relationship dissolution: Criticism, Contempt, Defensiveness, Stonewalling.

**Negative Cycle** - The repetitive, self-reinforcing pattern of interaction that couples get stuck in. Common forms: pursue-withdraw, attack-defend, demand-distance.

**Parts** - In IFS, the sub-personalities within us that hold different feelings, beliefs, and roles. Parts are not pathology—everyone has them.

**Primary Emotion** - The initial, often vulnerable emotion (fear, longing, shame) underneath the secondary emotion we show (anger, frustration, numbness).

**Repair Attempt** - Any verbal or nonverbal effort to de-escalate conflict and reconnect. Successful repair attempts predict relationship success more than lack of conflict.

**Self** - In IFS, the core of who we are when not blended with parts. Characterized by the 8 C's: Curiosity, Calm, Compassion, Clarity, Confidence, Courage, Creativity, Connectedness.

**U-Turn** - The IFS practice of turning attention inward to notice your own parts rather than focusing on what your partner is doing wrong.

**Window of Tolerance** - The zone of optimal arousal where you can think clearly, feel emotions without being overwhelmed, and engage productively. Outside this window = activation (hyperarousal) or shutdown (hypoarousal).

---

*Document Version 1.0 | Architecture Phase: Individual Self-Knowledge*
*Next Phase: Relational Assessment & Combined Portrait Integration*
