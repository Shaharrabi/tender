import { Question } from '@/types';

/**
 * ECR-R Assessment — 36 questions
 * Source: Fraley, Shaver, & Brennan (2000)
 *
 * Items 1-18: Anxiety subscale
 * Items 19-36: Avoidance subscale
 * Reverse-scored items: 20, 21, 30, 33, 34, 35 (1-indexed)
 */
export const ECR_R_QUESTIONS: Question[] = [
  // ─── Anxiety Subscale (Items 1-18) ──────────────────────
  { id: 1, text: "I'm afraid that I will lose my partner's love.", subscale: 'anxiety', reverseScored: false },
  { id: 2, text: "I often worry that my partner will not want to stay with me.", subscale: 'anxiety', reverseScored: false },
  { id: 3, text: "I worry that my partner doesn't care about me as much as I care about them.", subscale: 'anxiety', reverseScored: false },
  { id: 4, text: "I worry a fair amount about losing my partner.", subscale: 'anxiety', reverseScored: false },
  { id: 5, text: "My desire to be very close sometimes scares people away.", subscale: 'anxiety', reverseScored: false },
  { id: 6, text: "I'm afraid that once my partner gets to know me, he or she won't like who I really am.", subscale: 'anxiety', reverseScored: false },
  { id: 7, text: "I worry that my partner won't care about me as much as I care about him or her.", subscale: 'anxiety', reverseScored: false },
  { id: 8, text: "I often wish that my partner's feelings were as deep as mine.", subscale: 'anxiety', reverseScored: false },
  { id: 9, text: "I worry that I won't measure up to other people my partner knows.", subscale: 'anxiety', reverseScored: false },
  { id: 10, text: "My partner only seems to want to be close to me when I initiate it.", subscale: 'anxiety', reverseScored: false },
  { id: 11, text: "I find that my partner(s) don't want to get as close as I would like.", subscale: 'anxiety', reverseScored: false },
  { id: 12, text: "Sometimes I feel that I force my partner to show more feeling, more commitment.", subscale: 'anxiety', reverseScored: false },
  { id: 13, text: "I tell my partner that I love him or her too often or more than he or she says it to me.", subscale: 'anxiety', reverseScored: false },
  { id: 14, text: "I find myself needing reassurance from my partner that we're okay.", subscale: 'anxiety', reverseScored: false },
  { id: 15, text: "I need a lot of reassurance that I am loved and valued in my relationship.", subscale: 'anxiety', reverseScored: false },
  { id: 16, text: "I worry about being abandoned.", subscale: 'anxiety', reverseScored: false },
  { id: 17, text: "I get upset when my partner is unavailable or seems uninterested in me.", subscale: 'anxiety', reverseScored: false },
  { id: 18, text: "My jealousy or anger sometimes makes it difficult for my partner to stay close to me.", subscale: 'anxiety', reverseScored: false },

  // ─── Avoidance Subscale (Items 19-36) ───────────────────
  { id: 19, text: "I prefer not to show a partner how I feel deep down.", subscale: 'avoidance', reverseScored: false },
  { id: 20, text: "I feel comfortable opening up to my partner and talking about my fears.", subscale: 'avoidance', reverseScored: true },
  { id: 21, text: "It helps to turn to my romantic partner in times of need.", subscale: 'avoidance', reverseScored: true },
  { id: 22, text: "I prefer not to be too close to romantic partners.", subscale: 'avoidance', reverseScored: false },
  { id: 23, text: "I get uncomfortable when a romantic partner wants to be very close.", subscale: 'avoidance', reverseScored: false },
  { id: 24, text: "I prefer not to depend on a romantic partner.", subscale: 'avoidance', reverseScored: false },
  { id: 25, text: "I don't feel comfortable depending on romantic partners.", subscale: 'avoidance', reverseScored: false },
  { id: 26, text: "I'm uncomfortable when romantic partners want to be too emotionally close.", subscale: 'avoidance', reverseScored: false },
  { id: 27, text: "I want to get close to my partner, but I keep pulling back.", subscale: 'avoidance', reverseScored: false },
  { id: 28, text: "I am nervous when partners get too close, and I want them to back off.", subscale: 'avoidance', reverseScored: false },
  { id: 29, text: "I feel that it does not make a difference whether I'm with a partner or alone.", subscale: 'avoidance', reverseScored: false },
  { id: 30, text: "My partner really understands me and my needs.", subscale: 'avoidance', reverseScored: true },
  { id: 31, text: "I think it is important to maintain some emotional distance in relationships.", subscale: 'avoidance', reverseScored: false },
  { id: 32, text: "I find it difficult to allow myself to depend completely on romantic partners.", subscale: 'avoidance', reverseScored: false },
  { id: 33, text: "I am very comfortable being close to romantic partners.", subscale: 'avoidance', reverseScored: true },
  { id: 34, text: "I don't mind asking intimate partners for comfort or help.", subscale: 'avoidance', reverseScored: true },
  { id: 35, text: "It's easy for me to be affectionate with my partner.", subscale: 'avoidance', reverseScored: true },
  { id: 36, text: "My partner makes me doubt myself.", subscale: 'avoidance', reverseScored: false },
];

export const LIKERT_LABELS = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Somewhat Disagree' },
  { value: 4, label: 'Neutral' },
  { value: 5, label: 'Somewhat Agree' },
  { value: 6, label: 'Agree' },
  { value: 7, label: 'Strongly Agree' },
];
