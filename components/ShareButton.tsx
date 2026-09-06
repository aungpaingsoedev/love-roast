"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Copy, Download, Share2 } from "lucide-react";
import {
  absoluteUrl,
  copyText,
  encodeChallenge,
  challengePath,
  resultPath,
  shareOrCopy,
} from "@/lib/share";
import type { StoredResultPayload, TestSlug } from "@/lib/types";
import { getTest } from "@/lib/tests";
import { useI18n } from "@/lib/i18n";

/** Story-friendly export size (CSS pixels). Keep fixed — % widths break html-to-image. */
const CARD_W = 360;
const CARD_H = 640;
const EXPORT_RATIO = 3;

interface ShareButtonProps {
  payload: StoredResultPayload;
  resultId: string;
  headline: string;
  subline: string;
}

export function ShareButton({ payload, resultId, headline, subline }: ShareButtonProps) {
  const { t, lang } = useI18n();
  const cardRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const test = getTest(payload.test, lang);
  const url = absoluteUrl(resultPath(resultId));

  const shareText = `${headline}\n${subline}\n\n❤️ ${t.common.appName} — ${t.common.tagline}`;

  async function handleShare() {
    const result = await shareOrCopy({
      title: test?.title ?? t.common.appName,
      text: shareText,
      url,
    });
    setStatus(
      result === "shared"
        ? t.result.shareStatus.shared
        : result === "copied"
          ? t.result.shareStatus.copied
          : t.result.shareStatus.failed
    );
  }

  async function handleCopy() {
    const ok = await copyText(url);
    setStatus(ok ? t.result.shareStatus.copied : t.result.shareStatus.clipboardFailed);
  }

  async function handleDownload() {
    const node = cardRef.current;
    if (!node) {
      setStatus(t.result.shareStatus.downloadFailed);
      return;
    }
    setDownloading(true);
    try {
      // Wait a frame so fonts/layout settle before capture
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: EXPORT_RATIO,
        width: CARD_W,
        height: CARD_H,
        canvasWidth: CARD_W * EXPORT_RATIO,
        canvasHeight: CARD_H * EXPORT_RATIO,
        backgroundColor: "#be123c",
        style: {
          width: `${CARD_W}px`,
          height: `${CARD_H}px`,
          margin: "0",
          transform: "none",
          maxWidth: "none",
          left: "0",
          top: "0",
        },
      });

      const link = document.createElement("a");
      link.download = `loveroast-${payload.test}.png`;
      link.href = dataUrl;
      link.click();
      setStatus(t.result.shareStatus.downloadSuccess);
    } catch {
      setStatus(t.result.shareStatus.downloadFailed);
    } finally {
      setDownloading(false);
    }
  }

  function handleChallenge() {
    const id = encodeChallenge({
      v: 1,
      challengerName: payload.yourName,
      test: payload.test as TestSlug,
      createdAt: Date.now(),
    });
    const challengeUrl = absoluteUrl(challengePath(id));
    void copyText(challengeUrl).then((ok) =>
      setStatus(ok ? t.result.shareStatus.challengeCopied : t.result.shareStatus.failed)
    );
  }

  return (
    <div className="space-y-4">
      {/* Scale wrapper for small screens — NEVER put transform on the capture node */}
      <div className="flex justify-center overflow-x-auto">
        <div
          className="shrink-0 overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
          style={{ width: CARD_W }}
        >
          <div
            ref={cardRef}
            className="flex flex-col justify-between text-white"
            style={{
              width: CARD_W,
              height: CARD_H,
              boxSizing: "border-box",
              padding: 28,
              background:
                "linear-gradient(145deg, #be123c 0%, #db2777 48%, #ea580c 100%)",
              // Override html[lang=my] keep-all so long Myanmar lines wrap in-card
              wordBreak: "normal",
              overflowWrap: "anywhere",
            }}
          >
            <div className="min-w-0">
              <p className="text-sm font-bold opacity-90">
                {test?.emoji} {test?.title ?? t.common.appName}
              </p>
              <p className="mt-5 break-words font-display text-[1.65rem] font-black leading-snug">
                <span className="block">{payload.yourName}</span>
                <span className="my-1 block text-lg font-bold opacity-80">vs</span>
                <span className="block">{payload.theirName}</span>
              </p>
            </div>

            <div className="min-w-0 rounded-3xl bg-black/30 p-5">
              <p className="break-words font-display text-xl font-extrabold leading-snug">
                {headline}
              </p>
              <p className="mt-3 break-words text-[0.95rem] leading-relaxed opacity-95">
                {subline}
              </p>
            </div>

            <div className="min-w-0">
              <p className="font-display text-xl font-black">❤️ {t.common.appName}</p>
              <p className="mt-1 break-words text-sm leading-snug opacity-90">
                {t.result.shareCardTagline}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button type="button" onClick={handleShare} className="btn-chaos px-3 py-3 text-sm">
          <Share2 className="size-4" /> {t.result.shareBtn}
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="btn-secondary-chaos px-3 py-3 text-sm"
        >
          <Copy className="size-4" /> {t.result.copyBtn}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="btn-secondary-chaos px-3 py-3 text-sm disabled:opacity-60"
        >
          <Download className="size-4" /> {t.result.downloadBtn}
        </button>
        <button
          type="button"
          onClick={handleChallenge}
          className="btn-secondary-chaos px-3 py-3 text-sm"
        >
          {t.result.challengeBtn}
        </button>
      </div>
      {status ? (
        <p className="text-center text-sm font-medium text-rose-700" role="status">
          {status}
        </p>
      ) : null}
    </div>
  );
}
