"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { TipDeveloper } from "@/components/TipDeveloper";

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

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mt-auto border-t border-rose-200/70 bg-white/70 backdrop-blur-sm">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        {/* Brand & Developer Info */}
        <div className="md:col-span-2">
          <Link href="/" className="font-display text-lg font-extrabold text-rose-950">
            ❤️ {t.common.appName}
          </Link>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            {t.footer.about}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50/70 px-3 py-1 text-xs font-semibold text-rose-900">
              <span>{t.footer.developerCredit}</span>
              <a
                href={t.common.developerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-rose-600 underline decoration-rose-300 underline-offset-2 hover:text-rose-700"
              >
                {t.common.developerName}
              </a>
            </div>

            <a
              href={t.common.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-semibold text-rose-900 hover:bg-rose-50"
            >
              <GithubIcon className="size-3.5" />
              <span>{t.footer.github}</span>
            </a>

            <TipDeveloper compact />
          </div>

          <div className="mt-4">
            <LanguageSwitch />
          </div>
        </div>

        {/* Explore Links */}
        <div>
          <p className="mb-2 text-sm font-bold tracking-wide text-rose-500 uppercase">{t.footer.explore}</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/#tests" className="text-muted-foreground transition hover:text-rose-600">
                {t.footer.allTests}
              </Link>
            </li>
            <li>
              <Link href="/test/who-is-the-problem" className="text-muted-foreground transition hover:text-rose-600">
                {t.footer.whoIsProblem}
              </Link>
            </li>
            <li>
              <Link href="/test/roast" className="text-muted-foreground transition hover:text-rose-600">
                {t.footer.fullRoast}
              </Link>
            </li>
            <li>
              <a
                href={t.common.developerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition hover:text-rose-600"
              >
                {t.common.developerName} (Portfolio)
              </a>
            </li>
          </ul>
        </div>

        {/* Disclaimer */}
        <div>
          <p className="mb-2 text-sm font-bold tracking-wide text-rose-500 uppercase">{t.footer.disclaimerTitle}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t.footer.disclaimerText}
          </p>
        </div>
      </div>

      <div className="border-t border-rose-100 py-4 text-center text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 sm:flex-row">
          <p>© {new Date().getFullYear()} {t.common.appName} · {t.footer.copyright}</p>
          <p>
            {t.footer.developerCredit}{" "}
            <a
              href={t.common.developerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-rose-600 hover:underline"
            >
              {t.common.developerName}
            </a>
            {" · "}
            <a
              href={t.common.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-rose-600 hover:underline"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
