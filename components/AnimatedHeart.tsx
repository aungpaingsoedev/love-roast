"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedHeartProps {
  className?: string;
  delay?: number;
  size?: number;
  emoji?: string;
}

export function AnimatedHeart({
  className,
  delay = 0,
  size = 28,
  emoji = "❤️",
}: AnimatedHeartProps) {
  const reduce = useReducedMotion();

  return (
    <motion.span
      aria-hidden
      className={cn("pointer-events-none absolute select-none", className)}
      style={{ fontSize: size }}
      initial={reduce ? false : { y: 0, opacity: 0.35, scale: 0.8 }}
      animate={
        reduce
          ? { opacity: 0.5 }
          : {
              y: [0, -18, 0],
              opacity: [0.35, 0.9, 0.35],
              scale: [0.85, 1.1, 0.85],
              rotate: [-8, 8, -8],
            }
      }
      transition={{
        duration: 4.5,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    >
      {emoji}
    </motion.span>
  );
}

export function FloatingDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <AnimatedHeart className="top-[8%] left-[8%]" delay={0} emoji="❤️" size={26} />
      <AnimatedHeart className="top-[18%] right-[10%]" delay={0.6} emoji="😂" size={24} />
      <AnimatedHeart className="top-[42%] left-[4%]" delay={1.2} emoji="🔥" size={22} />
      <AnimatedHeart className="right-[6%] bottom-[22%]" delay={1.8} emoji="💀" size={22} />
      <AnimatedHeart className="bottom-[12%] left-[18%]" delay={0.9} emoji="💕" size={20} />
      <AnimatedHeart className="top-[30%] right-[28%]" delay={1.4} emoji="🚩" size={18} />
    </div>
  );
}
