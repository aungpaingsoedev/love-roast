"use client";

import { ResultCard } from "@/components/ResultCard";

interface RoastCardProps {
  yourName: string;
  theirName: string;
  paragraphs: string[];
}

export function RoastCard({ yourName, theirName, paragraphs }: RoastCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-rose-200 shadow-xl">
      <div className="bg-gradient-to-r from-rose-600 via-orange-500 to-amber-400 px-5 py-4 text-white">
        <p className="text-xs font-bold tracking-[0.25em] uppercase">Full roast</p>
        <h2 className="font-display text-2xl font-black">
          {yourName} & {theirName}
        </h2>
      </div>
      <div className="space-y-3 bg-rose-950 p-5 text-rose-50 sm:p-6">
        {paragraphs.map((p) => (
          <p key={p} className="text-base leading-relaxed sm:text-lg">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}

export { ResultCard };
