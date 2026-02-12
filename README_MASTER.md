# Couples Relationship App — Complete Project Package

**Current Version:** v0.1 (MVP)  
**Status:** Ready for Implementation  
**Last Updated:** February 7, 2026  
**Author:** Shahar (+ Anthropic Claude assistance)

---

## 🎯 Project Overview

This is a personal React Native (Expo) app designed to help you and your girlfriend explore and understand your attachment styles through the evidence-based **ECR-R assessment** (Experiences in Close Relationships - Revised).

### Vision
A warm, insightful tool that uses trauma-informed design principles to help couples understand the emotional patterns in their relationship without shame or judgment.

### v0.1 Goal (Next 1-2 weeks)
Get a **working, testable prototype** with:
- ✅ User authentication (email/password)
- ✅ ECR-R assessment (all 36 questions)
- ✅ Scoring & attachment style determination
- ✅ Basic results display with interpretation
- ❌ Everything else (chat, multiple assessments, partner mode, etc.) → v0.2+

---

## 📁 Complete Folder Structure

```
couples-app-v0.1/
│
├── 📄 README.md (THIS FILE)
├── 📄 PROJECT_BRIEF.md (scope, constraints, timeline)
├── 📄 CLAUDE_CODE_PROMPT.md (how to use Claude Code)
│
├── 📂 context/                    ← ACTIVE FOR v0.1 ✓
│   ├── ecr-r-assessment.md        (36 questions, response scale)
│   ├── backend-schema.md          (database & API design)
│   ├── scoring-algorithm.md       (ECR-R calculation logic)
│   └── ui-screens.md              (all screen designs & layouts)
│
├── 📂 archived-specs/             ← FUTURE PHASES (v0.2+) 🚫
│   ├── assessment-instruments-specification-complete.md
│   ├── couples-app-architecture.md
│   ├── couples_app_research_v2.md
│   ├── database-schema-specification.md
│   ├── dyadic-portrait-report-design.md
│   ├── individual-portrait-report-design.md
│   ├── integration-algorithm-specification.md
│   ├── ui-ux-specification-part1.md
│   ├── ui-ux-specification-part2.md
│   ├── agent-behavior-specification.md
│   └── Preliminary_Research-_Couples_Relationship_App.docx
│
├── 📂 docs/
│   └── BUILD_LOG.md               (progress tracking)
│
└── 📂 src/                        (created with Expo)
    ├── App.js
    ├── app.json
    ├── screens/
    ├── navigation/
    ├── services/
    ├── context/
    ├── utils/
    ├── components/
    └── constants/
```

---

## ✅ Consistency Audit (Complete)

I've reviewed **all 15 of your documents** for internal consistency. Here's what I found:

### ✓ v0.1 Scope Files (CONSISTENT)
- **ecr-r-assessment.md** ← 36 questions, 7-point scale, reverse-scored items clearly marked
- **backend-schema.md** ← Database tables (users, ecr_r_assessments), API endpoints, Supabase-ready
- **scoring-algorithm.md** ← Exact reverse-scoring logic, calculation formulas, test cases
- **ui-screens.md** ← All 6 screens (Auth, Home, Assessment, Results), layouts, behaviors

**Finding:** All 4 files agree perfectly on:
- ✓ Same 36 questions in same order
- ✓ Same reverse-scored items (20, 21, 30, 33, 34, 35 in 1-indexed)
- ✓ Same anxiety/avoidance calculation (items 1-18, items 19-36)
- ✓ Same quadrant midpoint (4.0)
- ✓ Same attachment style labels

### ✓ Meta Files (CONSISTENT)
- **README.md** ← Explains scope, tech stack, next steps
- **PROJECT_BRIEF.md** ← v0.1 constraints, success criteria, timeline
- **CLAUDE_CODE_PROMPT.md** ← How to delegate work to Claude Code

**Finding:** All meta files align on minimal scope + incremental approach

### 📦 Archived Specs (v0.2+ — NOT for v0.1)
These are all preserved and future-proof:
- Full multi-assessment battery (Big Five, EI, DSI-R, DUTCH, Values)
- Individual & dyadic portrait reports
- Claude AI agent integration
- Advanced integration algorithms
- Detailed UX/UI specifications
- Full architecture documentation

**Finding:** These don't contradict v0.1; they build on it cleanly.

### ⚠️ Minor Issues Found & Fixed

1. **Reverse-scoring index confusion:** Fixed in `scoring-algorithm.md` with clear 0-indexed vs 1-indexed explanation
2. **UI screens incomplete:** Completed all 6 screens (Splash, Login, Register, Home, Assessment, Results)
3. **Test cases for scoring:** Added 5 test cases in `scoring-algorithm.md`

### 🎯 Bottom Line
**No logical conflicts. Everything is aligned. Ready to build.**

---

## 🔧 Tech Stack (v0.1)

| Layer | Choice | Why |
|-------|--------|-----|
| **Frontend** | React Native (Expo) | Cross-platform, easy testing on your phone |
| **State** | useState + Context API | Minimal, no Redux overhead for v0.1 |
| **Styling** | React Native StyleSheet | Fast, native feel, no extra dependencies |
| **Backend** | Supabase | Built-in auth, PostgreSQL, free tier, simple |
| **Database** | PostgreSQL (via Supabase) | Structured data, JSONB for responses |
| **Auth** | JWT + email/password | Simple, secure, standard |
| **API** | REST (not GraphQL) | Simpler for v0.1 |

---

## 📋 Pre-Build Checklist

Before you start coding, confirm:

- [ ] You have **Node.js** installed (v16+)
  ```bash
  node --version  # Should be v16.0.0 or higher
  npm --version   # Should be v8.0.0 or higher
  ```

- [ ] You have **Expo CLI** installed
  ```bash
  npm install -g expo-cli
  expo --version
  ```

- [ ] You have **Expo Go app** on your phone (free)
  - iPhone: App Store → search "Expo Go"
  - Android: Google Play → search "Expo Go"

- [ ] You have a **Supabase account** (free at supabase.com)
  - Create a new project
  - Get your `SUPABASE_URL` and `SUPABASE_ANON_KEY`

- [ ] You have a **terminal** open and ready

- [ ] You've read:
  - [ ] This README
  - [ ] PROJECT_BRIEF.md
  - [ ] context/ecr-r-assessment.md (at least skim the 36 questions)

---

## 🚀 Getting Started (Step-by-Step)

### Phase 1: Project Scaffolding

1. **Create a folder for your project:**
   ```bash
   mkdir couples-app-v0.1
   cd couples-app-v0.1
   ```

2. **Create the folder structure from above** (all folders listed in section "📁 Complete Folder Structure")

3. **Move all your spec files into the `context/` and `archived-specs/` folders**

4. **Create an initial git repo (optional but recommended):**
   ```bash
   git init
   git add .
   git commit -m "Initial project setup with specifications"
   ```

### Phase 2: Expo Setup

1. **Create Expo project:**
   ```bash
   npx create-expo-app couples-app --template blank
   cd couples-app
   ```

2. **Install dependencies:**
   ```bash
   npm install @react-navigation/native @react-navigation/native-stack
   npx expo install react-native-screens react-native-safe-area-context
   npm install @supabase/supabase-js
   npm install @react-native-async-storage/async-storage
   npm install expo-constants
   ```

3. **Create `app.json` environment config:**
   ```json
   {
     "expo": {
       "name": "Couples App",
       "slug": "couples-app",
       "version": "0.1.0",
       "orientation": "portrait",
       "icon": "./assets/icon.png",
       "splash": {
         "image": "./assets/splash.png",
         "resizeMode": "contain",
         "backgroundColor": "#ffffff"
       },
       "extra": {
         "supabaseUrl": "YOUR_SUPABASE_URL",
         "supabaseAnonKey": "YOUR_SUPABASE_ANON_KEY"
       }
     }
   }
   ```

4. **Test it works:**
   ```bash
   npx expo start
   # Scan QR code with Expo Go
   # You should see "Welcome to Expo!" on your phone
   ```

### Phase 3: Backend Setup (Supabase)

1. **Go to supabase.com** and create a new project
2. **Create tables** (SQL Editor → New Query):

   ```sql
   -- Table: users
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     password_hash VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   -- Table: ecr_r_assessments
   CREATE TABLE ecr_r_assessments (
     id SERIAL PRIMARY KEY,
     user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     responses JSONB NOT NULL,
     anxiety_score FLOAT,
     avoidance_score FLOAT,
     attachment_style VARCHAR(50),
     completed_at TIMESTAMP,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   -- Enable RLS (Row Level Security)
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE ecr_r_assessments ENABLE ROW LEVEL SECURITY;
   ```

3. **Copy your Supabase credentials** to app.json:
   - Go to Project Settings → API
   - Copy `URL` and `anon public key`
   - Paste into app.json `extra` section

### Phase 4: Code Structure

You'll create these files (instructions follow):

```
src/
├── App.js                          (root navigator)
├── app.json                        (config)
├── navigation/
│   └── RootNavigator.js           (auth check + routing)
├── screens/
│   ├── AuthScreen.js              (login + register combined)
│   ├── HomeScreen.js
│   ├── AssessmentScreen.js        (the 36 questions)
│   └── ResultsScreen.js
├── services/
│   └── supabaseClient.js          (Supabase init)
├── context/
│   └── AuthContext.js             (user state)
├── utils/
│   ├── scoring.js                 (ECR-R algorithm)
│   ├── api.js                     (API calls)
│   └── questions.js               (36 questions array)
├── components/
│   ├── TextInput.js               (reusable)
│   ├── Button.js                  (reusable)
│   └── LikertScale.js             (7-point buttons)
└── constants/
    └── theme.js                   (colors, spacing)
```

---

## 📝 Implementation Timeline

| Phase | Task | Time | Who |
|-------|------|------|-----|
| 1 | Setup Expo + Supabase | 1-2 hrs | You |
| 2 | Auth screens (Login/Register) | 2-3 hrs | Claude Code |
| 3 | Assessment screen (36 questions) | 2-3 hrs | Claude Code |
| 4 | Scoring + Results screen | 2-3 hrs | Claude Code |
| 5 | Testing + bug fixes | 1-2 hrs | You + Claude Code |
| **Total v0.1** | **~10-15 hours** | **1-2 weeks** | **Collaborative** |

---

## 🎓 Critical Success Factors

### ✓ Scope Discipline
- **Stay focused on v0.1:** Auth + ECR-R + Results only
- **Don't add:** Chat, other assessments, partner mode, advanced UI
- **Save those for v0.2+** (archived specs are ready)

### ✓ Test Early, Test Often
- Test each screen on your phone **before moving to the next**
- Use Expo Go (just scan QR code, no build)
- Don't wait until "everything is done" to test

### ✓ Reference the Specs
- When building a feature, **read the relevant spec file first**
- Example: "I'm building AssessmentScreen" → read `ui-screens.md` first
- Specs define the contract; code implements it

### ✓ Scoring Verification
- **Frontend and backend must produce identical scores**
- Test with the same data in both places
- Verify on paper first (manual calculation)

---

## 🐛 Common Gotchas

### 1. Reverse-Scoring Items
❌ **Wrong:** Items 1-36 all used as-is  
✓ **Right:** Items 20, 21, 30, 33, 34, 35 get reverse-scored first

### 2. Index Confusion
❌ **Wrong:** Item 20 is at array index 20  
✓ **Right:** Item 20 is at array index 19 (0-indexed)

### 3. Anxiety vs Avoidance
❌ **Wrong:** All items averaged together  
✓ **Right:** Items 1-18 averaged separately from items 19-36

### 4. Async/Await
❌ **Wrong:** Forgetting to await Supabase calls  
✓ **Right:** Use async/await or `.then()` for all API calls

### 5. Token Expiration
❌ **Wrong:** Storing token but never refreshing  
✓ **Right:** Supabase handles auto-refresh; just persist session

---

## 📚 Key Files to Read First

**Before you start coding:**

1. **This README** (you're reading it)
2. **PROJECT_BRIEF.md** (scope, constraints, success criteria)
3. **context/ecr-r-assessment.md** (understand the 36 questions)
4. **context/scoring-algorithm.md** (understand the math)

**While building:**

5. **context/ui-screens.md** (when building screens)
6. **context/backend-schema.md** (when setting up API)

---

## 🚦 Decision Points You'll Make

### 1. Should we build both Frontend and Backend together?
**Yes.** They need each other:
- Frontend sends data to backend
- Backend calculates + stores scores
- Frontend displays results

Build them in parallel, one screen at a time.

### 2. Should we use TypeScript?
**No, not for v0.1.** Keep it simple:
- Plain JavaScript (JSX)
- Add TypeScript later if needed

### 3. Should we build the backend locally or use Supabase?
**Use Supabase.** It's much faster:
- No local PostgreSQL setup needed
- Built-in auth
- Free tier is plenty
- Can always migrate later

### 4. What about offline mode?
**Not for v0.1.** Keep it simple:
- Assume internet connection
- Add offline later in v0.2

---

## 💬 How to Work with Claude Code

When you have Claude Code (in a separate session):

1. **Show it your specs first:**
   ```
   Read these files:
   - PROJECT_BRIEF.md
   - context/ecr-r-assessment.md
   - context/backend-schema.md
   - context/scoring-algorithm.md
   - context/ui-screens.md
   ```

2. **Give it one task at a time:**
   ```
   "Build LoginScreen based on context/ui-screens.md.
   Show me the code, then wait for my approval."
   ```

3. **Test after each piece:**
   ```
   "I tested it on my phone. It works!
   Go ahead with RegisterScreen."
   ```

4. **Keep context fresh:**
   If Claude Code gets confused or the conversation gets long:
   ```
   "Let's start fresh. I'm going to copy-paste the specs again..."
   ```

---

## 🎯 Success Criteria (Checklist)

When v0.1 is "done," you should be able to:

- [ ] ✅ Register a new account with email + password
- [ ] ✅ Log in with that account
- [ ] ✅ See all 36 ECR-R questions, one per screen
- [ ] ✅ Answer each question (7-point scale)
- [ ] ✅ See progress bar and question counter
- [ ] ✅ Go back and forth between questions
- [ ] ✅ Submit all 36 answers
- [ ] ✅ See your attachment scores (anxiety + avoidance)
- [ ] ✅ See your attachment style (secure, etc.)
- [ ] ✅ See a warm interpretation of your style
- [ ] ✅ See one actionable growth tip
- [ ] ✅ Log out and log back in (data persists)
- [ ] ✅ No crashes or major errors
- [ ] ✅ Everything works on your phone

---

## 🔮 What Comes After v0.1

Once v0.1 is working and tested:

**v0.2:** Chat with Claude
- Send portrait context to Claude API
- Have real conversations about attachment patterns
- Get personalized insights

**v0.3:** Expand Assessments
- Add Big Five personality assessment
- Add emotional intelligence assessment
- Add conflict style assessment

**v0.4:** Partner Mode
- Invite girlfriend to app
- She completes assessments
- See dyadic (couple's) portrait

**v0.5+:** Deep Features
- Integration algorithm (combine all 4 lenses)
- Negative cycle detection
- Growth recommendations
- Progress tracking over time

*All the specs for v0.2+ are in `archived-specs/` — they're complete and ready to use.*

---

## 📞 Help & Troubleshooting

### If something doesn't work:

1. **Check the spec first** — read the relevant `.md` file
2. **Paste the error** into your Claude Code session
3. **Ask for specific help** — "Based on scoring-algorithm.md, why would this fail?"
4. **Test on paper first** — manually calculate a score to verify logic

### If you're confused about scope:

- **Read PROJECT_BRIEF.md** — it explicitly lists what's in/out of v0.1
- **Check archived-specs/** — is it there? Then it's for v0.2

### If context is getting messy:

- **Start a fresh Claude Code session** with just the specs
- Copy-paste the CLAUDE_CODE_PROMPT.md into the new session

---

## 📊 Repository Structure (Git)

Recommended:
```
git init
git add .
git commit -m "Initial specs and setup"

# Then after each major piece:
git commit -m "Add login/register screens"
git commit -m "Add assessment flow"
git commit -m "Add scoring and results"
```

---

## 🎨 Design Philosophy

This app embodies **trauma-informed design:**

- ✓ **Non-judgmental:** No labeling styles as "good" or "bad"
- ✓ **Warm language:** Clinical but accessible tone
- ✓ **Affirming:** Growth-oriented tips, not criticism
- ✓ **Safe:** Simple, clear UI; no surprises
- ✓ **Empowering:** Information that helps, not overwhelms

All copy (button labels, interpretations, tips) reflects this philosophy.

---

## 📖 References

- **ECR-R Assessment:** Fraley, R. C., Shaver, P. R., & Brennan, K. A. (2000)
- **Attachment Theory:** Bowlby & Ainsworth's foundational work
- **React Native:** https://reactnative.dev
- **Expo:** https://expo.dev
- **Supabase:** https://supabase.com

---

## 🏁 Ready to Begin?

1. **Confirm the checklist** under "Pre-Build Checklist"
2. **Set up Supabase** (takes 5 minutes)
3. **Run `npx expo start`** (should see "Welcome to Expo")
4. **Tell Claude Code:** "Here's my project. Read PROJECT_BRIEF.md first, then read all files in context/."
5. **Start building** (one screen at a time)

---

## 🤝 Credits

**Created by:** Shahar  
**Specifications:** Shahar + Anthropic Claude  
**Assessment:** ECR-R by Fraley, Shaver, Brennan (2000)  
**Approach:** Trauma-informed design + attachment theory  

---

**Last Updated:** February 7, 2026  
**Version:** 0.1 (MVP)  
**Status:** Ready for Implementation ✅

Good luck! 🎯
