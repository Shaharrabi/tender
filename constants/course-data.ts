/**
 * Course Data — 4 clinical couple courses for live play
 *
 * Each course has 5 rounds with choices, sliders, and reveal cards.
 * Icons reference existing Tender icon components by key name.
 */

export type CourseIconKey =
  | 'mirror' | 'seedling' | 'compass' | 'heartPulse' | 'eye'
  | 'leaf' | 'wave' | 'sun' | 'brain' | 'dove'
  | 'heartDouble' | 'sparkle' | 'shield' | 'meditation';

export type TurnType = 'a' | 'b' | 'both';

export interface CourseChoice {
  icon: CourseIconKey;
  text: string;
}

export interface CourseReveal {
  icon: CourseIconKey;
  title: string;
  text: string;
}

export interface SliderConfig {
  min: string;
  max: string;
}

export interface CourseRound {
  label: string;
  turn: TurnType;
  prompt: string;
  type: 'choice' | 'slider';
  choices?: CourseChoice[];
  sliderConfig?: SliderConfig;
  reveal: CourseReveal | null;
}

export interface CourseBadge {
  icon: CourseIconKey;
  name: string;
  description: string;
}

export interface CourseDefinition {
  id: string;
  number: number;          // i, ii, iii, iv
  title: string;
  subtitle: string;
  description: string;
  tags: { label: string; colorKey: 'ch1' | 'ch2' | 'ch3' | 'ch4' }[];
  badge: CourseBadge;
  rounds: CourseRound[];
  /** Which WEARE variables this course primarily feeds */
  weareMapping: ('A' | 'C' | 'S' | 'Tr' | 'Delta' | 'R')[];
}

export const COURSE_TAG_COLORS = {
  ch1: { bg: '#EAD8D2', text: '#6A2A1E' },  // ACA / codependency
  ch2: { bg: '#DDE0EA', text: '#2A3070' },  // boundaries / bowen
  ch3: { bg: '#D8E4DD', text: '#1E4A38' },  // trauma / resilience
  ch4: { bg: '#E4DDE0', text: '#4A2030' },  // gottman / values
} as const;

export const COURSE_NUMBER_LABELS = ['i', 'ii', 'iii', 'iv'] as const;

export const COURSES: CourseDefinition[] = [
  // ─── COURSE I: Family Echo ─────────────────────────
  {
    id: 'family-echo',
    number: 1,
    title: 'The Family Echo',
    subtitle: 'tracing what you inherited',
    description: 'Trace your childhood roles into your adult relationship. Identify the caretaker, the invisible one, the fixer — not to blame your family, but to stop re-enacting what you learned before you had words.',
    tags: [
      { label: 'ACA', colorKey: 'ch1' },
      { label: 'codependency', colorKey: 'ch1' },
    ],
    badge: { icon: 'mirror', name: 'Echo Breaker', description: 'Named the family pattern. Began the new draft.' },
    weareMapping: ['A', 'C', 'Delta'],
    rounds: [
      {
        label: 'round 1 · your childhood rule',
        turn: 'a',
        prompt: 'Growing up, what was the unspoken rule in your family about showing emotions?',
        type: 'choice',
        choices: [
          { icon: 'meditation', text: "We didn't show them. Feelings were private — handled alone, behind closed doors." },
          { icon: 'wave', text: "One person's emotions dominated the household. Everyone else managed around them." },
          { icon: 'eye', text: 'We performed "fine." Always. The outside world saw a family with no problems.' },
          { icon: 'heartPulse', text: 'Feelings came out sideways — as anger, sarcasm, silence, or sudden exits.' },
        ],
        reveal: {
          icon: 'mirror',
          title: 'The Mirror',
          text: "Your partner's family taught them the same lesson in a different dialect. Neither was wrong — it was survival. But now you're in a relationship with someone who learned a different dialect. That's where the friction lives.",
        },
      },
      {
        label: "round 2 · your partner's rule",
        turn: 'b',
        prompt: "Same question for you. What was YOUR family's unspoken rule about showing emotions?",
        type: 'choice',
        choices: [
          { icon: 'meditation', text: "We didn't show them. Feelings were private — handled alone, behind closed doors." },
          { icon: 'wave', text: "One person's emotions dominated the household. Everyone else managed around them." },
          { icon: 'eye', text: 'We performed "fine." Always. The outside world saw a family with no problems.' },
          { icon: 'heartPulse', text: 'Feelings came out sideways — as anger, sarcasm, silence, or sudden exits.' },
        ],
        reveal: {
          icon: 'heartDouble',
          title: 'The Link',
          text: "Your automatic reactions to each other's emotions were written before you met. Not destiny — the first draft. Everything after this is a revision you write together.",
        },
      },
      {
        label: 'round 3 · together',
        turn: 'both',
        prompt: 'Which childhood role do you most recognize in yourself inside THIS relationship?',
        type: 'choice',
        choices: [
          { icon: 'shield', text: "The Caretaker — I manage everyone's emotional temperature so nobody has to feel too much." },
          { icon: 'meditation', text: "The Invisible One — I make myself small when things get intense. If I'm not here, I can't make it worse." },
          { icon: 'compass', text: 'The Fixer — I solve, strategize, organize. Feeling comes later. Maybe.' },
          { icon: 'dove', text: 'The Performer — I make it light, funny, okay. Someone has to hold the room together.' },
        ],
        reveal: {
          icon: 'sparkle',
          title: 'The Shift',
          text: "You just named it out loud. In front of each other. That is the opposite of what the role was designed to do — which was to stay invisible. Naming it is already the new draft.",
        },
      },
      {
        label: 'round 4 · the pattern',
        turn: 'a',
        prompt: '"The thing I do in our relationship that I learned in my family is..."',
        type: 'choice',
        choices: [
          { icon: 'shield', text: 'I over-function. I take care of everything so no one has reason to leave.' },
          { icon: 'meditation', text: 'I under-function. I pull back to zero burden — hoping that makes me safe to keep.' },
          { icon: 'eye', text: "I scan for mood shifts. I know your emotional weather before you do." },
          { icon: 'wave', text: 'I go numb when things get too close. My system learned closeness is where danger lives.' },
        ],
        reveal: null,
      },
      {
        label: 'round 5 · the exchange',
        turn: 'b',
        prompt: '"The thing I do in OUR relationship that I learned in MY family is..."',
        type: 'choice',
        choices: [
          { icon: 'shield', text: 'I over-function. I take care of everything so no one has reason to leave.' },
          { icon: 'meditation', text: 'I under-function. I pull back to zero burden — hoping that makes me safe to keep.' },
          { icon: 'eye', text: "I scan for mood shifts. I know your emotional weather before you do." },
          { icon: 'wave', text: 'I go numb when things get too close. My system learned closeness is where danger lives.' },
        ],
        reveal: {
          icon: 'seedling',
          title: 'The New Draft',
          text: "You've named the inherited pattern AND its cost. This is ACA's core: you are not your family's story. You are the author of what comes next. Now there are two of you writing.",
        },
      },
    ],
  },

  // ─── COURSE II: Aliveness Map ──────────────────────
  {
    id: 'aliveness-map',
    number: 2,
    title: 'The Aliveness Map',
    subtitle: 'from surviving to thriving',
    description: 'Move from surviving to thriving. Map your window of tolerance together, build a shared nervous system vocabulary, and discover the post-traumatic growth you carry.',
    tags: [
      { label: 'trauma', colorKey: 'ch3' },
      { label: 'resilience', colorKey: 'ch3' },
    ],
    badge: { icon: 'sun', name: 'Nervous System Navigator', description: 'Mapped your aliveness. Built the co-regulation manual.' },
    weareMapping: ['A', 'S', 'Tr'],
    rounds: [
      {
        label: 'round 1 · body check-in',
        turn: 'both',
        prompt: "Right now, in your body — not your mind — where does your aliveness live? Don't explain. Just notice.",
        type: 'slider',
        sliderConfig: { min: 'shut down · numb', max: 'electric · buzzing' },
        reveal: {
          icon: 'sun',
          title: 'The Signal',
          text: 'Aliveness is the opposite of numb. Your body just spoke. In polyvagal terms, you checked: am I in my window right now? That awareness alone is regulation.',
        },
      },
      {
        label: 'round 2 · your activation',
        turn: 'a',
        prompt: 'When you get activated — angry, anxious, overwhelmed — what is the FIRST thing your body does?',
        type: 'choice',
        choices: [
          { icon: 'heartPulse', text: 'Heart races, chest tightens, jaw clenches. Sympathetic takeover. Fight or flight.' },
          { icon: 'wave', text: 'Everything goes quiet. I leave my body. Far away. Dorsal vagal. Freeze.' },
          { icon: 'compass', text: "I can't sit still. Need to move, talk, DO. Mobilized energy, no target." },
          { icon: 'meditation', text: 'Foggy. Unreal. Watching from outside. Dissociation — the last escape hatch.' },
        ],
        reveal: {
          icon: 'eye',
          title: 'Your Window Edge',
          text: "You just showed your partner the edge of your window of tolerance. Not a flaw — a nervous system signature. When you cross that edge, the thinking brain goes offline. They now know what to watch for.",
        },
      },
      {
        label: "round 3 · partner activation",
        turn: 'b',
        prompt: 'When YOUR body gets activated, what is the first signal?',
        type: 'choice',
        choices: [
          { icon: 'heartPulse', text: 'Heart races, chest tightens, jaw clenches. Sympathetic takeover. Fight or flight.' },
          { icon: 'wave', text: 'Everything goes quiet. I leave my body. Far away. Dorsal vagal. Freeze.' },
          { icon: 'compass', text: "I can't sit still. Need to move, talk, DO. Mobilized energy, no target." },
          { icon: 'meditation', text: 'Foggy. Unreal. Watching from outside. Dissociation — the last escape hatch.' },
        ],
        reveal: {
          icon: 'heartDouble',
          title: 'The Shared Map',
          text: "Now you both know: when I go HERE, that's my nervous system state. Not a mood. Not an attitude. A STATE. Porges' polyvagal ladder. This changes how you read each other's shutdowns forever.",
        },
      },
      {
        label: 'round 4 · growth from pain',
        turn: 'both',
        prompt: 'What is ONE hard thing you survived that made you stronger — through it, not despite it?',
        type: 'choice',
        choices: [
          { icon: 'wave', text: 'Loss that stripped everything — and taught me what actually matters.' },
          { icon: 'heartPulse', text: 'A breaking point that demolished who I was — and rebuilt me differently.' },
          { icon: 'seedling', text: 'A slow awakening after years of numbness. Not dramatic. Just: feeling returned.' },
          { icon: 'dove', text: 'Finding my voice after being silenced. The first time I said what was true.' },
        ],
        reveal: {
          icon: 'sun',
          title: 'Post-Traumatic Growth',
          text: "Tedeschi and Calhoun named five domains: new possibilities, deeper relationships, personal strength, appreciation of life, spiritual change. You just shared yours. Now it belongs to your story.",
        },
      },
      {
        label: 'round 5 · co-regulation',
        turn: 'both',
        prompt: "When your partner is overwhelmed, what calms YOUR nervous system that you could share?",
        type: 'choice',
        choices: [
          { icon: 'heartDouble', text: 'Physical contact. Hold me. Hand on chest. Let our systems sync through touch.' },
          { icon: 'meditation', text: "Quiet presence. Sit near. Don't fix. Don't talk. Just be warm and close." },
          { icon: 'compass', text: 'Movement. Walk beside me. Side by side, same pace. Bilateral activation settles me.' },
          { icon: 'eye', text: 'Name it. Tell me what you see: "You look overwhelmed." The naming IS regulation.' },
        ],
        reveal: {
          icon: 'sparkle',
          title: 'Your Regulation Manual',
          text: "You just built what most couples never build: a shared manual for each other's nervous systems. Co-regulation is a practice. It starts with knowing: this is what brings me back.",
        },
      },
    ],
  },

  // ─── COURSE III: Edge Between Us ───────────────────
  {
    id: 'edge-between-us',
    number: 3,
    title: 'The Edge Between Us',
    subtitle: 'where I end and we begin',
    description: "Not walls. Not enmeshment. The living, permeable boundary where two whole selves meet. Bowen's differentiation — translated into felt experience.",
    tags: [
      { label: 'boundaries', colorKey: 'ch2' },
      { label: 'bowen', colorKey: 'ch4' },
    ],
    badge: { icon: 'compass', name: 'Edge Finder', description: 'Found the boundary. Named the unasked need.' },
    weareMapping: ['S', 'C', 'Delta'],
    rounds: [
      {
        label: 'round 1 · the fusion question',
        turn: 'a',
        prompt: 'When your partner is upset, how much does their emotion BECOME your emotion?',
        type: 'slider',
        sliderConfig: { min: 'theirs, not mine', max: 'I absorb it completely' },
        reveal: {
          icon: 'compass',
          title: 'Differentiation of Self',
          text: "Bowen called this the central variable in family therapy. Not caring less — being close without losing your shape. Where you land is not a verdict. It's information.",
        },
      },
      {
        label: "round 2 · partner's fusion",
        turn: 'b',
        prompt: 'Same: when YOUR partner is upset, how much does their emotion become yours?',
        type: 'slider',
        sliderConfig: { min: 'theirs, not mine', max: 'I absorb it completely' },
        reveal: {
          icon: 'eye',
          title: 'The Gap',
          text: "The difference between your numbers IS the boundary conversation. Both high = you fuse. One high, one low = one gets called cold, the other needy. Neither is wrong. Both were learned.",
        },
      },
      {
        label: 'round 3 · where you disappear',
        turn: 'a',
        prompt: 'Inside this relationship — where do you lose yourself the most?',
        type: 'choice',
        choices: [
          { icon: 'wave', text: 'In conflict. I abandon my position to keep peace. My opinion evaporates under pressure.' },
          { icon: 'mirror', text: "In their moods. I shape-shift. If they're heavy, I'm heavy. If light, I perform light." },
          { icon: 'compass', text: 'In decisions. I defer even with a clear preference. "Whatever you want" is autopilot.' },
          { icon: 'brain', text: "In identity. I don't know what I want apart from us. The WE swallowed the I." },
        ],
        reveal: null,
      },
      {
        label: 'round 4 · partner disappears',
        turn: 'b',
        prompt: 'Where do YOU lose yourself most inside this relationship?',
        type: 'choice',
        choices: [
          { icon: 'wave', text: 'In conflict. I abandon my position to keep peace. My opinion evaporates under pressure.' },
          { icon: 'mirror', text: "In their moods. I shape-shift. If they're heavy, I'm heavy. If light, I perform light." },
          { icon: 'compass', text: 'In decisions. I defer even with a clear preference. "Whatever you want" is autopilot.' },
          { icon: 'brain', text: "In identity. I don't know what I want apart from us. The WE swallowed the I." },
        ],
        reveal: {
          icon: 'heartDouble',
          title: 'The Knot',
          text: "The spot where you disappear is where a boundary wants to grow. Not a wall. A place where YOU become more visible inside the WE. Minuchin: permeable enough for love, firm enough for selfhood.",
        },
      },
      {
        label: 'round 5 · the unasked need',
        turn: 'both',
        prompt: 'What is ONE thing you need that you have not been asking for?',
        type: 'choice',
        choices: [
          { icon: 'meditation', text: "Time alone that doesn't mean something is wrong. Space that is not rejection." },
          { icon: 'dove', text: 'Permission to disagree without crisis. Difference that is not danger.' },
          { icon: 'mirror', text: 'My feelings treated as separate from yours. My sadness is not about you.' },
          { icon: 'leaf', text: 'A part of my life that is just mine. Not ours. Mine.' },
        ],
        reveal: {
          icon: 'seedling',
          title: 'The Healthy Edge',
          text: "Bowen's deepest discovery: the most intimate couples are the most differentiated. Closeness with edges. Togetherness with two whole selves. You just named what your edge needs. That is the oxygen the relationship runs on.",
        },
      },
    ],
  },

  // ─── COURSE IV: Bid Game ───────────────────────────
  {
    id: 'bid-game',
    number: 4,
    title: 'The Bid Game',
    subtitle: 'every reaching is an invitation',
    description: "Gottman found that lasting couples turn toward bids 86% of the time. Learn to spot the bids you've been missing, practice turning toward — together, live.",
    tags: [
      { label: 'gottman', colorKey: 'ch4' },
      { label: 'bids', colorKey: 'ch4' },
    ],
    badge: { icon: 'heartPulse', name: 'Bid Spotter', description: '86% turning toward. Building the bank account.' },
    weareMapping: ['A', 'Tr', 'Delta'],
    rounds: [
      {
        label: 'round 1 · spot the bid',
        turn: 'both',
        prompt: '"Did you see that sunset?" — that\'s a bid. What is your partner ACTUALLY asking for?',
        type: 'choice',
        choices: [
          { icon: 'eye', text: "Share my world. Look at what I'm looking at. Be in this moment with me." },
          { icon: 'heartPulse', text: 'I want connection. The sunset is the excuse. YOU are the point.' },
          { icon: 'sun', text: "I'm feeling something and I don't want to feel it alone." },
          { icon: 'sparkle', text: 'All of these. That is what a bid IS — reaching dressed as something casual.' },
        ],
        reveal: {
          icon: 'brain',
          title: "Gottman's Discovery",
          text: '130 newlywed couples. Six years. Lasting couples turned toward bids 86% of the time. Divorced couples: 33%. The difference was not passion or compatibility. It was attention. Repeated, mundane, unglamorous attention.',
        },
      },
      {
        label: 'round 2 · your bids',
        turn: 'a',
        prompt: 'What is YOUR most common bid — the one your partner might be missing?',
        type: 'choice',
        choices: [
          { icon: 'eye', text: 'I share something I found. "Look at this" means "think of me."' },
          { icon: 'leaf', text: 'I make something for them. Acts of service that are actually bids for closeness.' },
          { icon: 'dove', text: 'I start talking about my day. Testing: will they listen?' },
          { icon: 'heartDouble', text: 'I reach for physical contact. A hand. Sitting closer. My body asking first.' },
        ],
        reveal: null,
      },
      {
        label: 'round 3 · partner bids',
        turn: 'b',
        prompt: 'What is YOUR most common bid that your partner might miss?',
        type: 'choice',
        choices: [
          { icon: 'eye', text: 'I share something I found. "Look at this" means "think of me."' },
          { icon: 'leaf', text: 'I make something for them. Acts of service that are actually bids for closeness.' },
          { icon: 'dove', text: 'I start talking about my day. Testing: will they listen?' },
          { icon: 'heartDouble', text: 'I reach for physical contact. A hand. Sitting closer. My body asking first.' },
        ],
        reveal: {
          icon: 'sparkle',
          title: 'The Decoder',
          text: "You just gave each other the most valuable information in relationship maintenance: THIS is how I reach for you. A bid recognized is a bid that can be received. A bid received is a deposit.",
        },
      },
      {
        label: 'round 4 · turning pattern',
        turn: 'both',
        prompt: "When your partner bids and you're tired or stressed — what do you ACTUALLY do?",
        type: 'choice',
        choices: [
          { icon: 'heartDouble', text: 'Turn toward — I stop and engage, even briefly. Even "hmm, show me" counts.' },
          { icon: 'meditation', text: "Turn away — I don't respond. Not intentionally. The bid falls into silence." },
          { icon: 'heartPulse', text: '"Not now." "Can\'t you see I\'m busy?" I feel bad after.' },
          { icon: 'wave', text: 'Depends on my state. Regulated = toward. Depleted = away. Flooded = against.' },
        ],
        reveal: {
          icon: 'brain',
          title: 'The Bank Account',
          text: "Every turn-toward: deposit. Every turn-away: withdrawal. Every turn-against: large withdrawal. Gottman's ratio: 5 positive for every 1 negative. Not in grand gestures. In the daily invisible moments.",
        },
      },
      {
        label: 'round 5 · the live bid',
        turn: 'a',
        prompt: 'Right now. Make a real bid to your partner. Not a performance — a reaching.',
        type: 'choice',
        choices: [
          { icon: 'dove', text: '"I like doing this with you. This — right here — feels like us."' },
          { icon: 'eye', text: '"I see you right now. Not the role. You. I want you to know I\'m looking."' },
          { icon: 'heartDouble', text: '"I want to get better at catching your bids. I\'m paying attention now."' },
          { icon: 'sparkle', text: '"Thank you for being here with me. For being willing to be seen."' },
        ],
        reveal: {
          icon: 'heartPulse',
          title: 'That Was Real',
          text: "You just practiced the single most predictive behavior in relationship science. Not fixing. Not analyzing. Reaching, and turning toward the reach. Gottman's 86%. You're building it now.",
        },
      },
    ],
  },
];
