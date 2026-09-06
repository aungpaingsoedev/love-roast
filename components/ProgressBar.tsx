"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  barClassName?: string;
  label?: string;
  showValue?: boolean;
}

export function ProgressBar({
  value,
  className,
  barClassName,
  label,
  showValue = true,
}: ProgressBarProps) {
  const reduce = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between gap-2 text-sm font-semibold">
          {label ? <span>{label}</span> : <span />}
          {showValue ? <span className="tabular-nums text-rose-600">{clamped}%</span> : null}
        </div>
      )}
      <div
        className="h-3 overflow-hidden rounded-full bg-rose-100/80"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
      >
        <motion.div
          className={cn(
            "h-full rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400",
            barClassName
          )}
          initial={reduce ? { width: `${clamped}%` } : { width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: reduce ? 0 : 1.1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
