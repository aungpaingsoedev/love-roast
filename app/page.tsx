"use client";

import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FloatingDecor } from "@/components/AnimatedHeart";
import { TestCard } from "@/components/TestCard";
import { TipDeveloper } from "@/components/TipDeveloper";
import { getLocalizedTests } from "@/lib/tests";
import { useI18n } from "@/lib/i18n";

export default function HomePage() {
  const { t, lang } = useI18n();
  const allTests = getLocalizedTests(lang);
  const popular = allTests.filter((item) => item.popular);

  return (
    <div className="relative overflow-hidden">
      {/* HERO */}
      <section className="relative mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-16">
        <FloatingDecor />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="font-display text-4xl font-black sm:text-5xl md:text-6xl">
            ❤️ {t.common.appName}
          </p>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-relaxed text-rose-950 sm:text-5xl">
            {t.hero.titleLine1}
            <br />
            <span className="gradient-text">{t.hero.titleLine2}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t.hero.subtitle}
          </p>
          <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Link href="/test/love-calculator" className="btn-chaos w-full px-5 sm:w-auto">
              {t.hero.ctaTest}
            </Link>
            <Link href="/test/roast" className="btn-secondary-chaos w-full px-5 sm:w-auto">
              {t.hero.ctaRoast}
            </Link>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            {t.hero.disclaimer}
          </p>
        </div>
      </section>

      {/* POPULAR */}
      <section id="popular" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-6 text-center">
          <h2 className="font-display text-3xl font-black">{t.sections.popularTitle}</h2>
          <p className="mt-2 text-muted-foreground">{t.sections.popularSubtitle}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((test) => (
            <TestCard key={test.slug} test={test} />
          ))}
        </div>
      </section>

      {/* ALL TESTS */}
      <section id="tests" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-6 text-center">
          <h2 className="font-display text-3xl font-black">{t.sections.allTestsTitle}</h2>
          <p className="mt-2 text-muted-foreground">{t.sections.allTestsSubtitle}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allTests.map((test) => (
            <TestCard key={test.slug} test={test} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-black">{t.sections.howItWorksTitle}</h2>
        </div>
        <ol className="grid gap-4 md:grid-cols-3">
          {[
            {
              n: "1️⃣",
              t: t.sections.howStep1Title,
              d: t.sections.howStep1Desc,
            },
            {
              n: "2️⃣",
              t: t.sections.howStep2Title,
              d: t.sections.howStep2Desc,
            },
            {
              n: "3️⃣",
              t: t.sections.howStep3Title,
              d: t.sections.howStep3Desc,
            },
          ].map((step) => (
            <li key={step.t} className="glass rounded-3xl p-6 text-center">
              <p className="text-3xl" aria-hidden>
                {step.n}
              </p>
              <h3 className="mt-3 font-display text-xl font-extrabold">{step.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* WHY */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="glass rounded-3xl p-6 sm:p-10">
          <h2 className="text-center font-display text-3xl font-black">{t.sections.whyTitle}</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                e: "📸",
                t: t.sections.why1Title,
                d: t.sections.why1Desc,
              },
              {
                e: "😂",
                t: t.sections.why2Title,
                d: t.sections.why2Desc,
              },
              {
                e: "⚡",
                t: t.sections.why3Title,
                d: t.sections.why3Desc,
              },
            ].map((item) => (
              <li key={item.t} className="text-center">
                <p className="text-3xl">{item.e}</p>
                <h3 className="mt-2 font-display text-xl font-extrabold">{item.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <TipDeveloper />
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-center font-display text-3xl font-black">{t.sections.faqTitle}</h2>
        <Accordion>
          {t.faq.map((item, i) => (
            <AccordionItem key={item.q} value={`faq-${i}`}>
              <AccordionTrigger className="leading-relaxed">{item.q}</AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-br from-rose-600 via-pink-500 to-orange-400 p-8 text-center text-white shadow-xl sm:p-12">
          <h2 className="font-display text-3xl font-black sm:text-4xl leading-relaxed">
            {t.sections.finalCtaTitle}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-white/90 leading-relaxed">
            {t.sections.finalCtaSubtitle}
          </p>
          <Link
            href="/test/who-is-the-problem"
            className="mt-6 inline-flex rounded-2xl bg-white px-6 py-3 text-base font-bold text-rose-600 shadow-lg transition hover:bg-rose-50"
          >
            {t.sections.finalCtaButton}
          </Link>
        </div>
      </section>
    </div>
  );
}
