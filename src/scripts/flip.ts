import { navigate } from "astro:transitions/client";

/**
 * The record flip — done by hand, deterministic in every browser.
 * Out: the page rotates edge-on (333ms). Fetch happens while the record is
 * on edge (a centered label keeps the beat). In: the other side rotates
 * back (333ms). One full beat at 90 BPM, everywhere, no View Transition
 * support required.
 */

let flipping = false;

function html(): HTMLElement {
  return document.documentElement;
}

function cleanup(): void {
  html().classList.remove("flip-out", "flip-in");
  flipping = false;
}

export function flipTo(href: string): void {
  if (flipping) {
    return;
  }
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    void navigate(href);
    return;
  }
  flipping = true;
  html().classList.add("flip-out");
  window.setTimeout(() => {
    void navigate(href);
  }, 330);
  // if the navigation never lands (offline, error), un-stick the page
  window.setTimeout(() => {
    if (flipping && !html().classList.contains("flip-in")) cleanup();
  }, 5000);
}

// any anchor marked data-flip flips instead of navigating plainly
document.addEventListener("click", (e) => {
  const a = (e.target as HTMLElement).closest?.("a[data-flip]");
  if (!(a instanceof HTMLAnchorElement)) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // respect new-tab
  e.preventDefault();
  flipTo(a.href);
});

// the terminal (and anything else) can request a flip by event
addEventListener("jxn:flip", (e) => {
  flipTo((e as CustomEvent<string>).detail);
});

// skipping the router's view transition rejects its promise — that's expected
addEventListener("unhandledrejection", (e) => {
  if (
    flipping &&
    e.reason instanceof DOMException &&
    e.reason.name === "AbortError"
  ) {
    e.preventDefault();
  }
});

// don't let the router's own transition fight the flip
document.addEventListener("astro:before-swap", (e) => {
  if (flipping) {
    (e as unknown as { viewTransition?: { skipTransition?: () => void } })
      .viewTransition?.skipTransition?.();
  }
});

// after-swap fires before first paint of the new document — no flash
document.addEventListener("astro:after-swap", () => {
  if (flipping) {
    html().classList.remove("flip-out");
    html().classList.add("flip-in");
    window.setTimeout(cleanup, 380);
  }
});
