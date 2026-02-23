/**
 * Building Bridges Card Game — All 60 Cards
 *
 * 40 Connection Builder Cards (5 categories)
 * 20 Open Heart Vulnerability Cards
 *
 * Based on EFT, attachment theory, and trauma-informed somatic practices.
 */

import type { CardCategory, CardDeck } from './categories';

// ─── Types ──────────────────────────────────────────────

export interface GameCard {
  id: string;
  deck: CardDeck;
  category?: CardCategory;
  title: string;
  backContent: {
    instructions: string;
    example?: string;
    discussionPrompt: string;
  };
  timeEstimate?: string;
  requiresTimer?: boolean;
  timerDuration?: number;         // seconds
  soloAdaptation?: string;
  xpReward: number;
}

// ─── Connection Builder Cards ───────────────────────────

// Category 1: Emotional Connection & Vulnerability (9 cards)

const EMOTIONAL_CONNECTION_CARDS: GameCard[] = [
  {
    id: 'cb-01',
    deck: 'connection-builder',
    category: 'emotional-connection',
    title: 'Vulnerability Expression',
    backContent: {
      instructions: 'Share a vulnerability with your partner — a fear, doubt, or weakness. Express it without expecting a specific response or solution. Your partner will listen actively and provide empathy.',
      example: 'I feel vulnerable when...',
      discussionPrompt: 'How did sharing and listening to this vulnerability feel for each of you? What did you learn about each other?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Write about a vulnerability you carry. What would you want to hear back if you shared it?',
    xpReward: 25,
  },
  {
    id: 'cb-02',
    deck: 'connection-builder',
    category: 'emotional-connection',
    title: 'Fear Sharing',
    backContent: {
      instructions: 'Share a fear about your relationship without blaming your partner. Your partner reflects back what they heard.',
      example: 'I fear that if we don\'t communicate more effectively, we might grow apart.',
      discussionPrompt: 'How can you support each other regarding this fear?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Write about a relationship fear. What would it feel like to have it received without defensiveness?',
    xpReward: 25,
  },
  {
    id: 'cb-03',
    deck: 'connection-builder',
    category: 'emotional-connection',
    title: 'Connection Recall',
    backContent: {
      instructions: 'Recall a time you felt deeply connected. Take turns describing it in detail.',
      example: 'I felt so connected when we...',
      discussionPrompt: 'How can you create more moments like this?',
    },
    timeEstimate: '5-10 min',
    soloAdaptation: 'Describe a moment of deep connection you remember. What made it feel that way?',
    xpReward: 25,
  },
  {
    id: 'cb-04',
    deck: 'connection-builder',
    category: 'emotional-connection',
    title: 'Trigger Exploration',
    backContent: {
      instructions: 'Identify a trigger in your relationship. Explore its origins without blame. Your partner listens and offers support.',
      example: 'I realize that my trigger about... stems from my past experience with...',
      discussionPrompt: 'How can you work together to manage this trigger?',
    },
    timeEstimate: '15-20 min',
    soloAdaptation: 'Write about a trigger and trace it back to its origin. What does it need from you?',
    xpReward: 25,
  },
  {
    id: 'cb-05',
    deck: 'connection-builder',
    category: 'emotional-connection',
    title: 'Emotional Support Practice',
    backContent: {
      instructions: 'One partner shares a current stress. Instead of problem-solving, the other offers emotional support.',
      example: 'I\'m here for you and want to support you emotionally.',
      discussionPrompt: 'How did this shift in approach feel for both of you?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Write about a current stress. Then write the supportive words you would want to hear.',
    xpReward: 25,
  },
  {
    id: 'cb-06',
    deck: 'connection-builder',
    category: 'emotional-connection',
    title: 'Intimacy Avoidance Awareness',
    backContent: {
      instructions: 'Identify a way you avoid intimacy. Explore how this might stem from past experiences. Your partner listens without judgment.',
      example: 'I realize that my avoidance of intimacy stems from...',
      discussionPrompt: 'How can you create safer spaces for intimacy?',
    },
    timeEstimate: '15-20 min',
    soloAdaptation: 'Reflect on ways you might avoid closeness. Where does this pattern come from?',
    xpReward: 25,
  },
  {
    id: 'cb-07',
    deck: 'connection-builder',
    category: 'emotional-connection',
    title: 'Abandonment Fear Expression',
    backContent: {
      instructions: 'Share a fear of abandonment without making it your partner\'s responsibility to fix. Your partner reflects back what they heard.',
      example: 'I fear abandonment when...',
      discussionPrompt: 'How can you create more security in your relationship?',
    },
    timeEstimate: '15-20 min',
    soloAdaptation: 'Write about abandonment fears. What would security look and feel like for you?',
    xpReward: 25,
  },
  {
    id: 'cb-08',
    deck: 'connection-builder',
    category: 'emotional-connection',
    title: 'Insecurity Sharing',
    backContent: {
      instructions: 'Share a personal insecurity and how it affects your behavior in the relationship. Your partner listens without judgment.',
      example: 'I feel insecure when...',
      discussionPrompt: 'How can you create a safer space for vulnerability?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Write about an insecurity and how it shapes your actions in relationships.',
    xpReward: 25,
  },
  {
    id: 'cb-09',
    deck: 'connection-builder',
    category: 'emotional-connection',
    title: 'Secure Base Exploration',
    backContent: {
      instructions: 'Describe a time when you felt your partner was a secure base — allowing you to explore, take risks, or be fully yourself.',
      example: 'I felt like I had a secure base when you...',
      discussionPrompt: 'How did this impact your relationship? How can you both cultivate more of these moments?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Describe what a secure base looks like for you. Who has provided that, and what made it feel safe?',
    xpReward: 25,
  },
];

// Category 2: Communication & Conflict Resolution (9 cards)

const COMMUNICATION_CARDS: GameCard[] = [
  {
    id: 'cb-10',
    deck: 'connection-builder',
    category: 'communication',
    title: 'Perspective Shift',
    backContent: {
      instructions: 'Identify a recurring argument. Describe it from your partner\'s perspective. Your partner then shares how accurate they feel your description is.',
      example: 'In our last argument, I think you felt...',
      discussionPrompt: 'What new insights did you gain? How can understanding each other\'s perspectives help you navigate future conflicts?',
    },
    timeEstimate: '15-20 min',
    soloAdaptation: 'Write about a conflict from the other person\'s perspective. What might they have been feeling?',
    xpReward: 25,
  },
  {
    id: 'cb-11',
    deck: 'connection-builder',
    category: 'communication',
    title: 'Wish Expression',
    backContent: {
      instructions: 'Instead of voicing a criticism, express a wish. Your partner shares how hearing a wish instead of criticism impacts them.',
      example: 'I wish we could find a way to resolve conflicts more quickly.',
      discussionPrompt: 'How might this approach change your interactions?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Transform a criticism you carry into a wish. How does the shift in language change how it feels?',
    xpReward: 25,
  },
  {
    id: 'cb-12',
    deck: 'connection-builder',
    category: 'communication',
    title: 'Active Listening Challenge',
    backContent: {
      instructions: 'Set a 3-minute timer. One partner shares about their day while the other listens without interrupting. When the timer ends, the listener summarizes what they heard.',
      example: 'I heard that you had a challenging day and felt overwhelmed.',
      discussionPrompt: 'What was this experience like for both of you?',
    },
    timeEstimate: '8-10 min',
    requiresTimer: true,
    timerDuration: 180,
    soloAdaptation: 'Set a 3-minute timer and write freely about your day. Then re-read and summarize the core feeling.',
    xpReward: 25,
  },
  {
    id: 'cb-13',
    deck: 'connection-builder',
    category: 'communication',
    title: 'Misunderstanding Reflection',
    backContent: {
      instructions: 'Describe a time you felt misunderstood. Brainstorm together how you could express yourself differently now.',
      example: 'I felt misunderstood when...',
      discussionPrompt: 'What communication strategies could prevent future misunderstandings?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Write about a time you felt misunderstood. What would you say differently now?',
    xpReward: 25,
  },
  {
    id: 'cb-14',
    deck: 'connection-builder',
    category: 'communication',
    title: '\'I\' Statement Practice',
    backContent: {
      instructions: 'Choose a recent conflict. Rephrase your perspective using \'I\' statements. Your partner reflects back what they heard.',
      example: 'I feel frustrated when...',
      discussionPrompt: 'How does this change the emotional tone of the conversation?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Rewrite a recent frustration using only "I" statements. Notice how the energy shifts.',
    xpReward: 25,
  },
  {
    id: 'cb-15',
    deck: 'connection-builder',
    category: 'communication',
    title: 'Empathy Practice',
    backContent: {
      instructions: 'Recall a recent conflict. Take turns imagining and expressing each other\'s emotional experience during that time.',
      example: 'I imagine you felt...',
      discussionPrompt: 'How does this exercise change your perspective on the conflict?',
    },
    timeEstimate: '15-20 min',
    soloAdaptation: 'Imagine how the other person experienced a recent disagreement. Write from their perspective.',
    xpReward: 25,
  },
  {
    id: 'cb-16',
    deck: 'connection-builder',
    category: 'communication',
    title: 'Direct Communication Practice',
    backContent: {
      instructions: 'Choose something you want. Practice asking for it directly, without hints or expectations.',
      example: 'I want...',
      discussionPrompt: 'How does this directness impact your communication?',
    },
    timeEstimate: '5-10 min',
    soloAdaptation: 'Write down three things you want but haven\'t asked for directly. Practice forming the direct ask.',
    xpReward: 25,
  },
  {
    id: 'cb-17',
    deck: 'connection-builder',
    category: 'communication',
    title: 'Conflict Resolution Celebration',
    backContent: {
      instructions: 'Share a time when you felt proud of how you handled a conflict together. Your partner adds their perspective.',
      example: 'I\'m proud of how we resolved...',
      discussionPrompt: 'What specific strategies made this resolution successful, and how can you apply them in the future?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Recall a conflict you navigated well. What did you do right? What can you repeat?',
    xpReward: 25,
  },
  {
    id: 'cb-18',
    deck: 'connection-builder',
    category: 'communication',
    title: 'Anxious Communication Patterns',
    backContent: {
      instructions: 'Identify a situation where you communicated from an anxious attachment place — perhaps seeking reassurance, over-explaining, or escalating.',
      example: 'I communicated anxiously when I...',
      discussionPrompt: 'How could you express your needs more securely next time? What would that sound like?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Reflect on when anxiety drives your communication. Write what a secure version of that message would sound like.',
    xpReward: 25,
  },
];

// Category 3: Personal Growth & Self-Awareness (11 cards)

const PERSONAL_GROWTH_CARDS: GameCard[] = [
  {
    id: 'cb-19',
    deck: 'connection-builder',
    category: 'personal-growth',
    title: 'Need Expression',
    backContent: {
      instructions: 'Express a need without making it your partner\'s responsibility to fulfill it. Your partner reflects back what they heard.',
      example: 'I need some time alone to recharge.',
      discussionPrompt: 'How can you both contribute to meeting this need?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Write about a need you have. How can you meet it for yourself while also communicating it?',
    xpReward: 25,
  },
  {
    id: 'cb-20',
    deck: 'connection-builder',
    category: 'personal-growth',
    title: 'Past Influence Awareness',
    backContent: {
      instructions: 'Share how a past experience might be influencing your current reactions. Your partner listens without judgment.',
      example: 'I realize that my past experience with... is affecting my reaction to our current situation.',
      discussionPrompt: 'How can you support each other in healing past wounds?',
    },
    timeEstimate: '15-20 min',
    soloAdaptation: 'Trace a current reaction back to a past experience. What is the through-line?',
    xpReward: 25,
  },
  {
    id: 'cb-21',
    deck: 'connection-builder',
    category: 'personal-growth',
    title: 'Childhood Influence',
    backContent: {
      instructions: 'Share a childhood memory that might explain one of your relationship patterns. Your partner listens without judgment.',
      example: 'I realize that my childhood experience with... is influencing my behavior in our relationship.',
      discussionPrompt: 'How can understanding this influence improve your connection?',
    },
    timeEstimate: '15-20 min',
    soloAdaptation: 'Write about a childhood memory that still shapes how you relate to others.',
    xpReward: 25,
  },
  {
    id: 'cb-22',
    deck: 'connection-builder',
    category: 'personal-growth',
    title: 'Self-Protection Awareness',
    backContent: {
      instructions: 'Identify a way you protect yourself in the relationship. Share how this might affect your partner.',
      example: 'I realize that my self-protection mechanism of... might be impacting our connection.',
      discussionPrompt: 'How can you create more safety in your relationship?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Name a way you protect yourself in relationships. What is it guarding? What would it be like to lower it slightly?',
    xpReward: 25,
  },
  {
    id: 'cb-23',
    deck: 'connection-builder',
    category: 'personal-growth',
    title: 'Individual Growth Sharing',
    backContent: {
      instructions: 'Describe a way you\'d like to grow individually. Your partner shares how they think this growth might benefit your relationship.',
      example: 'I\'d like to grow by...',
      discussionPrompt: 'How can you support each other\'s personal growth?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Write about one area of growth you\'re working on. How would it change your relationships?',
    xpReward: 25,
  },
  {
    id: 'cb-24',
    deck: 'connection-builder',
    category: 'personal-growth',
    title: 'Reassurance Seeking Awareness',
    backContent: {
      instructions: 'Identify a way you seek reassurance. Brainstorm self-soothing techniques you could use instead.',
      example: 'I seek reassurance by...',
      discussionPrompt: 'How can your partner support your self-soothing efforts?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Notice how you seek reassurance. Write three self-soothing alternatives you could try.',
    xpReward: 25,
  },
  {
    id: 'cb-25',
    deck: 'connection-builder',
    category: 'personal-growth',
    title: 'Emotional Availability Reflection',
    backContent: {
      instructions: 'Acknowledge a time you were emotionally unavailable. Share how you\'d respond differently now.',
      example: 'I was emotionally unavailable when...',
      discussionPrompt: 'What signs can you look for to recognize when either of you is becoming emotionally unavailable?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Recall a time you withdrew emotionally. What was happening underneath? What would presence have looked like?',
    xpReward: 25,
  },
  {
    id: 'cb-26',
    deck: 'connection-builder',
    category: 'personal-growth',
    title: 'Relationship Belief Examination',
    backContent: {
      instructions: 'Share a belief about relationships learned in childhood. Your partner listens without judgment.',
      example: 'I learned that relationships should always be...',
      discussionPrompt: 'How does this belief impact your current relationship, positively or negatively?',
    },
    timeEstimate: '15-20 min',
    soloAdaptation: 'Write a belief about relationships you absorbed growing up. Is it still serving you?',
    xpReward: 25,
  },
  {
    id: 'cb-27',
    deck: 'connection-builder',
    category: 'personal-growth',
    title: 'Emotion Presence Practice',
    backContent: {
      instructions: 'Choose a difficult emotion. Practice staying present with it for 2 minutes, then share your experience.',
      example: 'I feel anxious when...',
      discussionPrompt: 'How can you support each other in sitting with difficult emotions?',
    },
    timeEstimate: '5-10 min',
    requiresTimer: true,
    timerDuration: 120,
    soloAdaptation: 'Set a 2-minute timer and sit with a difficult emotion. Write what you noticed.',
    xpReward: 25,
  },
  {
    id: 'cb-28',
    deck: 'connection-builder',
    category: 'personal-growth',
    title: 'Control Release Exercise',
    backContent: {
      instructions: 'Identify a way you try to control outcomes in your relationship. Share how you could practice acceptance instead.',
      example: 'I try to control...',
      discussionPrompt: 'How might releasing control improve your connection?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Write about where you try to control. What would acceptance look like in that same situation?',
    xpReward: 25,
  },
  {
    id: 'cb-29',
    deck: 'connection-builder',
    category: 'personal-growth',
    title: 'Attachment Pattern Reflection',
    backContent: {
      instructions: 'Reflect on your attachment style in childhood — how you learned to get close to or protect yourself from others. Your partner listens without judgment.',
      example: 'In my childhood, I learned to... when I needed connection.',
      discussionPrompt: 'How do you see this pattern influencing your current relationship dynamics?',
    },
    timeEstimate: '15-20 min',
    soloAdaptation: 'Write about your earliest way of seeking or avoiding closeness. How does it echo in your adult relationships?',
    xpReward: 25,
  },
];

// Category 4: Appreciation & Positive Reinforcement (5 cards)

const APPRECIATION_CARDS: GameCard[] = [
  {
    id: 'cb-30',
    deck: 'connection-builder',
    category: 'appreciation',
    title: 'Appreciation Expression',
    backContent: {
      instructions: 'Express appreciation for something your partner does that you often take for granted. Your partner shares how hearing this appreciation impacts them.',
      example: 'I appreciate how you always support me in my endeavors.',
      discussionPrompt: 'How can you incorporate more appreciation into your daily interactions?',
    },
    timeEstimate: '5-10 min',
    soloAdaptation: 'Write three things you appreciate about someone close to you. What stops you from saying them?',
    xpReward: 25,
  },
  {
    id: 'cb-31',
    deck: 'connection-builder',
    category: 'appreciation',
    title: 'Strength Building',
    backContent: {
      instructions: 'Describe a strength in your relationship. Together, brainstorm ways to build on this strength.',
      example: 'Our strength is our ability to communicate openly...',
      discussionPrompt: 'How can you leverage this strength during challenging times?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Name a strength in how you relate to others. How can you lean into it more?',
    xpReward: 25,
  },
  {
    id: 'cb-32',
    deck: 'connection-builder',
    category: 'appreciation',
    title: 'Support Appreciation',
    backContent: {
      instructions: 'Describe a time when you felt your partner was truly there for you. Your partner shares what they remember about that time.',
      example: 'I felt supported when...',
      discussionPrompt: 'How can you recreate this level of support more often?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Recall a time someone truly showed up for you. What made that support feel real?',
    xpReward: 25,
  },
  {
    id: 'cb-33',
    deck: 'connection-builder',
    category: 'appreciation',
    title: 'Attraction Reflection',
    backContent: {
      instructions: 'Describe a positive quality that initially attracted you to your partner. Share how you see it now.',
      example: 'I was attracted to your...',
      discussionPrompt: 'How can you continue to appreciate and nurture this quality?',
    },
    timeEstimate: '5-10 min',
    soloAdaptation: 'Write about a quality in someone that drew you in. Do you still see it? Has it changed?',
    xpReward: 25,
  },
  {
    id: 'cb-34',
    deck: 'connection-builder',
    category: 'appreciation',
    title: 'Secure Attachment Celebration',
    backContent: {
      instructions: 'Share a moment when you felt securely attached to your partner — safe, seen, and at ease.',
      example: 'I felt securely attached when...',
      discussionPrompt: 'How did this security positively impact your relationship? What conditions made it possible?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Write about a time you felt securely attached to someone. What made it feel safe?',
    xpReward: 25,
  },
  {
    id: 'cb-35',
    deck: 'connection-builder',
    category: 'appreciation',
    title: 'Love Language Expression',
    backContent: {
      instructions: 'Express affection in your partner\'s preferred love language (words of affirmation, quality time, physical touch, acts of service, or receiving gifts). Your partner shares how this makes them feel.',
      example: 'My love language is... and yours is...',
      discussionPrompt: 'How can you incorporate more of this expression in your daily life?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Identify your love language. Write about a time you felt loved in exactly the right way.',
    xpReward: 25,
  },
];

// Category 5: Relationship Dynamics & Future Vision (10 cards, last one is attachment celebration from Cat 4)

const RELATIONSHIP_DYNAMICS_CARDS: GameCard[] = [
  {
    id: 'cb-36',
    deck: 'connection-builder',
    category: 'relationship-dynamics',
    title: 'Security Recall',
    backContent: {
      instructions: 'Describe a time you felt secure in the relationship. Your partner shares what they remember about that time.',
      example: 'I felt secure when...',
      discussionPrompt: 'How can you create more of these secure moments?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Recall a moment of feeling truly secure with someone. What conditions created that safety?',
    xpReward: 25,
  },
  {
    id: 'cb-37',
    deck: 'connection-builder',
    category: 'relationship-dynamics',
    title: 'Support Improvement',
    backContent: {
      instructions: 'Acknowledge an area where you could be more supportive. Your partner shares how this increased support would impact them.',
      example: 'I could be more supportive by...',
      discussionPrompt: 'How can you implement this change together?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Write about where you could show up more for someone. What gets in the way?',
    xpReward: 25,
  },
  {
    id: 'cb-38',
    deck: 'connection-builder',
    category: 'relationship-dynamics',
    title: 'Shared Challenge Gratitude',
    backContent: {
      instructions: 'Express gratitude for a challenge you\'ve overcome together. Your partner adds their perspective.',
      example: 'I\'m grateful for how we worked through...',
      discussionPrompt: 'What strengths did you discover through this challenge?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Write about a challenge that, in hindsight, made you stronger. What did it teach you?',
    xpReward: 25,
  },
  {
    id: 'cb-39',
    deck: 'connection-builder',
    category: 'relationship-dynamics',
    title: 'Reconnection Strategies',
    backContent: {
      instructions: 'Identify a pattern where you disconnect from each other. Together, brainstorm gentler ways to stay engaged.',
      example: 'We disconnect when...',
      discussionPrompt: 'How can you remind each other to use these strategies in the moment?',
    },
    timeEstimate: '15-20 min',
    soloAdaptation: 'Identify a pattern where you disconnect from others. What would a repair attempt look like?',
    xpReward: 25,
  },
  {
    id: 'cb-40',
    deck: 'connection-builder',
    category: 'relationship-dynamics',
    title: 'Connection Deepening',
    backContent: {
      instructions: 'Describe a way you\'d like to deepen your emotional connection. Your partner shares their perspective.',
      example: 'I\'d like to deepen our connection by...',
      discussionPrompt: 'What small steps can you take this week to work towards this deeper connection?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Write about how you want to deepen connection in your life. What is one step you can take this week?',
    xpReward: 25,
  },
  {
    id: 'cb-41',
    deck: 'connection-builder',
    category: 'relationship-dynamics',
    title: 'Space Request Practice',
    backContent: {
      instructions: 'Practice expressing a need for space without it feeling like rejection. Your partner shares how this request lands for them.',
      example: 'I need some space when...',
      discussionPrompt: 'How can you balance needs for connection and space in a way that works for both of you?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Write about your need for space. How can you honor it without guilt?',
    xpReward: 25,
  },
  {
    id: 'cb-42',
    deck: 'connection-builder',
    category: 'relationship-dynamics',
    title: 'Feeling Validation Exercise',
    backContent: {
      instructions: 'Identify a way you minimize your partner\'s feelings. Practice validating those feelings instead.',
      example: 'I validate your feelings when...',
      discussionPrompt: 'How does this shift in approach change the emotional atmosphere between you?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Notice where you might minimize your own feelings. Practice writing a validating response to yourself.',
    xpReward: 25,
  },
  {
    id: 'cb-43',
    deck: 'connection-builder',
    category: 'relationship-dynamics',
    title: 'Relationship Dream Sharing',
    backContent: {
      instructions: 'Share a dream or hope for your relationship without demanding agreement. Your partner shares their reaction.',
      example: 'My dream is for us to...',
      discussionPrompt: 'How can you support each other\'s relationship dreams?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Write a dream you have for your future relationship(s). What would it feel like to live in that dream?',
    xpReward: 25,
  },
  {
    id: 'cb-44',
    deck: 'connection-builder',
    category: 'relationship-dynamics',
    title: 'Avoidant Tendency Awareness',
    backContent: {
      instructions: 'Identify a time when you felt the need to distance yourself emotionally — to go quiet, withdraw, or shut down. Your partner listens without pressure.',
      example: 'I felt the need to pull away when...',
      discussionPrompt: 'What triggered this response? How can your partner support you without pushing you further away?',
    },
    timeEstimate: '15-20 min',
    soloAdaptation: 'Write about a time you shut down or pulled away. What was the feeling underneath the withdrawal?',
    xpReward: 25,
  },
  {
    id: 'cb-45',
    deck: 'connection-builder',
    category: 'relationship-dynamics',
    title: 'Co-regulation Practice',
    backContent: {
      instructions: 'Describe a stressful situation where your partner helped you feel calm and secure — where their presence actually regulated your nervous system.',
      example: 'You helped me feel calm when...',
      discussionPrompt: 'How can you both intentionally foster more of these co-regulating experiences?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Write about a time someone\'s presence calmed you. What was it about them that helped your nervous system settle?',
    xpReward: 25,
  },
];

// ─── Open Heart Vulnerability Cards (20 cards) ─────────

const OPEN_HEART_CARDS: GameCard[] = [
  {
    id: 'oh-01',
    deck: 'open-heart',
    title: 'Fear and Hope',
    backContent: {
      instructions: 'Share a personal fear AND a hope related to your relationship.',
      discussionPrompt: 'How can your partner support you with both?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Write a fear and a hope for your relationships. Let them sit side by side.',
    xpReward: 35,
  },
  {
    id: 'oh-02',
    deck: 'open-heart',
    title: 'Childhood Memories',
    backContent: {
      instructions: 'Share a fond childhood memory and how it shaped who you are today.',
      discussionPrompt: 'How does this part of you show up in your relationship?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Write about a childhood memory that still lives in your body. How does it shape you now?',
    xpReward: 35,
  },
  {
    id: 'oh-03',
    deck: 'open-heart',
    title: 'Personal Growth',
    backContent: {
      instructions: 'Discuss an area where you\'d like to grow and improve.',
      discussionPrompt: 'How can your partner support your development?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Write honestly about where you want to grow. What is the first small step?',
    xpReward: 35,
  },
  {
    id: 'oh-04',
    deck: 'open-heart',
    title: 'Unspoken Thoughts',
    backContent: {
      instructions: 'Share a thought or feeling you\'ve been hesitant to express in your relationship. Why did you hesitate?',
      discussionPrompt: 'How can you work through this hesitation together?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Write the thing you haven\'t said. What held you back? What would it feel like to release it?',
    xpReward: 35,
  },
  {
    id: 'oh-05',
    deck: 'open-heart',
    title: 'Love Language',
    backContent: {
      instructions: 'Share your love language and how your partner can show love in ways that truly resonate with you.',
      discussionPrompt: 'What would it feel like to receive love in exactly the way you need it?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Write about how you most want to receive love. When have you felt it most clearly?',
    xpReward: 35,
  },
  {
    id: 'oh-06',
    deck: 'open-heart',
    title: 'Deeply Understood',
    backContent: {
      instructions: 'Share a moment when you felt deeply understood by your partner.',
      discussionPrompt: 'What did they do or say that created that feeling? How can you recreate it?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Write about a moment someone truly understood you. What made it feel real?',
    xpReward: 35,
  },
  {
    id: 'oh-07',
    deck: 'open-heart',
    title: 'Fully Yourself',
    backContent: {
      instructions: 'Describe a time when you felt safe to be fully yourself with your partner — no editing, no performance.',
      discussionPrompt: 'What made that safety possible?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'When have you felt most like yourself with another person? What conditions created that freedom?',
    xpReward: 35,
  },
  {
    id: 'oh-08',
    deck: 'open-heart',
    title: 'Positive Influence',
    backContent: {
      instructions: 'Share a way your partner has positively influenced your growth as a person.',
      discussionPrompt: 'How does it feel to name this aloud?',
    },
    timeEstimate: '5-10 min',
    soloAdaptation: 'Write about someone who has positively influenced your growth. What did they awaken in you?',
    xpReward: 35,
  },
  {
    id: 'oh-09',
    deck: 'open-heart',
    title: 'Moment of Closeness',
    backContent: {
      instructions: 'Recall a moment of connection that made you feel closer to your partner than usual.',
      discussionPrompt: 'What was present in that moment that isn\'t always there?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Recall a moment of unexpected closeness. What was different about that moment?',
    xpReward: 35,
  },
  {
    id: 'oh-10',
    deck: 'open-heart',
    title: 'Unexpressed Admiration',
    backContent: {
      instructions: 'Describe a quality in your partner that you admire but haven\'t expressed fully.',
      discussionPrompt: 'What stopped you from saying it before now?',
    },
    timeEstimate: '5-10 min',
    soloAdaptation: 'Write about a quality you admire in someone but have never told them. Why haven\'t you?',
    xpReward: 35,
  },
  {
    id: 'oh-11',
    deck: 'open-heart',
    title: 'Hope for Deeper Connection',
    backContent: {
      instructions: 'Share a hope you have for deepening your emotional connection.',
      discussionPrompt: 'What would need to shift to make that possible?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Write about your hope for deeper connection. What is one thing you could do to move toward it?',
    xpReward: 35,
  },
  {
    id: 'oh-12',
    deck: 'open-heart',
    title: 'Partner as Resource',
    backContent: {
      instructions: 'Describe a time when your partner\'s support helped you overcome a challenge.',
      discussionPrompt: 'How did it feel to lean on them? What did it teach you about your relationship?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Write about a time someone\'s support carried you through something hard. What did leaning on them teach you?',
    xpReward: 35,
  },
  {
    id: 'oh-13',
    deck: 'open-heart',
    title: 'More Emotionally Available',
    backContent: {
      instructions: 'Share a way you\'d like to be more emotionally available to your partner.',
      discussionPrompt: 'What gets in the way? What would help?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Write about how you want to be more emotionally available. What barriers do you face?',
    xpReward: 35,
  },
  {
    id: 'oh-14',
    deck: 'open-heart',
    title: 'Proud Moment of Support',
    backContent: {
      instructions: 'Recall a moment when you felt proud of how you supported your partner.',
      discussionPrompt: 'What did you do? How did it feel to show up that way?',
    },
    timeEstimate: '5-10 min',
    soloAdaptation: 'Write about a time you showed up for someone and felt good about it. What did it reveal about you?',
    xpReward: 35,
  },
  {
    id: 'oh-15',
    deck: 'open-heart',
    title: 'Sense of "Us"',
    backContent: {
      instructions: 'Describe a time when you felt a strong sense of "us" — not two individuals but a team, a unit.',
      discussionPrompt: 'What created that feeling? How do you find it again when it\'s gone?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Write about a time you felt like part of a "we." What made that togetherness possible?',
    xpReward: 35,
  },
  {
    id: 'oh-16',
    deck: 'open-heart',
    title: 'Personal Strength',
    backContent: {
      instructions: 'Share a personal strength that has been enhanced by your relationship.',
      discussionPrompt: 'How has being with your partner made you more of who you want to be?',
    },
    timeEstimate: '5-10 min',
    soloAdaptation: 'Write about a strength that has grown through connection with others. How did they nurture it?',
    xpReward: 35,
  },
  {
    id: 'oh-17',
    deck: 'open-heart',
    title: 'Gesture That Moved You',
    backContent: {
      instructions: 'Describe a gesture of love from your partner that deeply moved you — even something small.',
      discussionPrompt: 'Why did that particular gesture land so powerfully?',
    },
    timeEstimate: '5-10 min',
    soloAdaptation: 'Write about a small gesture that meant more than the person probably knew. What made it land?',
    xpReward: 35,
  },
  {
    id: 'oh-18',
    deck: 'open-heart',
    title: 'Inviting Closer',
    backContent: {
      instructions: 'Share a way you\'d like to invite your partner closer emotionally — something specific they could do.',
      discussionPrompt: 'What makes it hard to ask for this directly?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Write about what you wish someone would do to come closer. What stops you from asking?',
    xpReward: 35,
  },
  {
    id: 'oh-19',
    deck: 'open-heart',
    title: 'Completely Accepted',
    backContent: {
      instructions: 'Recall a time when you felt completely accepted by your partner — flaws, fears, and all.',
      discussionPrompt: 'What did that acceptance do for you? How can you offer that to them?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Write about a time you felt fully accepted. What did it free in you?',
    xpReward: 35,
  },
  {
    id: 'oh-20',
    deck: 'open-heart',
    title: 'Grown in Connection',
    backContent: {
      instructions: 'Describe a way you\'ve grown in your ability to connect emotionally with your partner since you first got together.',
      discussionPrompt: 'What changed? What helped it change?',
    },
    timeEstimate: '10-15 min',
    soloAdaptation: 'Write about how your capacity for emotional connection has grown over time. What helped it change?',
    xpReward: 35,
  },
];

// ─── Exports ────────────────────────────────────────────

/** All 40 Connection Builder cards */
export const CONNECTION_BUILDER_CARDS: GameCard[] = [
  ...EMOTIONAL_CONNECTION_CARDS,
  ...COMMUNICATION_CARDS,
  ...PERSONAL_GROWTH_CARDS,
  ...APPRECIATION_CARDS,
  ...RELATIONSHIP_DYNAMICS_CARDS,
];

/** All 20 Open Heart cards */
export { OPEN_HEART_CARDS };

/** All 60 cards */
export const ALL_CARDS: GameCard[] = [
  ...CONNECTION_BUILDER_CARDS,
  ...OPEN_HEART_CARDS,
];

/** Get a card by ID */
export function getCardById(id: string): GameCard | undefined {
  return ALL_CARDS.find((c) => c.id === id);
}

/** Get cards by category */
export function getCardsByCategory(category: CardCategory): GameCard[] {
  return CONNECTION_BUILDER_CARDS.filter((c) => c.category === category);
}

/** Get a random card from a deck */
export function getRandomCard(deck?: CardDeck, excludeIds: string[] = []): GameCard | null {
  const pool = deck
    ? ALL_CARDS.filter((c) => c.deck === deck && !excludeIds.includes(c.id))
    : ALL_CARDS.filter((c) => !excludeIds.includes(c.id));
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Get a random card from a specific category */
export function getRandomCardByCategory(category: CardCategory, excludeIds: string[] = []): GameCard | null {
  const pool = getCardsByCategory(category).filter((c) => !excludeIds.includes(c.id));
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}
