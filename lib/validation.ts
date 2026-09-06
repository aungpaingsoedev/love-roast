import { z } from "zod";
import { getDictionary, type Language } from "@/lib/i18n";

export const relationshipStatuses = [
  "crush",
  "talking",
  "dating",
  "best-friends",
  "complicated",
  "married",
  "unknown",
] as const;

export const zodiacSigns = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
] as const;

/** Letters A–Z only, plus spaces / hyphens / apostrophes for English names. */
export const ENGLISH_NAME_REGEX = /^[A-Za-z]+(?:[ '\-][A-Za-z]+)*$/;

/** Strip anything that is not an English letter, space, hyphen, or apostrophe. */
export function sanitizeEnglishName(value: string): string {
  return value.replace(/[^A-Za-z '\-]/g, "").replace(/\s{2,}/g, " ");
}

export function getNameFormSchema(
  lang: Language = "en",
  options?: { requireZodiac?: boolean }
) {
  const dict = getDictionary(lang);
  const requireZodiac = options?.requireZodiac ?? false;

  const base = z.object({
    yourName: z
      .string()
      .trim()
      .min(1, dict.validation.yourNameRequired)
      .max(30, dict.validation.yourNameTooLong)
      .regex(ENGLISH_NAME_REGEX, dict.validation.yourNameEnglishOnly),
    theirName: z
      .string()
      .trim()
      .min(1, dict.validation.theirNameRequired)
      .max(30, dict.validation.theirNameTooLong)
      .regex(ENGLISH_NAME_REGEX, dict.validation.theirNameEnglishOnly),
    status: z.enum(relationshipStatuses).optional(),
    yourZodiac: z.union([z.enum(zodiacSigns), z.literal("")]).optional(),
    theirZodiac: z.union([z.enum(zodiacSigns), z.literal("")]).optional(),
  });

  if (!requireZodiac) return base;

  return base.superRefine((data, ctx) => {
    if (!data.yourZodiac) {
      ctx.addIssue({
        code: "custom",
        path: ["yourZodiac"],
        message: dict.validation.zodiacRequired,
      });
    }
    if (!data.theirZodiac) {
      ctx.addIssue({
        code: "custom",
        path: ["theirZodiac"],
        message: dict.validation.zodiacRequired,
      });
    }
  });
}

export const nameFormSchema = z.object({
  yourName: z
    .string()
    .trim()
    .min(1, "Name required")
    .max(30, "Name too long")
    .regex(ENGLISH_NAME_REGEX, "English letters only"),
  theirName: z
    .string()
    .trim()
    .min(1, "Their name required")
    .max(30, "Name too long")
    .regex(ENGLISH_NAME_REGEX, "English letters only"),
  status: z.enum(relationshipStatuses).optional(),
  yourZodiac: z.union([z.enum(zodiacSigns), z.literal("")]).optional(),
  theirZodiac: z.union([z.enum(zodiacSigns), z.literal("")]).optional(),
});

export type NameFormValues = z.infer<typeof nameFormSchema>;

export function getStatusLabels(lang: Language = "en"): Record<(typeof relationshipStatuses)[number], string> {
  const dict = getDictionary(lang);
  return dict.relationshipStatuses;
}

export function getZodiacLabels(lang: Language = "en"): Record<(typeof zodiacSigns)[number], string> {
  const dict = getDictionary(lang);
  return dict.zodiacSigns;
}

export const STATUS_LABELS: Record<(typeof relationshipStatuses)[number], string> = {
  crush: "Crushing 😍",
  talking: "Talking stage 💬",
  dating: "In a relationship ❤️",
  "best-friends": "Best friends 🤝",
  complicated: "It's complicated 🌀",
  married: "Married 💍",
  unknown: "We don't know either 💀",
};

export const ZODIAC_LABELS: Record<(typeof zodiacSigns)[number], string> = {
  aries: "♈ Aries",
  taurus: "♉ Taurus",
  gemini: "♊ Gemini",
  cancer: "♋ Cancer",
  leo: "♌ Leo",
  virgo: "♍ Virgo",
  libra: "♎ Libra",
  scorpio: "♏ Scorpio",
  sagittarius: "♐ Sagittarius",
  capricorn: "♑ Capricorn",
  aquarius: "♒ Aquarius",
  pisces: "♓ Pisces",
};
