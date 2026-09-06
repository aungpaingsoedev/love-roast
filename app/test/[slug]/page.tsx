import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TestFlow } from "@/components/TestFlow";
import { getTest, isValidSlug } from "@/lib/tests";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const test = getTest(slug);
  if (!test) {
    return { title: "Test not found" };
  }
  return {
    title: `${test.emoji} ${test.title}`,
    description: test.description,
    openGraph: {
      title: `${test.title} · LoveRoast`,
      description: test.description,
    },
  };
}

export function generateStaticParams() {
  return [
    { slug: "love-calculator" },
    { slug: "who-loves-who" },
    { slug: "who-is-the-problem" },
    { slug: "red-flags" },
    { slug: "jealousy" },
    { slug: "roast" },
    { slug: "marriage" },
    { slug: "delusional" },
    { slug: "breakup" },
    { slug: "zodiac-check" },
  ];
}

export default async function TestPage({ params }: PageProps) {
  const { slug } = await params;
  if (!isValidSlug(slug)) notFound();
  const test = getTest(slug)!;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <TestFlow slug={test.slug} title={test.title} emoji={test.emoji} blurb={test.description} />
    </div>
  );
}
