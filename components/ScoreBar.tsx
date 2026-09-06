"use client";

import { ProgressBar } from "@/components/ProgressBar";
import { cn } from "@/lib/utils";

interface ScoreBarProps {
  emoji?: string;
  label: string;
  score: number;
  className?: string;
  barClassName?: string;
}

export function ScoreBar({ emoji, label, score, className, barClassName }: ScoreBarProps) {
  return (
    <div className={cn("rounded-2xl border border-rose-100/80 bg-white/50 p-3", className)}>
      <ProgressBar
        value={score}
        label={`${emoji ? `${emoji} ` : ""}${label}`}
        barClassName={barClassName}
      />
    </div>
  );
}
