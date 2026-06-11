# JXN-000 · DESIGN & BUILD PLAN

Palette, registers, and reference extraction live in `art-direction.md`.
This file is the page map, the feature spec, and the easter-egg registry.

## Page map

```
/            → locale sniff redirect (hu browsers → /hu, everyone else → /en)
/en          → SIDE A — the record (one continuous tracklist page, canonical)
/hu          → SIDE B — faithful localization, structure-identical
/status      → system status: OS-window chrome, build info, real uptime,
               design-token swatches, THE BONSAI (grows with site age)
/404         → ERROR — TRACK NOT FOUND. The only red on the site.
```

## The tracklist (both sides)

`01 INTRO` hero — "I code." enormous, ASCII fluid field behind it, CRT overlay
`02 ABOUT` — sleeve-mounted duotone portrait (placeholder until masters arrive)
`03 EXPERIENCE` — EverLink + field notes as expandable incident reports
`04 FEATURED PROJECTS` — JXN-001/002/003 sleeve cards, gold catalog numbers
`05 MORE PROJECTS` — JXN-004/005/006 + "in the lab" strip
`06 AI` — position piece, straight prose
`07 STACK` — three honest tiers
`08 OFF THE CLOCK` — label grid
`09 NOW` — homepage strip, config-stubbed placeholders
`10 CONTACT` — say hi
FOOTER — liner notes (3 lines), token swatch strip, stdin hint

Reading time = track duration (`mm:ss`), computed from copy at build.
All motion timings are multiples of 666ms (90 BPM). Nobody will measure it.

## Signature features

1. **Needle drop** — first visit per session only: typed catalog line, waveform
   draw, dither-out. ~1s, any key/click skips, reduced-motion skips entirely.
2. **ASCII hero field** — Canvas2D value-noise fluid rendered as glyphs,
   cursor disturbs it, clicks ripple. Accent ink, rare gold twinkles, cream
   peaks. 30fps budget, sprite-atlas blitting, pauses offscreen. CRT
   scanline/vignette overlay on top.
3. **The playhead** — scroll progress as track timeline: current track label,
   `mm:ss / total`, clickable chapter ticks.
4. **The record flip** — cross-document View Transitions: SIDE A↔B navigation
   plays a 666ms page flip (one beat). Browsers without support: instant nav.
5. **The terminal** — `~` opens it anywhere. Real commands over the real
   content. English only (machines speak English).
6. **The bonsai** — /status grows a deterministic ASCII bonsai seeded by the
   site's age in weeks: it is genuinely bigger next month. Terminal `bonsai`
   grows one on demand.

## Easter-egg registry (spoilers — this file is the only place they're written down)

| Egg | Trigger | Behavior |
|---|---|---|
| stdin hint | footer | `stdin: ~` — the only visible terminal hint |
| console block | devtools | styled JXN-000 liner notes + "stdin is open. press ~" |
| view-source | view source | ASCII liner-notes comment block at top of body |
| humans.txt | /humans.txt | full liner notes, colophon |
| konami code | ↑↑↓↓←→←→BA | CRT degauss wobble + the cat walks by |
| "boombap" typed | anywhere | grain pulses 4 beats at exactly 90 BPM, toast: "the pocket." |
| needle up | tab blur | title becomes "⏸ needle up — JXN-000" |
| `hire-me` | terminal | "permission denied: try sudo." (sudo works) |
| `gloria` | terminal | ASCII cannon. BOOM. (the gnome's artillery) |
| `warframe` | terminal | ~3,000 hours acknowledged |
| `cat` (no args) | terminal | the cat. meow. |
| `vim` | terminal | "not that kind of terminal. (:q works though.)" — :q actually quits |
| `play` | terminal | "no audio on this site. the beat is structural." |
| token swatches | footer + /status | the actual design tokens as terminal-style color swatches |
| 404 buttons | /404 | OK and NO — both go home. there is no no. |
| catalog hovers | JXN-xxx numbers | dashed-border annotation cards (cbonsai tooltip style) |

## Engineering rules

- Zero runtime dependencies beyond React islands. No three.js, no GSAP — the
  noise field, bonsai, terminal, and flip are hand-rolled. The "how did he do
  this" must survive a view-source.
- `prefers-reduced-motion`: needle drop skipped, field static, flip disabled,
  bonsai renders fully grown. Still gorgeous, never moving.
- Red appears in exactly two places: /404 and terminal error lines.
- Placeholders (`email`, `current game`, `current album`, `now date`) live in
  `src/config.ts` as nulls → rendered as honest visible placeholders.
- The portrait ships as a labeled placeholder until the original file lands.
