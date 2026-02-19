/**
 * Hotel Rooms (V1) & Meeting Rooms (V2)
 *
 * V1: 7 self-guided hotel rooms — each a chapter in the dating journey
 * V2: 5 meeting rooms — ways to connect with others
 */

import { Colors } from '@/constants/theme';
import type { HotelRoom, MeetingRoom } from '@/types/dating';

// ─── V1: Hotel Rooms (Self-Guided Journey) ───────────────────

export const HOTEL_ROOMS: HotelRoom[] = [
  {
    id: 'lobby',
    floor: 'G',
    name: 'The Lobby',
    subtitle: 'Before You Begin',
    icon: '🗝️',
    color: Colors.accentGold,
    description: 'Every great story starts with knowing who walks through the door.',
    content: {
      type: 'self-check',
      prompt: 'Before you date, check in with yourself',
      questions: [
        {
          text: "Right now, I'm looking for connection because...",
          type: 'reflection',
          options: [
            'I want to share life with someone',
            'I feel lonely and want it to stop',
            "I'm curious about who I am with another person",
            "I'm healing and want to practice being open",
          ],
        },
        {
          text: 'When I imagine a first date, my nervous system...',
          type: 'body-check',
          options: [
            'Gets excited — butterflies, energy',
            'Tightens — anxiety, scanning for danger',
            'Goes quiet — I disappear a little',
            "Depends entirely on who it's with",
          ],
        },
        {
          text: 'The story I tell myself about dating is:',
          type: 'narrative',
          options: [
            "It's a numbers game — keep trying",
            'I always pick the wrong person',
            "I'm too much / not enough",
            'It could be beautiful if I let it',
          ],
        },
      ],
    },
  },
  {
    id: 'reading-room',
    floor: '1',
    name: 'The Reading Room',
    subtitle: 'Know Your Pattern',
    icon: '📖',
    color: Colors.secondary,
    description: "Your attachment style doesn't doom you. It's the map to where your growth edges live.",
    content: {
      type: 'pattern-reveal',
      title: 'Your Dating Signature',
      patterns: [
        {
          style: 'The Pursuer',
          attachment: 'Anxious',
          color: Colors.accentGold,
          icon: '🌊',
          tendency: 'You move toward. Fast. You read every text for subtext. You want to know where you stand before dessert arrives.',
          gift: 'Your attunement is extraordinary. You sense connection and disconnection with precision.',
          edge: 'Can you tolerate not knowing? Can you let someone reveal themselves at their own pace?',
          practice: "On your next date: notice one moment when you want to ask 'where is this going?' — and instead, ask 'what do you care about most right now?'",
        },
        {
          style: 'The Protector',
          attachment: 'Avoidant',
          color: Colors.secondary,
          icon: '🏔️',
          tendency: "You keep space. You notice flaws quickly — not because you're judgmental, but because finding reasons to leave feels safer than reasons to stay.",
          gift: "Your independence is genuine. You don't need someone to complete you.",
          edge: "Can you let someone matter to you before you've decided they're worth it?",
          practice: 'On your next date: notice one moment when you want to pull back — and instead, share one small true thing about yourself.',
        },
        {
          style: 'The Watcher',
          attachment: 'Fearful-Avoidant',
          color: Colors.primary,
          icon: '🌓',
          tendency: 'You want closeness and fear it simultaneously. You may find yourself drawn to someone Monday, overwhelmed by Tuesday.',
          gift: "You understand complexity. You know that love isn't simple, and that makes you wise.",
          edge: 'Can you stay present with contradictory feelings without either fleeing or clinging?',
          practice: "On your next date: name the contradiction silently — 'I want to be here AND I want to leave' — then choose to stay 10 more minutes.",
        },
        {
          style: 'The Gardener',
          attachment: 'Secure',
          color: Colors.success,
          icon: '🌱',
          tendency: "You show up, communicate, and trust the process. But you may struggle with partners who can't meet you there.",
          gift: 'Your regulation is your superpower. You create safety just by being present.',
          edge: "Can you stay open to someone whose attachment style looks different from yours?",
          practice: "On your next date: notice if you're evaluating whether they're 'secure enough' — and instead, get curious about the story behind their pattern.",
        },
      ],
    },
  },
  {
    id: 'parlor',
    floor: '2',
    name: 'The Parlor',
    subtitle: 'The Seven Practices of Dating Well',
    icon: '🪞',
    color: Colors.primary,
    description: 'Seven micro-practices that transform dating from performance into presence.',
    content: {
      type: 'practices',
      intro: "These aren't tips. They're practices — things you do with your body, your attention, your breath. Each one maps to a principle of loving attention.",
      practices: [
        { principle: 'Presence', name: 'The Arrival', time: '30 seconds', instruction: 'Before entering the restaurant / bar / park: stop. Feel your feet. Take one full breath. Arrive in your body before you arrive at the table.', why: 'Your nervous system enters the room before your words do. If you arrive regulated, the space between you starts warm.', weare: 'Attunement (A)' },
        { principle: 'Patience', name: 'The Slow Reveal', time: 'Entire date', instruction: "Resist the urge to tell your whole story. Share one layer. Let silence happen. A good date has pauses — that's where curiosity lives.", why: 'Rushing to know everything is anxiety dressed as enthusiasm. Trust the pace.', weare: 'Resistance (R) ↓' },
        { principle: 'Sacred Attention', name: 'The Real Question', time: '2 minutes', instruction: "Ask one question you actually want to know the answer to. Not 'what do you do?' but 'what are you paying attention to lately?' or 'what made you laugh this week?'", why: 'Attention is the first act of love. Real questions create real space.', weare: 'Co-Creation (C)' },
        { principle: 'Play', name: 'The Absurd Moment', time: 'Spontaneous', instruction: "Introduce one moment of gentle absurdity. A weird question. A ridiculous hypothetical. 'If you had to eat only one food for a year but it had to start with the letter Q...'", why: 'Play reveals who someone is underneath their dating persona. It also makes you both human.', weare: 'Co-Creation (C)' },
        { principle: 'Embodied Joy', name: 'The Body Check', time: '3 breaths', instruction: 'Midway through the date, silently notice: where is my body right now? Tight? Open? Leaning in? Pulling back? Don\'t fix it — just notice.', why: "Your body knows things your mind hasn't caught up to yet.", weare: 'Individual (I)' },
        { principle: 'Peace', name: 'The Gratitude Frame', time: 'End of date', instruction: "Before deciding if there'll be a second date, name one thing that was genuinely good about the experience. Even if it's 'the pasta was excellent.'", why: "We lose people by scanning for what's wrong. Start by noticing what was right.", weare: 'Context (CE)' },
        { principle: 'Perspective', name: 'The Other Chair', time: 'After the date', instruction: 'On the way home, imagine the date from their perspective. What might they have noticed about you? What might they have been nervous about?', why: "Perspective-taking builds empathy before there's even a relationship to apply it to.", weare: 'Attunement (A)' },
      ],
    },
  },
  {
    id: 'ballroom',
    floor: '3',
    name: 'The Ballroom',
    subtitle: 'The Date Lab',
    icon: '💃',
    color: Colors.accentCream,
    description: 'Practice scenarios before real dates. Low stakes, high learning.',
    content: {
      type: 'scenarios',
      intro: "These aren't scripts. They're experiments. Try them in your imagination first, then in real life.",
      scenarios: [
        {
          title: 'The Moment They Go Silent',
          setup: "You've asked a question. They pause. The silence stretches. Your system starts firing.",
          options: [
            { label: 'Fill the silence immediately', result: 'notice', feedback: "Notice the impulse. What are you afraid will happen if you don't fill it? Silence isn't rejection — it might be thinking." },
            { label: 'Wait. Breathe. Let them find their words.', result: 'growth', feedback: 'Beautiful. You just tolerated uncertainty. That\'s a relational skill most people never develop.' },
            { label: 'Make a joke to break the tension', result: 'notice', feedback: "Humor is a great tool — unless it's always a shield. Notice: are you being funny, or avoiding something?" },
          ],
        },
        {
          title: 'They Say Something That Triggers You',
          setup: 'Midway through dinner, they casually say something that hits a nerve. Your chest tightens.',
          options: [
            { label: 'Shut down — smile, nod, change topic', result: 'notice', feedback: 'You just left the room while staying at the table. Your protector showed up. Not wrong — but notice the cost.' },
            { label: 'React — push back immediately', result: 'notice', feedback: "Your nervous system just took the wheel. Before responding: can you take one breath and check what's actually happening?" },
            { label: 'Pause. Name it internally. Then respond.', result: 'growth', feedback: "That pause is everything. 'Something in what you said landed hard for me. Can I sit with it for a second?' — That's emotional intelligence in real time." },
          ],
        },
        {
          title: 'You Really Like Them',
          setup: "It's been two hours. You're laughing. The conversation flows. You feel the pull. Your brain starts spinning future scenarios.",
          options: [
            { label: 'Start planning the next 6 months in your head', result: 'notice', feedback: 'Your anxious attachment just fast-forwarded past the present moment. Come back. They\'re still right here.' },
            { label: 'Find something wrong with them to protect yourself', result: 'notice', feedback: "That's your avoidant protector pre-emptively creating distance. The flaw-finding is a defense, not a discernment." },
            { label: "Notice the feeling. Stay right here. This moment is enough.", result: 'growth', feedback: "You just did the hardest thing in dating: you let yourself enjoy it without needing to know what it means." },
          ],
        },
        {
          title: 'The Goodbye',
          setup: "The date is ending. You're standing outside. The question of 'what now' hangs in the air.",
          options: [
            { label: "Say 'this was fun!' and leave quickly", result: 'notice', feedback: 'Quick exits can be kindness or avoidance. Which was this one? Check in with your body.' },
            { label: "Ask directly: 'I'd like to see you again. Would you?'", result: 'growth', feedback: "Vulnerability at the door. The answer matters less than the courage it took to ask. This is how secure attachment gets built." },
            { label: 'Text them 10 minutes later to gauge their response', result: 'notice', feedback: 'The checking behavior just activated. Can you sit with not knowing for one full hour? Your tolerance for uncertainty is a muscle.' },
          ],
        },
      ],
    },
  },
  {
    id: 'observatory',
    floor: '4',
    name: 'The Observatory',
    subtitle: 'Red Flags & Green Lights',
    icon: '🔭',
    color: Colors.success,
    description: 'Not everything that glitters is gold. Not everything quiet is empty. Learn to read the field.',
    content: {
      type: 'signals',
      intro: "Your body already knows what your mind takes weeks to figure out. These signals aren't rules — they're invitations to pay attention.",
      greenLights: [
        { signal: 'They ask you questions AND listen to the answers', weare: 'Attunement' },
        { signal: 'You feel more like yourself, not less', weare: 'Space' },
        { signal: "They can sit with 'I don't know'", weare: 'Resistance ↓' },
        { signal: 'Laughter that comes from surprise, not performance', weare: 'Co-Creation' },
        { signal: 'They mention their own growth or therapy casually', weare: 'Change' },
        { signal: 'Your body relaxes over the course of the date', weare: 'Context' },
        { signal: 'They notice small things — your drink, your mood shift, the music', weare: 'Attunement' },
        { signal: "Disagreement doesn't create a rupture", weare: 'Transmission' },
      ],
      amberLights: [
        { signal: 'They talk about themselves for 80% of the time', note: 'Could be nerves. Notice if it shifts on date 2.' },
        { signal: 'They\'re charming in a way that feels rehearsed', note: "Some people are just charismatic. But if the charm never cracks — where's the real person?" },
        { signal: "They push for intensity fast — 'I've never felt this before'", note: "Early idealization often precedes devaluation. Enjoy it, but don't build on it yet." },
        { signal: "Your friends see something you don't", note: "You don't have to agree. But don't dismiss external perspective. They see your field from outside." },
      ],
      redFlags: [
        { signal: 'You feel smaller after spending time with them', body: 'Tightness in throat, collapsed posture, editing yourself' },
        { signal: "They dismiss your feelings as 'overreacting'", body: 'Stomach drop, heat in face, confusion' },
        { signal: "Love-bombing: grand gestures before they know you", body: "Excitement that feels destabilizing, like you can't keep up" },
        { signal: "They can't take accountability — everything is someone else's fault", body: "Unease you can't name, walking on eggshells" },
        { signal: "Your nervous system stays activated — you can't relax around them", body: 'Chronic tension, hypervigilance, exhaustion after dates' },
      ],
    },
  },
  {
    id: 'writing-desk',
    floor: '5',
    name: 'The Writing Desk',
    subtitle: 'Your Dating Journal',
    icon: '✒️',
    color: Colors.accent,
    description: "After each date, three questions. That's it. No analysis. Just noticing.",
    content: {
      type: 'journal',
      prompts: [
        { question: 'What did my body tell me?', hint: 'Where was the tension? Where was the ease? When did I lean in or pull back?' },
        { question: 'What surprised me?', hint: 'About them. About myself. About the space between us.' },
        { question: 'What do I want to carry forward?', hint: 'Not conclusions — just one thing worth remembering.' },
      ],
      bonus: {
        title: 'The Pattern Tracker',
        description: 'After 3+ dates (with anyone), look for your thread:',
        questions: [
          'What type of person am I consistently drawn to?',
          'At what point do I usually check out, pull in, or get anxious?',
          'What am I hoping dating will fix that might be mine to work on?',
        ],
      },
    },
  },
  {
    id: 'rooftop',
    floor: 'R',
    name: 'The Rooftop',
    subtitle: 'When It\'s Becoming Something',
    icon: '🌅',
    color: Colors.primaryLight,
    description: 'The transition from dating to relating. The most beautiful and terrifying threshold.',
    content: {
      type: 'transition',
      intro: "You've been seeing someone. It's been 3, 5, 8 dates. Something is forming. This is where most people either rush in or run away.",
      guideposts: [
        {
          title: 'The Couple Bubble Begins',
          text: "When you start creating a 'we' that has its own weather — its own inside jokes, its own rhythm, its own gravity — the couple bubble is forming. Tend it. Name it. 'Something is happening between us. I like it.'",
          practice: "Say out loud what you're experiencing. Not what you want it to become. Just what it is right now.",
        },
        {
          title: 'Your Patterns Will Arrive',
          text: "The attachment patterns you explored in the Reading Room? They're about to show up in high definition. The pursuer will want to define the relationship. The protector will want to slow down. The watcher will feel both impulses at once.",
          practice: "Name the pattern to yourself: 'My pursuer just showed up.' Then ask: 'What does this moment actually need?'",
        },
        {
          title: "Repair Before It's Needed",
          text: "The first misunderstanding will come. Don't wait for it to become a fight. Build the repair muscle now: 'Hey — something felt off between us yesterday. Can we talk about it?'",
          practice: "Have the 'how do we handle ruptures' conversation while things are still good. It's the relationship equivalent of putting on your seatbelt before driving.",
        },
        {
          title: 'The Space Between Speaks',
          text: 'Pay attention to the quality of the field between you. Is it getting warmer? More spacious? Or tighter? The field tells you things before either person does.',
          practice: "After spending time together, ask yourself: 'How does the space between us feel right now?' Not 'how do I feel about them' — how does the space feel?",
        },
      ],
      invitation: "When you're ready to go deeper with someone — that's when Tender's full journey begins. The 12 Steps aren't just for couples in trouble. They're for couples who want to build something that's alive from the very start.",
    },
  },
];

// ─── V2: Meeting Rooms ──────────────────────────────────────

export const MEETING_ROOMS: MeetingRoom[] = [
  {
    name: 'The Conversation Room',
    desc: 'A guided prompt drops every 24 hours. Both of you respond. No small talk allowed.',
    people: 12,
    icon: '💬',
    status: 'active',
    prompt: "Today's prompt: 'What's the bravest thing you've done for love — and did it work?'",
  },
  {
    name: 'The Listening Room',
    desc: 'Share a song that describes where you are right now. Others listen. That\'s it. Music before words.',
    people: 8,
    icon: '🎧',
    status: 'active',
    prompt: 'This week\'s theme: Songs that feel like coming home',
  },
  {
    name: 'The Walk Room',
    desc: 'Matched with someone for a 30-minute walk. The app gives you both a route and 3 questions. Meet in motion.',
    people: 5,
    icon: '🚶',
    status: 'upcoming',
    prompt: 'Next walk: Saturday 10am',
  },
  {
    name: 'The Letter Desk',
    desc: "Write to someone whose constellation intrigued you. No instant messages. Letters only. 48-hour reply window.",
    people: 19,
    icon: '✉️',
    status: 'active',
    prompt: 'You have 1 unopened letter',
  },
  {
    name: 'The Workshop',
    desc: 'A shared Dating Well exercise. Do it solo, then compare notes with your match. Vulnerability through parallel experience.',
    people: 7,
    icon: '🔨',
    status: 'active',
    prompt: "This week: 'The Pattern Spotter' — identify your attachment dance",
  },
];

/** WEARE Compatibility dimensions for Discover view */
export const COMPATIBILITY_DIMS = [
  { key: 'attunement', label: 'Attunement', desc: 'How naturally you sense each other', icon: '〰️', color: Colors.primary },
  { key: 'co_creation', label: 'Creative Tension', desc: 'How your differences generate sparks', icon: '⚡', color: Colors.accentGold },
  { key: 'space', label: 'Space', desc: 'Room for both of you to breathe', icon: '◌', color: Colors.secondary },
  { key: 'growth', label: 'Growth Direction', desc: "Where you're both heading", icon: '↗', color: Colors.success },
  { key: 'resilience', label: 'Resilience', desc: "How you'd weather storms together", icon: '◇', color: Colors.accent },
];
