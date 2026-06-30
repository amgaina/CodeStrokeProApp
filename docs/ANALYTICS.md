# CodeStrokePro — Usage Analytics

De-identified, aggregate usage analytics for the CodeStrokePro education tools.
Built to answer research questions about educational reach and tool
utilization **without collecting any patient-level data**.

## What it is

- **Provider:** [PostHog](https://posthog.com) (free tier — 1M events/month, no card required).
- **Cost:** $0 at expected training-session volume.
- **Scope:** page views, unique visitors, which tools are used and completed,
  PDF downloads, resource interactions, and traffic source (incl. QR codes).
- **No PHI:** no patient names, no identifiers, no free-text inputs are ever
  sent. Numeric clinical scores (e.g. NIHSS total) are non-identifying and are
  captured only to describe how the tools are used.

When `NEXT_PUBLIC_POSTHOG_KEY` is unset, all analytics is a no-op and the app
behaves identically.

## Setup (one-time, ~5 min)

1. Create a free account at [posthog.com](https://posthog.com) and a project.
2. Copy the **Project API Key** (`phc_...`) from Project Settings.
3. Add to local `.env.local`:
   ```
   NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
   NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
   ```
   Use `https://eu.i.posthog.com` if you created an EU project.
4. Add the same two variables in Vercel: **Project → Settings → Environment
   Variables** (Production + Preview), then redeploy.

That's it — page views and events start flowing.

## Event dictionary

Every event carries PostHog's automatic context: unique visitor id (random,
cookie-based — not a person), timestamp, page URL, referrer, and any `utm_*`
parameters. Tool ids are stable: `calculator`, `fast-calc`, `nihss`, `cpss`,
`van`, `resources`.

| Event | When it fires | Properties |
|-------|---------------|------------|
| `$pageview` | Every route/page view (auto) | url, referrer, utm_* |
| `$pageleave` | User leaves a page (auto) | powers time-on-page |
| `tool_completed` | A tool reaches its result/end state | `tool`, plus result detail (drug / score / severity / interpretation) |
| `pdf_downloaded` | A dosing card or scale summary PDF is downloaded | `tool`, result detail |
| `resource_opened` | A resource PDF is opened (View) | `tool: resources`, `filename`, `title` |

`tool_completed` details by tool:
- `calculator` / `fast-calc`: `{ drug: "tnk" | "alteplase" }`
- `nihss`: `{ score, severity }`
- `cpss`: `{ result: "positive" | "negative", abnormalCount: 0-3 }`
- `van`: `{ result }`

## Mapping to the research questions

| Research question | How to get it in PostHog |
|---|---|
| Overall page visits & unique users | Web Analytics dashboard (Visitors / Pageviews) |
| Most-used tools | Pageviews grouped by path, or `tool_completed` broken down by `tool` |
| Engagement (time on page, repeat visits) | Web Analytics: session duration, returning visitors (from `$pageleave`) |
| Tool completion | `tool_completed` count, or a funnel: pageview → `tool_completed` |
| PDF / checklist downloads | `pdf_downloaded` + `resource_opened`, broken down by `tool`/`filename` |
| Traffic source (QR / session) | Breakdown by `utm_source` / `utm_campaign` (see below) |

All of these export to CSV from PostHog for use in a manuscript.

## QR codes & session-based traffic source

Encode UTM parameters in the URL behind each QR code. PostHog captures them
automatically and attributes every downstream event to that source/session.

Example URL behind a training-session QR code:
```
https://codestrokepro.com/?utm_source=qr&utm_medium=training&utm_campaign=ulm-spring2026
```
- `utm_source=qr` separates QR scans from organic/direct traffic.
- `utm_campaign=...` labels the specific session/cohort, so usage can be
  compared across training events.

Generate the QR code from that full URL with any QR generator. In PostHog,
break any metric down by `utm_campaign` to see per-session reach and tool use.

## Privacy notes

- No login, no accounts, no patient data — the app is stateless by design.
- Visitor ids are random and cookie-based; they identify a browser, not a person.
- Only the aggregate events above are sent. Clinical inputs (weight, free-text)
  are never transmitted; only derived non-identifying results/scores are.
