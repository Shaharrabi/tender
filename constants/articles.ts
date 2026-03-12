/**
 * Articles — 10 evidence-based relationship articles.
 *
 * "The Science of Relationships" — beautifully written pieces
 * on what actually makes love work.
 */

import type { ComponentType } from 'react';
import type { IconProps } from '@/assets/graphics/icons';
import {
  HeartIcon,
  HandshakeIcon,
  LinkIcon,
  RefreshIcon,
  LightningIcon,
  ShieldIcon,
  LeafIcon,
  EyeIcon,
  BrainIcon,
  SeedlingIcon,
} from '@/assets/graphics/icons';

export interface Article {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  rootedIn: string;
  accentColor: string;
  Icon: ComponentType<IconProps>;
  paragraphs: string[];
  pullQuote: string;
}

/**
 * Returns the 1-3 articles most relevant to a given step number.
 * Mapping based on thematic alignment between article topics and step focus.
 */
const STEP_ARTICLE_MAP: Record<number, string[]> = {
  1:  ['art-01', 'art-04'],       // Attachment patterns + perpetual conflicts
  2:  ['art-03', 'art-02'],       // Relational field + bids for connection
  3:  ['art-05'],                 // Nervous system / vulnerability
  4:  ['art-09'],                 // Stories we tell about each other
  5:  ['art-02'],                 // The Bid — sharing / intimacy
  6:  ['art-08', 'art-09'],       // Contempt + narrative rewriting
  7:  ['art-10'],                 // Showing up — daily practice
  8:  ['art-06'],                 // Repair is the skill
  9:  ['art-10'],                 // Consistent action — showing up
  10: ['art-07'],                 // Differentiation — staying yourself
  11: ['art-03'],                 // Two people, one space — shared insight
  12: ['art-06', 'art-10'],       // Repair + showing up — carrying the message
};

export function getArticlesForStep(stepNumber: number): Article[] {
  const ids = STEP_ARTICLE_MAP[stepNumber] || [];
  return ids.map((id) => ARTICLES.find((a) => a.id === id)!).filter(Boolean);
}

export const ARTICLES: Article[] = [
  {
    id: 'art-01',
    number: '01',
    title: 'You Are Not Arguing About the Dishes',
    subtitle: 'Every fight has a surface and a floor. Most couples live on the surface.',
    category: 'Attachment',
    readTime: '4 min read',
    rootedIn: 'EFT (Johnson), Gottman Four Horsemen research',
    accentColor: '#C4616E',
    Icon: HeartIcon,
    pullQuote: 'The presenting issue is the door. The attachment need is the room behind it.',
    paragraphs: [
      'John Gottman spent four decades watching couples fight in a lab. What he found surprised even him: the topic almost never mattered. Couples argued about money, sex, chores, in-laws, time. But underneath every argument \u2014 without exception \u2014 was the same thing. Someone felt unseen. Someone felt alone. Someone needed to know they still mattered.',
      'The dishes are never about the dishes. They are about whether you notice what I carry. Whether you see how tired I am. Whether you still consider me.',
      'Emotionally Focused Therapy calls this the cycle \u2014 the predictable loop couples fall into when connection feels threatened. One partner protests loudly; the other withdraws quietly. Both are trying to get the same thing: safety. Both feel like the other is the problem. Neither is wrong. Both are scared.',
      'The first move in any argument isn\u2019t to solve it. It\u2019s to ask: what is this really about? What am I actually needing right now? What is my partner reaching for underneath all that noise?',
      'When you find that, the dishes become small again. And the two of you become large.',
    ],
  },
  {
    id: 'art-02',
    number: '02',
    title: 'The Bid',
    subtitle: 'Relationships are built and destroyed in small moments. Not the big ones.',
    category: 'Intimacy',
    readTime: '4 min read',
    rootedIn: 'Gottman Bid Theory, attachment co-regulation',
    accentColor: '#D8A499',
    Icon: HandshakeIcon,
    pullQuote: 'Turning toward doesn\u2019t mean agreeing. It means: I heard you. You exist to me.',
    paragraphs: [
      'A bid is any attempt to connect. It can be enormous \u2014 a tearful confession at 2am \u2014 or nearly invisible. \u201CLook at that bird.\u201D \u201CYou okay?\u201D A hand reaching across a car seat. A glance during a dinner party that says: I see you in there.',
      'Gottman\u2019s research found that in stable, happy relationships, partners turn toward each other\u2019s bids about 86% of the time. In couples headed for divorce, that number drops to 33%.',
      'The problem is that most bids are disguised. They don\u2019t arrive labeled. They come as complaints, as jokes, as quiet withdrawal, as random questions about nothing. We miss them because we\u2019re looking at our phones, or tired, or still stewing from the morning.',
      'The practice is not complicated. It\u2019s just hard. It asks you to stay awake to the person in front of you. To notice when they\u2019re reaching \u2014 even clumsily \u2014 and to reach back.',
      'You don\u2019t have to be perfect at this. You just have to be present enough, often enough, that your partner feels the truth: I am not invisible to you.',
    ],
  },
  {
    id: 'art-03',
    number: '03',
    title: 'Two People, One Space',
    subtitle: 'There is you. There is your partner. And then there is a third thing \u2014 the relationship itself.',
    category: 'Communication',
    readTime: '4 min read',
    rootedIn: 'PACT (Tatkin), Bowen Systems Theory, relational field research',
    accentColor: '#7294D4',
    Icon: LinkIcon,
    pullQuote: 'The space between two people is not empty. It is full of everything you\u2019ve built together.',
    paragraphs: [
      'Most couples focus on the first two. What do I need? What do they need? How do we compromise? But the most resilient couples develop a sense of the third thing. They can ask: what does this relationship need right now?',
      'This isn\u2019t mystical. It\u2019s actually quite practical. When you treat the relationship as something real \u2014 something with its own atmosphere, its own temperature, its own needs \u2014 you stop asking \u201Cwho\u2019s right?\u201D and start asking \u201Cwhat would make this better for us?\u201D',
      'Stan Tatkin calls this the couple bubble. It\u2019s an understanding, often unspoken, that we are each other\u2019s primary person. That we protect the relationship the way we\u2019d protect a living thing. Because it is one.',
      'This shows up in small decisions. Do we present a united front, even when we disagree privately? Do we have each other\u2019s backs in public? Do we treat our time together as something worth protecting?',
      'The space between two people is not empty. It is full of everything you\u2019ve built together, everything you\u2019ve survived, every small act of care that said: I\u2019m still here. So is this.',
    ],
  },
  {
    id: 'art-04',
    number: '04',
    title: 'Why You Keep Having the Same Fight',
    subtitle: 'Sixty-nine percent of relationship problems never get resolved. The research is clear.',
    category: 'Conflict',
    readTime: '4 min read',
    rootedIn: 'Gottman perpetual problems research, ACT values clarification',
    accentColor: '#D4A843',
    Icon: RefreshIcon,
    pullQuote: 'The goal is not resolution. It is dialogue \u2014 the ability to talk about the problem without it destroying you.',
    paragraphs: [
      'Gottman\u2019s longitudinal studies revealed something that unsettled couples therapists for years: most perpetual conflicts \u2014 the ones partners return to again and again \u2014 are not solvable. They are rooted in fundamental personality differences, values, or life dreams. Trying to eliminate them is, in his words, like trying to change someone\u2019s temperament.',
      'Happy couples don\u2019t have fewer perpetual problems. They have a different relationship to them.',
      'What breaks couples is not the presence of an unsolvable conflict. It\u2019s the gridlock \u2014 when the conversation becomes impossible, when both partners stop being curious and start being defended, when the same words trigger the same shutdown, every time.',
      'The way through gridlock is not smarter arguing. It\u2019s curiosity. What dream or need is living underneath your position on this? What are you actually protecting? When couples can share those dreams \u2014 even when they\u2019re in conflict \u2014 the fight changes shape. It doesn\u2019t disappear. But it becomes something you carry together instead of something that carries you.',
      'You will fight about this again. The question is whether, next time, you can stay a little more open.',
    ],
  },
  {
    id: 'art-05',
    number: '05',
    title: 'The Nervous System Is Running the Show',
    subtitle: 'Most relationship advice assumes you have access to your thinking brain during conflict. You often don\u2019t.',
    category: 'Emotions',
    readTime: '5 min read',
    rootedIn: 'Polyvagal Theory (Porges), Gottman flooding research, somatic awareness',
    accentColor: '#6BA3A0',
    Icon: LightningIcon,
    pullQuote: 'A flooded partner cannot be reached. Before anything, they need to come back to their own body.',
    paragraphs: [
      'When we feel threatened \u2014 and relational rupture registers as threat \u2014 the nervous system does what it was built to do. It floods the body with cortisol. Heart rate climbs. Blood flow shifts. The prefrontal cortex, the part of the brain that does nuance and repair, goes offline. You\u2019re no longer having a conversation. You\u2019re surviving.',
      'Gottman calls this flooding. At 100 beats per minute, most people lose the ability to take in new information or respond with care. You can literally not hear what your partner is saying.',
      'This is why \u201Cjust calm down\u201D is useless advice. Regulation is not a choice in that moment; it\u2019s a physiology. What helps is time \u2014 genuine time. Twenty minutes of actual separation, doing something non-stimulating, so the cortisol can clear.',
      'The practice is learning to recognize your own signals. The jaw that tightens. The chest that closes. The voice that gets very quiet or very loud. These are not character flaws. They are your body doing its best to protect you from pain.',
      'The relational skill is building enough safety between you that your nervous systems can relax in each other\u2019s presence. That takes time, and repetition, and repair. It is the slow work of becoming safe for each other.',
    ],
  },
  {
    id: 'art-06',
    number: '06',
    title: 'Repair Is the Skill',
    subtitle: 'Every relationship ruptures. The ones that survive are the ones that know how to come back.',
    category: 'Growth',
    readTime: '4 min read',
    rootedIn: 'EFT repair cycles, Gottman repair attempt research',
    accentColor: '#6B9080',
    Icon: ShieldIcon,
    pullQuote: 'A relationship that can rupture and return is more intimate than one that never breaks.',
    paragraphs: [
      'Repair is not apologizing correctly. It\u2019s not saying the right words in the right order. It\u2019s a gesture \u2014 verbal, physical, tonal \u2014 that says: I don\u2019t want to be here with you in this way. I\u2019d rather be on the same side.',
      'Research is unambiguous: the ability to repair after conflict is the single strongest predictor of long-term relationship satisfaction. Not the absence of conflict. Not compatibility scores. Repair.',
      'Repairs often fail not because they aren\u2019t sincere, but because they\u2019re poorly timed. One partner is ready to come back; the other is still flooded. The repair lands as another demand, and the wall goes up higher.',
      'Effective repair has three qualities: it comes when both people are regulated, it acknowledges impact without extensive explanation, and it makes a genuine bid for reconnection. \u201CI\u2019m sorry for how I said that.\u201D \u201CI don\u2019t want us to go to sleep like this.\u201D \u201CI love you and I got lost in there.\u201D',
      'You don\u2019t have to be good at fighting. You have to be good at finding your way back. Most couples who do the work discover that the repair \u2014 the tender moment after the rupture \u2014 becomes one of the most connecting things they do.',
    ],
  },
  {
    id: 'art-07',
    number: '07',
    title: 'Staying Yourself While Loving Someone Else',
    subtitle: 'Intimacy without self is just merger. And merger, eventually, kills desire.',
    category: 'Growth',
    readTime: '5 min read',
    rootedIn: 'Bowen Family Systems, Perel relational desire research, DSI-R differentiation',
    accentColor: '#5B6B8A',
    Icon: LeafIcon,
    pullQuote: 'To love a person clearly, you have to be able to stand apart from them.',
    paragraphs: [
      'Murray Bowen spent decades watching how people function in families. He noticed that people exist on a spectrum: those with high differentiation can stay emotionally present with another person without losing their own thoughts, values, and sense of self. Those with low differentiation \u2014 what he called emotional fusion \u2014 absorb the other person\u2019s anxiety like a sponge.',
      'Fusion feels like love at first. In the early stages of a relationship, losing yourself in another person feels romantic. It\u2019s only later that it becomes claustrophobic \u2014 for both people.',
      'Differentiation is not distance. It\u2019s the capacity to be in close contact with another person\u2019s emotions while remaining anchored in your own. To hear your partner\u2019s distress without immediately trying to fix it, flee it, or collapse into it.',
      'This is also what sustains desire over time. Esther Perel has written extensively about this: we are most drawn to partners who have a life we can\u2019t fully access, who remain, in some way, other. The pursuit requires space. Togetherness needs twoness.',
      'Staying yourself is not selfish. It\u2019s the gift. The person your partner fell for was distinct, alive, their own. Keeping that person in the relationship \u2014 through your own interests, your own friendships, your own interiority \u2014 is one of the most loving things you can do.',
    ],
  },
  {
    id: 'art-08',
    number: '08',
    title: 'What Contempt Actually Does',
    subtitle: 'There is one predictor of divorce so reliable that Gottman calls it the relationship death knell.',
    category: 'Conflict',
    readTime: '4 min read',
    rootedIn: 'Gottman Four Horsemen, positive sentiment override research',
    accentColor: '#8B6914',
    Icon: EyeIcon,
    pullQuote: 'Your partner is not your project. They are a person.',
    paragraphs: [
      'Contempt is the sense that you are superior to your partner. It arrives as eye-rolling, sneering, mockery, dismissiveness. Unlike anger \u2014 which at least assumes the other person matters \u2014 contempt says: you are beneath consideration.',
      'Gottman\u2019s research showed that couples who displayed contempt during conflict had significantly higher rates of illness. Contempt doesn\u2019t just damage the relationship. It degrades the immune system of the person on the receiving end.',
      'Contempt grows in the gap between who your partner is and who you need them to be. It is not a character problem. It is an intimacy problem.',
      'The antidote, Gottman found, is not tolerance. It\u2019s a culture of genuine appreciation. Couples who actively build a habit of noticing and naming what they value in each other \u2014 not just on special occasions, but in ordinary moments \u2014 create a buffer that holds during hard times.',
      'This is more than gratitude practice. It\u2019s a deliberate act of seeing. It asks you to look at the person you live with as they actually are \u2014 complex, imperfect, trying \u2014 rather than as the person you\u2019re disappointed they haven\u2019t become.',
    ],
  },
  {
    id: 'art-09',
    number: '09',
    title: 'The Stories We Tell About Each Other',
    subtitle: 'You don\u2019t respond to your partner. You respond to your story about your partner.',
    category: 'Communication',
    readTime: '5 min read',
    rootedIn: 'CBT schema theory, ACT cognitive defusion, DBT radical acceptance',
    accentColor: '#C6CDF7',
    Icon: BrainIcon,
    pullQuote: 'The person in front of you is always more complex than the story about them.',
    paragraphs: [
      'Cognitive behavioral approaches to relationships have long identified this: we are narrative creatures. We don\u2019t experience events raw; we experience them through the meaning we\u2019ve already made. And in long-term relationships, those meanings can calcify. \u201CHe never really listens.\u201D \u201CShe always makes everything about her.\u201D The word always. The word never. Both are lies, and both feel completely true.',
      'ACT \u2014 Acceptance and Commitment Therapy \u2014 offers a useful frame. It calls this cognitive fusion: when we treat our thoughts as facts, and our stories as reality. In relationship terms, it\u2019s when the story about our partner becomes more real to us than the actual person.',
      'The practice is noticing when you\u2019re in the story versus in contact with the person. A story is smooth and certain: I know exactly why they did that. Contact is slower and more uncertain: I wonder what was going on for them. I could ask.',
      'DBT adds another layer: radical acceptance. Not agreement, not approval \u2014 but the willingness to see a situation as it actually is, without the overlay of how it should be. This creates space. In that space, something other than the usual response becomes possible.',
      'Your partner is not the character in your head. They are someone evolving, struggling, reaching. So are you. Letting both of you be that is, quietly, one of the most radical things a couple can do.',
    ],
  },
  {
    id: 'art-10',
    number: '10',
    title: 'Showing Up, Over and Over',
    subtitle: 'Love is not a feeling you have. It is something you practice, with a body, in time.',
    category: 'Values',
    readTime: '4 min read',
    rootedIn: 'EFT attachment theory, behavioral activation, Gottman love map research',
    accentColor: '#F1BB7B',
    Icon: SeedlingIcon,
    pullQuote: 'Commitment is not a feeling of certainty. It is the decision to act as though the relationship matters, and then to let the feeling follow.',
    paragraphs: [
      'The research on what sustains long-term relationships converges on something simple and demanding: consistency. Not grand gestures. Not perfect communication. The steady accumulation of small acts that say: I am here. You matter. I chose this today.',
      'This is not romantic in the Hollywood sense. It is romantic in the truer sense \u2014 it takes courage, and discipline, and the willingness to show up even when you don\u2019t feel like it. Especially when you don\u2019t feel like it.',
      'Behavioral activation \u2014 a principle from CBT \u2014 works here too. We often wait to feel loving before we act loving. The research reverses this. Action precedes feeling. When you act with care toward your partner \u2014 a hand on their shoulder, a text that says I was thinking about you, making the coffee how they like it \u2014 the feeling often follows.',
      'EFT would add: what makes this sustainable is that it\u2019s rooted in genuine attachment, not performance. You are not performing love for an audience. You are building, brick by small brick, the evidence that this person can count on you.',
      'Every relationship will have seasons of distance, difficulty, and doubt. What carries people through is the rhythm they\u2019ve built \u2014 the daily practice of turning toward each other that becomes, over time, not something you do but something you are.',
    ],
  },
];
