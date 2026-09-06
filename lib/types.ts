export type RelationshipStatus =
  | "crush"
  | "talking"
  | "dating"
  | "best-friends"
  | "complicated"
  | "married"
  | "unknown";

export type ZodiacSign =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces"
  | "";

export type TestSlug =
  | "love-calculator"
  | "who-loves-who"
  | "who-is-the-problem"
  | "red-flags"
  | "jealousy"
  | "roast"
  | "marriage"
  | "delusional"
  | "breakup"
  | "zodiac-check";

export type ChaosLevel = 1 | 2 | 3 | 4 | 5;

export interface CoupleInput {
  yourName: string;
  theirName: string;
  status?: RelationshipStatus;
  yourZodiac?: ZodiacSign;
  theirZodiac?: ZodiacSign;
}

export interface ScoreCategory {
  key: string;
  label: string;
  emoji: string;
  score: number;
}

export interface LoveCalculatorResult {
  type: "love-calculator";
  overall: number;
  categories: ScoreCategory[];
  verdictTitle: string;
  verdictBody: string;
}

export interface LoveBattleResult {
  type: "who-loves-who";
  youScore: number;
  themScore: number;
  winner: "you" | "them" | "tie";
  margin: number;
  warning: string;
  cta: string;
}

export interface ProblemResult {
  type: "who-is-the-problem";
  culprit: "you" | "them";
  culpritName: string;
  innocentName: string;
  culpritPercent: number;
  innocentPercent: number;
  roast: string;
}

export interface RedFlagResult {
  type: "red-flags";
  score: number;
  yourFlags: string[];
  theirFlags: string[];
  verdict: string;
  answers: Record<string, string>;
}

export interface JealousyResult {
  type: "jealousy";
  youScore: number;
  themScore: number;
  winner: "you" | "them" | "tie";
  verdict: string;
  roast: string;
}

export interface MarriageResult {
  type: "marriage";
  marriageProbability: number;
  weddingProbability: number;
  furnitureArguing: number;
  foodArguing: number;
  divorceProbability: number;
  recommendation: string;
}

export interface DelusionResult {
  type: "delusional";
  youScore: number;
  themScore: number;
  winner: "you" | "them" | "tie";
  verdict: string;
}

export interface BreakupResult {
  type: "breakup";
  reason: string;
  survivalProbability: number;
  disclaimer: string;
}

export interface ZodiacCheckResult {
  type: "zodiac-check";
  yourSign: Exclude<ZodiacSign, "">;
  theirSign: Exclude<ZodiacSign, "">;
  yourElement: "fire" | "earth" | "air" | "water";
  theirElement: "fire" | "earth" | "air" | "water";
  compatibility: number;
  vibeTitle: string;
  roast: string;
  categories: ScoreCategory[];
}

export interface RoastResult {
  type: "roast";
  loveScore: number;
  redFlagScore: number;
  jealousyScore: number;
  humorScore: number;
  delusionScore: number;
  communicationScore: number;
  marriageScore: number;
  paragraphs: string[];
  isPremium: boolean;
}

export type TestResult =
  | LoveCalculatorResult
  | LoveBattleResult
  | ProblemResult
  | RedFlagResult
  | JealousyResult
  | MarriageResult
  | DelusionResult
  | BreakupResult
  | ZodiacCheckResult
  | RoastResult;

export interface StoredResultPayload {
  v: 1;
  test: TestSlug;
  yourName: string;
  theirName: string;
  status?: RelationshipStatus;
  result: TestResult;
  createdAt: number;
  fromChallenge?: boolean;
}

export interface ChallengePayload {
  v: 1;
  challengerName: string;
  test: TestSlug;
  createdAt: number;
}

export interface TestMeta {
  slug: TestSlug;
  emoji: string;
  title: string;
  description: string;
  chaos: ChaosLevel;
  href: string;
  popular?: boolean;
}
