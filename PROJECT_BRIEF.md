# Couples Relationship App v0.1 — Project Brief

**Status:** Planning Phase → Ready for Claude Code  
**Scope:** Minimal viable product (personal use only, you + girlfriend)  
**Timeline:** 1-2 weeks for v0.1 working prototype  
**Tech Stack:** React Native (Expo) + Node.js/Express backend + PostgreSQL  
**Budget:** ~$50/month Anthropic API + simple hosting  

---

## v0.1 Scope (ONLY This Phase)

### What We're Building (First 2 Weeks)

1. **Authentication Screen** (Simple email + password)
   - Register new user (email, password, partner name)
   - Login with email + password
   - Passwords stored securely (hashed, backend validation)
   - Session management with JWT tokens

2. **ECR-R Assessment** (36 questions)
   - Read all 36 questions from `context/ecr-r-assessment.md`
   - 7-point Likert scale (radio buttons, 1-7)
   - Progress indicator (e.g., "Question 12 of 36")
   - Save progress locally (can resume later)
   - Submit responses to backend

3. **Attachment Scores + Basic Portrait**
   - Calculate ECR-R scores (anxiety + avoidance)
   - Determine attachment quadrant (secure, anxious-preoccupied, dismissive-avoidant, fearful-avoidant)
   - Display:
     - Both scores (numerical: 1.0 - 7.0)
     - Attachment style label
     - 3-5 sentence interpretation (warm, non-clinical)
     - One actionable growth tip

### What v0.1 Does NOT Include (Saved for Later)

- ❌ Chat with Claude (comes in v0.2)
- ❌ Other assessments (Big Five, Values, EI, DSI-R, DUTCH)
- ❌ Partner linking / partner mode
- ❌ Full "Portrait Report" with all four lenses
- ❌ Advanced integrations or algorithms
- ❌ Nice UI polish (functional first, pretty later)

---

## Technical Architecture (v0.1)

### Frontend (React Native / Expo)
```
App.js (Root navigation)
├── screens/
│   ├── AuthScreen.js (Login/Register)
│   ├── AssessmentScreen.js (ECR-R, paginated)
│   ├── ResultsScreen.js (Scores + portrait text)
│   └── HomeScreen.js (Placeholder for later)
├── utils/
│   ├── api.js (Backend calls)
│   ├── scoring.js (ECR-R algorithm)
│   └── auth.js (Token management)
└── navigation/
    └── RootNavigator.js
```

### Backend (Node.js / Express)
```
server/
├── index.js (Express app)
├── routes/
│   ├── auth.js (Register, login, verify token)
│   └── assessment.js (Save/retrieve ECR-R responses)
├── controllers/
│   ├── authController.js
│   └── assessmentController.js
├── models/
│   ├── User.js
│   └── Assessment.js (ECR-R responses)
├── middleware/
│   └── auth.js (JWT verification)
└── config/
    └── db.js (PostgreSQL connection)
```

### Database (PostgreSQL)
```
TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  partner_name VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
)

TABLE ecr_r_assessments (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  responses JSONB (array of 36 integers, 1-7),
  anxiety_score FLOAT,
  avoidance_score FLOAT,
  attachment_style VARCHAR,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
)
```

---

## File Dependencies for Claude Code

**Order Claude Code should read:**
1. `PROJECT_BRIEF.md` (this file)
2. `context/ecr-r-assessment.md` (the 36 questions)
3. `context/backend-schema.md` (database + auth flow)
4. `context/scoring-algorithm.md` (ECR-R calculation)
5. `context/ui-screens.md` (screen layouts + copy)

**Do NOT show Claude Code yet:**
- `archived-specs/*` (will use in v0.2+)

---

## Success Criteria for v0.1

✅ **Functional** — App launches in Expo Go, no crashes  
✅ **Authentication** — Can register and login (you + girlfriend)  
✅ **Assessment** — All 36 questions load, can answer and submit  
✅ **Scoring** — Correct ECR-R calculation (verified by hand on sample data)  
✅ **Results** — Show scores, quadrant, and basic interpretation  
✅ **Data Persists** — Backend stores responses, can retrieve later  
✅ **No Partner Mode** — Keep it simple: just one user at a time  

---

## First Steps (What Happens Next)

1. You've read this brief ✓
2. Claude Code will create the Expo project structure
3. Claude Code will implement auth + ECR-R screens
4. You test in Expo Go on your phone
5. We iterate and fix bugs together
6. Once v0.1 works → we plan v0.2 (chat + portrait depth)

---

## Key Constraints

| Constraint | Why | Implication |
|-----------|-----|------------|
| **Minimal scope** | Reduce mistakes, get working faster | Skip everything not essential |
| **Personal use only** | Simplifies auth (no complex security yet) | Can use local storage for some data |
| **Expo Go for testing** | No need to build IPA/APK yet | Just scan QR code from terminal |
| **Single-user login first** | Partner mode comes later | Don't build partner linking yet |
| **Backend from day 1** | Real API practice, easier to scale | Use simple Node.js + Express |

---

## Questions for Claude Code (Before Starting)

Claude Code will ask:
- ✅ Node.js environment ready? (yes)
- ✅ PostgreSQL database available? (or use mock for now?)
- ✅ Anthropic API key? (not needed for v0.1, only in v0.2)
- ✅ Preferred styling library? (React Native defaults + minimal styling)

---

## Contact / Support

If Claude Code gets stuck or confused:
1. Check the `context/` folder for reference specs
2. Ask clarifying questions before building
3. Build one screen at a time, test after each
4. If context gets huge, start a fresh session
5. All decisions log to `docs/BUILD_LOG.md`

**Ready to start?** Show Claude Code this brief + the `context/` folder. It will take it from there.
