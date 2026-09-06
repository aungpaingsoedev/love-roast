"use client";

import { motion } from "framer-motion";
import { ScoreBar } from "@/components/ScoreBar";
import { ProgressBar } from "@/components/ProgressBar";
import type { StoredResultPayload, TestResult } from "@/lib/types";
import { useI18n, type TranslationSchema } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface ResultCardProps {
  payload: StoredResultPayload;
  className?: string;
}

export function getShareCopy(
  result: TestResult,
  yourName: string,
  theirName: string,
  t?: TranslationSchema
) {
  switch (result.type) {
    case "love-calculator":
      return {
        headline: `${result.overall}% ${t ? t.result.overallCompatibility : "compatibility"}`,
        subline: result.verdictTitle,
      };
    case "who-loves-who": {
      const winner = result.winner === "you" ? yourName : theirName;
      const winnerScore = result.winner === "you" ? result.youScore : result.themScore;
      return {
        headline: `🥇 ${winner} — ${winnerScore}%`,
        subline: result.cta,
      };
    }
    case "who-is-the-problem":
      return {
        headline: `🚨 The problem is ${result.culpritName}`,
        subline: result.roast,
      };
    case "red-flags":
      return {
        headline: `🚩 ${result.score}/100 ${t ? t.redFlags.scoreLabel : "Red Flags"}`,
        subline: result.verdict,
      };
    case "jealousy":
      return { headline: `👀 ${result.verdict}`, subline: result.roast };
    case "marriage":
      return {
        headline: `💍 ${result.marriageProbability}% ${t ? t.result.marriageProb : "marriage odds"}`,
        subline: result.recommendation,
      };
    case "delusional":
      return {
        headline:
          result.winner === "you"
            ? `${yourName} is more delusional`
            : `${theirName} wins the delusion cup`,
        subline: result.verdict,
      };
    case "breakup":
      return {
        headline: `💔 ${t ? t.result.breakupSimulator : "Breakup Simulator"}`,
        subline: result.reason,
      };
    case "zodiac-check":
      return {
        headline: `♈ ${result.compatibility}% ${t ? t.result.zodiacCompatibility : "zodiac compatibility"}`,
        subline: result.vibeTitle,
      };
    case "roast":
      return {
        headline: `🔥 ${t ? t.result.fullRoast : "Full Relationship Roast"}`,
        subline: result.paragraphs[1] ?? result.paragraphs[0] ?? "",
      };
    default:
      return {
        headline: t ? t.common.appName : "LoveRoast",
        subline: t ? t.common.tagline : "",
      };
  }
}

export function ResultCard({ payload, className }: ResultCardProps) {
  const { result, yourName, theirName } = payload;
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("glass space-y-6 rounded-3xl p-5 sm:p-8", className)}
    >
      <header className="text-center">
        <p className="text-xs font-bold tracking-[0.2em] text-rose-500 uppercase">
          {yourName} × {theirName}
        </p>
        <ResultHeadline result={result} yourName={yourName} theirName={theirName} />
      </header>
      <ResultBody result={result} yourName={yourName} theirName={theirName} />
      <p className="text-center text-xs text-muted-foreground">
        {t.common.entertainmentDisclaimer}
      </p>
    </motion.div>
  );
}

function ResultHeadline({
  result,
  yourName,
  theirName,
}: {
  result: TestResult;
  yourName: string;
  theirName: string;
}) {
  const { t } = useI18n();
  const copy = getShareCopy(result, yourName, theirName, t);
  return (
    <>
      <h1 className="mt-2 font-display text-3xl font-black text-rose-950 sm:text-4xl">
        {copy.headline}
      </h1>
      <p className="mt-3 text-base text-muted-foreground sm:text-lg">{copy.subline}</p>
    </>
  );
}

function ResultBody({
  result,
  yourName,
  theirName,
}: {
  result: TestResult;
  yourName: string;
  theirName: string;
}) {
  const { t } = useI18n();

  switch (result.type) {
    case "love-calculator":
      return (
        <div className="space-y-3">
          <div className="rounded-3xl bg-gradient-to-br from-rose-500 to-orange-400 p-6 text-center text-white shadow-lg">
            <p className="text-sm font-bold tracking-widest uppercase opacity-90">
              {t.result.overallCompatibility}
            </p>
            <p className="font-display text-6xl font-black tabular-nums">{result.overall}%</p>
            <p className="mt-2 font-semibold">{result.verdictBody}</p>
          </div>
          <div className="grid gap-2">
            {result.categories.map((c) => (
              <ScoreBar key={c.key} emoji={c.emoji} label={c.label} score={c.score} />
            ))}
          </div>
        </div>
      );

    case "who-loves-who":
      return (
        <div className="space-y-5">
          <p className="text-center font-display text-2xl font-black">{t.result.loveBattle}</p>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
            <div className="rounded-3xl bg-white/70 p-4 text-center">
              <p className="font-bold">{yourName}</p>
              <p className="font-display text-4xl font-black text-rose-600">{result.youScore}%</p>
              <ProgressBar value={result.youScore} showValue={false} />
            </div>
            <p className="text-center font-black text-orange-500">VS</p>
            <div className="rounded-3xl bg-white/70 p-4 text-center">
              <p className="font-bold">{theirName}</p>
              <p className="font-display text-4xl font-black text-fuchsia-600">{result.themScore}%</p>
              <ProgressBar
                value={result.themScore}
                showValue={false}
                barClassName="from-fuchsia-500 via-pink-500 to-orange-400"
              />
            </div>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-center">
            <p className="font-bold text-orange-700">{t.result.warning}</p>
            <p className="mt-1">{result.warning}</p>
            <p className="mt-2 font-semibold">{result.cta}</p>
          </div>
        </div>
      );

    case "who-is-the-problem":
      return (
        <div className="space-y-5 text-center">
          <p className="text-sm font-bold text-rose-500">{t.result.severeProblem}</p>
          <div className="rounded-3xl bg-gradient-to-br from-rose-600 to-orange-500 p-8 text-white shadow-xl">
            <p className="text-sm font-bold tracking-widest uppercase">{t.result.theProblemIs}</p>
            <p className="mt-2 font-display text-5xl font-black">{result.culpritName}</p>
            <p className="mt-2 text-3xl" aria-hidden>
              💀
            </p>
          </div>
          <div className="space-y-3 text-left">
            <ProgressBar
              label={result.culpritName}
              value={result.culpritPercent}
              barClassName="from-rose-600 to-red-500"
            />
            <ProgressBar
              label={result.innocentName}
              value={result.innocentPercent}
              barClassName="from-emerald-400 to-teal-500"
            />
          </div>
          <p className="text-lg font-semibold">&ldquo;{result.roast}&rdquo;</p>
        </div>
      );

    case "red-flags":
      return (
        <div className="space-y-4">
          <div className="rounded-3xl bg-rose-600 p-6 text-center text-white">
            <p className="text-sm font-bold tracking-widest uppercase">🚩 {t.redFlags.scoreLabel}</p>
            <p className="font-display text-5xl font-black">{result.score}/100</p>
            <p className="mt-2">{result.verdict}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FlagList title={t.redFlags.yourFlagsTitle} flags={result.yourFlags} />
            <FlagList title={t.redFlags.theirFlagsTitle} flags={result.theirFlags} />
          </div>
        </div>
      );

    case "jealousy":
      return (
        <div className="space-y-4">
          <p className="text-center font-display text-2xl font-black">{t.result.jealousyBattle}</p>
          <ScoreBar label={`${yourName}`} score={result.youScore} />
          <ScoreBar
            label={`${theirName}`}
            score={result.themScore}
            barClassName="from-fuchsia-500 via-violet-500 to-orange-400"
          />
        </div>
      );

    case "marriage":
      return (
        <div className="space-y-3">
          <p className="text-center font-display text-2xl font-black">{t.result.marriageAnalysis}</p>
          <ScoreBar emoji="💍" label={t.result.marriageProb} score={result.marriageProbability} />
          <ScoreBar emoji="💒" label={t.result.weddingProb} score={result.weddingProbability} />
          <ScoreBar emoji="🛋️" label={t.result.furnitureArg} score={result.furnitureArguing} />
          <ScoreBar emoji="🍜" label={t.result.foodArg} score={result.foodArguing} />
          <ScoreBar emoji="📄" label={t.result.divorceProb} score={result.divorceProbability} />
          <p className="rounded-2xl bg-orange-50 p-4 text-center font-semibold">
            {t.result.recommendedAction}: {result.recommendation}
          </p>
          <p className="text-center text-xs text-muted-foreground">
            {t.result.marriageDisclaimer}
          </p>
        </div>
      );

    case "delusional":
      return (
        <div className="space-y-4">
          <p className="text-center font-display text-2xl font-black">🧠 {t.tests.delusional.title}</p>
          <ScoreBar label={`${yourName}`} score={result.youScore} />
          <ScoreBar label={`${theirName}`} score={result.themScore} />
          <p className="text-center text-lg font-semibold">{result.verdict}</p>
        </div>
      );

    case "breakup":
      return (
        <div className="space-y-4 text-center">
          <p className="font-display text-2xl font-black">{t.result.breakupSimulator}</p>
          <div className="rounded-3xl bg-rose-950 p-6 text-white">
            <p className="text-sm font-bold tracking-widest uppercase opacity-80">
              {t.result.breakupReason}
            </p>
            <p className="mt-3 text-xl font-semibold">{result.reason}</p>
          </div>
          <p className="text-lg font-bold">
            {t.result.survivalProb}: {result.survivalProbability}%
          </p>
          <p className="rounded-2xl border border-dashed border-rose-300 bg-rose-50 p-3 text-sm">
            {result.disclaimer}
          </p>
        </div>
      );

    case "zodiac-check":
      return (
        <div className="space-y-4">
          <p className="text-center font-display text-2xl font-black">
            {t.result.zodiacCheckTitle}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-amber-200 bg-white/80 p-4 text-center">
              <p className="text-xs font-bold tracking-wider text-amber-700 uppercase">
                {yourName}
              </p>
              <p className="mt-1 font-display text-xl font-extrabold text-rose-950">
                {t.zodiacSigns[result.yourSign]}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t.zodiacData.elements[result.yourElement]}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-white/80 p-4 text-center">
              <p className="text-xs font-bold tracking-wider text-amber-700 uppercase">
                {theirName}
              </p>
              <p className="mt-1 font-display text-xl font-extrabold text-rose-950">
                {t.zodiacSigns[result.theirSign]}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t.zodiacData.elements[result.theirElement]}
              </p>
            </div>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-violet-500 to-orange-400 p-6 text-center text-white shadow-lg">
            <p className="text-sm font-bold tracking-widest uppercase opacity-90">
              {t.result.zodiacCompatibility}
            </p>
            <p className="font-display text-6xl font-black tabular-nums">
              {result.compatibility}%
            </p>
            <p className="mt-2 font-semibold">{result.vibeTitle}</p>
          </div>
          <div className="grid gap-2">
            {result.categories.map((c) => (
              <ScoreBar key={c.key} emoji={c.emoji} label={c.label} score={c.score} />
            ))}
          </div>
          <p className="rounded-2xl bg-violet-50 p-4 text-center text-base font-semibold text-violet-950">
            {result.roast}
          </p>
        </div>
      );

    case "roast":
      return (
        <div className="space-y-4">
          <p className="text-center font-display text-2xl font-black">{t.result.fullRoast}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <ScoreBar emoji="💕" label={t.roastData.categories.romance} score={result.loveScore} />
            <ScoreBar emoji="🚩" label={t.redFlags.scoreLabel} score={result.redFlagScore} />
            <ScoreBar emoji="👀" label={t.roastData.categories.jealousy} score={result.jealousyScore} />
            <ScoreBar emoji="😂" label={t.roastData.categories.humor} score={result.humorScore} />
            <ScoreBar emoji="🧠" label={t.tests.delusional.title} score={result.delusionScore} />
            <ScoreBar emoji="💬" label={t.roastData.categories.communication} score={result.communicationScore} />
            <ScoreBar emoji="💍" label={t.result.marriageProb} score={result.marriageScore} className="sm:col-span-2" />
          </div>
          <div className="space-y-3 rounded-3xl bg-rose-950 p-5 text-rose-50">
            {result.paragraphs.map((p) => (
              <p key={p} className="text-base leading-relaxed sm:text-lg">
                {p}
              </p>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
}

function FlagList({ title, flags }: { title: string; flags: string[] }) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white/60 p-4">
      <p className="mb-2 font-bold text-rose-700">{title}</p>
      <ul className="space-y-2 text-sm">
        {flags.map((f) => (
          <li key={f} className="flex gap-2">
            <span aria-hidden>🚩</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
