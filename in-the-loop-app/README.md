# In The Loop

Personal daily app to close the "1st-gen → 2nd-gen" gap in American English and culture — language intuition (idioms, tone, slang) and shared cultural references (news, pop culture), ~5-10 min/day.

## Stack

Vite + React + Tailwind v4, no router. `/api` serverless functions (Node.js, plain `(req, res)` handlers) call Claude via **Vercel AI Gateway** (`ai` SDK, model `anthropic/claude-sonnet-5`). Content is cached per-day in Vercel Blob (optional — works without it, just regenerates each request).

## Local dev

```bash
npm install
npm run dev        # frontend only — /api routes need `vercel dev` or a real deployment
```

## Deploy

```bash
vercel link         # first time only
vercel               # preview deploy
vercel --prod        # production
```

### One manual step required

AI Gateway auth uses OIDC and "just works" once the project is linked — but **AI Gateway must be enabled once** in the Vercel dashboard: `Project → Settings → AI Gateway`. Until then, `/api/daily-content` and `/api/gap-journal` will fail and the app silently falls back to the built-in seed content (`src/data/seedContent.js`) — the app still works, just without live AI generation.

## How the daily loop works

- `src/data/curriculum.js` — fixed start date + `America/Los_Angeles` as the canonical "today", so `dayNumber` never drifts by device (same pattern as `learn_japanese`/`learn_math`).
- Every day has 4 cards: **language** (idiom/expression), **news** (today's real US headline, via Google News RSS candidates fed to the model — never invented), **popculture** (same, from an entertainment RSS feed), **slang** (youth/internet expression).
- `language` and `slang` cards feed a simple Leitner-style review pool (`src/data/reviewSchedule.js`) — `news`/`popculture` are intentionally not reviewed, since they're trend-bound and go stale.
- **Gap journal**: capture anything you didn't understand in real life, anytime — it gets an AI explanation and joins the same review pool.
- `vercel.json` cron hits `/api/cron/generate` daily to pre-warm that day's content before you ever open the app.

## Known rough edges

- News/popculture trend sourcing is currently just two Google News RSS feeds (regex-parsed, no XML library) — good enough as a first pass, but Reddit/other sources could be added to `api/_lib/trends.js` later for more texture.
- No auth/multi-profile — this is intentionally single-user (unlike the couple-oriented `learn_japanese`).
