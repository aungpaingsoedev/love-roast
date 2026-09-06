import {
  biasToward,
  scoreFrom,
  pickFrom,
} from "@/lib/calculations";
import { getDictionary, type Language } from "@/lib/i18n";
import {
  getElement,
  signFromName,
  zodiacCompatibility,
} from "@/lib/zodiac";
import type {
  BreakupResult,
  CoupleInput,
  DelusionResult,
  JealousyResult,
  LoveBattleResult,
  LoveCalculatorResult,
  MarriageResult,
  ProblemResult,
  RedFlagResult,
  RoastResult,
  TestResult,
  TestSlug,
  ZodiacCheckResult,
  ZodiacSign,
} from "@/lib/types";
import { zodiacSigns } from "@/lib/validation";

function verdictForLove(score: number, lang: Language = "en"): { title: string; body: string } {
  const dict = getDictionary(lang);
  const found = dict.roastData.loveVerdicts.find((v) => score >= v.minScore);
  return found ?? dict.roastData.loveVerdicts[dict.roastData.loveVerdicts.length - 1];
}

export function generateLoveCalculator(
  input: CoupleInput,
  lang: Language = "en"
): LoveCalculatorResult {
  const { yourName: a, theirName: b } = input;
  const dict = getDictionary(lang);
  const cats = dict.roastData.categories;

  const overall = scoreFrom(a, b, "love-overall", 12, 99);
  const categories = [
    { key: "romance", label: cats.romance, emoji: "💕", score: scoreFrom(a, b, "romance", 20, 100) },
    { key: "humor", label: cats.humor, emoji: "😂", score: scoreFrom(a, b, "humor", 30, 100) },
    { key: "communication", label: cats.communication, emoji: "🗣️", score: scoreFrom(a, b, "comms", 5, 95) },
    { key: "fighting", label: cats.fighting, emoji: "😤", score: scoreFrom(a, b, "fight", 0, 80, "bad") },
    { key: "jealousy", label: cats.jealousy, emoji: "👀", score: scoreFrom(a, b, "jealous", 10, 100, "bad") },
    { key: "spending", label: cats.spending, emoji: "💸", score: scoreFrom(a, b, "spend", 0, 90, "bad") },
    { key: "food", label: cats.food, emoji: "🍜", score: scoreFrom(a, b, "food", 40, 100) },
  ];
  const verdict = verdictForLove(overall, lang);
  return {
    type: "love-calculator",
    overall,
    categories,
    verdictTitle: verdict.title,
    verdictBody: verdict.body,
  };
}

export function generateLoveBattle(
  input: CoupleInput,
  lang: Language = "en"
): LoveBattleResult {
  const { yourName: a, theirName: b } = input;
  const dict = getDictionary(lang);

  let youScore = scoreFrom(a, b, "battle-you", 35, 98);
  let themScore = scoreFrom(a, b, "battle-them", 35, 98);
  if (youScore === themScore) themScore = Math.min(100, themScore + 1);

  const winner = youScore > themScore ? "you" : themScore > youScore ? "them" : "tie";
  const margin = Math.abs(youScore - themScore);
  const winnerName = winner === "you" ? a : b;
  const loserName = winner === "you" ? b : a;

  const warning = dict.roastData.loveBattle.warning
    .replace("{winner}", winnerName)
    .replace("{margin}", String(margin));
  const cta = dict.roastData.loveBattle.cta.replace("{loser}", loserName);

  return {
    type: "who-loves-who",
    youScore,
    themScore,
    winner,
    margin,
    warning,
    cta,
  };
}

export function generateProblem(
  input: CoupleInput,
  lang: Language = "en"
): ProblemResult {
  const { yourName: a, theirName: b } = input;
  const dict = getDictionary(lang);
  const culprit = biasToward(a, b, "problem-culprit");
  const culpritPercent = scoreFrom(a, b, "problem-pct", 62, 93, "bad");
  const innocentPercent = 100 - culpritPercent;
  return {
    type: "who-is-the-problem",
    culprit,
    culpritName: culprit === "you" ? a : b,
    innocentName: culprit === "you" ? b : a,
    culpritPercent,
    innocentPercent,
    roast: pickFrom(dict.roastData.problemRoasts, a, b, "problem-roast"),
  };
}

export function generateRedFlags(
  input: CoupleInput,
  answers: Record<string, string> = {},
  lang: Language = "en"
): RedFlagResult {
  const { yourName: a, theirName: b } = input;
  const dict = getDictionary(lang);
  const score = scoreFrom(a, b, `redflags-${Object.values(answers).join("|")}`, 48, 96, "bad");
  const yourFlags = [
    pickFrom(dict.roastData.yourFlagPool, a, b, "yf1"),
    pickFrom(dict.roastData.yourFlagPool, a, b, "yf2"),
  ];
  const theirFlags = [
    pickFrom(dict.roastData.theirFlagPool, a, b, "tf1"),
    pickFrom(dict.roastData.theirFlagPool, a, b, "tf2"),
  ];
  return {
    type: "red-flags",
    score,
    yourFlags: [...new Set(yourFlags)],
    theirFlags: [...new Set(theirFlags)],
    verdict: dict.redFlags.verdict,
    answers,
  };
}

export function generateJealousy(
  input: CoupleInput,
  lang: Language = "en"
): JealousyResult {
  const { yourName: a, theirName: b } = input;
  const dict = getDictionary(lang);
  let youScore = scoreFrom(a, b, "jealous-you", 20, 99, "bad");
  let themScore = scoreFrom(a, b, "jealous-them", 15, 95, "bad");
  if (youScore === themScore) youScore = Math.min(100, youScore + 3);
  const winner = youScore > themScore ? "you" : "them";
  const winnerLabel =
    lang === "my"
      ? winner === "you"
        ? "နင်ပဲ (YOU)"
        : `${b.toUpperCase()}`
      : winner === "you"
        ? "YOU"
        : `${b.toUpperCase()}`;

  return {
    type: "jealousy",
    youScore,
    themScore,
    winner,
    verdict: winnerLabel,
    roast: pickFrom(dict.roastData.jealousyVerdicts, a, b, "jealous-roast"),
  };
}

export function generateMarriage(
  input: CoupleInput,
  lang: Language = "en"
): MarriageResult {
  const { yourName: a, theirName: b } = input;
  const dict = getDictionary(lang);
  return {
    type: "marriage",
    marriageProbability: scoreFrom(a, b, "marry", 20, 88),
    weddingProbability: scoreFrom(a, b, "wedding", 30, 95),
    furnitureArguing: scoreFrom(a, b, "furniture", 70, 100, "bad"),
    foodArguing: scoreFrom(a, b, "food-arg", 75, 100, "bad"),
    divorceProbability: scoreFrom(a, b, "divorce", 40, 95, "bad"),
    recommendation: pickFrom(dict.roastData.marriageRecs, a, b, "marry-rec"),
  };
}

export function generateDelusion(
  input: CoupleInput,
  lang: Language = "en"
): DelusionResult {
  const { yourName: a, theirName: b } = input;
  const dict = getDictionary(lang);
  let youScore = scoreFrom(a, b, "delusion-you", 40, 99, "bad");
  let themScore = scoreFrom(a, b, "delusion-them", 25, 90, "bad");
  if (youScore === themScore) youScore = Math.min(100, youScore + 5);
  const winner = youScore > themScore ? "you" : "them";
  return {
    type: "delusional",
    youScore,
    themScore,
    winner,
    verdict: pickFrom(dict.roastData.delusionVerdicts, a, b, "delusion-verdict"),
  };
}

export function generateBreakup(
  input: CoupleInput,
  lang: Language = "en"
): BreakupResult {
  const { yourName: a, theirName: b } = input;
  const dict = getDictionary(lang);
  return {
    type: "breakup",
    reason: pickFrom(dict.roastData.breakupReasons, a, b, "breakup-reason"),
    survivalProbability: scoreFrom(a, b, "survive", 28, 92),
    disclaimer: dict.roastData.breakupDisclaimer,
  };
}

function resolveSign(
  value: ZodiacSign | undefined,
  name: string
): Exclude<ZodiacSign, ""> {
  if (value && (zodiacSigns as readonly string[]).includes(value)) {
    return value as Exclude<ZodiacSign, "">;
  }
  return signFromName(name);
}

export function generateZodiacCheck(
  input: CoupleInput,
  lang: Language = "en"
): ZodiacCheckResult {
  const { yourName: a, theirName: b } = input;
  const dict = getDictionary(lang);
  const yourSign = resolveSign(input.yourZodiac, a);
  const theirSign = resolveSign(input.theirZodiac, b);
  const yourElement = getElement(yourSign);
  const theirElement = getElement(theirSign);
  const compatibility = zodiacCompatibility(yourSign, theirSign, a, b);

  const vibe =
    dict.zodiacData.vibes.find((v) => compatibility >= v.minScore) ??
    dict.zodiacData.vibes[dict.zodiacData.vibes.length - 1]!;

  const chemistry = scoreFrom(a, b, `z-chem-${yourSign}-${theirSign}`, 20, 99);
  const drama = scoreFrom(a, b, `z-drama-${yourSign}-${theirSign}`, 25, 99, "bad");
  const texting = scoreFrom(a, b, `z-text-${yourSign}-${theirSign}`, 15, 95);
  const forever = scoreFrom(a, b, `z-forever-${yourSign}-${theirSign}`, 10, 90);

  const roastTemplate = pickFrom(dict.zodiacData.roasts, a, b, "zodiac-roast");
  const roast = roastTemplate
    .replaceAll("{you}", a)
    .replaceAll("{them}", b)
    .replaceAll("{yourSign}", dict.zodiacSigns[yourSign])
    .replaceAll("{theirSign}", dict.zodiacSigns[theirSign])
    .replaceAll("{score}", String(compatibility));

  return {
    type: "zodiac-check",
    yourSign,
    theirSign,
    yourElement,
    theirElement,
    compatibility,
    vibeTitle: vibe.title,
    roast,
    categories: [
      {
        key: "chemistry",
        label: dict.zodiacData.categories.chemistry,
        emoji: "✨",
        score: chemistry,
      },
      {
        key: "drama",
        label: dict.zodiacData.categories.drama,
        emoji: "🎭",
        score: drama,
      },
      {
        key: "texting",
        label: dict.zodiacData.categories.texting,
        emoji: "📱",
        score: texting,
      },
      {
        key: "forever",
        label: dict.zodiacData.categories.forever,
        emoji: "⏳",
        score: forever,
      },
    ],
  };
}

export function generateRoast(
  input: CoupleInput,
  _premium = true,
  lang: Language = "en"
): RoastResult {
  const { yourName: a, theirName: b } = input;
  const loveScore = scoreFrom(a, b, "roast-love", 40, 96);
  const redFlagScore = scoreFrom(a, b, "roast-flag", 45, 95, "bad");
  const jealousyScore = scoreFrom(a, b, "roast-jealous", 30, 99, "bad");
  const humorScore = scoreFrom(a, b, "roast-humor", 50, 100);
  const delusionScore = scoreFrom(a, b, "roast-delusion", 35, 99, "bad");
  const communicationScore = scoreFrom(a, b, "roast-comms", 10, 80);
  const marriageScore = scoreFrom(a, b, "roast-marriage", 20, 85);

  const paragraphs: string[] =
    lang === "my"
      ? [
          `${a} နဲ့ ${b} တို့ရဲ့ ဆက်ဆံရေးက တကယ်ကို အထင်ကြီးစရာ ကောင်းပါတယ်။`,
          "ဒါပေမဲ့ အထင်ကြီးစရာ ကောင်းတဲ့အချက်က သူတို့နှစ်ယောက် တစ်ယောက်နဲ့တစ်ယောက် ဘယ်လောက်တောင် နားလည်မှုလွဲနေလဲဆိုတာပါပဲ။",
          loveScore >= 70
            ? "ဓာတ်တွေကတော့ ပြင်းပြင်းထန်ထန် ပေါင်းစပ်နေကြတာ အမှန်ပဲ။"
            : "ဓာတ်ပေါင်းစပ်မှုကတော့... စမ်းသပ်ခန်း အဆင့်မှာပဲ ရှိပါသေးတယ်။",
          communicationScore < 50
            ? "စကားပြော ဆက်သွယ်ရေး ဌာနကတော့ အပြီးအပိုင် ပိတ်ထားပုံရပါတယ်။"
            : "စကားတွေတော့ ပြောကြပါရဲ့... ရှင်းလင်းမှုတော့ သုညပါပဲ။",
          jealousyScore > 70
            ? "သဝန်တိုမှု ဌာနကတော့ ၂၄ နာရီ ပုံမှန် အပြည့်အဝ လည်ပတ်နေပါတယ်။"
            : "သဝန်တိုမှု နည်းပေမဲ့... မသင်္ကာစရာ မေးခွန်းတွေကတော့ များနေတုန်းပါ။",
          `Red flag ရမှတ် ${redFlagScore}/100 ဆိုတော့ Date လုပ်တိုင်း စုံထောက်ရုပ်ရှင် ရိုက်နေရသလိုပဲ။`,
          `မင်္ဂလာဆောင်နိုင်ခြေ ${marriageScore}% ရှိပေမဲ့ ပရိဘောဂဆိုင်မှာ ရန်ဖြစ်ရမှာကတော့ မလွဲဧကန်ပါပဲ။`,
          `${a} ရဲ့ စိတ်ကူးယဉ်မီတာက ${delusionScore}% ထိ ရောက်နေပါပြီ။ ${b} ကတော့ မှတ်စုထုတ်နေပါတယ်။`,
          "တစ်ယောက်ယောက်က 'အင်း / K' မပြန်ခင် ဒါလေးကို အမြန် Share လိုက်စမ်းပါ။",
        ]
      : [
          `The dynamic between ${a} and ${b} is genuinely fascinating.`,
          "Mostly because of how impressively committed you both are to misunderstanding each other.",
          loveScore >= 70
            ? "The emotional chemistry is undeniably explosive."
            : "The chemistry is currently stuck in the experimental research phase.",
          communicationScore < 50
            ? "The communication department has declared bankruptcy and closed indefinitely."
            : "Words are exchanged frequently, though comprehension remains near zero.",
          jealousyScore > 70
            ? "The jealousy division operates at 100% capacity around the clock."
            : "Jealousy is moderate, though suspicious interrogations remain standard.",
          `With a Red Flag index of ${redFlagScore}/100, every date is basically an undercover espionage thriller.`,
          `Marriage probability sits at ${marriageScore}%, but an explosive furniture aisle meltdown is 100% guaranteed.`,
          `${a}'s delusion meter has peaked at ${delusionScore}%, while ${b} is vigorously taking mental notes.`,
          "Screenshot this and post it before someone sends a passive-aggressive 'K'.",
        ];

  return {
    type: "roast",
    loveScore,
    redFlagScore,
    jealousyScore,
    humorScore,
    delusionScore,
    communicationScore,
    marriageScore,
    paragraphs,
    isPremium: true,
  };
}

export function generateTestResult(
  slug: TestSlug,
  input: CoupleInput,
  extras?: { answers?: Record<string, string>; premium?: boolean; lang?: Language }
): TestResult {
  const lang = extras?.lang ?? "en";
  switch (slug) {
    case "love-calculator":
      return generateLoveCalculator(input, lang);
    case "who-loves-who":
      return generateLoveBattle(input, lang);
    case "who-is-the-problem":
      return generateProblem(input, lang);
    case "red-flags":
      return generateRedFlags(input, extras?.answers, lang);
    case "jealousy":
      return generateJealousy(input, lang);
    case "marriage":
      return generateMarriage(input, lang);
    case "delusional":
      return generateDelusion(input, lang);
    case "breakup":
      return generateBreakup(input, lang);
    case "zodiac-check":
      return generateZodiacCheck(input, lang);
    case "roast":
      return generateRoast(input, extras?.premium ?? false, lang);
    default: {
      const _exhaustive: never = slug;
      return _exhaustive;
    }
  }
}
