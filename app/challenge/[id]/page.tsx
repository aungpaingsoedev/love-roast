"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { NameForm } from "@/components/NameForm";
import { LoadingAnalysis } from "@/components/LoadingAnalysis";
import { decodeChallenge, encodeResult } from "@/lib/share";
import { generateTestResult } from "@/lib/result-generator";
import { getTest } from "@/lib/tests";
import { useI18n } from "@/lib/i18n";
import type { CoupleInput } from "@/lib/types";

export default function ChallengePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { t, lang } = useI18n();
  const id = typeof params.id === "string" ? params.id : "";
  const challenge = useMemo(() => (id ? decodeChallenge(id) : null), [id]);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);

  if (!challenge) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-black">{t.challenge.expiredTitle}</h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          {t.challenge.expiredDesc}
        </p>
        <Link href="/" className="btn-chaos mt-8 inline-flex">
          {t.challenge.goHome}
        </Link>
      </div>
    );
  }

  const test = getTest(challenge.test, lang);

  const onSubmit = (data: CoupleInput) => {
    const input: CoupleInput = {
      ...data,
      theirName: challenge.challengerName,
    };
    const result = generateTestResult(challenge.test, input, { lang });
    const rid = encodeResult({
      v: 1,
      test: challenge.test,
      yourName: input.yourName,
      theirName: input.theirName,
      status: input.status,
      result,
      createdAt: Date.now(),
      fromChallenge: true,
    });
    setResultId(rid);
    setLoading(true);
  };

  if (loading && resultId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-14">
        <LoadingAnalysis onComplete={() => router.push(`/result/${resultId}`)} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <div className="glass mb-8 rounded-3xl p-6 text-center sm:p-8">
        <p className="text-4xl" aria-hidden>
          👀
        </p>
        <h1 className="mt-3 font-display text-3xl font-black leading-relaxed">
          {t.challenge.header}
        </h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          <span className="font-bold text-rose-600">{challenge.challengerName}</span>{" "}
          {t.challenge.description}{" "}
          <span className="font-semibold text-rose-950">
            {test?.emoji} {test?.title ?? t.common.appName}
          </span>
        </p>
        {!accepted ? (
          <button type="button" className="btn-chaos mt-6" onClick={() => setAccepted(true)}>
            {t.challenge.acceptButton}
          </button>
        ) : null}
      </div>

      {accepted ? (
        <div className="space-y-4">
          <p className="text-center text-sm font-semibold text-rose-600 leading-relaxed">
            {t.challenge.enterPrompt}
          </p>
          <NameForm
            onSubmit={onSubmit}
            defaultTheirName={challenge.challengerName}
            lockTheirName
            submitLabel={t.form.challengeSubmitButton}
          />
        </div>
      ) : null}
    </div>
  );
}
