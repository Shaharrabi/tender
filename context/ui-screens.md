# UI/UX Screens Specification (v0.1)

**Platform:** React Native (Expo)  
**Styling:** React Native built-in StyleSheet  
**Target:** Personal use, mobile-first (phone testing)  
**Philosophy:** Functional first, beautiful later. Clear, readable, touch-friendly.

---

## Screen Hierarchy & Navigation Flow

```
Splash/Loading
  ↓
┌──────────────────────────────┐
│    NOT AUTHENTICATED         │
├──────────────────────────────┤
│  LoginScreen                 │
│  RegisterScreen              │
│  ↓ (on success)              │
└──────────────────────────────┘
  ↓
┌──────────────────────────────┐
│    AUTHENTICATED             │
├──────────────────────────────┤
│  HomeScreen                  │
│  ├─→ AssessmentScreen        │
│  │   ├─→ ResultsScreen       │
│  │   └─→ (back to Home)      │
│  └─→ Logout (back to Login)  │
└──────────────────────────────┘
```

---

## 1. SplashScreen (Optional, ~2 seconds)

**Purpose:** Show loading state while app initializes

**Elements:**
- App logo or title: "Attachment Profile"
- Loading spinner
- Optional tagline: "Understanding your relationship patterns"

**Behavior:**
- Check if user is authenticated (token in AsyncStorage)
- If yes: navigate to HomeScreen
- If no: navigate to LoginScreen
- Auto-hide after 2 seconds or when auth check completes

---

## 2. LoginScreen

**Purpose:** Authenticate existing user

**Elements:**
1. **Header section:**
   - Title: "Welcome back"
   - Subtitle: "Sign in to your account"

2. **Email input field:**
   - Placeholder: "you@example.com"
   - Keyboard: email-address
   - Validation: basic email format check

3. **Password input field:**
   - Placeholder: "Password"
   - secureTextEntry: true
   - Show/hide password icon (optional)

4. **"Login" button:**
   - Primary color (indigo)
   - Full width, padded
   - Shows spinner while loading

5. **Error message display:**
   - Red text, visible only if login fails
   - Possible messages:
     - "Invalid email or password"
     - "Please enter valid email"
     - "Password required"
     - "Network error - please try again"

6. **Link to RegisterScreen:**
   - "Don't have an account? Register"
   - Secondary text color, underlined

**Layout Example:**
```
┌─────────────────────────────────────┐
│                                     │
│      Welcome back                   │
│      Sign in to your account        │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ you@example.com             │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ ••••••••••••••              │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │       Login      [🔄]       │   │
│   └─────────────────────────────┘   │
│                                     │
│   Don't have an account? Register   │
│                                     │
└─────────────────────────────────────┘
```

**Behavior:**
- Validate email format before submit
- Show error if email/password incorrect
- Navigate to HomeScreen on success
- Store JWT token in AsyncStorage
- Optional: Remember email in local storage

**Styling:**
- Background: white
- Input borders: light gray (1px)
- Button: primary color (indigo)
- Text: dark gray
- Error text: red (#EF4444)
- Links: primary color, underlined

---

## 3. RegisterScreen

**Purpose:** Create new user account

**Elements:**
1. **Header section:**
   - Title: "Create account"
   - Subtitle: "Get started with your attachment journey"

2. **Email input field**

3. **Password input field**

4. **Confirm password input field:**
   - Placeholder: "Confirm password"
   - Must match password field

5. **"Create account" button**

6. **Validation feedback:**
   - Below each field (optional, live)
   - Show if password is weak
   - Show if passwords don't match

7. **Link to LoginScreen:**
   - "Already have an account? Login"

**Layout Example:**
```
┌─────────────────────────────────────┐
│                                     │
│      Create account                 │
│      Get started on your journey    │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ you@example.com             │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ ••••••••••••••              │   │
│   └─────────────────────────────┘   │
│   ⚠ At least 8 characters           │
│                                     │
│   ┌─────────────────────────────┐   │
│   │ ••••••••••••••              │   │
│   └─────────────────────────────┘   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │   Create account [🔄]      │   │
│   └─────────────────────────────┘   │
│                                     │
│   Already have an account? Login    │
│                                     │
└─────────────────────────────────────┘
```

**Validation Rules:**
- Email: valid format required
- Password: ≥ 8 characters
- Confirm: must match password exactly
- Real-time feedback: green checkmark when valid

**Error Messages:**
- ❌ "Email already in use"
- ❌ "Password must be at least 8 characters"
- ❌ "Passwords do not match"
- ❌ "Invalid email format"
- ✅ "Account created successfully!"

**Behavior:**
- Disable "Create account" button until all fields valid
- Auto-login after registration (optional: show "Logging you in...")
- Navigate to HomeScreen on success

---

## 4. HomeScreen

**Purpose:** Main entry point; gateway to assessment and results

**Elements:**
1. **Header section:**
   - Greeting: "Hi, [user's email]"
   - Title: "Your Attachment Profile"

2. **Primary action button:**
   - "Start Assessment" (or "Resume Assessment" if in progress)
   - Large, primary color, full width
   - Icon: play button or pencil icon

3. **Secondary action button:**
   - "View Past Results" (disabled if no completed assessments)
   - Secondary color, full width
   - Icon: chart/graph icon

4. **Status section (if assessment in progress):**
   - "You have an in-progress assessment"
   - Shows last question number: "Question 18 of 36"
   - "Continue" button or "Start over" link

5. **Logout button:**
   - Link text in footer
   - Small, secondary color

**Layout Example:**
```
┌─────────────────────────────────────┐
│  Hi, user@example.com               │
│                                     │
│  Your Attachment Profile            │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ▶ Start Assessment          │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📊 View Past Results        │   │
│  │    (disabled)               │   │
│  └─────────────────────────────┘   │
│                                     │
│  Or resume: Question 18 of 36       │
│  ┌─────────────────────────────┐   │
│  │       Continue              │   │
│  └─────────────────────────────┘   │
│                                     │
│           Logout                    │
│                                     │
└─────────────────────────────────────┘
```

**Behavior:**
- Check for in-progress assessment on load
- If exists: show "Resume" option with last question number
- "Start Assessment" → navigate to AssessmentScreen
- "View Past Results" → (disabled for v0.1, enabled in v0.2)
- "Logout" → clear token, return to LoginScreen
- Optional: show last completion date if assessment completed

---

## 5. AssessmentScreen

**Purpose:** Answer ECR-R questions one by one

**Elements:**
1. **Progress section:**
   - Progress bar (visual fill: 5/36 complete)
   - Question counter: "Question 5 of 36"
   - Percentage: "14% complete"

2. **Question section:**
   - Question text (large, centered, readable)
   - Font size: 16-18px
   - Padding: adequate margins

3. **Response section (7-point Likert scale):**
   - 7 radio buttons or touch-friendly buttons
   - Labels: "Strongly Disagree" ← → "Strongly Agree"
   - Visual indication of selected answer (highlighted)
   - Current selection shown clearly

4. **Navigation section:**
   - "Previous" button (disabled on Q1)
   - "Next" button (disabled until answer selected)
   - Optional: "Skip to Results" (NO - don't implement, force completion)

5. **Optional features:**
   - Save indicator: "Auto-saved" (shown briefly after selection)
   - Question-specific help text (not needed for v0.1)

**Layout Example:**
```
┌─────────────────────────────────────┐
│                                     │
│   Question 5 of 36                  │
│   ████░░░░░░░░░░░░░░░░░░░░░ 14%   │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  "I worry a fair amount about       │
│   losing my partner."               │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  ◯ 1  Strongly Disagree             │
│  ◯ 2  Disagree                      │
│  ◯ 3  Somewhat Disagree             │
│  ◉ 4  Neutral                       │
│  ◯ 5  Somewhat Agree                │
│  ◯ 6  Agree                         │
│  ◯ 7  Strongly Agree                │
│                                     │
│  ┌──────────────┬──────────────┐   │
│  │  Previous    │    Next      │   │
│  └──────────────┴──────────────┘   │
│                                     │
│  Auto-saved                         │
│                                     │
└─────────────────────────────────────┘
```

**Behavior:**
- Display one question at a time
- Auto-save selection to AsyncStorage after each answer
- Previous button goes back (preserves answer)
- Next button goes forward (only enabled if answered)
- Progress bar updates with each question
- On Q36: "Next" button changes to "Submit" or "See Results"
- Handle screen rotations gracefully (optional)

**Styling:**
- Background: white or very light gray
- Radio buttons: clear, large touch targets (44px minimum)
- Progress bar: primary color
- Selected state: primary color highlight
- Typography: readable, high contrast

---

## 6. ResultsScreen

**Purpose:** Display attachment scores and interpretation

**Elements:**
1. **Header section:**
   - Title: "Your Results"
   - Subtitle: "Understanding your attachment style"
   - Optional: Date completed

2. **Scores section:**
   - **Anxiety Score:**
     - Large number: "4.2"
     - Label: "Anxiety" with brief definition
     - Visual bar (1-7 scale, color-coded)
   
   - **Avoidance Score:**
     - Large number: "3.8"
     - Label: "Avoidance" with brief definition
     - Visual bar (1-7 scale, color-coded)

3. **Attachment Style section:**
   - Large, prominent label: "Secure" (or other style)
   - Color-coded background (optional)
   - Icon (optional): ❤️ for secure, etc.

4. **Interpretation section:**
   - 3-5 sentences of warm, non-clinical interpretation
   - Tailored to attachment style
   - Accessible language (no jargon)

5. **Growth tip section:**
   - One actionable suggestion
   - Specific to attachment style
   - Positive, growth-oriented

6. **Action buttons:**
   - "Back to Home" button
   - "Retake Assessment" button (secondary)
   - "Share Results" (optional, v0.2)

**Layout Example:**
```
┌─────────────────────────────────────┐
│         Your Results                │
│     Understanding your style        │
│     Completed: Feb 6, 2025         │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│        Anxiety: 4.2                 │
│  ████████░░░░░░░░░░░░░░░░░░░░░  │
│                                     │
│        Avoidance: 3.8               │
│  ███████░░░░░░░░░░░░░░░░░░░░░░  │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│            ❤️ SECURE                │
│                                     │
│  You generally feel comfortable     │
│  with emotional intimacy and can    │
│  balance your needs with your       │
│  partner's. You tend toward trust   │
│  and healthy interdependence.       │
│                                     │
│  💡 Growth Tip:                     │
│  Practice occasional vulnerability │
│  sharing to deepen connection.      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │    Back to Home             │   │
│  └─────────────────────────────┘   │
│                                     │
│       Retake Assessment             │
│                                     │
└─────────────────────────────────────┘
```

**Interpretation Text (Example for Secure):**
```
"Your attachment pattern suggests you're secure in relationships. 
You're generally comfortable with both closeness and autonomy, 
and you tend to communicate your needs clearly. You likely feel 
secure enough to be vulnerable when appropriate, and you balance 
your own needs with your partner's. This is a strong foundation 
for healthy, interdependent relationships."
```

**Growth Tips (by style):**
- **Secure:** "Practice occasional vulnerability to deepen intimacy."
- **Anxious-Preoccupied:** "Notice when seeking reassurance becomes a habit; practice self-soothing first."
- **Dismissive-Avoidant:** "Create small moments of emotional sharing; vulnerability strengthens bonds."
- **Fearful-Avoidant:** "Work on self-compassion; your conflicted feelings are valid and can be understood."

**Styling:**
- Background: white or soft gradient
- Scores: large, bold typography
- Attachment style: prominent, color-coded (optional)
- Interpretation: warm tone, readable contrast
- Buttons: clear call-to-action

**Behavior:**
- Calculate scores automatically (backend + frontend verification)
- Display results immediately after submission
- Allow returning to HomeScreen
- Optional: download or share results (v0.2)

---

## Design Tokens (Consistent Across All Screens)

**Colors:**
```
Primary: #4F46E5 (Indigo)
Success: #10B981 (Green)
Warning: #F59E0B (Amber)
Error: #EF4444 (Red)
Background: #FFFFFF (White)
Surface: #F3F4F6 (Light Gray)
Text: #111827 (Dark)
TextSecondary: #6B7280 (Gray)
Border: #D1D5DB (Light Gray)
```

**Spacing:**
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
```

**Typography:**
```
HeadingXL: 32px, bold
HeadingL: 24px, bold
HeadingM: 20px, bold
Body: 16px, regular
BodySmall: 14px, regular
Caption: 12px, regular
```

**Button sizes:**
```
Large: 48px height, 16px horizontal padding
Medium: 40px height, 12px horizontal padding
Small: 32px height, 8px horizontal padding
```

---

## Accessibility Notes

- All text must have sufficient contrast (WCAG AA minimum)
- Touch targets minimum 44x44 pixels
- Radio buttons should be large and clearly labeled
- Error messages should be clear and specific
- Screen reader support (alt text for images, semantic HTML)
- Color not the only indicator (use icons, text, patterns)

---

## Mobile-First Considerations

- Test on small screens (iPhone SE = 375px width)
- Avoid horizontal scrolling
- Buttons and inputs should be thumb-friendly
- Font sizes should be ≥ 16px to prevent zoom on iOS
- Avoid fixed positioning (use ScrollView)
- Handle keyboard appearance (keyboard avoidance for inputs)

---

## v0.1 Constraints

- No animations (keep it simple)
- No custom fonts (use system fonts)
- No images or complex graphics
- Minimal colors (stick to design tokens)
- No complex layouts (stack vertically)
- No responsive breakpoints (mobile-first, simple scaling)

---

## Testing Checklist

- [ ] All screens render without errors
- [ ] Text is readable on small screens
- [ ] Buttons are touchable (44px minimum)
- [ ] Navigation works (Previous/Next, buttons)
- [ ] Auto-save works during assessment
- [ ] Results display correctly
- [ ] Error messages appear on failed login/register
- [ ] Logout works and clears session
