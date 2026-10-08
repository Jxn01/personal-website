# JXN-000

Personal site of Norbert Oláh. The site is itself a catalog entry.

```
produced & engineered by Norbert Oláh
recorded in Budapest · mixed with machines · mastered by hand
no cookies · no trackers · no skill bars
```

## Stack

Astro 5 (static output) · React 19 islands · TypeScript strict ·
hand-rolled everything else — the noise field, the ASCII bonsai, the
terminal, and the record flip are all written from scratch in this repo.
No three.js, no GSAP, no UI kit.

## Develop

```bash
pnpm install
pnpm dev        # localhost:4321
pnpm check      # astro check (strict TS)
pnpm build      # static output → dist/
pnpm preview
```

## Deploy

Push to `main`; `.github/workflows/deploy.yml` does the rest.

- **jxn.hu** — built with `SITE=https://jxn.hu` and force-pushed as one commit
  to the `deploy` branch. The server behind jxn.hu pulls that branch every
  10 minutes and swaps the new build in atomically (the previous builds stay
  for an instant rollback).
- **GitHub Pages** (`jxn01.github.io/personal-website/`, built with
  `BASE_PATH=/personal-website`) — the public copy until jxn.hu is reachable
  from the internet; then its job goes.

`SITE` and `BASE_PATH` are the only deploy knobs (`astro.config.mjs`); unset,
the build targets jxn.hu at the root.

## Map

- `/en` — SIDE A (canonical) · `/hu` — SIDE B. The header toggle flips the record.
- `/status` — build info, live uptime, the bonsai that grows with the site's age.
- `404` — the only red on the site.
- Press `~` anywhere.

## Owner notes

- Content is sourced verbatim from `docs/jxn-000-site-asset.md`. Edit there
  (and in `src/i18n/`) — never invent copy in markup.
- Fill the placeholders in `src/config.ts` (email, current game, current
  album, now-date). The site renders honest placeholders while they're null.
- Design direction and reference extraction: `docs/art-direction.md`.
  Page map, feature spec, easter-egg registry: `docs/design.md`.
- The portrait ships as a labeled placeholder until the original photo lands
  in the repo.
