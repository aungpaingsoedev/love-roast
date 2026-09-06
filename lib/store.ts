"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CoupleInput, RelationshipStatus, TestSlug, ZodiacSign } from "@/lib/types";

type Language = "en" | "my";

interface LoveRoastState {
  language: Language;
  setLanguage: (lang: Language) => void;
  yourName: string;
  theirName: string;
  status?: RelationshipStatus;
  yourZodiac?: ZodiacSign;
  theirZodiac?: ZodiacSign;
  lastTest?: TestSlug;
  setCouple: (input: CoupleInput) => void;
  setLastTest: (slug: TestSlug) => void;
  clear: () => void;
}

export const useLoveStore = create<LoveRoastState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (lang) => set({ language: lang }),
      yourName: "",
      theirName: "",
      setCouple: (input) =>
        set({
          yourName: input.yourName,
          theirName: input.theirName,
          status: input.status,
          yourZodiac: input.yourZodiac,
          theirZodiac: input.theirZodiac,
        }),
      setLastTest: (slug) => set({ lastTest: slug }),
      clear: () =>
        set({
          yourName: "",
          theirName: "",
          status: undefined,
          yourZodiac: undefined,
          theirZodiac: undefined,
          lastTest: undefined,
        }),
    }),
    { name: "loveroast-store" }
  )
);

export function coupleFromStore(state: LoveRoastState): CoupleInput | null {
  if (!state.yourName.trim() || !state.theirName.trim()) return null;
  return {
    yourName: state.yourName.trim(),
    theirName: state.theirName.trim(),
    status: state.status,
    yourZodiac: state.yourZodiac,
    theirZodiac: state.theirZodiac,
  };
}
