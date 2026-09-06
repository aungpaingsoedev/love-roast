import type { TestMeta, TestSlug } from "@/lib/types";
import { getDictionary, type Language } from "@/lib/i18n";

export const TESTS: TestMeta[] = [
  {
    slug: "love-calculator",
    emoji: "❤️",
    title: "Love Calculator",
    description: "Percentages that make no sense — and that's the point.",
    chaos: 2,
    href: "/test/love-calculator",
    popular: true,
  },
  {
    slug: "who-loves-who",
    emoji: "🔥",
    title: "Who Loves Who More?",
    description: "A love battle. Someone is losing. Emotionally.",
    chaos: 3,
    href: "/test/who-loves-who",
    popular: true,
  },
  {
    slug: "who-is-the-problem",
    emoji: "🚨",
    title: "Who Is The Problem?",
    description: "We scan. We judge. We name names.",
    chaos: 5,
    href: "/test/who-is-the-problem",
    popular: true,
  },
  {
    slug: "red-flags",
    emoji: "🚩",
    title: "Red Flag Detector",
    description: "Answer funny questions. Collect flags like Pokémon.",
    chaos: 4,
    href: "/test/red-flags",
    popular: true,
  },
  {
    slug: "jealousy",
    emoji: "👀",
    title: "Who Is More Jealous?",
    description: "Following lists. Last seen. Emotional espionage.",
    chaos: 4,
    href: "/test/jealousy",
  },
  {
    slug: "roast",
    emoji: "😂",
    title: "Relationship Roast",
    description: "Full-send personalized roasting. Bring tissues.",
    chaos: 5,
    href: "/test/roast",
  },
  {
    slug: "marriage",
    emoji: "💍",
    title: "Marriage Probability",
    description: "Wedding odds vs furniture-argument odds.",
    chaos: 3,
    href: "/test/marriage",
  },
  {
    slug: "delusional",
    emoji: "🧠",
    title: "Who Is More Delusional?",
    description: "Main-character energy, side-quest results.",
    chaos: 4,
    href: "/test/delusional",
  },
  {
    slug: "breakup",
    emoji: "💔",
    title: "Breakup Simulator",
    description: "Fictional chaos. Do not take this seriously.",
    chaos: 5,
    href: "/test/breakup",
  },
  {
    slug: "zodiac-check",
    emoji: "♈",
    title: "Zodiac Sign Check",
    description: "Two signs. One vibe. Unlimited cosmic nonsense.",
    chaos: 3,
    href: "/test/zodiac-check",
  },
];

export function getLocalizedTests(lang: Language = "en"): TestMeta[] {
  const dict = getDictionary(lang);
  return TESTS.map((test) => {
    const localized = dict.tests[test.slug as keyof typeof dict.tests];
    return {
      ...test,
      title: localized?.title ?? test.title,
      description: localized?.description ?? test.description,
    };
  });
}

export function getTest(slug: string, lang?: Language): TestMeta | undefined {
  const list = lang ? getLocalizedTests(lang) : TESTS;
  return list.find((t) => t.slug === slug);
}

export function isValidSlug(slug: string): slug is TestSlug {
  return TESTS.some((t) => t.slug === slug);
}

export const LOADING_MESSAGES = [
  "🔍 Scanning your love life...",
  "Inspecting texting patterns...",
  "Finding who replies with just 'K'...",
  "Measuring jealousy levels...",
  "Checking suspicious Instagram activity...",
  "Calculating emotional damage...",
  "Consulting the Relationship Algorithm™...",
  "Doing very unscientific math...",
  "⚠️ Severe problem detected",
] as const;

export const RED_FLAG_QUESTIONS = [
  {
    id: "reply",
    question: "Who takes longer to reply?",
    options: [
      { value: "me", label: "Me" },
      { value: "them", label: "Them" },
      { value: "both", label: "Both pretending to be busy" },
    ],
  },
  {
    id: "jealous",
    question: "Who gets jealous first?",
    options: [
      { value: "me", label: "Me" },
      { value: "them", label: "Them" },
      { value: "both", label: "It's a tie" },
    ],
  },
  {
    id: "fine",
    question: 'Who says "I\'m fine" while absolutely not fine?',
    options: [
      { value: "me", label: "Me" },
      { value: "them", label: "Them" },
      { value: "both", label: "Both. Every day." },
    ],
  },
  {
    id: "lastseen",
    question: "Who checks the other's Last Seen / Active Now?",
    options: [
      { value: "me", label: "Me" },
      { value: "them", label: "Them" },
      { value: "both", label: "Both, quietly" },
    ],
  },
  {
    id: "tiny",
    question: "Who starts fights over tiny things?",
    options: [
      { value: "me", label: "Me" },
      { value: "them", label: "Them" },
      { value: "both", label: "The universe just wants chaos" },
    ],
  },
  {
    id: "sorry",
    question: "Who apologizes first?",
    options: [
      { value: "me", label: "Me" },
      { value: "them", label: "Them" },
      { value: "neither", label: "Pride always wins (nobody apologizes)" },
    ],
  },
  {
    id: "whatever",
    question: 'Who says "do whatever" without meaning it?',
    options: [
      { value: "me", label: "Me" },
      { value: "them", label: "Them" },
      { value: "both", label: "That's our love language" },
    ],
  },
] as const;

export const DEMO_TRENDING = [
  { pair: "Sarah & Mike", result: "94% compatible 😂", note: "Demo result" },
  { pair: "Alex & Jamie", result: "87% red flag score 🚩", note: "Demo result" },
  { pair: "John & Emma", result: "99% food compatibility 🍜", note: "Demo result" },
  { pair: "Nina & Kai", result: "Problem: Kai (81%) 🚨", note: "Demo result" },
] as const;

export const FAQ_ITEMS = [
  {
    q: "Is LoveRoast scientifically accurate?",
    a: "Absolutely not. Our algorithm has zero degrees and runs on chaos alone. 💀",
  },
  {
    q: "Should I use this as real relationship advice?",
    a: "Please don't. Talk to each other (or a therapist). We only roast.",
  },
  {
    q: "Why did I get roasted so hard?",
    a: "You showed up. Names decide destiny. Same names = same roast.",
  },
  {
    q: "Do you store our results?",
    a: "Results live in a shareable link on your device. No accounts needed.",
  },
] as const;
