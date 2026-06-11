import { useEffect, useState } from "react";
import Terminal from "./Terminal";
import Pads from "./Pads";
import Spray from "./Spray";
import Mixer, { applyMix, loadMix } from "./Mixer";
import StatusModal from "./StatusModal";

/**
 * THE DECK — the visible toy chest, bottom right. No ARG energy: you see a
 * button, you press it, something excellent happens. One React root hosts
 * every overlay so they share a bus and never fight over z-index.
 *
 * Persisted across the record flip (transition:persist in Base).
 */

export type OverlayId = null | "term" | "pads" | "spray" | "mix" | "status";

const TOOLS: { id: Exclude<OverlayId, null>; ico: string; label: string; title: string }[] = [
  { id: "term", ico: ">_", label: "term", title: "a terminal. a real one." },
  { id: "pads", ico: "▞▞", label: "pads", title: "JXN-808 — drum machine, 90 bpm, non-negotiable" },
  { id: "spray", ico: "✺", label: "tag", title: "spray can. tag the site. it stays." },
  { id: "mix", ico: "≡≡", label: "mix", title: "the mixer — remix this site's design tokens" },
  { id: "status", ico: "●", label: "stat", title: "system status + the tree" },
];

export default function Deck(): React.ReactElement {
  const [open, setOpen] = useState<OverlayId>(null);

  useEffect(() => {
    const onOverlay = (e: Event): void => {
      setOpen((e as CustomEvent<OverlayId>).detail);
    };
    const onKey = (e: KeyboardEvent): void => {
      const t = e.target as HTMLElement;
      const typing =
        t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable;
      if ((e.key === "~" || e.key === "`") && !typing) {
        e.preventDefault();
        setOpen((o) => (o === "term" ? null : "term"));
      } else if (e.key === "Escape") {
        setOpen(null);
      }
    };
    // the saved mix lives on <html>'s inline style, which the router swaps —
    // re-apply it on every soft navigation (and on first mount)
    const reapplyMix = (): void => applyMix(loadMix());
    reapplyMix();
    document.addEventListener("astro:page-load", reapplyMix);

    addEventListener("jxn:overlay", onOverlay);
    addEventListener("keydown", onKey);
    return () => {
      removeEventListener("jxn:overlay", onOverlay);
      removeEventListener("keydown", onKey);
      document.removeEventListener("astro:page-load", reapplyMix);
    };
  }, []);

  return (
    <>
      <nav className="deck" aria-label="the deck">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            className="deck-btn"
            title={tool.title}
            aria-pressed={open === tool.id}
            onClick={() => setOpen((o) => (o === tool.id ? null : tool.id))}
          >
            <span className="deck-ico" aria-hidden="true">
              {tool.ico}
            </span>
            {tool.label}
          </button>
        ))}
      </nav>

      {open === "term" && (
        <Terminal
          onClose={() => setOpen(null)}
          onOverlay={(id) => setOpen(id)}
        />
      )}
      {open === "pads" && <Pads onClose={() => setOpen(null)} />}
      {open === "spray" && <Spray onClose={() => setOpen(null)} />}
      {open === "mix" && <Mixer onClose={() => setOpen(null)} />}
      {open === "status" && <StatusModal onClose={() => setOpen(null)} />}
    </>
  );
}
