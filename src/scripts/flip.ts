import { navigate } from "astro:transitions/client";

/**
 * The record flip — a cover panel does the rotating, never the page. The real
 * content (hero canvas, deck, scroll) is untouched, so nothing breaks.
 *
 * Sequence, matching the concept:
 *   1. cover rotates in from edge-on → flat, hiding the page (≈340ms)
 *   2. on flat, the page swaps underneath, scroll anchored (invisible)
 *   3. HOLD ≈900ms — only the flipping label is visible (the record on edge)
 *   4. cover rotates out flat → edge-on the OTHER way, revealing the new side
 *
 * Direction depends on which way you're going: A→B spins one way, B→A the
 * mirror. So flipping back undoes the motion, like turning a record over.
 *
 * Scroll is restored by TRACK, not by pixel: both records share the same
 * tracklist (#t01…#t10), so we land on the same track at the same offset
 * even though the two languages run to slightly different lengths.
 */

const PERSP = "1600px";
const SPIN = 340; // each half of the rotation
const HOLD = 900; // edge-on pause
const COVER_ID = "flip-cover";
const ANCHOR_KEY = "jxn.flipAnchor";
const PENDING_KEY = "jxn.flipping";

interface Anchor {
  id: string;
  delta: number;
  y: number;
}

let busy = false;
let targetY = 0;
let lastAnchor: Anchor | null = null;

function cover(): HTMLElement | null {
  return document.getElementById(COVER_ID);
}

function reduce(): boolean {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

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

export function flipTo(href: string): void {
  if (busy) return;
  const c = cover();
  if (!c || reduce()) {
    void navigate(href);
    return;
  }
  busy = true;
  document.documentElement.classList.add("flipping");

  const toB = goingToB(href);
  const inFrom = toB ? 90 : -90;

  c.style.transition = "none";
  c.style.transform = `perspective(${PERSP}) rotateY(${inFrom}deg)`;
  c.classList.add("on");

  const anchor = captureAnchor();
  lastAnchor = anchor;
  sessionStorage.setItem(ANCHOR_KEY, JSON.stringify(anchor));
  sessionStorage.setItem(PENDING_KEY, toB ? "B" : "A");

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      c.style.transition = `transform ${SPIN}ms cubic-bezier(.5, 0, .5, 1)`;
      c.style.transform = `perspective(${PERSP}) rotateY(0deg)`;
    });
  });

  window.setTimeout(() => void navigate(href), SPIN + 30);
}

/** Phase 3+4: after the new page mounts under the cover, hold then reveal. */
function finishFlip(): void {
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

  // Re-resolve every tick: the hero (92svh + a late-mounting canvas) and any
  // reflow can change track offsets AFTER we first restore. Anchoring to the
  // track and recomputing each frame absorbs all of it. The cover is opaque,
  // so none of this correction is ever seen.
  const pin = (): void => {
    targetY = resolveAnchor(lastAnchor);
    jump(targetY);
  };
  pin();
  const lock = window.setInterval(pin, 16);
  // also react immediately to layout growth (lazy media, island mount)
  const ro = new ResizeObserver(pin);
  ro.observe(document.documentElement);
  window.setTimeout(() => {
    window.clearInterval(lock);
    ro.disconnect();
  }, HOLD + SPIN + 160);

  const c = cover();
  if (!c) {
    document.documentElement.classList.remove("flipping");
    busy = false;
    return;
  }

  c.classList.add("on");
  c.style.transition = "none";
  c.style.transform = `perspective(${PERSP}) rotateY(0deg)`;

  const outTo = pending === "B" ? -90 : 90;

  window.setTimeout(() => {
    pin(); // settle once more right before the reveal
    requestAnimationFrame(() => {
      c.style.transition = `transform ${SPIN}ms cubic-bezier(.5, 0, .5, 1)`;
      c.style.transform = `perspective(${PERSP}) rotateY(${outTo}deg)`;
    });
    window.setTimeout(() => {
      jump(targetY);
      c.classList.remove("on");
      c.style.transition = "none";
      document.documentElement.classList.remove("flipping");
      busy = false;
      lastAnchor = null;
    }, SPIN + 20);
  }, HOLD);
}

/* — restore the instant the new DOM is in, before it can paint —————————————— */
document.addEventListener("astro:after-swap", () => {
  if (!sessionStorage.getItem(PENDING_KEY)) return;
  jump(resolveAnchor(lastAnchor));
  cover()?.classList.add("on");
});

document.addEventListener("astro:page-load", finishFlip);

/* — entry points ———————————————————————————————————————————————————————————— */

document.addEventListener("click", (e) => {
  const a = (e.target as HTMLElement).closest?.("a[data-flip]");
  if (!(a instanceof HTMLAnchorElement)) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // respect new-tab
  e.preventDefault();
  flipTo(a.href);
});

addEventListener("jxn:flip", (e) => {
  flipTo((e as CustomEvent<string>).detail);
});

// skipping the router's own view transition rejects its promise — expected
addEventListener("unhandledrejection", (e) => {
  if (e.reason instanceof DOMException && e.reason.name === "AbortError") {
    e.preventDefault();
  }
});

if (sessionStorage.getItem(PENDING_KEY)) finishFlip();
