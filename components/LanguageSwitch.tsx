"use client";

import { cn } from "@/lib/utils";
import { useI18n, type Language } from "@/lib/i18n";

interface LanguageSwitchProps {
  className?: string;
  variant?: "pill" | "compact";
}

export function LanguageSwitch({ className, variant = "pill" }: LanguageSwitchProps) {
  const { lang, setLang } = useI18n();

  function toggleLang(target: Language) {
    setLang(target);
    document.documentElement.lang = target === "my" ? "my" : "en";
  }

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={() => toggleLang(lang === "my" ? "en" : "my")}
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-rose-200 bg-white/90 px-2.5 py-1.5 text-xs font-bold text-rose-900 transition hover:bg-rose-50 active:scale-95",
          className
        )}
        aria-label="Toggle language"
      >
        <span>{lang === "my" ? "English" : "မြန်မာ"}</span>
      </button>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-rose-200 bg-white/90 p-0.5 text-xs font-bold",
        className
      )}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => toggleLang("my")}
        className={cn(
          "rounded-full px-2.5 py-1.5 transition",
          lang === "my"
            ? "bg-gradient-to-r from-rose-500 to-orange-400 text-white shadow-sm"
            : "text-rose-900/70 hover:text-rose-950"
        )}
        aria-pressed={lang === "my"}
      >
        မြန်မာ
      </button>
      <button
        type="button"
        onClick={() => toggleLang("en")}
        className={cn(
          "rounded-full px-2.5 py-1.5 transition",
          lang === "en"
            ? "bg-gradient-to-r from-rose-500 to-orange-400 text-white shadow-sm"
            : "text-rose-900/70 hover:text-rose-950"
        )}
        aria-pressed={lang === "en"}
      >
        English
      </button>
    </div>
  );
}
