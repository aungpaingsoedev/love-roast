"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { NameForm } from "@/components/NameForm";
import { LoadingAnalysis } from "@/components/LoadingAnalysis";
import { generateTestResult } from "@/lib/result-generator";
import { encodeResult } from "@/lib/share";
import { useLoveStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import type { CoupleInput, TestSlug } from "@/lib/types";

interface TestFlowProps {
  slug: TestSlug;
  title: string;
  emoji: string;
  blurb: string;
}

type Phase = "form" | "questions" | "loading";

export function TestFlow({ slug, title, emoji, blurb }: TestFlowProps) {
  const router = useRouter();
  const { t, lang } = useI18n();
  const setLastTest = useLoveStore((s) => s.setLastTest);
  const [phase, setPhase] = useState<Phase>("form");
  const [couple, setCouple] = useState<CoupleInput | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [resultId, setResultId] = useState<string | null>(null);

  // Pick localized title and description if available
  const localized = t.tests[slug as keyof typeof t.tests];
  const activeTitle = localized?.title ?? title;
  const activeBlurb = localized?.description ?? blurb;

  const finish = useCallback(
    (input: CoupleInput, extraAnswers?: Record<string, string>) => {
      const result = generateTestResult(slug, input, {
        answers: extraAnswers,
        premium: true,
        lang,
      });
      const id = encodeResult({
        v: 1,
        test: slug,
        yourName: input.yourName,
        theirName: input.theirName,
        status: input.status,
        result,
        createdAt: Date.now(),
      });
      setLastTest(slug);
      setResultId(id);
      setPhase("loading");
    },
    [lang, setLastTest, slug]
  );

  const onNames = (data: CoupleInput) => {
    setCouple(data);
    if (slug === "red-flags") {
      setPhase("questions");
      return;
    }
    finish(data);
  };

  const onLoadingDone = useCallback(() => {
    if (resultId) router.push(`/result/${resultId}`);
  }, [resultId, router]);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-8 text-center">
        <p className="text-4xl" aria-hidden>
          {emoji}
        </p>
        <h1 className="mt-2 font-display text-3xl font-black text-rose-950 sm:text-4xl leading-relaxed">
          {activeTitle}
        </h1>
        <p className="mt-2 text-muted-foreground leading-relaxed">{activeBlurb}</p>
      </div>

      {phase === "form" ? (
        <NameForm onSubmit={onNames} requireZodiac={slug === "zodiac-check"} />
      ) : null}

      {phase === "questions" && couple ? (
        <RedFlagQuestions
          answers={answers}
          setAnswers={setAnswers}
          onBack={() => setPhase("form")}
          onSubmit={() => finish(couple, answers)}
        />
      ) : null}

      {phase === "loading" ? <LoadingAnalysis onComplete={onLoadingDone} /> : null}
    </div>
  );
}

function RedFlagQuestions({
  answers,
  setAnswers,
  onBack,
  onSubmit,
}: {
  answers: Record<string, string>;
  setAnswers: (v: Record<string, string>) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const { t } = useI18n();
  const questions = t.redFlags.questions;
  const unanswered = questions.filter((q) => !answers[q.id]);
  const ready = unanswered.length === 0;

  return (
    <div className="glass space-y-5 rounded-3xl p-5 sm:p-7">
      <p className="text-center text-sm font-bold text-rose-500 uppercase tracking-wide leading-relaxed">
        {t.redFlags.prompt}
      </p>
      {questions.map((q) => (
        <fieldset key={q.id} className="space-y-2">
          <legend className="text-base font-bold text-rose-950 leading-relaxed">{q.question}</legend>
          <div className="grid gap-2">
            {Object.entries(q.options).map(([val, label]) => {
              const selected = answers[q.id] === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAnswers({ ...answers, [q.id]: val })}
                  className={
                    selected
                      ? "rounded-2xl bg-gradient-to-r from-rose-500 to-orange-400 px-4 py-3 text-left text-sm font-semibold text-white"
                      : "rounded-2xl border border-rose-200 bg-white/70 px-4 py-3 text-left text-sm font-semibold hover:border-rose-400"
                  }
                  aria-pressed={selected}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
      <div className="flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={onBack} className="btn-secondary-chaos flex-1">
          {t.common.back}
        </button>
        <button
          type="button"
          disabled={!ready}
          onClick={onSubmit}
          className="btn-chaos flex-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t.redFlags.detectButton}
        </button>
      </div>
      {!ready ? (
        <p className="text-center text-xs text-muted-foreground leading-relaxed">
          {t.redFlags.unansweredWarning}
        </p>
      ) : null}
    </div>
  );
}
