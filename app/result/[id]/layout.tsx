import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your LoveRoast result",
  description: "LoveRoast relationship test result — entertainment only.",
  robots: { index: false, follow: true },
};

export default function ResultLayout({ children }: { children: React.ReactNode }) {
  return children;
}
