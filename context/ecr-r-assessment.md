# ECR-R Assessment Specification
## Experiences in Close Relationships - Revised (36 questions)

**Purpose:** Measure attachment anxiety and avoidance dimensions in romantic relationships  
**Duration:** ~10 minutes  
**Response Scale:** 7-point Likert (1 = Strongly Disagree, 7 = Strongly Agree)  
**Scoring:** Two subscales calculated from item means (see scoring-algorithm.md)

---

## Response Scale (Display to User)

```
1 = Strongly Disagree
2 = Disagree
3 = Somewhat Disagree
4 = Neutral
5 = Somewhat Agree
6 = Agree
7 = Strongly Agree
```

---

## All 36 Questions

### Items 1-18: Attachment Anxiety Subscale

These items measure anxiety about abandonment, seeking reassurance, and preoccupation with relationship.

1. I'm afraid that I will lose my partner's love.
2. I often worry that my partner will not want to stay with me.
3. I worry that my partner doesn't care about me as much as I care about them.
4. I worry a fair amount about losing my partner.
5. My desire to be very close sometimes scares people away.
6. I'm afraid that once my partner gets to know me, he or she won't like who I really am.
7. I worry that my partner won't care about me as much as I care about him or her.
8. I often wish that my partner's feelings were as deep as mine.
9. I worry that I won't measure up to other people my partner knows.
10. My partner only seems to want to be close to me when I initiate it.
11. I find that my partner(s) don't want to get as close as I would like.
12. Sometimes I feel that I force my partner to show more feeling, more commitment.
13. I tell my partner that I love him or her too often or more than he or she says it to me.
14. I find myself needing reassurance from my partner that we're okay.
15. I need a lot of reassurance that I am loved and valued in my relationship.
16. I worry about being abandoned.
17. I get upset when my partner is unavailable or seems uninterested in me.
18. My jealousy or anger sometimes makes it difficult for my partner to stay close to me.

---

### Items 19-36: Attachment Avoidance Subscale

These items measure discomfort with closeness, distance-seeking, and emotional suppression.

19. I prefer not to show a partner how I feel deep down.
20. I feel comfortable opening up to my partner and talking about my fears.
21. It helps to turn to my romantic partner in times of need.
22. I prefer not to be too close to romantic partners.
23. I get uncomfortable when a romantic partner wants to be very close.
24. I prefer not to depend on a romantic partner.
25. I don't feel comfortable depending on romantic partners.
26. I'm uncomfortable when romantic partners want to be too emotionally close.
27. I want to get close to my partner, but I keep pulling back.
28. I am nervous when partners get too close, and I want them to back off.
29. I feel that it does not make a difference whether I'm with a partner or alone.
30. My partner really understands me and my needs.
31. I think it is important to maintain some emotional distance in relationships.
32. I find it difficult to allow myself to depend completely on romantic partners.
33. I am very comfortable being close to romantic partners.
34. I don't mind asking intimate partners for comfort or help.
35. It's easy for me to be affectionate with my partner.
36. My partner makes me doubt myself.

---

## Reverse-Scored Items

The following items must be reverse-scored before calculating means:

**Items to reverse:** 20, 21, 30, 33, 34, 35

**Reverse-scoring rule:** If response is X, change to (8 - X)
- Response 1 → becomes 7
- Response 2 → becomes 6
- Response 3 → becomes 5
- Response 4 → becomes 4
- Response 5 → becomes 3
- Response 6 → becomes 2
- Response 7 → becomes 1

**After reversing these 6 items, use the adjusted values for all calculations.**

---

## UI Presentation

### One Question Per Screen (Recommended for v0.1)

Show:
1. Question number (e.g., "Question 5 of 36")
2. Progress bar (5 out of 36 filled)
3. The question text (centered, readable)
4. 7 radio buttons labeled 1-7 with text labels
5. Next/Previous buttons (disabled on first/last)
6. Option to save progress (auto-save to local storage)

### Example Screen Layout

```
═════════════════════════════════════════
    Question 5 of 36
    ████░░░░░░░░░░░░░░░░░░░░░░░░░░ 14%
═════════════════════════════════════════

"I worry a fair amount about losing 
my partner."

Strongly Disagree ◯ 1
Disagree ◯ 2
Somewhat Disagree ◯ 3
Neutral ◯ 4
Somewhat Agree ◯ 5
Agree ◯ 6
Strongly Agree ◯ 7

[ Previous ] [ Next ]
═════════════════════════════════════════
```

---

## Submission & Storage

**When user completes all 36 questions:**

1. Save all 36 responses (array of integers 1-7) to local storage (AsyncStorage)
2. Send to backend API: `POST /assessment/ecr-r`
   - Payload: `{ responses: [1,5,6,4,...], timestamp: ISOString }`
   - Backend calculates scores, stores, returns attachment style

3. Redirect to ResultsScreen to display scores & interpretation

---

## Data Validation

Before submission, validate:
- All 36 questions answered (no nulls)
- All responses are integers 1-7
- No obvious patterns (all same answer) — optional warning

---

## Notes for Implementation

- **Progress tracking:** Store current question index in local state + AsyncStorage
- **Resume capability:** On app restart, offer "Resume assessment" if partially complete
- **No time limit:** User can take as long as needed
- **No penalties:** User can change answers by going back
- **Mobile-friendly:** Radio buttons should be large, easy to tap

---

## References

Original ECR-R paper:  
Fraley, R. C., Shaver, P. R., & Brennan, K. A. (2000). An item response theory analysis of the experiences in close relationships (ECR) scale. Personal Relationships, 7(1), 3-26.

Questionnaire source: http://labs.psychology.illinois.edu/~rcfraley/measures/ecr_revised.html
