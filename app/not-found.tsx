"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <p className="text-5xl" aria-hidden>💀</p>
      <h1 className="mt-4 font-display text-3xl font-black">
        {t.result.resultMissing}
      </h1>
      <p className="mt-3 text-muted-foreground leading-relaxed">
        {t.result.resultMissingDesc}
      </p>
      <Link href="/" className="btn-chaos mt-8 inline-flex">
        {t.challenge.goHome}
      </Link>
    </div>
  );
}
