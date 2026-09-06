"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ResultCard, getShareCopy } from "@/components/ResultCard";
import { ShareButton } from "@/components/ShareButton";
import { ResultActions } from "@/components/ResultActions";
import { TipDeveloper } from "@/components/TipDeveloper";
import { decodeResult } from "@/lib/share";
import { useI18n } from "@/lib/i18n";

export default function ResultPage() {
  const params = useParams<{ id: string }>();
  const id = typeof params.id === "string" ? params.id : "";
  const { t } = useI18n();

  const payload = useMemo(() => (id ? decodeResult(id) : null), [id]);

  if (!payload) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-5xl" aria-hidden>
          💀
        </p>
        <h1 className="mt-4 font-display text-3xl font-black">{t.result.resultMissing}</h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          {t.result.resultMissingDesc}
        </p>
        <Link href="/test/love-calculator" className="btn-chaos mt-8 inline-flex">
          {t.result.startNewTest}
        </Link>
      </div>
    );
  }

  const share = getShareCopy(payload.result, payload.yourName, payload.theirName, t);

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
      {payload.fromChallenge ? (
        <div className="rounded-3xl bg-gradient-to-r from-rose-600 to-orange-500 p-5 text-center text-white shadow-lg">
          <p className="font-display text-2xl font-black">{t.challenge.testedBannerTitle}</p>
          <p className="mt-2 text-sm text-white/95 leading-relaxed">
            {t.challenge.testedBannerDesc}
          </p>
        </div>
      ) : null}
      <ResultCard payload={payload} />
      <section className="space-y-3">
        <h2 className="text-center font-display text-2xl font-black">{t.result.shareTitle}</h2>
        <ShareButton
          payload={payload}
          resultId={id}
          headline={share.headline}
          subline={share.subline}
        />
      </section>
      <TipDeveloper />
      <ResultActions currentTest={payload.test} />
    </div>
  );
}
