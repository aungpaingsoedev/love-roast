"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { TestMeta } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

interface TestCardProps {
  test: TestMeta;
  className?: string;
}

function ChaosDots({ level, label }: { level: number; label: string }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${label} ${level} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "size-1.5 rounded-full",
            i < level ? "bg-orange-500" : "bg-rose-200"
          )}
        />
      ))}
    </div>
  );
}

export function TestCard({ test, className }: TestCardProps) {
  const { t } = useI18n();

  // Pick localized title and description if available
  const localized = t.tests[test.slug as keyof typeof t.tests];
  const title = localized?.title ?? test.title;
  const description = localized?.description ?? test.description;

  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn("h-full", className)}
    >
      <Link
        href={test.href}
        className="glass group flex h-full flex-col rounded-3xl p-5 transition hover:border-rose-300 hover:shadow-xl hover:shadow-rose-200/40"
      >
        <div className="mb-3 flex items-start justify-between gap-2">
          <span className="text-3xl" aria-hidden>
            {test.emoji}
          </span>
          <div className="text-right">
            <p className="text-[10px] font-bold tracking-wider text-orange-500 uppercase">
              {t.common.chaos}
            </p>
            <ChaosDots level={test.chaos} label={t.common.chaos} />
          </div>
        </div>
        <h3 className="font-display text-lg font-extrabold text-rose-950 group-hover:text-rose-600">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
        <div className="mt-4">
          <span className="text-sm font-bold text-rose-600">{t.common.startChaos}</span>
        </div>
      </Link>
    </motion.article>
  );
}
