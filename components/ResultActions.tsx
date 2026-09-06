"use client";

import Link from "next/link";
import type { TestSlug } from "@/lib/types";
import { getLocalizedTests } from "@/lib/tests";
import { useI18n } from "@/lib/i18n";

interface ResultActionsProps {
  currentTest: TestSlug;
}

export function ResultActions({ currentTest }: ResultActionsProps) {
  const { t, lang } = useI18n();
  const tests = getLocalizedTests(lang);
  const next = tests.filter((item) => item.slug !== currentTest).slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href={`/test/${currentTest}`} className="btn-chaos flex-1 text-center">
          {t.common.tryAgain}
        </Link>
        <Link href="/#tests" className="btn-secondary-chaos flex-1 text-center">
          {t.common.moreChaos}
        </Link>
      </div>
      <div>
        <p className="mb-2 text-sm font-bold text-rose-500 uppercase tracking-wide">
          {t.result.peopleAlso}
        </p>
        <div className="flex flex-wrap gap-2">
          {next.map((item) => (
            <Link
              key={item.slug}
              href={item.href}
              className="rounded-full border border-rose-200 bg-white/70 px-3 py-1.5 text-sm font-semibold hover:border-rose-400"
            >
              {item.emoji} {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
