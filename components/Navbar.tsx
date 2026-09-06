"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitch } from "@/components/LanguageSwitch";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { t, lang } = useI18n();
  const isMy = lang === "my";

  const links = [
    { href: "/#tests", label: t.nav.tests },
    { href: "/#popular", label: t.nav.popular },
    { href: "/test/roast", label: t.nav.roasts },
    { href: "/#how", label: t.nav.howItWorks },
    { href: "/#tip", label: t.nav.tip },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-rose-200/60 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:gap-3 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap font-display text-xl font-extrabold tracking-tight"
        >
          <span aria-hidden>❤️</span>
          <span className="whitespace-nowrap">{t.common.appName}</span>
        </Link>

        {/* Desktop Nav — xl so Myanmar labels don't crush the logo/CTA */}
        <nav
          className="ml-auto hidden min-w-0 items-center xl:flex"
          aria-label="Main"
        >
          <div
            className={cn(
              "flex min-w-0 items-center",
              isMy ? "gap-2.5" : "gap-4"
            )}
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "whitespace-nowrap font-semibold text-rose-900/80 transition hover:text-rose-600",
                  isMy ? "text-xs" : "text-sm"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="ml-3 flex shrink-0 items-center gap-2 border-l border-rose-200/80 pl-3">
            <LanguageSwitch variant="compact" />

            <a
              href={t.common.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-rose-200/80 bg-white/80 text-rose-900/80 transition hover:bg-rose-50 hover:text-rose-950 active:scale-95"
              title="GitHub Repository"
              aria-label="GitHub Repository"
            >
              <GithubIcon className="size-4" />
            </a>

            <Link
              href="/test/love-calculator"
              className="btn-chaos shrink-0 whitespace-nowrap rounded-2xl px-3 py-2 text-sm shadow-md"
            >
              {t.common.startTest}
            </Link>
          </div>
        </nav>

        {/* Tablet / mobile controls (< xl) */}
        <div className="ml-auto flex shrink-0 items-center gap-2 xl:hidden">
          <LanguageSwitch variant="compact" />

          <a
            href={t.common.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex size-9 items-center justify-center rounded-xl border border-rose-200 bg-white/80 text-rose-900/80"
            title="GitHub"
            aria-label="GitHub"
          >
            <GithubIcon className="size-4" />
          </a>

          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-xl border border-rose-200 bg-white/80"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Drawer for < xl */}
      <div
        id="mobile-nav"
        className={cn(
          "border-t border-rose-100 bg-white/95 px-4 py-4 xl:hidden",
          open ? "block" : "hidden"
        )}
      >
        <div className="mb-3 flex items-center justify-between border-b border-rose-100 pb-3">
          <span className="text-xs font-bold text-muted-foreground uppercase">
            Language · ဘာသာစကား
          </span>
          <LanguageSwitch />
        </div>

        <nav className="flex flex-col gap-2.5" aria-label="Mobile">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-rose-50"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/test/love-calculator"
            className="btn-chaos mt-2 whitespace-nowrap text-center"
            onClick={() => setOpen(false)}
          >
            {t.common.startTest}
          </Link>
        </nav>
      </div>
    </header>
  );
}
