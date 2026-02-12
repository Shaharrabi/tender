# Couples App v0.1 — Quick Reference Card

**Print this or keep it open while building**

---

## 🎯 Project in One Sentence
Personal React Native (Expo) app to understand attachment styles using the ECR-R assessment.

---

## 📦 What You Have

### Core Specification Files (In `context/` folder)
1. **ecr-r-assessment.md** — 36 questions, 7-point scale, reverse-scoring marked
2. **backend-schema.md** — Database tables, API endpoints, Supabase setup
3. **scoring-algorithm.md** — Scoring logic, JS code, Node.js code, test cases
4. **ui-screens.md** — 6 screen designs, layouts, behaviors, design tokens

### Meta Files (Root folder)
- **README.md** — Quick start guide
- **PROJECT_BRIEF.md** — Scope, constraints, timeline
- **CLAUDE_CODE_PROMPT.md** — How to use Claude Code

### Archive Files (In `archived-specs/` folder)
11 files for v0.2+ (don't use yet, but they're ready)

---

## ⚡ Reverse-Scoring (CRITICAL)

**Items to reverse before calculating:** 20, 21, 30, 33, 34, 35 (1-indexed)

**Formula:** `reversed = 8 - original`

Example: If item 20 = 6, reverse to 8 - 6 = 2

---

## 📊 Scoring Formula

**After reverse-scoring:**

```
Anxiety = average of items 1-18
Avoidance = average of items 19-36
```

Both are on 1.0 - 7.0 scale.

---

## 🎨 Attachment Styles (Quadrants)

```
          Anxiety
            ↑
            |
Low Avoid   |   High Avoid
            |
    Secure  |  Fearful-Avoidant
            |
────────────┼───────────────→ Avoidance
            |
 Anxious-   |  Dismissive-
 Preoccupied|  Avoidant
            |
```

**Boundary:** Midpoint = 4.0

- **Anxiety < 4.0, Avoidance < 4.0** → Secure
- **Anxiety ≥ 4.0, Avoidance < 4.0** → Anxious-Preoccupied
- **Anxiety < 4.0, Avoidance ≥ 4.0** → Dismissive-Avoidant
- **Anxiety ≥ 4.0, Avoidance ≥ 4.0** → Fearful-Avoidant

---

## 🏗️ Folder Structure

```
couples-app-v0.1/
├── context/                 ← Read these 4 files for v0.1
│   ├── ecr-r-assessment.md
│   ├── backend-schema.md
│   ├── scoring-algorithm.md
│   └── ui-screens.md
│
├── archived-specs/          ← Ignore for v0.1
│   └── (11 files for v0.2+)
│
├── README.md
├── PROJECT_BRIEF.md
└── CLAUDE_CODE_PROMPT.md
```

---

## 🖥️ 6 Screens to Build

1. **SplashScreen** (optional) — Loading, 2 seconds
2. **LoginScreen** — Email, password, link to register
3. **RegisterScreen** — Email, password, confirm password
4. **HomeScreen** — Start assessment button, logout
5. **AssessmentScreen** — 36 questions, one per screen
6. **ResultsScreen** — Scores, attachment style, interpretation

---

## 📱 Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend | React Native (Expo) |
| State | useState + Context API |
| Styling | React Native StyleSheet |
| Backend | Supabase (PostgreSQL) |
| Auth | Email/password + JWT |
| API | REST endpoints |

---

## ✅ Success Criteria (v0.1)

Must be able to:
- Register & login
- Answer all 36 questions
- See scores + attachment style
- See interpretation + growth tip
- Log out & log back in
- No crashes

---

## 🔑 Database Schema

```sql
users (
  id, email, password_hash, created_at
)

ecr_r_assessments (
  id, user_id, responses [JSON array of 36 ints],
  anxiety_score, avoidance_score, attachment_style,
  completed_at
)
```

---

## 🌐 Key API Endpoints

```
POST   /auth/register        (email, password)
POST   /auth/login          (email, password)
POST   /auth/verify         (check token)

POST   /assessment/ecr-r    (submit 36 answers)
GET    /assessment/ecr-r/:id (get results)
GET    /assessment/ecr-r/user (get all assessments)
```

---

## 🔒 Important Security Notes

- Passwords hashed with bcrypt before storage
- JWT tokens auto-refresh via Supabase
- CORS enabled for frontend domain
- RLS (Row-Level Security) on database
- Never expose error details

---

## ⚠️ Common Mistakes

1. ❌ Not reverse-scoring items 20, 21, 30, 33, 34, 35
2. ❌ Using 1-indexed when code is 0-indexed (array[19] = item 20)
3. ❌ Calculating anxiety from wrong items (should be 1-18 only)
4. ❌ Calculating avoidance from wrong items (should be 19-36 only)
5. ❌ Forgetting to await Supabase calls
6. ❌ Using same formula in frontend and backend but getting different results

**Prevention:** Test with identical data on both sides.

---

## 🧪 Test Cases for Scoring

**Test 1:** All responses = 4
- Expected: Anxiety 4.0, Avoidance 4.0, Style: Fearful-Avoidant

**Test 2:** Items 1-18 all 2, items 19-36 all 6
- Expected: Anxiety 2.0, Avoidance 6.0, Style: Dismissive-Avoidant

**Test 3:** Items 1-18 all 6, items 19-36 all 2
- Expected: Anxiety 6.0, Avoidance 2.0, Style: Anxious-Preoccupied

**Test 4:** Items 1-18 all 2, items 19-36 all 2
- Expected: Anxiety 2.0, Avoidance 2.0, Style: Secure

---

## 📅 Timeline Estimate

| Task | Time | Who |
|------|------|-----|
| Supabase setup | 30 min | You |
| Expo scaffolding | 30 min | Claude Code |
| Auth screens | 2-3 hrs | Claude Code |
| Assessment screen | 2-3 hrs | Claude Code |
| Scoring + Results | 2-3 hrs | Claude Code |
| Testing + fixes | 1-2 hrs | You + Claude Code |
| **Total** | **~10-15 hours** | **1-2 weeks** |

---

## 📚 Read These First (In Order)

1. This card (you're reading it)
2. PROJECT_BRIEF.md (5 min)
3. context/ecr-r-assessment.md (10 min, skim the 36 questions)
4. context/scoring-algorithm.md (10 min)

Then dive into:
5. context/ui-screens.md (when building screens)
6. context/backend-schema.md (when building API)

---

## 🚀 Get Started in 5 Steps

1. **Set up Supabase**
   - Go to supabase.com
   - Create project
   - Get URL + anon key

2. **Create Expo project**
   ```bash
   npx create-expo-app couples-app --template blank
   cd couples-app
   npm install @supabase/supabase-js @react-navigation/native ...
   ```

3. **Create folder structure**
   - src/screens/
   - src/utils/
   - src/services/
   - src/context/
   - src/components/
   - src/constants/

4. **Test it works**
   ```bash
   npx expo start
   # Scan QR with Expo Go on your phone
   ```

5. **Give specs to Claude Code**
   - "Here's my project"
   - "Read PROJECT_BRIEF.md"
   - "Read all files in context/"
   - "Ready to start building v0.1"

---

## 🎯 What's IN v0.1 ✅

- Authentication
- ECR-R assessment (36 questions)
- Scoring (anxiety + avoidance)
- Attachment style (4 quadrants)
- Basic results display
- Simple interpretation

## 🚫 What's NOT in v0.1

- Chat with Claude
- Other assessments
- Partner mode
- Advanced UI polish
- Offline mode

*All saved for v0.2+ (specs in `archived-specs/`)*

---

## 💡 Design Philosophy

- **Non-judgmental:** No "good" or "bad" styles
- **Warm tone:** Clinical but accessible
- **Affirming:** Growth-focused, not critical
- **Safe UI:** Clear, predictable, no surprises
- **Empowering:** Information that helps

---

## 🆘 If Something Goes Wrong

**Error in registration?**
→ Check backend validation in backend-schema.md

**Scores don't match?**
→ Verify reverse-scoring (items 20, 21, 30, 33, 34, 35)

**API call fails?**
→ Check CORS, JWT token, endpoint URL

**UI looks wrong?**
→ Read ui-screens.md design tokens

**Confused about scope?**
→ Read PROJECT_BRIEF.md "What v0.1 Does NOT Include"

---

## 📞 Quick Help

**"Should we add [feature]?"**
→ Check PROJECT_BRIEF.md. If it's not in v0.1, it's for v0.2.

**"How do we calculate [score]?"**
→ Read context/scoring-algorithm.md

**"What should this screen look like?"**
→ Read context/ui-screens.md

**"How do we store [data]?"**
→ Read context/backend-schema.md

---

## ✨ Success Looks Like

After 1-2 weeks, you can:
1. Register with email + password
2. Answer all 36 ECR-R questions
3. See your attachment scores
4. See your attachment style
5. Read a warm interpretation
6. Get one growth tip
7. Log out and log back in
8. See your data persists

**No crashes. No errors. Just working app.**

---

## 🏁 Ready? Checklist

- [ ] Read PROJECT_BRIEF.md
- [ ] Understand the 36 ECR-R questions (basic idea)
- [ ] Know reverse-scoring items (20, 21, 30, 33, 34, 35)
- [ ] Know attachment style quadrants
- [ ] Have Node.js installed
- [ ] Have Expo CLI installed
- [ ] Have Expo Go app on your phone
- [ ] Have Supabase account
- [ ] Have a terminal ready

**If all checked:** You're ready to build! 🚀

---

## Version Info

- **v0.1:** Auth + ECR-R + Scoring + Results (THIS)
- **v0.2:** Add chat with Claude
- **v0.3:** Add more assessments
- **v0.4:** Add partner mode
- **v0.5+:** Deep integration features

*Complete specs for v0.2+ are in `archived-specs/`*

---

**Good luck! You've got this! 💪**

Last Updated: February 7, 2026
