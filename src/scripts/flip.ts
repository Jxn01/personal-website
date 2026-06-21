import { navigate } from "astro:transitions/client";

/**
 * THE FLIP — a tunnel/iris transition that turns the record over.
 *
 *   ACT 1 · ENTER   the iris closes (a black ring phases inward), the page
 *                   recedes down the tunnel and a vinyl coalesces in the
 *                   middle — the page "zooms out into a record."
 *   — swap —        at the deepest point the DOM swaps, hidden behind the disc.
 *   ACT 2 · FLIP    the record spins on its axis (A→B one way, B→A the mirror),
 *                   "flipping the record" holding under it.
 *   ACT 3 · EXIT    the iris opens fast (the ring phases back out through the
 *                   camera), the disc zooms up and dissolves into the new page.
 *
 * Driven entirely by the Web Animations API on the persisted #flip-stage — the
 * real page is never transformed, so the hero/canvas/deck can't break. Scroll
 * is restored by track anchor (both sides share #t01…#t10) and pinned through
 * the hidden stretch so it never jumps.
 */

const STAGE_ID = "flip-stage";
const ANCHOR_KEY = "jxn.flipAnchor";
const PENDING_KEY = "jxn.flipping";

// timing (ms)
const ENTER_MS = 430;
const FLIP_MS = 700;
const EXIT_MS = 400;

// geometry
const HOLE_OPEN = "152%"; // iris fully open (page visible)
const HOLE_SHUT = "16%"; // iris closed around the disc
const SCALE_PAGE = 1.55; // disc scale when "is the page" (zoomed in)
const SCALE_DISC = 0.62; // disc scale at the bottom of the tunnel

const EASE_IN = "cubic-bezier(.6, 0, .9, .25)"; // accelerate down the tunnel
const EASE_OUT = "cubic-bezier(.1, .75, .35, 1)"; // accelerate out, settle
const EASE_SPIN = "cubic-bezier(.5, 0, .5, 1)";

interface Anchor {
  id: string;
  delta: number;
  y: number;
}

let busy = false;
let lastAnchor: Anchor | null = null;

const stage = (): HTMLElement | null => document.getElementById(STAGE_ID);
const veil = (): HTMLElement | null =>
  stage()?.querySelector(".flip-veil") ?? null;
const disc = (): HTMLElement | null =>
  stage()?.querySelector(".flip-disc") ?? null;
const disc3d = (): HTMLElement | null =>
  stage()?.querySelector(".flip-disc-3d") ?? null;
const caption = (): HTMLElement | null =>
  stage()?.querySelector(".flip-cap") ?? null;

const reduce = (): boolean =>
  matchMedia("(prefers-reduced-motion: reduce)").matches;

function jump(y: number): void {
  window.scrollTo({ top: y, left: 0, behavior: "instant" as ScrollBehavior });
}

/** Going to SIDE B? (the /hu record) — decides the spin direction. */
function goingToB(href: string): boolean {
  return new URL(href, location.href).pathname.split("/").filter(Boolean)[0] === "hu";
}

function docTop(el: HTMLElement): number {
  return el.getBoundingClientRect().top + window.scrollY;
}

/** Record which track is at the top of the viewport, and the offset into it. */
function captureAnchor(): Anchor {
  const tracks = [...document.querySelectorAll<HTMLElement>("[data-track]")];
  let id = "";
  let delta = window.scrollY;
  for (const t of tracks) {
    const top = docTop(t);
    if (top <= window.scrollY + 8) {
      id = t.id;
      delta = window.scrollY - top;
    }
  }
  return { id, delta, y: window.scrollY };
}

/** Resolve an anchor against the current (possibly different-length) page. */
function resolveAnchor(a: Anchor | null): number {
  if (!a) return window.scrollY;
  if (a.id) {
    const el = document.getElementById(a.id);
    if (el) return Math.max(0, docTop(el) + a.delta);
  }
  return a.y;
}

/** Animate and resolve when done, leaving the final frame committed inline. */
function run(
  el: Element | null,
  frames: Keyframe[],
  duration: number,
  easing: string,
): Promise<void> {
  if (!el) return Promise.resolve();
  const a = el.animate(frames, { duration, easing, fill: "both" });
  return a.finished.then(() => {
    try {
      a.commitStyles();
    } catch {
      /* commitStyles can throw on detached nodes — safe to ignore */
    }
    a.cancel();
  });
}

/** Park the stage in a known state without animating. */
function setStage(opts: { hole: string; scale: number; discOpacity: number; capOpacity: number; rotate: number }): void {
  const v = veil();
  const d = disc();
  const d3 = disc3d();
  const c = caption();
  if (v) v.style.setProperty("--flip-hole", opts.hole);
  if (d) {
    d.style.transform = `scale(${opts.scale})`;
    d.style.opacity = String(opts.discOpacity);
  }
  if (d3) d3.style.transform = `rotateY(${opts.rotate}deg)`;
  if (c) c.style.opacity = String(opts.capOpacity);
}

export function flipTo(href: string): void {
  if (busy) return;
  const st = stage();
  if (!st || reduce()) {
    void navigate(href);
    return;
  }
  busy = true;
  document.documentElement.classList.add("flipping");

  const toB = goingToB(href);
  lastAnchor = captureAnchor();
  sessionStorage.setItem(ANCHOR_KEY, JSON.stringify(lastAnchor));
  sessionStorage.setItem(PENDING_KEY, toB ? "B" : "A");

  // prime: iris open, disc large + invisible (it IS the page), flat, no caption
  setStage({ hole: HOLE_OPEN, scale: SCALE_PAGE, discOpacity: 0, capOpacity: 0, rotate: 0 });
  st.classList.add("on");

  // ACT 1 — the tunnel closes, the page recedes, a vinyl coalesces
  void Promise.all([
    run(veil(), [{ "--flip-hole": HOLE_OPEN } as Keyframe, { "--flip-hole": HOLE_SHUT } as Keyframe], ENTER_MS, EASE_IN),
    run(
      disc(),
      [
        { transform: `scale(${SCALE_PAGE})`, opacity: 0 },
        { transform: `scale(${SCALE_DISC})`, opacity: 1 },
      ],
      ENTER_MS,
      EASE_IN,
    ),
    run(caption(), [{ opacity: 0 }, { opacity: 1 }], ENTER_MS, EASE_OUT),
  ]).then(() => {
    // hold the closed state and swap the page underneath the disc
    setStage({ hole: HOLE_SHUT, scale: SCALE_DISC, discOpacity: 1, capOpacity: 1, rotate: 0 });
    void navigate(href);
  });
}

/** ACT 2 + 3, after the new page has mounted behind the disc. */
async function finishFlip(): Promise<void> {
  const pending = sessionStorage.getItem(PENDING_KEY);
  if (!pending) return;
  sessionStorage.removeItem(PENDING_KEY);
  busy = true;
  document.documentElement.classList.add("flipping");

  if (!lastAnchor) {
    try {
      lastAnchor = JSON.parse(sessionStorage.getItem(ANCHOR_KEY) ?? "null") as Anchor | null;
    } catch {
      lastAnchor = null;
    }
  }
  sessionStorage.removeItem(ANCHOR_KEY);

  // keep scroll pinned to the track anchor through the whole hidden stretch —
  // the hero (92svh + late canvas) can reflow after restore; recompute each tick
  const pin = (): void => jump(resolveAnchor(lastAnchor));
  pin();
  const lock = window.setInterval(pin, 16);
  const ro = new ResizeObserver(pin);
  ro.observe(document.documentElement);

  const st = stage();
  if (!st) {
    window.clearInterval(lock);
    ro.disconnect();
    document.documentElement.classList.remove("flipping");
    busy = false;
    return;
  }

  // make sure we're parked closed over the fresh page
  st.classList.add("on");
  setStage({ hole: HOLE_SHUT, scale: SCALE_DISC, discOpacity: 1, capOpacity: 1, rotate: 0 });

  const dir = pending === "B" ? 1 : -1; // A→B spins one way, B→A mirrors it

  // ACT 2 — the record turns over
  await run(
    disc3d(),
    [
      { transform: "rotateY(0deg)" },
      { transform: `rotateY(${180 * dir}deg)` },
    ],
    FLIP_MS,
    EASE_SPIN,
  );

  // ACT 3 — the iris opens fast, the disc zooms up and dissolves into the page
  pin();
  await Promise.all([
    run(veil(), [{ "--flip-hole": HOLE_SHUT } as Keyframe, { "--flip-hole": HOLE_OPEN } as Keyframe], EXIT_MS, EASE_OUT),
    run(
      disc(),
      [
        { transform: `scale(${SCALE_DISC})`, opacity: 1 },
        { transform: `scale(${SCALE_PAGE})`, opacity: 0 },
      ],
      EXIT_MS,
      EASE_OUT,
    ),
    run(caption(), [{ opacity: 1 }, { opacity: 0 }], EXIT_MS * 0.7, EASE_IN),
  ]);

  jump(resolveAnchor(lastAnchor));
  window.clearInterval(lock);
  ro.disconnect();
  st.classList.remove("on");
  // reset for next time
  setStage({ hole: HOLE_OPEN, scale: SCALE_PAGE, discOpacity: 0, capOpacity: 0, rotate: 0 });
  if (disc3d()) disc3d()!.style.transform = "rotateY(0deg)";
  document.documentElement.classList.remove("flipping");
  busy = false;
  lastAnchor = null;
}

/* — restore scroll the instant the new DOM is in, before it can paint ——————— */
document.addEventListener("astro:after-swap", () => {
  if (!sessionStorage.getItem(PENDING_KEY)) return;
  jump(resolveAnchor(lastAnchor));
  stage()?.classList.add("on"); // re-assert over the fresh document
});

document.addEventListener("astro:page-load", () => void finishFlip());

/* — entry points ———————————————————————————————————————————————————————————— */

// capture phase + stopImmediatePropagation so we win the click before Astro's
// ClientRouter can navigate it plainly
document.addEventListener(
  "click",
  (e) => {
    const a = (e.target as HTMLElement).closest?.("a[data-flip]");
    if (!(a instanceof HTMLAnchorElement)) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // respect new-tab
    e.preventDefault();
    e.stopImmediatePropagation();
    flipTo(a.href);
  },
  { capture: true },
);

addEventListener("jxn:flip", (e) => {
  flipTo((e as CustomEvent<string>).detail);
});

// skipping the router's own view transition rejects its promise — expected
addEventListener("unhandledrejection", (e) => {
  if (e.reason instanceof DOMException && e.reason.name === "AbortError") {
    e.preventDefault();
  }
});

if (sessionStorage.getItem(PENDING_KEY)) void finishFlip();
