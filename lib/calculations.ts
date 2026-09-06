/**
 * Deterministic pseudo-random helpers.
 * Same names + salt always produce the same scores — no true randomness.
 */

export function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function collapseName(name: string): string {
  return normalizeName(name).replace(/\s+/g, "");
}

export function coupleKey(name1: string, name2: string, salt = ""): string {
  return `${normalizeName(name1)}|${normalizeName(name2)}|${salt}`;
}

function isMinKhant(name: string): boolean {
  const n = normalizeName(name);
  const c = collapseName(name);
  return n.includes("min khant") || c.includes("minkhant");
}

function isShweYi(name: string): boolean {
  const n = normalizeName(name);
  const c = collapseName(name);
  return n.includes("shwe yi") || c.includes("shweyi");
}

function isAungPaing(name: string): boolean {
  const n = normalizeName(name);
  const c = collapseName(name);
  return n.includes("aung paing") || c.includes("aungpaing");
}

function isPaired(
  name1: string,
  name2: string,
  matchA: (n: string) => boolean,
  matchB: (n: string) => boolean
): boolean {
  return (matchA(name1) && matchB(name2)) || (matchA(name2) && matchB(name1));
}

/** Min Khant (Aung) ↔ Shwe Yi (Mon) — any order / casing / short form. */
export function isCursedCouple(name1: string, name2: string): boolean {
  return isPaired(name1, name2, isMinKhant, isShweYi);
}

/** Aung Paing (Soe) ↔ Shwe Yi (Mon) — any order / casing / short form / no spaces. */
export function isBlessedCouple(name1: string, name2: string): boolean {
  return isPaired(name1, name2, isAungPaing, isShweYi);
}

export type ScorePolarity = "good" | "bad";

/**
 * Inclusive integer score in [min, max].
 * - blessed (Aung Paing × Shwe Yi): good→88–99, bad→1–12
 *   exception: jealousy salts → 88–99 (သဝန်တိုမှု always high)
 * - cursed (Min Khant × Shwe Yi): good→1–12, bad→88–99
 */
export function scoreFrom(
  name1: string,
  name2: string,
  salt: string,
  min = 0,
  max = 100,
  polarity: ScorePolarity = "good"
): number {
  const roll = hashString(coupleKey(name1, name2, `${polarity}-${salt}`));
  const low = 1 + (roll % 12); // 1–12
  const high = 88 + (roll % 12); // 88–99
  const isJealousySalt = salt.toLowerCase().includes("jealous");

  if (isCursedCouple(name1, name2)) {
    return polarity === "bad" ? high : low;
  }

  if (isBlessedCouple(name1, name2)) {
    // Romance looks healthy… except jealousy is max chaos 👀
    if (isJealousySalt) return high;
    return polarity === "bad" ? low : high;
  }

  const span = max - min + 1;
  return min + (hashString(coupleKey(name1, name2, salt)) % span);
}

export function pickFrom<T>(items: readonly T[], name1: string, name2: string, salt: string): T {
  const idx = hashString(coupleKey(name1, name2, salt)) % items.length;
  return items[idx]!;
}

export function biasToward(
  name1: string,
  name2: string,
  salt: string
): "you" | "them" {
  return hashString(coupleKey(name1, name2, salt)) % 100 >= 50 ? "you" : "them";
}

export function complementaryScore(primary: number, variance: number): number {
  const raw = 100 - primary + variance;
  return Math.max(0, Math.min(100, raw));
}
