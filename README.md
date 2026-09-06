# LoveRoast

**We test your love. Then we roast it.** 😂❤️

A viral, mobile-first relationship entertainment web app built with Next.js, TypeScript, Tailwind CSS, Framer Motion, Zustand, Zod, and React Hook Form.

## Features

- Love Calculator, Who Loves Who More, Who Is The Problem, Red Flags, and more
- Deterministic name-based scoring (same names → same results)
- Fake AI loading experience
- Shareable result URLs + challenge links
- Story-ready 9:16 share cards (Web Share / copy / download)

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Notes

- All calculations run client-side and are modular under `lib/` for a future backend move.
- Premium / ads / payments are scaffolding only — no real billing yet.
- Results are encoded in the URL (no database required for MVP).
