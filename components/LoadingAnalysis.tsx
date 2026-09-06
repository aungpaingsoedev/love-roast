"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ProgressBar } from "@/components/ProgressBar";
import { useI18n } from "@/lib/i18n";

interface LoadingAnalysisProps {
  onComplete: () => void;
  durationMs?: number;
}

export function LoadingAnalysis({ onComplete, durationMs = 4200 }: LoadingAnalysisProps) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(reduce ? 100 : 8);

  const messages = useMemo(() => t.loading.messages, [t]);

  useEffect(() => {
    if (reduce) {
      const timeout = setTimeout(onComplete, 400);
      return () => clearTimeout(timeout);
    }

    const start = Date.now();
    const tick = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);
      const msgIndex = Math.min(
        messages.length - 1,
        Math.floor((elapsed / durationMs) * messages.length)
      );
      setIndex(msgIndex);
      if (elapsed >= durationMs) {
        window.clearInterval(tick);
        onComplete();
      }
    }, 120);

    return () => window.clearInterval(tick);
  }, [durationMs, messages.length, onComplete, reduce]);

  return (
    <div className="glass mx-auto w-full max-w-md rounded-3xl p-6 text-center sm:p-8">
      <motion.div
        className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-orange-400 text-3xl shadow-lg"
        animate={reduce ? undefined : { rotate: [0, 8, -8, 0], scale: [1, 1.06, 1] }}
        transition={{ repeat: Infinity, duration: 1.6 }}
        aria-hidden
      >
        🔍
      </motion.div>
      <p className="mb-2 text-xs font-bold tracking-widest text-rose-500 uppercase">
        {t.loading.badge}
      </p>
      <div className="relative mb-6 min-h-[4.5rem]">
        <AnimatePresence mode="wait">
          <motion.p
            key={messages[index]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-lg font-bold text-rose-950 sm:text-xl leading-relaxed"
            role="status"
            aria-live="polite"
          >
            {messages[index]}
          </motion.p>
        </AnimatePresence>
      </div>
      <ProgressBar value={progress} showValue label={t.loading.progressLabel} />
      <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
        {t.loading.disclaimer}
      </p>
    </div>
  );
}
