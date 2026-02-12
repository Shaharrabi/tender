# Prompt Template for Claude Code
## Copy-paste this exactly when ready

---

## Step 1: Preparation

Before you give Claude Code this prompt:

1. Open your terminal
2. Navigate to the project folder:
   ```bash
   cd couples-app-v0.1
   ```
3. Make sure Claude Code is running in another terminal

---

## Step 2: Give Claude Code This Exact Prompt

**Copy and paste everything below into Claude Code:**

```
I'm building a React Native app (Expo)
I have comprehensive specifications in this folder:

- PROJECT_BRIEF.md (read first)
- context/ecr-r-assessment.md
- context/backend-schema.md
- context/scoring-algorithm.md
- context/ui-screens.md

You are my technical partner and product engineer for v0.1.
Your job is NOT to immediately build everything.
Your job is to:

1. Ask clarifying questions if anything is ambiguous
2. Build one feature at a time (small increments)
3. Test after each feature before moving to the next
4. Wait for my confirmation before continuing
5. Keep code simple and maintainable

PHASE 1: Planning (Complete these first)

Read all 5 context files.
Then ask me:
- "Should we use Supabase (easiest), local PostgreSQL, or mock backend?"
- "For the frontend, should I use Redux, Context API, or local state for now?"
- "Any preferences on styling? (React Native styles, NativeWind, etc.)"
- "Should I scaffold the entire project structure first, or build feature by feature?"

Don't start coding until you've asked these and I've answered.

PHASE 2: Project Structure (if we decide to scaffold)

Based on my answers:
- Create Expo project: npx create-expo-app couples-app
- Install only necessary dependencies (no bloat)
- Create folder structure (see PROJECT_BRIEF.md "Technical Architecture")
- Create App.js with basic navigation skeleton
- Show me the structure, wait for approval

PHASE 3: Backend Setup (only if we decide backend-first)

- Initialize Node.js project in backend/ folder
- Create .env file (ask me for values if needed)
- Create database connection (based on our DB choice)
- Create auth routes: /auth/register, /auth/login, /auth/verify
- Show me it running, wait for approval

PHASE 4: One Screen at a Time

Build ONLY one screen at a time:
- First: LoginScreen
- Test it
- Wait for approval
- Then: RegisterScreen
- And so on...

For each screen:
- Show me the component code
- Explain what it does
- Ask "Should I continue to the next screen?"

CONSTRAINTS (v0.1):

- ONLY these files exist in this v0.1 scope:
  context/ecr-r-assessment.md
  context/backend-schema.md
  context/scoring-algorithm.md
  context/ui-screens.md

- IGNORE archived-specs/ (for v0.2+)

- No chat features yet
- No partner mode yet
- No other assessments yet
- Functional first, pretty later

APPROACH:

- Ask before you assume
- Small steps
- Test frequently
- Don't build multiple features at once
- If context gets messy, suggest starting fresh

Sound good? Start with Phase 1: read the files and ask your clarifying questions.
```

---

## Step 3: What Claude Code Will Do

Claude Code should:

1. **Read the context files** and understand the scope
2. **Ask 3-5 clarifying questions** (tech choices)
3. **Wait for your answers** before building anything
4. **Start with Phase 2** only after you approve
5. **Build incrementally**, testing after each piece

If Claude Code starts building without asking questions first → Remind it to follow the "Ask before you assume" approach.

---

## Step 4: Your Responses to Likely Questions

**Q: Should we use Supabase or PostgreSQL locally?**  
A: "Use Supabase for now. It's free and easiest. We can always migrate later."

**Q: Redux or Context API for state?**  
A: "Let's use React's built-in AsyncStorage + useState for now. No Redux yet."

**Q: Styling library?**  
A: "Keep it simple. Just React Native built-in styles. Pretty UI comes later."

**Q: Build backend first or frontend?**  
A: "Build both together, one screen at a time. Start with scaffolding, then auth screens with real backend."

---

## Step 5: As Claude Code Builds

**After each completed feature:**

Claude Code will say something like:
```
LoginScreen is ready. You can register and login.

Before I move to RegisterScreen, should I:
1. Test this on your phone first?
2. Proceed to RegisterScreen?
3. Change something about LoginScreen?
```

Your response:
```
Great! Let me test it on my phone first. [scan QR code]
...5 minutes later...
Looks good. Go ahead with RegisterScreen.
```

---

## Step 6: If Claude Code Gets Stuck

If Claude Code seems confused or goes off track:

```
Claude Code, I see you're [describe what it's doing].
Let's pause. Based on context/[filename].md, 
the correct approach is [clarify].

Can you clarify before continuing?
```

Or:

```
The instructions say "one screen at a time."
Can we stop here, test this feature on my phone,
and then plan the next step?
```

---

## Step 7: When Something Breaks

If Claude Code creates code with errors:

```
When I try to run this, I get: [paste error]

Looking at context/[filename].md, it should [explain expected behavior].

Can you fix it?
```

Claude Code should:
1. Acknowledge the error
2. Show you the fix
3. Explain what went wrong
4. Ask if you want to test or move forward

---

## Red Flags (Stop and Clarify)

If Claude Code:

- ❌ Starts building multiple features without asking
- ❌ Ignores context files and makes assumptions
- ❌ Creates giant monolithic components
- ❌ Doesn't test after building
- ❌ Suggests using archived-specs/ files
- ❌ Tries to add features not in v0.1 scope

**Response:** "Let's pause. Check [context file] again. We're only building [specific feature] right now."

---

## Expected Timeline

If Claude Code works efficiently:

- **2-4 hours:** Project setup + backend
- **3-5 hours:** Auth screens
- **2-3 hours:** Assessment screens (36 questions)
- **2-3 hours:** Scoring + results
- **1-2 hours:** Testing + bug fixes

**Total:** ~10-17 hours over 1-2 weeks (part-time)

---

## Final Check

Before you give Claude Code this prompt, make sure:

- [ ] You've read PROJECT_BRIEF.md
- [ ] Claude Code is running in your terminal
- [ ] You're in the `couples-app-v0.1` folder
- [ ] You have a Supabase account (or know your PostgreSQL setup)
- [ ] You have ~2 weeks to iterate

**Ready?** Give Claude Code the prompt above and report back! 🚀

