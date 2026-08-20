# LaTech — Weekly AI & Tech Intelligence Digest

A personal intelligence dashboard that delivers a hand-curated, AI-generated digest of the
most important developments in artificial intelligence and trending open-source repositories,
refreshed automatically every week.

## Overview

LaTech is a Next.js web app that presents two weekly digest columns — **Latest in AI** and
**Trending Repos** — in a playful, notebook-style interface. A live countdown in the hero
shows the time until the next automated refresh, and a History page archives every past week
as a "memory lane" of pinned notes.

The app is fully decoupled from any content pipeline: it is a thin, content-agnostic
presentation layer. All digest entries are produced and shipped by an external automation
(Make.com) and persisted in Supabase. The frontend never scrapes or generates content itself —
it only renders whatever the automation delivers.

Pages:
- `/` — Dashboard: this week's AI and repo digests with a refresh countdown.
- `/history` — Past Insights: digests grouped by week (Monday–Sunday), newest first.

## Problem It Solves

Keeping up with AI research and the open-source ecosystem is noisy and time-consuming.
Relevant breakthroughs, model releases, and trending repositories are scattered across
newsletters, arXiv, GitHub trending, and social feeds — and most of it arrives faster than
anyone can read.

LaTech turns that firehose into a single, calm, weekly briefing:
- A **scheduled automation** gathers and summarizes the week's most important items, so the
  user doesn't have to monitor dozens of sources.
- A **consistent, readable format** (title + two-sentence summary + source link) makes each
  item scannable in seconds.
- A **self-updating dashboard** means the digest appears every Monday without any manual
  publishing step — no copy-pasting, no deploy, no CMS.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 14](https://nextjs.org/) (App Router, TypeScript) |
| UI | React 18, Tailwind CSS, Material Symbols icons |
| Data store | [Supabase](https://supabase.com/) (Postgres + `@supabase/supabase-js`) |
| Automation | [Make.com](https://www.make.com/) (no-code scenario, scheduled weekly) |
| Knowledge base (optional) | Notion (linked via `notion_page_id`) |

Environment variables (see `.env.example`):
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — server-only admin key for DB writes
- `MAKE_DIGEST_SECRET` — shared bearer secret that authenticates the automation's POST calls

## The AI Automation (Core of This Project)

The defining feature of LaTech is that **content is produced entirely by an automated
pipeline and never by the app itself**. The app's only job is to receive, store, and render.

### Architecture

```
Make.com scenario (weekly, Mon 10 AM PHT)
        │  POST /api/digests   (Bearer MAKE_DIGEST_SECRET)
        ▼
Next.js Route Handler  ──►  Supabase `digests` table (upsert)
        ▲
        │  GET /api/digests
Next.js Dashboard / History pages  (client fetch + render)
```

### How the automation works

1. **Scheduled trigger.** A Make.com scenario fires automatically every **Monday at 10:00 AM
   Philippine Time (UTC+8)**. This is what the hero countdown targets — the dashboard always
   shows time remaining until the next run.

2. **Content gathering & AI summarization.** Make.com aggregates the week's AI news and
   trending repositories from its connected sources, then uses AI to condense each item into
   a structured, two-sentence summary. (Notion is optionally used as the working knowledge
   base; the resulting page is referenced through `notion_page_id`.)

3. **POST to the ingest endpoint.** For each item, Make.com calls `POST /api/digests` with a
   JSON payload:
   ```json
   {
     "type": "ai | technology | repo | github",
     "date": "2026-08-17",
     "title": "Open Source LLM Reaches 100B Parameters",
     "content": "Full AI-generated write-up. Sentence one. Sentence two. ...",
     "notionPageId": "optional-notion-page-id",
     "sourceData": { "url": "https://source-link", "...": "..." }
   }
   ```
   - `type` routes the item: `ai`/`technology` → **Latest in AI** column;
     `repo`/`github` → **Trending Repos** column.
   - `date` is the week's Monday; multiple cards can share the same type/date.

4. **Authenticated & idempotent write.** The route (`src/app/api/digests/route.ts`):
   - Verifies the `Authorization: Bearer <MAKE_DIGEST_SECRET>` header and rejects anything
     else with `401 Unauthorized`.
   - Validates required fields (`type`, `date`, `title`, `content`).
   - **Upserts** into the `digests` table with `onConflict: 'type,date,title'`, so re-runs of
     the scenario safely overwrite the same week instead of creating duplicates.

### How the app consumes the automation

- `GET /api/digests` returns all rows ordered by `date desc, type`.
- The **Dashboard** filters to the **latest week's** rows and splits them into the AI and
  repo columns. Each card shows the title, the first two sentences of the AI-generated
  `content` as a summary, and a "Read Article" / "View on GitHub" link pulled from
  `source_data` (`url` / `html_url` / `link` / `source_url`).
- The **History** page groups every row into Monday–Sunday weeks and lists AI and repo items
  side by side, giving a scrollable archive of past automated digests.

### Debugging the pipeline

`GET /api/digests/debug` is a small health/diagnostics endpoint that reports whether the
incoming auth header and the configured `MAKE_DIGEST_SECRET` match — useful for verifying
Make.com's webhook credentials without writing a real digest.

## Local Development

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase + Make secrets
npm run dev                  # http://localhost:3000
```

Build & start:
```bash
npm run build && npm run start
```

## Notes

- The Supabase schema centers on a `digests` table with the columns used above
  (`type`, `date`, `title`, `content`, `notion_page_id`, `source_data`, `updated_at`).
- `src/data/*.ts` holds static placeholder topics used during design; the live app is driven
  entirely by the automation, not these files.
- All DB access uses the server-side service-role client (never exposed to the browser).
