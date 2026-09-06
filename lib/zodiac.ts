import type { ZodiacSign } from "@/lib/types";
import { zodiacSigns } from "@/lib/validation";
import { hashString } from "@/lib/calculations";

export type ZodiacElement = "fire" | "earth" | "air" | "water";

export const ZODIAC_ELEMENTS: Record<Exclude<ZodiacSign, "">, ZodiacElement> = {
  aries: "fire",
  leo: "fire",
  sagittarius: "fire",
  taurus: "earth",
  virgo: "earth",
  capricorn: "earth",
  gemini: "air",
  libra: "air",
  aquarius: "air",
  cancer: "water",
  scorpio: "water",
  pisces: "water",
};

const ELEMENT_EMOJI: Record<ZodiacElement, string> = {
  fire: "🔥",
  earth: "🌿",
  air: "💨",
  water: "🌊",
};

/** How well two elements vibe together (0–100 base). */
function elementBase(a: ZodiacElement, b: ZodiacElement): number {
  if (a === b) return 88;
  const pair = [a, b].sort().join("-");
  switch (pair) {
    case "air-fire":
    case "earth-water":
      return 82;
    case "air-water":
    case "earth-fire":
      return 55;
    case "air-earth":
    case "fire-water":
      return 42;
    default:
      return 60;
  }
}

export function getElement(sign: Exclude<ZodiacSign, "">): ZodiacElement {
  return ZODIAC_ELEMENTS[sign];
}

export function getElementEmoji(element: ZodiacElement): string {
  return ELEMENT_EMOJI[element];
}

/** Deterministic sign from a name when user skipped zodiac (fallback). */
export function signFromName(name: string): Exclude<ZodiacSign, ""> {
  const idx = hashString(name.trim().toLowerCase()) % zodiacSigns.length;
  return zodiacSigns[idx]!;
}

/**
 * Compatibility 1–99 from signs + names (keeps couple special-case scoring via salt).
 */
export function zodiacCompatibility(
  yourSign: Exclude<ZodiacSign, "">,
  theirSign: Exclude<ZodiacSign, "">,
  yourName: string,
  theirName: string
): number {
  const base = elementBase(getElement(yourSign), getElement(theirSign));
  const wobble =
    hashString(
      `${yourName}|${theirName}|${yourSign}|${theirSign}|zodiac-vibe`
    ) % 21; // 0–20
  // Center wobble around base ±10
  const score = base - 10 + wobble;
  return Math.max(1, Math.min(99, score));
}
