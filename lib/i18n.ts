"use client";

import { useEffect, useState } from "react";
import en from "@/lib/locales/en.json";
import my from "@/lib/locales/my.json";
import { useLoveStore } from "@/lib/store";

export type Language = "en" | "my";

export const LOCALES = {
  en,
  my,
} as const;

export type TranslationSchema = typeof en;

export function getDictionary(lang: Language = "en"): TranslationSchema {
  return (LOCALES[lang] ?? LOCALES.en) as TranslationSchema;
}

export function useI18n() {
  const language = useLoveStore((s) => s.language);
  const setLanguage = useLoveStore((s) => s.setLanguage);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Default EN before mount to avoid SSR/client hydration mismatch
  const activeLang: Language = mounted ? language || "en" : "en";
  const t = (LOCALES[activeLang] ?? LOCALES.en) as TranslationSchema;

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = activeLang === "my" ? "my" : "en";
  }, [activeLang, mounted]);

  return {
    lang: activeLang,
    setLang: setLanguage,
    t,
    isMounted: mounted,
  };
}
