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
